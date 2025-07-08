
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
    number = models.CharField(max_length=20)
    cod_client = models.CharField(max_length=20, unique=True, editable=False)
    company = models.ForeignKey(
        DataCompany, 
        on_delete=models.CASCADE, 
        related_name='clients')
    
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
            self.cod_client = f'{prefix}{new_number:04d}'  # CLI0001, CLI0002...
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} {self.cif} || {self.cod_client}"
   
    # id = models.AutoField(primary_key=True)
class Document(models.Model):
    dataclient = models.ForeignKey(
        DataClient,
        on_delete=models.CASCADE,
        related_name='dataclient',
    )
    fecha_factura = models.DateField()
    num_presupuesto = models.CharField(max_length=13)
    fecha_factalb = models.DateField(blank=True, null=True)
    num_albaran = models.CharField(max_length=13, blank=True, null=True)
    num_factura = models.CharField(max_length=13, blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True) 
    compr_albaran = models.CharField(max_length=100, blank=True, null=True)
    datefactura = models.DateField(blank=True, null=True)
    
    def __str__(self):
        return f"Cif {self.dataclient} || Presupuesto {self.num_presupuesto} || Albarán {self.num_albaran} || Factura {self.num_factura}"

class titleDescripcion(models.Model):
    titledoc = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='titledocu')
    titdescripcion = models.TextField()

class DataDocument(models.Model):
    documento = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='doc_client')
    referencia = models.CharField(max_length=20, blank=True, null=True)
    descripcion = models.TextField()
    cantidad = models.DecimalField(max_digits=12, decimal_places=2)
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    dto = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    importe = models.DecimalField(max_digits=12, decimal_places=2)
    entrega = models.CharField(max_length=100, blank=True, null=True)
    line = models.BooleanField(default=True)

    def __str__(self):
        return f"Referencia {self.referencia} Línea de {self.documento}"


class FooterDocument(models.Model):
    footer_documento = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name='footerdocumentos'
    )
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    base_imponible = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    iva = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Línea de {self.footer_documento}"


class Pago(models.Model):
    empresa = models.ForeignKey(DataCompany, on_delete=models.CASCADE, related_name='pagos')
    forma_pago = models.CharField(max_length=100)

    def __str__(self):
        return f"Pago - {self.forma_pago}"