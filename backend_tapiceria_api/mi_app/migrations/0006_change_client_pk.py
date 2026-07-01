"""
Migration 0006: Change DataClient PK from CIF to auto-increment ID.

WARNING: This migration handles:
  1. Adding 'id' as the new PK for DataClient
  2. Assigning unique sequential IDs to existing records
  3. Converting Document.dataclient FK from CIF (VARCHAR) to ID (INTEGER)
  4. Making 'cif' a regular indexed field (no longer PK)
  5. Adding unique_together constraint on (cif, name)

For PostgreSQL (production). SQLite may need manual intervention.
"""
from django.db import migrations, models


def assign_client_ids(apps, schema_editor):
    """Assign sequential IDs to existing DataClient records."""
    Client = apps.get_model('mi_app', 'DataClient')
    db_alias = schema_editor.connection.alias
    table = Client._meta.db_table
    engine = schema_editor.connection.vendor

    if not Client.objects.using(db_alias).exists():
        return

    if engine == 'postgresql':
        # Use ctid for safe row identification + window function
        schema_editor.execute(f"""
            UPDATE {table}
            SET id = subq.seq
            FROM (
                SELECT ctid, ROW_NUMBER() OVER (ORDER BY cod_client, cif) AS seq
                FROM {table}
            ) subq
            WHERE {table}.ctid = subq.ctid
        """)
    else:
        # SQLite fallback: use raw cursor to avoid ORM PK quirks
        cursor = schema_editor.connection.cursor()
        cursor.execute(f"SELECT rowid, cif FROM {table} ORDER BY cod_client")
        for i, (rowid, _) in enumerate(cursor.fetchall(), start=1):
            cursor.execute(f"UPDATE {table} SET id = ? WHERE rowid = ?", [i, rowid])


def migrate_document_fk(apps, schema_editor):
    """Convert Document.dataclient_id from CIF strings to integer IDs.
    
    Uses raw SQL to avoid ORM type-casting issues (the column is still VARCHAR
    at this point but Django's state expects INTEGER after the PK change).
    """
    Document = apps.get_model('mi_app', 'Document')
    Client = apps.get_model('mi_app', 'DataClient')
    db_alias = schema_editor.connection.alias
    doc_table = Document._meta.db_table
    client_table = Client._meta.db_table
    engine = schema_editor.connection.vendor

    if engine == 'postgresql':
        # Single JOIN-based update — fully raw SQL, no ORM involvement
        schema_editor.execute(f"""
            UPDATE {doc_table} d
            SET dataclient_id_new = c.id
            FROM {client_table} c
            WHERE d.dataclient_id::text = c.cif::text
        """)
    else:
        # SQLite fallback: use raw cursor to avoid ORM type issues
        cursor = schema_editor.connection.cursor()
        # Build CIF → ID mapping
        cursor.execute(f"SELECT cif, id FROM {client_table}")
        mapping = dict(cursor.fetchall())
        # Read old CIF values and update each row
        cursor.execute(f"SELECT rowid, dataclient_id FROM {doc_table}")
        for rowid, old_cif in cursor.fetchall():
            new_id = mapping.get(old_cif)
            if new_id is not None:
                cursor.execute(
                    f"UPDATE {doc_table} SET dataclient_id_new = ? WHERE rowid = ?",
                    [new_id, rowid],
                )


