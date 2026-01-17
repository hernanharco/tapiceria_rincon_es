import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { toast } from 'sonner';
import Swal from 'sweetalert2'; // <-- MEJORA: Para ventanas de confirmación modernas

dayjs.locale('es');

// Hooks y Contextos
import useDocuments from '@/modules/documents/hooks/useDocuments';
import { useApiDataDocumentsContext } from '@/context/DataDocumentsProvider';
import { useApiTitleTableDocumentsContext } from '@/context/TitleTableDocumentsProvider';
import { useApiFootersContext } from '@/context/FootersProvider';
import { HistoryTableDocumentView } from '@/modules/history/components/table/HistoryTableDocumentView';
import { HistoryModals } from '@/modules/history/HistoryModals';
import DateModal from '@/utils/dateModal';
import useHistoryTableDocument from '@/modules/history/hooks/useHistoryTableDocument';

export const HistoryTableDocumentLogic = ({
  setShowModal,
  documents: documentsFromProps,
  searchTerm,
  allClients,
}) => {
  const navigate = useNavigate();

  const {
    getDocumentByDoc,
    documents: documentsFromContext,
    fetchDocumentById,
    deleteProduct: deleteCabecera,
  } = useDocuments();

  const { datadocuments, refetchdatadocuments } = useApiDataDocumentsContext();
  const { documents: titlesFromContext, refetch: refetchTitles } =
    useApiTitleTableDocumentsContext();
  const { refetchclientes: refetchFooters } = useApiFootersContext();

  const [showModalSearch, setShowModalSearch] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemIdToCheck, setItemIdToCheck] = useState(null);
  const [opcItem, setOpcItem] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [sortConfig, setSortConfig] = useState({
    key: 'num_presupuesto',
    direction: 'desc',
  });

  // --- MEJORA VISUAL: TRIPLE CONFIRMACIÓN MODERNA (ADIÓS WINDOW.CONFIRM) ---
  const handleFullDelete = async (item) => {
    // PASO 1: Diseño Moderno
    const step1 = await Swal.fire({
      title: '¿Eliminar documento?',
      text: `¿Está seguro de eliminar el presupuesto ${item.num_presupuesto}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
    });
    if (!step1.isConfirmed) return toast('Eliminación cancelada');

    // PASO 2: Diseño de Advertencia
    const step2 = await Swal.fire({
      title: '¡ADVERTENCIA!',
      text: 'Se borrarán todas las LÍNEAS, TÍTULOS y TOTALES asociados. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, lo entiendo',
      cancelButtonText: 'Detener',
      confirmButtonColor: '#f59e0b',
    });
    if (!step2.isConfirmed) return toast.info('Operación detenida');

    // PASO 3: Diseño de Peligro Crítico
    const step3 = await Swal.fire({
      title: 'CONFIRMACIÓN FINAL',
      text: `Esta acción es IRREVERSIBLE. ¿Eliminar definitivamente ${item.num_presupuesto}?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'SÍ, BORRAR TODO',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#ef4444',
    });

    if (step3.isConfirmed) {
      toast.promise(
        async () => {
          await deleteCabecera(item.id);
          await Promise.all([
            refetchdatadocuments?.(true),
            refetchTitles?.(true),
            refetchFooters?.(true),
          ]);
        },
        {
          loading: 'Eliminando registros...',
          success: `Documento ${item.num_presupuesto} eliminado.`,
          error: 'No se pudo eliminar el documento.',
          duration: 4000,
        },
      );
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const shouldShowAll = useMemo(() => {
    const term = debouncedSearchTerm?.trim().toLowerCase();
    return term === 'todos' || term === '%';
  }, [debouncedSearchTerm]);

  const parseSearchTerm = (value) => {
    const match = value.match(/^\(([^)]+)\)\s*(.*)/);
    return { cif: match ? match[1] : '' };
  };
  const { cif } = parseSearchTerm(debouncedSearchTerm);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        let baseDocs = [];
        const search = debouncedSearchTerm.trim().toLowerCase();

        if (shouldShowAll) {
          baseDocs = documentsFromContext || [];
        } else if (cif) {
          baseDocs = await getDocumentByDoc(String(cif).trim());
        } else if (documentsFromProps && documentsFromProps.length > 0) {
          const titledocsIds = documentsFromProps.map((doc) => doc.titledoc);
          const promises = titledocsIds.map((id) => fetchDocumentById(id));
          const results = await Promise.all(promises);
          baseDocs = results.filter((doc) => doc !== null);
        } else {
          baseDocs = documentsFromContext || [];
        }

        const enrichedDocs = baseDocs.map((doc) => ({
          ...doc,
          lineas: datadocuments?.filter((l) => l.documento === doc.id) || [],
          titulos:
            titlesFromContext?.filter((t) => t.titledoc === doc.id) || [],
        }));

        let result = enrichedDocs;

        if (search.length > 0 && !shouldShowAll && !cif) {
          result = enrichedDocs.filter((doc) => {
            const inHeader =
              doc.num_presupuesto?.toString().includes(search) ||
              doc.observaciones?.toLowerCase().includes(search);
            const inLines = doc.lineas.some(
              (l) =>
                l.descripcion?.toLowerCase().includes(search) ||
                l.referencia?.toLowerCase().includes(search),
            );
            const inTitles = doc.titulos.some((t) =>
              t.titdescripcion?.toLowerCase().includes(search),
            );
            return inHeader || inLines || inTitles;
          });
        }

        const finalDocs = result.map((doc) => {
          const client = allClients.find((c) => c.cif === doc.dataclient);
          return {
            ...doc,
            clienteNombre: client ? client.name : 'Cliente desconocido',
            cifCliente: doc.dataclient || client?.cif || '-',
          };
        });

        finalDocs.sort(
          (a, b) => new Date(b.fecha_factura) - new Date(a.fecha_factura),
        );
        setFilteredProducts(finalDocs);
        setIsDisabled(!cif && !shouldShowAll);
      } catch (error) {
        console.error('Error en búsqueda HistoryTable:', error);
        setFilteredProducts([]);
      }
    };

    fetchDocuments();
  }, [
    debouncedSearchTerm,
    cif,
    shouldShowAll,
    documentsFromProps,
    documentsFromContext,
    datadocuments,
    titlesFromContext,
    allClients,
  ]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc')
      direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let vA = a[sortConfig.key] ?? '';
      let vB = b[sortConfig.key] ?? '';
      if (typeof vA === 'string') {
        vA = vA.toLowerCase();
        vB = vB.toLowerCase();
      }
      if (vA < vB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (vA > vB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortConfig]);

  const handleUpdate = (item) => {
    setSelectedItem(item);
    setShowModalSearch(true);
  };

  const handlePrint = (numDoc, title, clientCif) => {
    if (!numDoc || !clientCif) return;
    navigate(`/imprimir/${numDoc}/${title}/${clientCif}`);
  };

  const { toggleChecklistItemProvider } = useHistoryTableDocument();

  return (
    <>
      <HistoryTableDocumentView
        sortedProducts={sortedProducts}
        setShowModal={setShowModal}
        isDisabled={isDisabled}
        handleUpdate={handleUpdate}
        handlePrint={handlePrint}
        handleDeleteFactura={handleFullDelete}
        toggleChecklistItem={(id, opc) => {
          setItemIdToCheck(id);
          setOpcItem(opc);
          setIsModalOpen(true);
        }}
        requestSort={requestSort}
        sortConfig={sortConfig}
        onDoubleClickSearch={(e) => e.target.select()}
      />

      <HistoryModals
        isOpen={showModalSearch}
        onClose={() => setShowModalSearch(false)}
        selectedItem={selectedItem}
        searchTerm={searchTerm}
      />

      <DateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (date) => {
          if (itemIdToCheck && date) {
            await toggleChecklistItemProvider(itemIdToCheck, date, opcItem);
            setIsModalOpen(false);
          }
        }}
        itemId={itemIdToCheck}
        opcItem={opcItem}
      />
    </>
  );
};
