from django.contrib import admin
from .models import DataCompany, DataClient, Document, DataDocument, Pago, FooterDocument

admin.site.register(DataCompany)
admin.site.register(DataClient)
admin.site.register(Document)
admin.site.register(DataDocument)
admin.site.register(Pago)
admin.site.register(FooterDocument)