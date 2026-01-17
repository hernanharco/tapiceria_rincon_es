
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    color: '#333',
  },
  paymentText: {
    fontSize: 11,
    lineHeight: 1.5,
    whiteSpace: 'pre-line',
    color: '#000',
    marginBottom: 10,
  },
  box: {
    border: '1px solid #000',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
});

export const PagosPDF = ({ cashPDF }) => {
  // console.log('PagosPDF cash:', cashPDF);
  if (!cashPDF || !cashPDF.forma_pago) {
    return null; // o puedes mostrar un mensaje de fallback
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Forma de Pago</Text>
      <View style={styles.box}>
        <Text style={styles.paymentText}>{cashPDF.forma_pago}</Text>
      </View>
    </View>
  );
};