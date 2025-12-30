# 1. Preparar el archivo para PostgreSQL
El archivo de MySQL usa comillas invertidas (`) y tipos de datos que PostgreSQL no entiende. Vamos a usar DBeaver para que haga la traducción por nosotros:

1. Abre DBeaver y asegúrate de que ves tu base de datos de Render a la izquierda.

2. Conecta también tu MySQL local en DBeaver (donde tienes la base de datos original).

Si no sabes cómo: Haz clic en el enchufe de arriba a la izquierda, elige MySQL y pon tus datos locales (normalmente Host: localhost, User: root, sin contraseña si usas XAMPP).

# 2. El truco de "Transferencia de Datos" (Recomendado)
Esta es la forma más segura porque DBeaver traduce los datos automáticamente:

1. En el panel izquierdo, busca tu base de datos local (db_tapiceria_es).

2. Despliega las "Tablas", selecciónalas todas con el ratón, haz clic derecho y elige Exportar datos.

3. En la ventana que sale, selecciona Base de datos y dale a "Siguiente".

4. En Target Container (Contenedor de destino), haz clic en el botón de la carpeta y busca tu conexión de Render (tapiceria_db) y selecciona el esquema public.

5. DBeaver te mostrará una lista de "Fuente" vs "Destino". Asegúrate de que todo se vea correcto.

6. Haz clic en Proceder.