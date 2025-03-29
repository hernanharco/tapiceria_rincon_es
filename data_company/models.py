from django.db import models

# Create your models here.
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


