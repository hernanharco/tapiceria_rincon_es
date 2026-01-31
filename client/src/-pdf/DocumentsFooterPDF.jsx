import { View, Text, StyleSheet } from '@react-pdf/renderer';

// Estilos mejorados
const styles = StyleSheet.create({
  footerContainer: {    
    paddingTop: 5,
    borderTopWidth: 1,            // <-- Ancho del borde superior
  borderTopColor: '#000',       // <-- Color del borde (negro)
    width: '100%',
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,    
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid'
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10,
    padding: 6,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 9,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid'
  },
  lastTableCell: {
    borderRightWidth: 0
  },
  totalCell: {
    fontWeight: 'bold',
    fontSize: 10
  }
});

export const DocumentsFooterPDF = ({ footers }) => {
  
  // console.log('Datos recibidos en el footer:', footer);

  if (!footers || Object.keys(footers).length === 0) {
    return (
      <View style={styles.footerContainer}>
        <Text style={{ textAlign: 'center', fontSize: 10, color: '#666' }}>
          No hay totales disponibles
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.footerContainer}>
      <View style={styles.table}>
        {/* Encabezado */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, { flex: 1 }]}>Subtotal</Text>
          <Text style={[styles.tableHeader, { flex: 1 }]}>Base Imponible</Text>
          <Text style={[styles.tableHeader, { flex: 1 }]}>IVA 21%</Text>
          <Text style={[styles.tableHeader, { flex: 1 }]}>Total</Text>
        </View>

        {/* Fila de datos */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 1 }]}>{footers.subtotal}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{footers.base_imponible}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{footers.iva}</Text>
          <Text style={[styles.tableCell, styles.totalCell, { flex: 1 }, styles.lastTableCell]}>
            {footers.total}
          </Text>
        </View>
      </View>
    </View>
  );
};