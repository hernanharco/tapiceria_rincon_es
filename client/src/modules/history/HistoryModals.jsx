import { useState, useEffect } from "react";

import { DocumentsInfo } from "../documents/components/DocumentsInfo";
import { TableDocuments } from "../documents/components/TableDocuments";
import { DocumentsFooter } from "../documents/components/DocumentsFooter";

// Hooks personalizados
import useDocuments from "../documents/hooks/useDocuments";
import useDataDocuments from "../documents/hooks/useDataDocuments";
import useDataFooter from "../documents/hooks/useFooters";

export const HistoryModals = ({
  isOpen,
  onClose,
  title,
  children,
  searchTerm,
  selectedItem, // Recibimos el item a editar
}) => {
  const { addProduct, updateProduct } = useDocuments(); // Asegúrate de tener `updateProduct`
  const { addProductTable, getProductsByDocument, updateProductTable } =
    useDataDocuments(); // Hook para productos
  const { saveFooter, updateFooter } = useDataFooter(); // Hook para footer

  // Estado para info del documento
  const [datInfo, setDatInfo] = useState({
    dataInfoDocument: "Cargando",
    dataInfoDate: "",
    dataInfoObservation: "",
  });

  // Estado para productos de TableDocuments
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleTableDataChange = (updatedProducts) => {
    setFilteredProducts(updatedProducts);
  };

  // Estado para footer
  const [datFooter, setDatFooter] = useState({
    datsubTotal: "",
    datbaseImponible: "",
    datIva: "",
    datTotal: "",
  });

  // Función para extraer CIF y nombre del cliente
  const parseSearchTerm = (value) => {
    const match = value.match(/^\(([^)]+)\)\s*(.*)/);
    return {
      cif: match ? match[1] : "",
      name: match ? match[2] : value,
    };
  };

  const { cif, name } = parseSearchTerm(searchTerm);

  // Determina si es edición o nuevo
  const isEditing = !!selectedItem?.num_factura;

  // Cargar datos cuando sea edición
  useEffect(() => {
    if (!isOpen || !isEditing) return;

    // Puedes cargar los datos completos del documento desde el backend aquí
    const loadDocumentData = async () => {
      try {
        const products = await getProductsByDocument(
          selectedItem.num_presupuesto
        );
        setFilteredProducts(products);

        const footer = await updateFooter(selectedItem.num_presupuesto); // O usa otro identificador
        if (footer) {
          setDatFooter({
            datsubTotal: footer.subtotal,
            datbaseImponible: footer.base_imponible,
            datIva: footer.iva,
            datTotal: footer.total,
          });
        }

        setDatInfo({
          dataInfoDocument: selectedItem.num_presupuesto,
          dataInfoDate: selectedItem.fecha_factura,
          dataInfoObservation: selectedItem.observaciones,
        });
      } catch (error) {
        console.error("Error al cargar datos del documento:", error);
      }
    };

    loadDocumentData();
  }, [isOpen, isEditing]);

  if (!isOpen) return null;

  // Manejador principal de guardado
  const handleSaveProduct = async () => {
    // Datos del documento principal
    const documentData = {
      fecha_factura: datInfo.dataInfoDate,
      observaciones: datInfo.dataInfoObservation,
      num_presupuesto: datInfo.dataInfoDocument,
      dataclient: cif,
    };

    try {
      let documentId;
      if (isEditing) {
        // Si ya tiene ID, actualizamos
        documentId = selectedItem.id;
        await updateProduct(documentId, documentData);
      } else {
        // Si no, creamos uno nuevo
        const documentResponse = await addProduct(documentData);
        documentId = documentResponse.id;
      }

      // Guardar cada línea de producto
      for (const item of filteredProducts) {
        const tabledocuments = {
          referencai: item.reference,
          descripcion: item.description,
          cantidad: item.quantity,
          precio: item.price,
          dto: item.dto,
          importe: item.amount,
          entrega: null,
          line: true,
          documento: documentId,
        };

        if (item.id) {
          // Si tiene ID, actualiza
          await updateProductTable(item.id, tabledocuments);
        } else {
          // Si no, crea nuevo
          await addProductTable(tabledocuments);
        }
      }

      // Datos del footer
      const documentdatFooter = {
        subtotal: parseFloat(datFooter.datsubTotal),
        base_imponible: parseFloat(datFooter.datbaseImponible),
        iva: parseFloat(datFooter.datIva),
        total: parseFloat(datFooter.datTotal),
        footer_documento: documentId,
      };

      if (isEditing) {
        await updateFooter(documentId, documentdatFooter);
      } else {
        await saveFooter(documentdatFooter);
      }

      // ✅ Cerrar el modal después de guardar todo
      onClose();
      alert("Documento guardado correctamente.");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar el documento.");
    }

    initializeVoid();
  }; //Fin de handleSaveProduct 

  const handleUpdateProduct = async () => {
    console.log("estoy en el metodo de actualizar");
  };

  return (
    <div>
      {/* Fondo oscuro */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        {/* Contenedor del modal con scroll */}
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6 relative mx-4">
          {/* Botón de cierre (X) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            aria-label="Cerrar modal"
          >
            &times;
          </button>

          {/* Título */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>

          {/* Contenido dinámico */}
          <div className="mb-6">{children}</div>

          {/* Información del documento */}
          <DocumentsInfo
            cif={cif}
            datInfo={datInfo}
            setDatInfo={(newData) =>
              setDatInfo((prev) => ({ ...prev, ...newData }))
            }
            onClose={onClose}
          />

          {/* Tabla de productos */}
          <TableDocuments
            filteredProducts={filteredProducts}
            setFilteredProducts={setFilteredProducts}
            onProductsChange={handleTableDataChange}
          />

          {/* Pie del documento */}
          <div className="mt-6">
            <DocumentsFooter
              filteredProducts={filteredProducts}
              setDatFooter={setDatFooter}
            />
          </div>

          {/* Botones inferiores */}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={isEditing ? handleUpdateProduct : handleSaveProduct}
              className={`px-4 py-2 text-white rounded hover:opacity-90 ${
                isEditing
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isEditing ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
