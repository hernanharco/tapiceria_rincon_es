import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

// Función auxiliar para formatear monedas
const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value || 0);
};

// Estilos del PDF
const styles = StyleSheet.create({
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",    
  },
  tableRowEnc: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
    fontSize: 9,
  },
  cell: {
    fontSize: 8,
    padding: 5,
    textAlign: "center",
    flex: 0.5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },
  descriptionCell: {
    flex: 3,
    fontSize: 8,
    padding: 5,
    textAlign: "left",
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
    wordWrap: "break-word",
  },  
});

export const TableDocumentsPDF = ({ filteredProducts = [] }) => {
  const data = Array.isArray(filteredProducts) ? filteredProducts : [];

  return (
    <View style={styles.table}>
      {/* Encabezado */}
      <View style={[styles.tableRowEnc, styles.tableHeader]}>
        <Text style={styles.cell}>Ref</Text>
        <Text style={styles.descriptionCell}>Descripción</Text>
        <Text style={styles.cell}>Cant</Text>
        <Text style={styles.cell}>Precio</Text>
        <Text style={styles.cell}>Dto.</Text>
        <Text style={styles.cell}>Importe</Text>
      </View>

      {/* Productos */}
      {data.map((item, index) => {
        const esTitulo =
          item.descripcion &&
          !["materiales", "mano de obra"].includes(
            item.descripcion.toLowerCase()
          );

        const isManoObra =
          item.descripcion &&
          item.descripcion.toLowerCase().trim() === "mano de obra";

        return (
          <View key={item.id || index}>
            <View style={styles.tableRow}>
              {/* Referencia */}
              <Text style={styles.cell}>
                {esTitulo ? "" : item.referencia || ""}
              </Text>

              {/* Descripción - Siempre mostramos algo */}
              <Text style={styles.descriptionCell}>
                {item.descripcion || "-"}
              </Text>

              {/* Cantidad */}
              <Text style={styles.cell}>
                {esTitulo ? "" : item.cantidad ? item.cantidad : "0"}
              </Text>

              {/* Precio */}
              <Text style={styles.cell}>
                {esTitulo ? "" : formatCurrency(item.precio)}
              </Text>

              {/* Descuento */}
              <Text style={styles.cell}>
                {esTitulo ? "" : item.dto ? `${item.dto}%` : "0%"}
              </Text>

              {/* Importe */}
              <Text style={styles.cell}>
                {esTitulo ? "" : formatCurrency(item.importe)}
              </Text>
            </View>

            {/* Línea horizontal después de "mano de obra" */}
            {isManoObra && (
              <View
                style={{
                  height: 1,
                  backgroundColor: "#000",
                  marginHorizontal: 5,
                  marginTop: 2,
                }}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};
