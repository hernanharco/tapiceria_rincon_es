from django.contrib import admin
from .models import DataCompany, DataClient, Document, DataDocument, Pago, FooterDocument

    # list_display = ('cod_client', 'name', 'cif')  # Muestra cod_client en la lista
admin.site.register(DataCompany)
@admin.register(DataClient)
class DataClientAdmin(admin.ModelAdmin):
    readonly_fields = ('cod_client',)             # Muestra cod_client en el formulario
admin.site.register(Document)
admin.site.register(DataDocument)
admin.site.register(Pago)
admin.site.register(FooterDocument)

 