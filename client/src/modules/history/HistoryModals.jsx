import { useState, useEffect } from "react";

import { DocumentsInfo } from "../documents/components/DocumentsInfo";
import { TableDocuments } from "../documents/components/compTableDocuments.jsx/TableDocuments";
import { DocumentsFooter } from "../documents/components/DocumentsFooter";

// Hooks personalizados
import useDocuments from "../documents/hooks/useDocuments";
import useTitleTableDocuments from "../documents/hooks/useTitleTableDocuments";
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
  // console.log("informacion de selectedItem: ", selectedItem);
  // Determina si es edición o nuevo
  const isEditing = !!selectedItem?.num_presupuesto;
  // console.log("isEditing en HistoryModals: ", isEditing)

  const { addProduct, updateProduct } = useDocuments(); // Asegúrate de tener `updateProduct`

  const {
    addProductTitle,
    getDocumentsByNumTitle,
    updateDocumentFieldsIdTitle,
    deleteProductTitle,
  } = useTitleTableDocuments(); // Asegúrate de tener `updateProduct`

  const {
    addProductTable,
    getDocumentsByNum,
    updateProductTable,
    deleteProduct,
  } = useDataDocuments(); // Hook para productos

  const { saveFooter, updateFooter } = useDataFooter(); // Hook para footer

  // Estado para info del documento
  const [datInfo, setDatInfo] = useState({
    dataInfoDocument: "Cargando",
    dataInfoDate: "",
    dataInfoObservation: "",
  });

  // Estado para productos de TableDocuments
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Inicializa los productos en vacio
  useEffect(() => {
    if (!isEditing) {
      setFilteredProducts([]);
    }
  }, [isEditing, onClose]);

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

  // Cargar datos cuando sea edición
  useEffect(() => {
    if (!isOpen || !isEditing) return;

    const loadDocumentData = async () => {
      try {
        const [titleResponse, productsResponse] = await Promise.all([
          getDocumentsByNumTitle(selectedItem.id),
          getDocumentsByNum(selectedItem.id),
        ]);

        // console.log("title", titleResponse);
        // console.log("products", productsResponse);

        // Combinar datos: 1 título + 3 productos, repetido
        const combinedData = [];

        for (let i = 0; i < titleResponse.length; i++) {
          // Convertir título en objeto con campo 'descripcion'
          const { titdescripcion, ...rest } = titleResponse[i];

          const titleItem = {
            ...rest,
            descripcion: titdescripcion,
          };

          // Tomar grupo de 2 productos consecutivos
          const productGroup = productsResponse.slice(i * 2, (i + 1) * 2);

          // Si no hay productos para este título, omitimos
          if (productGroup.length === 0) continue;

          // Añadimos el título + sus productos
          combinedData.push(titleItem, ...productGroup);
          // console.log("combinedData.push", combinedData);
        }

        // Actualizar estado
        setFilteredProducts(combinedData);
      } catch (error) {
        console.error("Error al cargar datos del documento:", error);
      }
    };

    loadDocumentData();
  }, [isOpen, isEditing]);

  if (!isOpen) return null;

  // Manejador principal de guardado
  const handleProduct = async () => {
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
        // console.log("documentId en HistoryModals: ", documentId)
        await updateProduct(documentId, documentData);
      } else {
        // Si no, creamos uno nuevo
        const documentResponse = await addProduct(documentData);
        documentId = documentResponse.id;
      }

      // Guardar cada línea de producto
      // console.log("filteredProducts", filteredProducts);
      for (const item of filteredProducts) {
        if (
          item.descripcion !== "Materiales" &&
          item.descripcion !== "Mano de Obra"
        ) {
          const titleDescription = {
            titdescripcion: item.descripcion,
            titledoc: documentId,
          };
          if (item.id) {
            // console.log("actualizarTitle", item.id, titleDescription)
            await updateDocumentFieldsIdTitle(item.id, titleDescription);
          } else {
            await addProductTitle(titleDescription);
          }
        } else {
          const tabledocuments = {
            referencai: item.referencia,
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            precio: item.precio,
            dto: item.dto,
            importe: item.importe,
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
      if (isEditing) {
        alert("Documento Actualizado.");
      } else {
        alert("Documento guardado correctamente.");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar el documento.");
    }
  }; //Fin de handleSaveProduct

  const handleDeleteRow = async (newFilteredProducts, index) => {
    // Encontrar el índice inicial del grupo de 3
    let startIndex = index;

    // Retroceder hasta encontrar el inicio del grupo (múltiplo de 3)
    while (startIndex > 0 && startIndex % 3 !== 0) {
      startIndex--;
    }

    // Eliminar 3 filas desde el inicio del grupo
    const valueDelete = newFilteredProducts.splice(startIndex, 3);
    newFilteredProducts.splice(startIndex, 3);

    // Confirmación antes de borrar
    if (isEditing) {
      const confirmDelete = window.confirm(
        "¿Estás seguro de que deseas eliminar este grupo de filas?"
      );

      if (!confirmDelete) return;

      console.log("confirmDelete", valueDelete);
      //Borramos el Titulo del Producto

      //Borramos Mano de Obra y Materiales
      for (const item of valueDelete) {
        if (
          item?.descripcion === "Materiales" ||
          item?.descripcion === "Mano de Obra"
        ) {
          console.log("item.id", item.id);
          await deleteProduct(item.id);
        } else {
          await deleteProductTitle(valueDelete[0].id);
        }
      }

      setFilteredProducts(newFilteredProducts);
    } else {
      setFilteredProducts(newFilteredProducts);
    }
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
            isEditing={isEditing}
            selectedItem={selectedItem}
          />

          {/* Tabla de productos */}
          <div className="mt-6">
            <TableDocuments
              filteredProducts={filteredProducts}
              setFilteredProducts={setFilteredProducts}
              onProductsChange={handleTableDataChange}
              onDeleteRow={handleDeleteRow} // 👈 Aquí pasas la función
            />
          </div>

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
              onClick={handleProduct}
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
