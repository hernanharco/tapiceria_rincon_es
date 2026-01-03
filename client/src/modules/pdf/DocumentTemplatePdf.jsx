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

export const findTitle = (prinTitle) => {
  const title = prinTitle?.title;
  if (!title || title === "undefined") return "PRESUPUESTO";
  return title === "ALBARAN" ? "ALBARAN" : "FACTURA";
};

export const dateShow = (printTitle, document) => {
  const title = printTitle?.title;
  let d = "";
  if (!title || title === "undefined") d = document.fecha_factura;
  else if (title === "ALBARAN") d = document.fecha_factalb;
  else if (title === "FACTURA") d = document.datefactura;
  return formatDate(d);
};

export const codShow = (printTitle, document) => {
  const title = printTitle?.title;
  if (!title || title === "undefined") return document.num_presupuesto;
  if (title === "ALBARAN") return document.num_albaran;
  return document.num_factura;
};

export const DocumentTemplatePdf = ({ company, client, document, filteredProducts, footers, cashPDF, prinTitle }) => {
  const pdfTitle = `${findTitle(prinTitle)}_${codShow(prinTitle, document)}`.replace(/\s+/g, "_");

  return (
    <Document title={pdfTitle}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{findTitle(prinTitle)}</Text>
        
        <View style={styles.section}>{company ? <CompanyPDF company={company}/> : null}</View>

        <View style={styles.row}>
          <View style={styles.column}>
            {document ? <DocumentInfoPDF prinTitle={findTitle(prinTitle)} document={document} client={client?.cod_client} dateShow={dateShow(prinTitle, document)} codShow={codShow(prinTitle, document)}/> : null}
          </View>
          <View style={{ width: 10 }}/>
          <View style={styles.column}>
            {client ? <ClientsPDF client={client}/> : null}
          </View>
        </View>

        {prinTitle?.title?.toUpperCase() === "ALBARAN" && (
          <View><Text style={styles.observation}>PRESUPUESTO {document?.num_presupuesto}</Text></View>
        )}

        {prinTitle?.title?.toUpperCase() === "FACTURA" && (
          <View><Text style={styles.observation}>ALBARAN {document?.num_albaran} - FECHA {document?.fecha_factalb}</Text></View>
        )}

        <View style={styles.section}>
          {filteredProducts ? <TableDocumentsPDF filteredProducts={filteredProducts}/> : null}
        </View>

        {(!prinTitle?.title || prinTitle.title === "undefined") ? (
          <View>
            <Text style={[styles.observation, { textAlign: "right" }]}>Total: {footers?.base_imponible}</Text>
            <View style={styles.container}><Text style={styles.observation}>Observaciones: Impuestos no Incluidos</Text></View>
          </View>
        ) : (
          <View>
            <View style={styles.section}>{footers ? <DocumentsFooterPDF footers={footers}/> : null}</View>
            <View style={styles.section}>{cashPDF ? <PagosPDF cashPDF={cashPDF}/> : null}</View>
          </View>
        )}
      </Page>
    </Document>
  );
};