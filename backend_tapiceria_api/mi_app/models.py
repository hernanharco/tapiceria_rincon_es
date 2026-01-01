from django.db import models

class DataCompany(models.Model):
    cif = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=10)
    city = models.CharField(max_length=100)
    number = models.CharField(max_length=20)
    email = models.EmailField()

    def __str__(self):
        return f"{self.name} ({self.cif})"

class DataClient(models.Model):
    cif = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=10)    
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    number = models.CharField(max_length=20)
    cod_client = models.CharField(max_length=20, unique=True, editable=False)
    company = models.ForeignKey(
        DataCompany, 
        on_delete=models.CASCADE, 
        related_name='clients'
    )
    
    def save(self, *args, **kwargs):
        if not self.cod_client:
            prefix = 'CLI'
            last = DataClient.objects.all().order_by('cod_client').last()
            if last and last.cod_client.startswith(prefix):
                try:
                    last_number = int(last.cod_client[len(prefix):])
                    new_number = last_number + 1
                except ValueError:
                    new_number = 1
            else:
                new_number = 1
            self.cod_client = f'{prefix}{new_number:04d}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} || {self.cif} || {self.cod_client}"

class Document(models.Model):
    # Relación con el cliente. Related name 'documents' es más natural.
    dataclient = models.ForeignKey(
        DataClient,
        on_delete=models.CASCADE,
        related_name='documents',
    )
    fecha_factura = models.DateField()
    # Unique=True evita que guardes dos veces el mismo presupuesto por error
    num_presupuesto = models.CharField(max_length=13, unique=True)
    fecha_factalb = models.DateField(blank=True, null=True)
    num_albaran = models.CharField(max_length=13, blank=True, null=True)
    num_factura = models.CharField(max_length=13, blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True) 
    compr_albaran = models.CharField(max_length=100, blank=True, null=True)
    datefactura = models.DateField(blank=True, null=True)
    
    def __str__(self):
        return f"Presupuesto {self.num_presupuesto} - Cliente {self.dataclient.name}"

class titleDescripcion(models.Model):
    # Relación con el documento padre
    titledoc = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='titles')
    titdescripcion = models.TextField()

    class Meta:
        verbose_name = "Título de Sección"

class DataDocument(models.Model):
    # El related_name 'items' permite acceder como documento.items.all()
    documento = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='items')
    referencia = models.CharField(max_length=20, blank=True, null=True)
    descripcion = models.TextField()
    # DecimalField requiere siempre un valor; default=0.00 previene el Error 500
    cantidad = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    precio = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    dto = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    importe = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    entrega = models.CharField(max_length=100, blank=True, null=True)
    line = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.descripcion[:30]}... ({self.documento.num_presupuesto})"

class FooterDocument(models.Model):
    footer_documento = models.OneToOneField( # OneToOne porque cada documento solo tiene un footer
        Document,
        on_delete=models.CASCADE,
        related_name='footer'
    )
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    base_imponible = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    iva = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

class Pago(models.Model):
    empresa = models.ForeignKey(DataCompany, on_delete=models.CASCADE, related_name='pagos')
    forma_pago = models.CharField(max_length=100)

    def __str__(self):
        return self.forma_pago