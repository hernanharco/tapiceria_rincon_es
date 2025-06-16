import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

// Función auxiliar para formatear monedas
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value || 0);
};

// Estilos del PDF
const styles = StyleSheet.create({
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 10,
    marginBottom: 10
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
    fontSize: 9
  },
  tabletittle: {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    fontSize: 9,
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid'
  },
  cell: {
    fontSize: 8,
    padding: 5,
    textAlign: 'center',
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid'
  },
  descriptionCell: {
    flex: 2, // Ancho dos veces mayor que los otros campos
    fontSize: 8,
    padding: 5,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    wordWrap: 'break-word' // Permite que el texto se divida en múltiples líneas
  }
});

export const TableDocumentsPDF = ({ filteredProducts = [] }) => {
  const data = Array.isArray(filteredProducts) ? filteredProducts : [];

  return (
    <View style={styles.table}>
      {/* Encabezado */}
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={styles.cell}>Referencia</Text>
        <Text style={styles.descriptionCell}>Descripción</Text>
        <Text style={styles.cell}>Cant</Text>
        <Text style={styles.cell}>Precio</Text>
        <Text style={styles.cell}>Dto.</Text>
        <Text style={styles.cell}>Importe</Text>
      </View>

      {/* Productos */}
      {data.map((item, index) => (
        <View key={item.id || JSON.stringify(item)} style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.cell}>{item.referencia || '-'}</Text>
          <Text style={styles.descriptionCell}>{item.descripcion || '-'}</Text> {/* Campo Descripción más ancho */}
          <Text style={styles.cell}>{item.cantidad || 0}</Text>
          <Text style={styles.cell}>{formatCurrency(item.precio)}</Text>
          <Text style={styles.cell}>{item.dto ? `${item.dto}%` : '0%'}</Text>
          <Text style={styles.cell}>{formatCurrency(item.importe)}</Text>
        </View>
      ))}
    </View>
  );
};