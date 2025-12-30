import { useEffect, useState } from "react";
import { DocumentsInfo } from "@/modules/documents/components/DocumentsInfo";
import { TableDocuments } from "@/modules/documents/components/compTableDocuments/TableDocuments";
import { DocumentsFooter } from "@/modules/documents/components/DocumentsFooter";

// Hooks de contextos (Sin cambios)
import { useApiDocumentsContext } from "@/modules/documents/context/DocumentsProvider";
import { useApiTitleTableDocumentsContext } from "@/modules/documents/context/TitleTableDocumentsProvider";
import { useApiDataDocumentsContext } from "@/modules/documents/context/DataDocumentsProvider";
import { useApiFootersContext } from "@/modules/documents/context/FootersProvider";

export const HistoryModals = ({ isOpen, onClose, searchTerm, selectedItem }) => {
  const isEditing = !!selectedItem?.id;
  const [activeTab, setActiveTab] = useState("info");

  // --- LÓGICA DE PROVIDERS ---
  const { updateDocumentFieldsId, addProduct } = useApiDocumentsContext();
  const { addProductTitle, getDocumentsByNumTitle, updateDocumentFieldsIdTitle } = useApiTitleTableDocumentsContext();
  const { addProductTable, getDocumentsByNum, updateProductTable } = useApiDataDocumentsContext();
  const { saveFooter, updateFooter, getFootersByFieldId } = useApiFootersContext();

  const [datInfo, setDatInfo] = useState({ dataInfoDocument: "", dataInfoDate: "", dataInfoObservation: "" });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [datFooter, setDatFooter] = useState({ datsubTotal: 0, datbaseImponible: 0, datIva: 0, datTotal: 0 });

  const parseSearchTerm = (value) => {
    let match = value?.match(/^\(([^)]+)\)\s*(.*)/);
    return match ? { cif: match[1] } : { cif: value ?? "" };
  };
  const { cif } = parseSearchTerm(searchTerm);

  useEffect(() => {
    if (!isOpen || !selectedItem) return;
    setDatInfo({
      dataInfoDocument: selectedItem.num_presupuesto || "",
      dataInfoDate: selectedItem.fecha_factura || "",
      dataInfoObservation: selectedItem.observaciones || "",
    });

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
        const foot = getFootersByFieldId(selectedItem.id);
        if (foot) {
          setDatFooter({ datsubTotal: foot.subtotal, datbaseImponible: foot.base_imponible, datIva: foot.iva, datTotal: foot.total });
        }
      } catch (err) { console.error(err); }
    };
    if (isEditing) loadData();
  }, [isOpen, selectedItem, isEditing, getDocumentsByNumTitle, getDocumentsByNum, getFootersByFieldId]);

  const handleSave = async () => {
    try {
      const documentPayload = {
        fecha_factura: datInfo.dataInfoDate,
        observaciones: datInfo.dataInfoObservation,
        num_presupuesto: datInfo.dataInfoDocument,
        dataclient: cif,
      };
      let documentId = selectedItem?.id;
      if (isEditing) await updateDocumentFieldsId(documentId, documentPayload);
      else {
        const newDoc = await addProduct(documentPayload);
        documentId = newDoc.id;
      }
      const tablePromises = filteredProducts.map(async (item) => {
        if (!item.descripcion?.trim()) return;
        if (item.descripcion !== "Materiales" && item.descripcion !== "Mano de Obra") {
          const payload = { titdescripcion: item.descripcion, titledoc: documentId };
          return item.id ? updateDocumentFieldsIdTitle(item.id, payload) : addProductTitle(payload);
        } else {
          const payload = { ...item, documento: documentId };
          return item.id ? updateProductTable(item.id, payload) : addProductTable(payload);
        }
      });
      await Promise.all(tablePromises);
      const footerPayload = { subtotal: datFooter.datsubTotal, base_imponible: datFooter.datbaseImponible, iva: datFooter.datIva, total: datFooter.datTotal, footer_documento: documentId };
      isEditing ? await updateFooter(documentId, footerPayload) : await saveFooter(footerPayload);
      onClose();
    } catch (error) { console.error(error); alert("Error al sincronizar"); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-full max-w-6xl max-h-[90vh] flex flex-col relative overflow-hidden border border-white/20">
        
        {/* HEADER */}
        <div className="px-8 pt-8 pb-4 bg-white shrink-0">
          <button onClick={onClose} className="absolute top-6 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90">
            <span className="text-2xl leading-none">&times;</span>
          </button>
          
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2">Editor de Documentos</span>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{isEditing ? "Actualizar Registro" : "Crear Nuevo Documento"}</h2>
          </div>
          
          <div className="flex gap-2 p-1.5 bg-slate-100/80 rounded-2xl w-fit">
            {[
              { id: "info", label: "Información", icon: "📄" },
              { id: "products", label: "Productos", icon: "📦" },
              { id: "summary", label: "Resumen Final", icon: "📊" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:bg-white/50"
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CUERPO DEL MODAL - Scroll Condicional */}
        <div className={`flex-1 px-8 py-4 bg-white ${activeTab === 'summary' ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'}`}>
          <div className="animate-in slide-in-from-bottom-2 duration-500">
            {activeTab === "info" && (
              <div className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100">
                <DocumentsInfo cif={cif} datInfo={datInfo} setDatInfo={setDatInfo} isEditing={isEditing} />
              </div>
            )}
            {activeTab === "products" && (
              <TableDocuments 
                filteredProducts={filteredProducts} 
                setFilteredProducts={setFilteredProducts} 
                onProductsChange={(newProds) => {
                  setFilteredProducts(newProds);
                  const sub = newProds.reduce((acc, i) => acc + (parseFloat(i.importe) || 0), 0);
                  setDatFooter(prev => ({ ...prev, datsubTotal: sub, datbaseImponible: sub, datIva: sub * 0.21, datTotal: sub * 1.21 }));
                }} 
              />
            )}
            {activeTab === "summary" && (
              <div className="h-full flex flex-col justify-center">
                <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                  <DocumentsFooter filteredProducts={filteredProducts} setDatFooter={setDatFooter} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
          <p className="text-[11px] text-slate-400 font-medium italic">* Verifique los totales antes de confirmar.</p>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-3 rounded-2xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all active:scale-95">Cerrar</button>
            {activeTab !== "summary" ? (
              <button onClick={() => setActiveTab(activeTab === "info" ? "products" : "summary")} className="group px-8 py-3 rounded-2xl bg-slate-800 text-white font-bold shadow-xl hover:bg-slate-900 active:scale-95 transition-all flex items-center gap-2">
                Siguiente paso <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            ) : (
              <button onClick={handleSave} className="px-10 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
                <span className="text-lg">✓</span> {isEditing ? "Confirmar Cambios" : "Guardar Documento"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};