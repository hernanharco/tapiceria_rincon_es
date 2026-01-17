import { useEffect, useState } from 'react';
import { DocumentsInfo } from '@/modules/documents/components/DocumentsInfo';
import { TableDocuments } from '@/modules/documents/components/compTableDocuments/TableDocuments';
import { DocumentsFooter } from '@/modules/documents/components/DocumentsFooter';

// Hooks de contextos
import { useApiDocumentsContext } from '@/context/DocumentsProvider';
import { useApiTitleTableDocumentsContext } from '@/context/TitleTableDocumentsProvider';
import { useApiDataDocumentsContext } from '@/context/DataDocumentsProvider';
import { useApiFootersContext } from '@/context/FootersProvider';

export const HistoryModals = ({
  isOpen,
  onClose,
  searchTerm,
  selectedItem,
}) => {
  const isEditing = !!selectedItem?.id;
  const [activeTab, setActiveTab] = useState('info');

  // --- LÓGICA DE PROVIDERS ---
  const { updateDocumentFieldsId, addProduct } = useApiDocumentsContext();
  const {
    addProductTitle,
    getDocumentsByNumTitle,
    updateDocumentFieldsIdTitle,
    deleteProductTitle,
  } = useApiTitleTableDocumentsContext();
  const {
    addProductTable,
    getDocumentsByNum,
    updateProductTable,
    deleteProduct,
  } = useApiDataDocumentsContext();
  const { /*saveFooter,*/ updateFooter, getFootersByFieldId } =
    useApiFootersContext();

  const [datInfo, setDatInfo] = useState({
    dataInfoDocument: '',
    dataInfoDate: '',
    dataInfoObservation: '',
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [datFooter, setDatFooter] = useState({
    datsubTotal: 0,
    datbaseImponible: 0,
    datIva: 0,
    datTotal: 0,
  });

  const [deletedIds, setDeletedIds] = useState({ titles: [], products: [] });

  // --- LÓGICA DE IDENTIFICACIÓN DEL CLIENTE (CIF) ---

  // 1. Definimos la función de limpieza una sola vez
  const parseSearchTerm = (value) => {
    if (!value) return '';
    // Busca el patrón (CIF) Nombre
    const match = value.match(/^\(([^)]+)\)\s*(.*)/);
    return match ? match[1] : value;
  };

  // 2. Determinamos el CIF mediante prioridad:
  // PRIORIDAD 1: Si estamos editando, mandamos el CIF que ya tiene el documento (dataclient).
  // PRIORIDAD 2: Si es nuevo, limpiamos lo que el usuario escribió en el buscador.
  const cleanCif = selectedItem?.dataclient || parseSearchTerm(searchTerm);

  // 3. (Opcional) Nombre del cliente para mostrar en la UI si lo necesitas
  //const clientName = selectedItem?.clienteNombre || "";

  useEffect(() => {
    if (!isOpen || !selectedItem) return;

    setDatInfo({
      dataInfoDocument: selectedItem.num_presupuesto || '',
      dataInfoDate: selectedItem.fecha_factura || '',
      dataInfoObservation: selectedItem.observaciones || '',
    });

    const loadData = async () => {
      try {
        const [titles, products] = await Promise.all([
          getDocumentsByNumTitle(selectedItem.id),
          getDocumentsByNum(selectedItem.id),
        ]);

        const combined = [];
        // Lógica de emparejamiento basada en tu estructura de UI
        titles.forEach((title, index) => {
          const titleItem = { ...title, descripcion: title.titdescripcion };
          const group = products
            .filter((p) => p.documento === selectedItem.id)
            .slice(index * 2, index * 2 + 2);
          combined.push(titleItem, ...group);
        });

        setFilteredProducts(combined);

        const foot = getFootersByFieldId(selectedItem.id);
        if (foot) {
          setDatFooter({
            datsubTotal: foot.subtotal,
            datbaseImponible: foot.base_imponible,
            datIva: foot.iva,
            datTotal: foot.total,
          });
        }
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    };

    if (isEditing) {
      loadData();
      setDeletedIds({ titles: [], products: [] });
    }
  }, [isOpen, selectedItem, isEditing]);

  const handleSave = async () => {
    try {
      // --- 1. PROCESAR ELIMINACIONES PENDIENTES ---
      if (isEditing) {
        if (deletedIds.products.length > 0) {
          await Promise.all(deletedIds.products.map((id) => deleteProduct(id)));
        }
        if (deletedIds.titles.length > 0) {
          await Promise.all(
            deletedIds.titles.map((id) => deleteProductTitle(id)),
          );
        }
      }

      // --- 2. GUARDAR O EDITAR CABECERA ---
      const documentPayload = {
        fecha_factura: datInfo.dataInfoDate,
        observaciones: datInfo.dataInfoObservation || '',
        num_presupuesto: String(datInfo.dataInfoDocument),
        dataclient: String(cleanCif),
      };

      let headerResponse;
      if (isEditing && selectedItem?.id) {
        headerResponse = await updateDocumentFieldsId(
          selectedItem.id,
          documentPayload,
        );
      } else {
        headerResponse = await addProduct(documentPayload);
      }

      const documentId = headerResponse.id;

      // --- 3. GUARDAR / ACTUALIZAR LÍNEAS DE LA TABLA ---
      if (filteredProducts.length > 0) {
        for (let i = 0; i < filteredProducts.length; i += 3) {
          const titleItem = filteredProducts[i];
          const materialItem = filteredProducts[i + 1];
          const obraItem = filteredProducts[i + 2];

          // A. Procesar Título
          if (titleItem) {
            const payloadTitle = {
              titledoc: documentId,
              titdescripcion: titleItem.descripcion,
            };
            if (titleItem.id && !titleItem.id.toString().startsWith('new-')) {
              await updateDocumentFieldsIdTitle(titleItem.id, payloadTitle);
            } else {
              await addProductTitle(payloadTitle);
            }
          }

          // B. Procesar Materiales y Mano de Obra
          const subItems = [
            { data: materialItem, type: 'Materiales' },
            { data: obraItem, type: 'Mano de Obra' },
          ];

          for (const item of subItems) {
            if (item.data) {
              const payloadDetail = { ...item.data, documento: documentId };
              if (item.data.id && !item.data.id.toString().startsWith('new-')) {
                await updateProductTable(item.data.id, payloadDetail);
              } else {
                await addProductTable(payloadDetail);
              }
            }
          }
        }
      }

      // --- 4. GUARDAR O ACTUALIZAR EL FOOTER (Totales) ---
      // Este es el paso que habilita tu saveFooter/updateFooter
      try {
        const footerPayload = {
          // Calculamos, fijamos 2 decimales y convertimos de nuevo a número
          subtotal: Number(parseFloat(datFooter.datsubTotal || 0).toFixed(2)),
          base_imponible: Number(
            parseFloat(datFooter.datbaseImponible || 0).toFixed(2),
          ),
          iva: Number(parseFloat(datFooter.datIva || 0).toFixed(2)),
          total: Number(parseFloat(datFooter.datTotal || 0).toFixed(2)),
          footer_documento: documentId,
        };

        // updateFooter decidirá internamente si llamar a saveFooter (POST) o hacer PATCH
        await updateFooter(documentId, footerPayload);
      } catch (footerError) {
        console.error('Error al procesar el footer:', footerError);
        // Aquí podrías decidir si quieres lanzar el error o que el proceso siga
      }

      // 5. FINALIZACIÓN
      alert('¡Todo se ha guardado correctamente!');
      onClose();
    } catch (error) {
      console.error('Error general:', error);
      alert('Error al guardar: ' + error.message);
    }
  };

  // Finaliza handleSave

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* HEADER */}
        <div className="px-8 pt-8 pb-4 bg-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <span className="text-2xl">&times;</span>
          </button>
          <div className="mb-6">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
              Gestión de Documentos
            </span>
            <h2 className="text-3xl font-black text-slate-800">
              {isEditing ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
            </h2>
          </div>

          <div className="flex gap-2 p-1.5 bg-slate-100/80 rounded-2xl w-fit">
            {['info', 'products', 'summary'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:bg-white/50'
                }`}
              >
                {tab === 'info'
                  ? '📄 Info'
                  : tab === 'products'
                    ? '📦 Detalles'
                    : '📊 Totales'}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENIDO DINÁMICO */}
        <div className="flex-1 px-8 py-4 bg-white overflow-y-auto custom-scrollbar">
          {activeTab === 'info' && (
            <DocumentsInfo
              cif={cleanCif}
              datInfo={datInfo}
              setDatInfo={setDatInfo}
              isEditing={isEditing}
            />
          )}

          {activeTab === 'products' && (
            <TableDocuments
              filteredProducts={filteredProducts}
              setFilteredProducts={setFilteredProducts}
              onDeleteRow={(newList, blockStartIndex) => {
                const block = filteredProducts.slice(
                  blockStartIndex,
                  blockStartIndex + 3,
                );
                const idsToTrack = { titles: [], products: [] };
                block.forEach((item) => {
                  if (item.id && !item.id.toString().startsWith('new-')) {
                    if (
                      item.descripcion !== 'Materiales' &&
                      item.descripcion !== 'Mano de Obra'
                    ) {
                      idsToTrack.titles.push(item.id);
                    } else {
                      idsToTrack.products.push(item.id);
                    }
                  }
                });
                setDeletedIds((prev) => ({
                  titles: [...prev.titles, ...idsToTrack.titles],
                  products: [...prev.products, ...idsToTrack.products],
                }));
                setFilteredProducts(newList);
              }}
              onProductsChange={(newProds) => {
                setFilteredProducts(newProds);
                const sub = newProds.reduce(
                  (acc, i) => acc + (parseFloat(i.importe) || 0),
                  0,
                );
                setDatFooter({
                  datsubTotal: sub,
                  datbaseImponible: sub,
                  datIva: sub * 0.21,
                  datTotal: sub * 1.21,
                });
              }}
            />
          )}

          {activeTab === 'summary' && (
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <DocumentsFooter
                filteredProducts={filteredProducts}
                setDatFooter={setDatFooter}
              />
            </div>
          )}
        </div>

        {/* ACCIONES */}
        <div className="px-8 py-6 bg-slate-50 border-t flex justify-between items-center">
          <p className="text-[11px] text-slate-400 italic">
            * Campos obligatorios: Cliente y Fecha.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 font-bold text-slate-400"
            >
              Cancelar
            </button>
            {activeTab !== 'summary' ? (
              <button
                onClick={() =>
                  setActiveTab(activeTab === 'info' ? 'products' : 'summary')
                }
                className="px-8 py-3 rounded-2xl bg-slate-800 text-white font-bold"
              >
                Continuar →
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-10 py-3 rounded-2xl bg-green-600 text-white font-black shadow-lg hover:bg-green-700 transition-all"
              >
                {isEditing ? 'Actualizar' : 'Guardar Documento'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
