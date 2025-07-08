import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

// Componentes personalizados para el PDF
import { CompanyPDF } from "../company/pdf/CompanyPDF";
import { ClientsPDF } from "../clients/pdf/ClientsPDF";
import { DocumentInfoPDF } from "../documents/pdf/DocumentsInfoPDF";
import { TableDocumentsPDF } from "../documents/pdf/TableDocumentsPDF";
import { DocumentsFooterPDF } from "../documents/pdf/DocumentsFooterPDF";
import { PagosPDF } from "../documents/pdf/PagosPDF";

// Define tus estilos al inicio del archivo
const styles = StyleSheet.create({
  page: {
    padding: 30, // 👈 Añade márgenes internos
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "stretch", // ⭐ Esto hace que ambos hijos se estiren verticalmente
  },
  column: {
    flex: 1,
    paddingRight: 5,
    paddingLeft: 5,
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: 10,
    color: "#555",
  },
  value: {
    fontSize: 10,
    marginBottom: 4,
    color: "#333",
  },
  container: {
    border: "1px solid #cccccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
    flexDirection: "row", // Alineamos imagen y texto horizontalmente
    alignItems: "center", // Centramos verticalmente
  },
  observation: {
    fontSize: 9,
    marginBottom: 2,
    color: "#555",
  },
});

// Función para mostrar el Titulo del Documento
const findTitle = (prinTitle) => {
  // console.log("prinTitle: ", prinTitle)
  let print = "";

  if (prinTitle.title === "undefined") {
    print = "PRESUPUESTO";
  } else {
    if (prinTitle.title === "ALBARAN") {
      print = "ALBARAN";
    } else {
      print = "FACTURA";
    }
  }

  return print;
};

//Encontrar que fecha debe Imprimir
const dateShow = (printTitle, document) => {
  console.log("prinTitle: ", printTitle, " datos document:", document);
  let printDate = "";

  if (printTitle.title === "undefined") {
    printDate = document.fecha_factura;
  } if(printTitle.title === "PRESUPUESTO"){
    printDate = document.fecha_factalb;
  }else {
    printDate = document.datefactura;
  }

  // console.log("fecha a mostrar", printDate);
  return printDate;
};

export const DocumentTemplatePdf = ({
  company,
  client,
  document,
  filteredProducts,
  footers,
  cashPDF,
  prinTitle,
}) => {
  console.log("🚀 Datos completos recibidos en PDF:", {
    prinTitle,
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
        <Text style={styles.header}>{findTitle(prinTitle)}</Text>

        {/* Datos de la Empresa */}
        <View style={styles.section}>
          {company && <CompanyPDF company={company} />}
        </View>

        {/* Cliente + Información del Documento */}
        <View style={styles.row}>
          {/* DocumentsInfoPDF */}
          <View style={styles.column}>
            {document && (
              <DocumentInfoPDF
                document={document}
                client={client.cod_client}
                dateShow={dateShow(prinTitle, document)}
              />
            )}
          </View>
          <View style={{ width: 10 }} /> {/* Espacio entre bloques */}
          {/* ClientsPDF */}
          <View style={styles.column}>
            {client && <ClientsPDF client={client} />}
          </View>
        </View>

        {/* Muestra un mensaje que dice con qué documento se relaciona */}
        {prinTitle?.title?.toUpperCase() === "ALBARAN" && (
          <View>
            <Text style={styles.observation}>PRESUPUESTO {document.num_presupuesto}</Text>
          </View>
        )}

        {prinTitle?.title?.toUpperCase() === "FACTURA" && (
          <View>
            <Text style={styles.observation}>ALBARAN {document.num_albaran}</Text>
          </View>
        )}

        {/* Información de los datos documento se construye la tabla */}
        <View style={styles.section}>
          {filteredProducts && (
            <TableDocumentsPDF filteredProducts={filteredProducts} />
          )}
        </View>

        {prinTitle.title === "undefined" ? (
          // Mostrar título adicional si NO es PRESUPUESTO
          <View style={styles.container}>
            <View>
              <Text style={styles.observation}>
                "Observaciones: Impuestos no Incluidos"
              </Text>
            </View>
          </View>
        ) : (
          <>
            {/* Footer + Forma de pago */}
            <View style={styles.section}>
              {footers && <DocumentsFooterPDF footers={footers} />}
            </View>

            <View style={styles.section}>
              {cashPDF && <PagosPDF cashPDF={cashPDF} />}
            </View>
          </>
        )}
      </Page>
    </Document>
  );
};
