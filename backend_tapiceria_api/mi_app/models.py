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
    company = models.ForeignKey(
        DataCompany, on_delete=models.CASCADE, related_name='clients')

    def __str__(self):
        return f"{self.name} {self.cif}"


class Document(models.Model):
    num_factura = models.CharField(max_length=50, primary_key=True)
    fecha_factura = models.DateField()
    observaciones = models.TextField(blank=True, null=True)
    cod_cliente = models.ForeignKey(
        DataClient,
        on_delete=models.CASCADE,
        related_name='documentos'  # Esto permite acceder desde DataClient
    )    

    def __str__(self):
        return f"Doc {self.num_factura} - {self.cod_cliente}"


class DataDocument(models.Model):
    documento = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name='lineas')
    referencia = models.CharField(max_length=20, blank=True, null=True)
    descripcion = models.TextField()
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    dto = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    importe = models.DecimalField(max_digits=10, decimal_places=2)       

    def __str__(self):
        return f"Referencia {self.referencia} Línea de {self.documento.num_factura} "

class FooterDocument(models.Model):
    footer_documento = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name='footerdocumentos')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    base_imponible = models.DecimalField(max_digits=10, decimal_places=2)
    iva = models.DecimalField(max_digits=5, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2) 

    def __str__(self):
        return f"Línea de {self.footer_documento}"


class Pago(models.Model):
    empresa = models.ForeignKey(
        DataCompany, on_delete=models.CASCADE, related_name='pagos')
    forma_pago = models.CharField(max_length=100)

    def __str__(self):
        return f"Pago - {self.forma_pago}"
