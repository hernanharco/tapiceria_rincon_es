
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet
} from '@react-pdf/renderer';

// Componentes personalizados para el PDF
import { CompanyPDF } from '../company/pdf/CompanyPDF';
import { ClientsPDF } from '../clients/pdf/ClientsPDF';
import { DocumentInfoPDF } from '../documents/pdf/DocumentsInfoPDF';
import { TableDocumentsPDF } from '../documents/pdf/TableDocumentsPDF';
import { DocumentsFooterPDF } from '../documents/pdf/DocumentsFooterPDF';
import { PagosPDF } from '../documents/pdf/PagosPDF';

// Define tus estilos al inicio del archivo
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica'
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'stretch', // ⭐ Esto hace que ambos hijos se estiren verticalmente
  },
  column: {
    flex: 1,
    paddingRight: 5,
    paddingLeft: 5,
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: 10,
    color: '#555'
  },
  value: {
    fontSize: 10,
    marginBottom: 4,
    color: '#333'
  }
});

// Función de formato de moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

export const DocumentTemplatePdf = ({ company, client, document, filteredProducts, footers, cashPDF }) => {
  console.log('🚀 Datos completos recibidos en PDF:', {
    company,
    client,
    document,
    filteredProducts,
    footers,
    cashPDF,
  });
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Título */}
        <Text style={styles.header}>ALBARÁN</Text>

        {/* Datos de la Empresa */}
        <View style={styles.section}>
          {company && <CompanyPDF company={company} />}
        </View>

        {/* Cliente + Información del Documento */}
        <View style={styles.row}>
          {/* DocumentsInfoPDF */}
          <View style={styles.column}>
            {document && <DocumentInfoPDF document={document} client={client.cod_client}  />}
          </View>
          <View style={{ width: 10 }} /> {/* Espacio entre bloques */}
          {/* ClientsPDF */}
          <View style={styles.column}>
            {client && <ClientsPDF client={client} />}
          </View>
        </View>

        {/* Información de los datos documento se construye la tabla */}
        <View style={styles.section}>
          {filteredProducts && <TableDocumentsPDF filteredProducts={filteredProducts} />}
        </View>

        {/* Informacion donde se muestra el total de los productos */}
        <View style={styles.section}>
          {footers && <DocumentsFooterPDF footers={footers} />}
        </View>

        {/* Forma de pago */}
        <View style={styles.section}>
          {cashPDF && <PagosPDF cashPDF={cashPDF} />}
        </View>
      </Page>
    </Document>
  );
};