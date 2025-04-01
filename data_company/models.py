from django.db import models

# Create your models here. - serian los datos de la empresa
class Data_Company(models.Model):
    name_company = models.CharField(max_length=50)
    addres_company = models.CharField(max_length=50)
    zip_code_company = models.CharField(max_length=10)
    city_company = models.CharField(max_length=50)
    number_company = models.CharField(max_length=30)
    nie_cif_dni_company = models.CharField(max_length=30)
    email_company = models.CharField(max_length=30)

    # method to view the name of company
    def __str__(self):
        return self.name_company

 #son los datos que se llenarian para realizar la factura
class Data_document(models.Model):
    #datos del documento de la factura
    data_num = models.CharField(max_length=50)#numero de factura
    data_documt = models.CharField(max_length=15)
    data_cod_client = models.CharField(max_length=30)
    data_observations = models.TextField(blank=True)

    #datos del cliente en la factura
    client_name = models.CharField(max_length=30)
    client_addres = models.CharField(max_length=30)
    client_zip_code = models.CharField(max_length=10)
    client_city = models.CharField(max_length=20)
    client_province = models.CharField(max_length=30)
    client_nie_cif_dni = models.CharField(max_length=30)  
    
    #La forma de pago
    payment_method = models.TextField(blank=True)

    # method to view the number of document
    def __str__(self):
        return self.client_name
    
class Document(models.Model):
    #numero de la factura esta es la llave principal
    data_num = models.CharField(max_length=50)

    #datos que se describe el contenido del documento
    doc_reference = models.CharField(max_length=30)
    doc_description = models.CharField(max_length=30)
    doc_amount = models.CharField(max_length=30)
    doc_price = models.CharField(max_length=30)
    doc_dto = models.CharField(max_length=30)
    doc_import = models.CharField(max_length=30)

    #Datos para cobrar
    doc_subtotal = models.CharField(max_length=12)
    doc_tax_base = models.CharField(max_length=12)
    doc_iva = models.CharField(max_length=5)
    doc_total = models.CharField(max_length=15)

    # method to view the number of document
    def __str__(self):
        return self.data_num



