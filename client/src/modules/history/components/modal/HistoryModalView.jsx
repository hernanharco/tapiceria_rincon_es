
import { DocumentsInfo } from "@/modules/documents/components/DocumentsInfo";
import { TableDocuments } from "@/modules/documents/components/compTableDocuments/TableDocuments";
import { DocumentsFooter } from "@/modules/documents/components/DocumentsFooter";

import { useHistoryModal } from "./HistoryModalLogic";

export const HistoryModalView = (props) => {
  const { isOpen, onClose, title, selectedItem } = props;

  // ✅ Hook SIEMPRE arriba
  const modal = useHistoryModal(props);

  // ✅ Render condicional DESPUÉS
  if (!isOpen) return null;

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
        {/* ... */}

        {modal.activeTab === "info" && (
          <DocumentsInfo
            cif={modal.cif}
            datInfo={modal.datInfo}
            setDatInfo={modal.setDatInfo}
            isEditing={modal.isEditing}
            selectedItem={selectedItem}
          />
        )}

        {modal.activeTab === "products" && (
          <TableDocuments
            filteredProducts={modal.filteredProducts}
            setFilteredProducts={modal.setFilteredProducts}
            onProductsChange={modal.handleTableDataChange}
            onDeleteRow={modal.handleDeleteRow}
          />
        )}

        {modal.activeTab === "summary" && (
          <DocumentsFooter
            filteredProducts={modal.filteredProducts}
            setDatFooter={modal.setDatFooter}
          />
        )}
      </div>
    </div>
  );
};
