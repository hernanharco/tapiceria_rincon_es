import { useEffect, useRef, useState } from "react";

import { DocumentsInfo } from "@/modules/documents/components/DocumentsInfo";
import { TableDocuments } from "@/modules/documents/components/compTableDocuments/TableDocuments";
import { DocumentsFooter } from "@/modules/documents/components/DocumentsFooter";

// Hooks personalizados
import useDocuments from "@/modules/documents/hooks/useDocuments";
import useTitleTableDocuments from "@/modules/documents/hooks/useTitleTableDocuments";
import useDataDocuments from "@/modules/documents/hooks/useDataDocuments";
import useDataFooter from "@/modules/documents/hooks/useFooters";

export const HistoryModals = ({
  isOpen,
  onClose,
  title,
  searchTerm,
  selectedItem,
}) => {
  //Valor recibidos
  console.log(
    "datos recibidos en HistoryModals: " + "\n searchTerm: ",
    searchTerm
  );

  /* ===========================
     Estados principales
  ============================ */

  const isEditing = !!selectedItem?.num_presupuesto;

  const [activeTab, setActiveTab] = useState("info");

  const [datInfo, setDatInfo] = useState({
    dataInfoDocument: "",
    dataInfoDate: "",
    dataInfoObservation: "",
  });

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [datFooter, setDatFooter] = useState({
    datsubTotal: 0,
    datbaseImponible: 0,
    datIva: 0,
    datTotal: 0,
  });

  /* ===========================
     Hooks de datos
  ============================ */

  const { addProduct, updateProduct } = useDocuments();
  const {
    addProductTitle,
    getDocumentsByNumTitle,
    updateDocumentFieldsIdTitle,
    deleteProductTitle,
  } = useTitleTableDocuments();
  const {
    addProductTable,
    getDocumentsByNum,
    updateProductTable,
    deleteProduct,
  } = useDataDocuments();
  const { saveFooter, updateFooter } = useDataFooter();

  /* ===========================
     Parse cliente
  ============================ */

  const parseSearchTerm = (value) => {
    console.log("estoy en parseSearchTerm: ", value);

    // Primero intentamos con paréntesis
    let match = value?.match(/^\(([^)]+)\)\s*(.*)/);

    if (match) {
      return { cif: match[1] };
    }

    // Si no tiene paréntesis, asumimos que todo es CIF
    return { cif: value ?? "" };
  };

  const { cif } = parseSearchTerm(searchTerm);
  console.log("valro en cif: ", cif);

  /* ===========================
     Inicialización SEGURA en edición
     (solo una vez)
  ============================ */

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!isEditing || !selectedItem || initializedRef.current) return;

    setDatInfo({
      dataInfoDocument: selectedItem.num_presupuesto || "",
      dataInfoDate: selectedItem.fecha_factura || "",
      dataInfoObservation: selectedItem.observaciones || "",
    });

    initializedRef.current = true;
  }, [isEditing, selectedItem]);

  /* ===========================
     Cargar productos en edición
  ============================ */

  useEffect(() => {
    if (!isOpen || !isEditing) return;

    const loadData = async () => {
      try {
        const [titles, products] = await Promise.all([
          getDocumentsByNumTitle(selectedItem.id),
          getDocumentsByNum(selectedItem.id),
        ]);

        const combined = [];
        for (let i = 0; i < titles.length; i++) {
          const { titdescripcion, ...rest } = titles[i];
          const titleItem = { ...rest, descripcion: titdescripcion };
          const group = products.slice(i * 2, i * 2 + 2);
          combined.push(titleItem, ...group);
        }

        setFilteredProducts(combined);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    loadData();
  }, [
    isOpen,
    isEditing,
    selectedItem,
    getDocumentsByNum,
    getDocumentsByNumTitle,
  ]);

  if (!isOpen) return null;

  /* ===========================
     Validaciones de tabs
  ============================ */

  const infoCompleted = Boolean(datInfo.dataInfoDate);
  const productsCompleted = filteredProducts.length > 0;

  /* ===========================
     Navegación siguiente
  ============================ */

  const handleNext = () => {
    if (activeTab === "info" && infoCompleted) setActiveTab("products");
    if (activeTab === "products" && productsCompleted) setActiveTab("summary");
  };

  /* ===========================
     Tabla
  ============================ */

  const handleTableDataChange = (products) => {
    setFilteredProducts(products);

    const subtotal = products.reduce(
      (acc, item) => acc + (item.importe || 0),
      0
    );
    const iva = subtotal * 0.21;

    setDatFooter({
      datsubTotal: subtotal,
      datbaseImponible: subtotal,
      datIva: iva,
      datTotal: subtotal + iva,
    });
  };

  const handleDeleteRow = async (newData, index) => {
    let startIndex = index;
    while (startIndex > 0 && startIndex % 3 !== 0) startIndex--;

    const deleted = newData.splice(startIndex, 3);

    if (isEditing) {
      if (!window.confirm("¿Eliminar este grupo?")) return;

      for (const item of deleted) {
        if (
          item.descripcion === "Materiales" ||
          item.descripcion === "Mano de Obra"
        ) {
          await deleteProduct(item.id);
        } else {
          await deleteProductTitle(item.id);
        }
      }
    }

    setFilteredProducts([...newData]);
    handleTableDataChange(newData);
  };

  /* ===========================
     Guardar
  ============================ */

  const handleSave = async () => {
    try {
      const documentData = {
        fecha_factura: datInfo.dataInfoDate,
        observaciones: datInfo.dataInfoObservation,
        num_presupuesto: datInfo.dataInfoDocument,
        dataclient: cif,
      };

      let documentId;

      if (isEditing) {
        documentId = selectedItem.id;
        await updateProduct(documentId, documentData);
      } else {
        const response = await addProduct(documentData);
        documentId = response.id;
      }

      for (const item of filteredProducts) {
        if (
          item.descripcion !== "Materiales" &&
          item.descripcion !== "Mano de Obra"
        ) {
          const payload = {
            titdescripcion: item.descripcion,
            titledoc: documentId,
          };
          item.id
            ? await updateDocumentFieldsIdTitle(item.id, payload)
            : await addProductTitle(payload);
        } else {
          const payload = {
            referencia: item.referencia,
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            precio: item.precio,
            dto: item.dto,
            importe: item.importe,
            documento: documentId,
          };
          item.id
            ? await updateProductTable(item.id, payload)
            : await addProductTable(payload);
        }
      }

      const footerPayload = {
        subtotal: datFooter.datsubTotal.toFixed(2),
        base_imponible: datFooter.datbaseImponible.toFixed(2),
        iva: datFooter.datIva.toFixed(2),
        total: datFooter.datTotal.toFixed(2),
        footer_documento: documentId,
      };

      isEditing
        ? await updateFooter(documentId, footerPayload)
        : await saveFooter(footerPayload);

      onClose();
      alert(isEditing ? "Documento actualizado." : "Documento guardado.");
    } catch (error) {
      console.error(error);
      alert("Error al guardar el documento");
    }
  };

  /* ===========================
     Render
  ============================ */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-500"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          {[
            { key: "info", label: "Información", enabled: true },
            { key: "products", label: "Productos", enabled: infoCompleted },
            { key: "summary", label: "Resumen", enabled: productsCompleted },
          ].map((tab) => (
            <button
              key={tab.key}
              disabled={!tab.enabled}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 font-semibold transition
                ${
                  activeTab === tab.key
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : tab.enabled
                    ? "text-gray-700"
                    : "text-gray-400 cursor-not-allowed"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "info" && (
          <DocumentsInfo
            cif={cif}
            datInfo={datInfo}
            setDatInfo={setDatInfo}
            isEditing={isEditing}
            selectedItem={selectedItem}
          />
        )}

        {activeTab === "products" && (
          <TableDocuments
            filteredProducts={filteredProducts}
            setFilteredProducts={setFilteredProducts}
            onProductsChange={handleTableDataChange}
            onDeleteRow={handleDeleteRow}
          />
        )}

        {activeTab === "summary" && (
          <DocumentsFooter
            filteredProducts={filteredProducts}
            setDatFooter={setDatFooter}
          />
        )}

        {/* Acciones */}
        <div className="flex justify-end gap-3 mt-6">
          {activeTab !== "summary" && (
            <button
              onClick={handleNext}
              disabled={
                (activeTab === "info" && !infoCompleted) ||
                (activeTab === "products" && !productsCompleted)
              }
              className="px-5 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-300"
            >
              Siguiente
            </button>
          )}

          {activeTab === "summary" && (
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-green-600 text-white"
            >
              {isEditing ? "Actualizar" : "Guardar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
