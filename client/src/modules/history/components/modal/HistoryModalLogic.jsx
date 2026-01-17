import { useEffect, useRef, useState } from "react";

// Hooks personalizados
import useDocuments from "@/modules/documents/hooks/useDocuments";
import useTitleTableDocuments from "@/modules/documents/hooks/useTitleTableDocuments";
import useDataDocuments from "@/modules/documents/hooks/useDataDocuments";
import useDataFooter from "@/modules/documents/hooks/useFooters";

export const HistoryModalLogic = ({
  isOpen,
  selectedItem,
  searchTerm,
  onClose,
}) => {
  const isEditing = !!selectedItem?.num_presupuesto;

  /* ===========================
     Estados
  ============================ */

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
     Cliente
  ============================ */

  const parseSearchTerm = (value) => {
    const match = value?.match(/^\(([^)]+)\)\s*(.*)/);
    return { cif: match ? match[1] : "" };
  };

  const { cif } = parseSearchTerm(searchTerm);

  /* ===========================
     Inicialización edición
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
     Cargar productos
  ============================ */

  useEffect(() => {
    if (!isOpen || !isEditing) return;

    const loadData = async () => {
      const [titles, products] = await Promise.all([
        getDocumentsByNumTitle(selectedItem.id),
        getDocumentsByNum(selectedItem.id),
      ]);

      const combined = [];
      for (let i = 0; i < titles.length; i++) {
        const { titdescripcion, ...rest } = titles[i];
        combined.push(
          { ...rest, descripcion: titdescripcion },
          ...products.slice(i * 2, i * 2 + 2)
        );
      }

      setFilteredProducts(combined);
    };

    loadData();
  }, [isOpen, isEditing, selectedItem]);

  /* ===========================
     Helpers
  ============================ */

  const infoCompleted = Boolean(datInfo.dataInfoDate);
  const productsCompleted = filteredProducts.length > 0;

  const handleNext = () => {
    if (activeTab === "info" && infoCompleted) setActiveTab("products");
    if (activeTab === "products" && productsCompleted) setActiveTab("summary");
  };

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

    if (isEditing && window.confirm("¿Eliminar este grupo?")) {
      for (const item of deleted) {
        item.descripcion === "Materiales" || item.descripcion === "Mano de Obra"
          ? await deleteProduct(item.id)
          : await deleteProductTitle(item.id);
      }
    }

    setFilteredProducts([...newData]);
    handleTableDataChange(newData);
  };

  const handleSave = async () => {
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
      if (item.descripcion !== "Materiales" && item.descripcion !== "Mano de Obra") {
        const payload = { titdescripcion: item.descripcion, titledoc: documentId };
        item.id
          ? await updateDocumentFieldsIdTitle(item.id, payload)
          : await addProductTitle(payload);
      } else {
        const payload = { ...item, documento: documentId };
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
  };

  return {
    isEditing,
    cif,
    activeTab,
    setActiveTab,
    datInfo,
    setDatInfo,
    filteredProducts,
    setFilteredProducts,
    datFooter,
    setDatFooter,
    infoCompleted,
    productsCompleted,
    handleNext,
    handleSave,
    handleDeleteRow,
    handleTableDataChange,
  };
};