class Migration(migrations.Migration):
    """Migrate DataClient PK from CIF → ID, convert Document FK."""

    dependencies = [
        ('mi_app', '0005_datacompany_iva_comp'),
    ]

    operations = [
        # =========================================================
        # PHASE 1: Add 'id', assign values, make it the new PK
        # =========================================================

        # 1. Add id as nullable IntegerField first
        migrations.AddField(
            model_name='dataclient',
            name='id',
            field=models.IntegerField(null=True),
        ),

        # 2. Assign unique sequential IDs to existing records
        migrations.RunPython(assign_client_ids, migrations.RunPython.noop),

        # 3. Make id NOT NULL
        migrations.AlterField(
            model_name='dataclient',
            name='id',
            field=models.IntegerField(null=False),
        ),

        # 4. State-only change: tell Django that 'id' is now the PK
        #    and 'cif' is a regular field (no longer PK).
        #    Database changes are handled by RunSQL steps below.
        migrations.SeparateDatabaseAndState(
            database_operations=[],  # handled by RunSQL below
            state_operations=[
                migrations.AlterField(
                    model_name='dataclient',
                    name='id',
                    field=models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                migrations.AlterField(
                    model_name='dataclient',
                    name='cif',
                    field=models.CharField(
                        db_index=True,
                        max_length=20,
                        verbose_name='CIF/NIF',
                    ),
                ),
            ],
        ),

        # 5. Database-level: drop old PK on cif (CASCADE drops FK in Document too)
        # Usamos PL/pgSQL para encontrar el nombre exacto de la constraint PK
        # (puede variar según cómo se creó la tabla en PostgreSQL)
        migrations.RunSQL(
            sql="""
                DO $$
                DECLARE
                    pk_name text;
                BEGIN
                    SELECT conname INTO pk_name
                    FROM pg_constraint
                    WHERE conrelid = 'data_client'::regclass
                    AND contype = 'p';

                    IF pk_name IS NOT NULL THEN
                        EXECUTE 'ALTER TABLE data_client DROP CONSTRAINT ' || pk_name || ' CASCADE';
                    END IF;
                END $$;
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),

        # 6. Database-level: add new PK constraint on id
        migrations.RunSQL(
            sql='ALTER TABLE data_client ADD PRIMARY KEY (id);',
            reverse_sql=migrations.RunSQL.noop,
        ),

        # 7. Create and wire up sequence for auto-increment (BigAutoField)
        migrations.RunSQL(
            sql="""
                CREATE SEQUENCE IF NOT EXISTS mi_app_dataclient_id_seq
                    OWNED BY data_client.id;
                ALTER TABLE data_client
                    ALTER COLUMN id
                    SET DEFAULT nextval('mi_app_dataclient_id_seq');
                SELECT setval(
                    'mi_app_dataclient_id_seq',
                    COALESCE((SELECT MAX(id) FROM data_client), 1),
                    false
                );
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),

        # =========================================================
        # PHASE 2: Convert Document FK column from VARCHAR → INTEGER
        # =========================================================

        # 8. Add temporary INTEGER column for the new FK
        migrations.RunSQL(
            sql='ALTER TABLE document ADD COLUMN dataclient_id_new INTEGER NULL;',
            reverse_sql=migrations.RunSQL.noop,
        ),

        # 9. Migrate FK values from CIF strings → integer IDs
        migrations.RunPython(migrate_document_fk, migrations.RunPython.noop),

        # 10. Drop the old VARCHAR dataclient_id column
        #     (the FK constraint was already dropped by CASCADE in step 5)
        migrations.RunSQL(
            sql='ALTER TABLE document DROP COLUMN dataclient_id;',
            reverse_sql=migrations.RunSQL.noop,
        ),

        # 11. Rename temp column to the official FK column name
        migrations.RunSQL(
            sql='ALTER TABLE document RENAME COLUMN dataclient_id_new TO dataclient_id;',
            reverse_sql=migrations.RunSQL.noop,
        ),

        # 12. Add FK constraint back
        migrations.RunSQL(
            sql="""
                ALTER TABLE document
                ADD CONSTRAINT document_dataclient_id_fkey
                FOREIGN KEY (dataclient_id)
                REFERENCES data_client(id)
                ON DELETE CASCADE
                DEFERRABLE INITIALLY DEFERRED;
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),

        # 13. Make dataclient_id NOT NULL
        #     (safe: all existing docs reference an existing client)
        migrations.RunSQL(
            sql='ALTER TABLE document ALTER COLUMN dataclient_id SET NOT NULL;',
            reverse_sql=migrations.RunSQL.noop,
        ),

        # =========================================================
        # PHASE 3: Final adjustments
        # =========================================================

        # 14. unique_together ensures same CIF allowed only with different names
        migrations.AlterUniqueTogether(
            name='dataclient',
            unique_together={('cif', 'name')},
        ),
    ]
