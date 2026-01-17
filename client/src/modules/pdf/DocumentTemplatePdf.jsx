import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { formatDate } from "@/utils/formatUtils";
import { CompanyPDF } from "@/modules/company/pdf/CompanyPDF";
import { ClientsPDF } from "@/modules/clients/pdf/ClientsPDF";
import { DocumentInfoPDF } from "@/modules/documents/pdf/DocumentsInfoPDF";
import { TableDocumentsPDF } from "@/modules/documents/pdf/TableDocumentsPDF";
import { DocumentsFooterPDF } from "@/modules/documents/pdf/DocumentsFooterPDF";
import { PagosPDF } from "@/modules/documents/pdf/PagosPDF";

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica" },
  header: { fontSize: 24, textAlign: "center", marginBottom: 10, fontWeight: "bold" },
  section: { marginBottom: 5 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, alignItems: "stretch" },
  column: { flex: 1, paddingRight: 5, paddingLeft: 5, display: "flex", flexDirection: "column" },
  container: { borderWidth: 1, borderColor: "#cccccc", borderRadius: 4, padding: 8, marginBottom: 10, flexDirection: "row", alignItems: "center" },
  observation: { fontSize: 9, marginBottom: 2, color: "#555" },
});

// Corregido: Ya no intenta asignar a una variable inexistente 'date'
export function fechaPDF(prinTitle, document) {
  const title = prinTitle?.toUpperCase();
  if (title === "ALBARAN") return formatDate(document?.fecha_factalb);
  if (title === "FACTURA") return formatDate(document?.datefactura);
  return formatDate(document?.fecha_factura);
}

export function codPDF(prinTitle, document) {
  const title = prinTitle?.toUpperCase();
  if (title === "ALBARAN") return document?.num_albaran || "-";
  if (title === "FACTURA") return document?.num_factura || "-";
  return document?.num_presupuesto || "-";
}

export const DocumentTemplatePdf = ({ company, client, document, filteredProducts, footers, cashPDF, prinTitle }) => {
  // Eliminamos cualquier posibilidad de que prinTitle sea nulo para el título del PDF
  const safeTitle = prinTitle || "DOCUMENTO";

  return (
    <Document title={safeTitle}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{safeTitle}</Text>
        
        <View style={styles.section}>
          {company ? <CompanyPDF company={company}/> : null}
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            {document ? (
              <DocumentInfoPDF 
                prinTitle={safeTitle} 
                document={document} 
                client={client?.cod_client} 
                dateShow={fechaPDF(safeTitle, document)} 
                codShow={codPDF(safeTitle, document)}
              />
            ) : null}
          </View>
          {/* Este View vacío es preferible a un string de espacio para separar columnas */}
          <View style={{ width: 10 }} />
          <View style={styles.column}>
            {client ? <ClientsPDF client={client}/> : null}
          </View>
        </View>

        {safeTitle.toUpperCase() === "ALBARAN" && document?.num_presupuesto && (
          <View style={styles.section}>
            <Text style={styles.observation}>PRESUPUESTO: {document.num_presupuesto}</Text>
          </View>
        )}

        {safeTitle.toUpperCase() === "FACTURA" && (
          <View style={styles.section}>
            <Text style={styles.observation}>
              ALBARAN: {document?.num_albaran || "-"} - FECHA: {formatDate(document?.fecha_factalb)}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          {filteredProducts ? <TableDocumentsPDF filteredProducts={filteredProducts}/> : null}
        </View>

        {safeTitle.toUpperCase() === "PRESUPUESTO" ? (
          <View style={styles.section}>
            <Text style={[styles.observation, { textAlign: "right", fontWeight: "bold" }]}>
              Total: {footers?.base_imponible || "0.00"} €
            </Text>
            <View style={styles.container}>
              <Text style={styles.observation}>Observaciones: Impuestos no Incluidos</Text>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            {footers ? <DocumentsFooterPDF footers={footers}/> : null}
            {cashPDF ? <PagosPDF cashPDF={cashPDF}/> : null}
          </View>
        )}
      </Page>
    </Document>
  );
};