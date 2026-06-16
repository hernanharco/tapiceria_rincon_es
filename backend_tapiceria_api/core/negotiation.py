from rest_framework.negotiation import DefaultContentNegotiation
from rest_framework.renderers import JSONRenderer

class ForceJSONNegotiation(DefaultContentNegotiation):
    """
    Siempre devuelve JSON, ignora el Accept header del navegador
    """
    def select_renderer(self, request, renderers, format_suffix):
        return (JSONRenderer(), 'application/json')
