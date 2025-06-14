import React from 'react';
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

// Define tus estilos al inicio del archivo
const styles = StyleSheet.create({
  page: {
    padding: 30,
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
    marginBottom: 10
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

export const DocumentTemplatePdf = ({ company, client, document }) => {
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
          <View style={{ width: '48%' }}>
            {client && <ClientsPDF client={client} />}
          </View>
          {/* DocumentsInfoPDF cuando lo tengas listo */}
          <View style={{ width: '48%' }}>
            {client && <DocumentInfoPDF client={document} />}
          </View>
        </View>

        {/* Información del documento */}
        <View style={styles.section}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>2025-04-05</Text>
          <Text style={styles.label}>Número de Albarán:</Text>
          <Text style={styles.value}>ALB-2025-001</Text>
        </View>

        {/* Tabla simple ejemplo */}
        <View style={styles.section}>
          <Text style={styles.label}>Productos:</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.value}>Servicio Web</Text>
            <Text style={styles.value}>{formatCurrency(500)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.value}>Soporte técnico</Text>
            <Text style={styles.value}>{formatCurrency(200)}</Text>
          </View>
        </View>

        {/* Forma de pago */}
        <View style={styles.section}>
          <Text style={styles.label}>Forma de Pago:</Text>
          <Text style={styles.value}>Transferencia bancaria</Text>
        </View>
      </Page>
    </Document>
  );
};