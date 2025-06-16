// src/components/pdf/SimplePDF.jsx

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from '@react-pdf/renderer';

// Estilos (similar a CSS pero en objeto)
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  paragraph: {
    marginBottom: 10
  }
});

// Componente del PDF
export const SimplePDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Mi primer PDF en React</Text>
      <Text style={styles.paragraph}>Este es un documento PDF generado con @react-pdf/renderer.</Text>
      <Text>¡Funciona muy bien!</Text>
    </Page>
  </Document>
);