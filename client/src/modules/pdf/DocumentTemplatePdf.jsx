import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

// Componentes personalizados para el PDF
import { formatDate } from "@/utils/formatUtils";
import { CompanyPDF } from "@/modules/company/pdf/CompanyPDF";
import { ClientsPDF } from "@/modules/clients/pdf/ClientsPDF";
import { DocumentInfoPDF } from "@/modules/documents/pdf/DocumentsInfoPDF";
import { TableDocumentsPDF } from "@/modules/documents/pdf/TableDocumentsPDF";
import { DocumentsFooterPDF } from "@/modules/documents/pdf/DocumentsFooterPDF";
import { PagosPDF } from "@/modules/documents/pdf/PagosPDF";
//import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";

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
    borderWidth: 1,
    borderColor: "#cccccc",
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
export const findTitle = (prinTitle) => {
  const title = prinTitle?.title;

  if (!title || title === "undefined") return "PRESUPUESTO";
  if (title === "ALBARAN") return "ALBARAN";
  return "FACTURA";
};

//Encontrar que fecha debe Imprimir
export const dateShow = (printTitle, document) => {
  const title = printTitle?.title;

  let printDate = "";

  if (!title || title === "undefined") {
    printDate = document.fecha_factura;
  } else if (title === "ALBARAN") {
    printDate = document.fecha_factalb;
  } else if (title === "FACTURA") {
    printDate = document.datefactura;
  }

  // console.log("fecha a mostrar", printDate);
  return formatDate(printDate);
};

//Encontrar que Codigo debe Imprimir
export const codShow = (printTitle, document) => {
  const title = printTitle?.title;

  let printNumber = "";

  if (!title || title === "undefined") {
    printNumber = document.num_presupuesto;
  } else if (title === "ALBARAN") {
    printNumber = document.num_albaran;
  } else if (title === "FACTURA") {
    printNumber = document.num_factura;
  }

  // console.log("código a mostrar", printNumber);
  return printNumber;
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
    <Document
      title={`${findTitle(prinTitle)}_${codShow(prinTitle, document)}`.replace(
        /\s+/g,
        "_"
      )}
    >
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
                prinTitle={findTitle(prinTitle)}
                document={document}
                client={client.cod_client}
                dateShow={dateShow(prinTitle, document)}
                codShow={codShow(prinTitle, document)}
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
            <Text style={styles.observation}>
              PRESUPUESTO {document.num_presupuesto}
            </Text>
          </View>
        )}

        {prinTitle?.title?.toUpperCase() === "FACTURA" && (
          <View>
            <Text style={styles.observation}>
              ALBARAN {document.num_albaran} - FECHA {document.fecha_factalb}
            </Text>
          </View>
        )}

        {/* Información de los datos documento se construye la tabla */}
        <View style={styles.section}>
          {filteredProducts && (
            <TableDocumentsPDF filteredProducts={filteredProducts} />
          )}
        </View>

        {/* Si el dato se toma como presupuesto se muestra la primera informacion sino la segunda */}
        {prinTitle.title === "undefined" ? (
          <View>
            <View>
              <Text style={[styles.observation, { textAlign: "right" }]}>
                Total: {footers.base_imponible}
              </Text>
            </View>

            <View style={styles.container}>
              <Text style={styles.observation}>
                Observaciones: Impuestos no Incluidos
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
