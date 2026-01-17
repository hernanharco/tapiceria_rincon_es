import { useState } from "react";
import { CreateClientsModal } from "../modules/clients/CreateClientsModal";
import { HistoryModals } from "@/modules/history/HistoryModals";
import useClients from "../modules/clients/hooks/useClients";
import useCompany from "../modules/company/hooks/useCompany";
import { toast } from "sonner"; // <-- MEJORA: Feedback SaaS
import Swal from "sweetalert2"; // <-- MEJORA: Confirmaciones Premium

// Iconos premium
import { FaFileInvoice, FaRegEdit, FaRegTrashAlt, FaUserPlus, FaSearch, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export const CreateClientView = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalHistory, setShowModalHistory] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  const { clients, addClients, deleteClients, updateClients, refetchClients } = useClients();
  const { empresas } = useCompany();

  const handleSaveClient = async (cliente) => {
    try {
      if (cliente.isEditing) await updateClients(cliente.cif, cliente);
      else await addClients(cliente);
      await refetchClients();
      setShowModal(false);
      setEditingClient(null);
      toast.success(cliente.isEditing ? "Cliente actualizado" : "Cliente creado");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  // --- MEJORA: ELIMINACIÓN DE CLIENTE CON TRIPLE CONFIRMACIÓN ESTRICTA ---
  const handleDeleteClient = async (client) => {
    // PASO 1: Confirmación de Identidad
    const step1 = await Swal.fire({
      title: '¿Eliminar cliente?',
      text: `Vas a iniciar el proceso para borrar a: ${client.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
    });
    if (!step1.isConfirmed) return toast("Operación cancelada");

    // PASO 2: Advertencia de Integridad (Relaciones)
    const step2 = await Swal.fire({
      title: '¡ADVERTENCIA DE INTEGRIDAD!',
      text: 'Si este cliente tiene facturas o presupuestos asociados, podrían quedar huérfanos. ¿Desea proceder?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Lo entiendo, ir al paso final',
      cancelButtonText: 'Detener',
      confirmButtonColor: '#f59e0b',
    });
    if (!step2.isConfirmed) return toast.info("Cliente protegido");

    // PASO 3: Confirmación Final e Irreversible
    const step3 = await Swal.fire({
      title: 'BORRADO DEFINITIVO',
      html: `¿Está TOTALMENTE seguro de eliminar a <b>${client.name}</b>?<br/>Esta acción no se puede deshacer.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'SÍ, ELIMINAR CLIENTE',
      cancelButtonText: 'ABORTAR',
      confirmButtonColor: '#ef4444',
      background: '#fff5f5'
    });

    if (step3.isConfirmed) {
      toast.promise(
        async () => {
          await deleteClients(client.cif);
          await refetchClients();
        },
        {
          loading: 'Eliminando cliente de la base de datos...',
          success: `Cliente ${client.name} eliminado correctamente.`,
          error: 'Error: No se pudo eliminar el cliente (posibles datos vinculados).',
          duration: 5000,
        }
      );
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
    c.cif.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-4 sm:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Clientes <span className="text-blue-600">.</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium">Gestión integral de contactos y facturación.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="text" 
                placeholder="Buscar cliente..."
                className="pl-11 pr-4 py-3 bg-white border-none rounded-2xl w-full sm:w-64 text-sm shadow-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>

            <button
              onClick={() => { setEditingClient(null); setShowModal(true); }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              <FaUserPlus /> Nuevo Cliente
            </button>
          </div>
        </div>

        {/* TABLA / GRID */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="hidden md:grid grid-cols-5 bg-white rounded-t-[2rem] border-b border-slate-50 px-8 py-5 shadow-sm">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Identificación</span>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Cliente</span>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Ubicación</span>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Contacto</span>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Acciones</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            {filteredClients.length > 0 ? (
              filteredClients.map((client, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] md:rounded-none md:first:rounded-t-none md:last:rounded-b-[2rem] p-6 md:px-8 md:py-5 border border-slate-50 shadow-[0_10px_30px_rgba(0,0,0,0.02)] md:shadow-none md:grid md:grid-cols-5 md:items-center hover:bg-blue-50/30 transition-all">
                  
                  <div className="flex justify-between items-start md:block mb-4 md:mb-0">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-bold text-sm">{client.cif}</span>
                      <span className="text-[10px] font-bold text-blue-500 uppercase">COD: {client.cod_client || "-"}</span>
                    </div>
                    <div className="md:hidden w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 font-black text-xs">
                      {client.name.charAt(0)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <div className="hidden md:flex w-9 h-9 rounded-xl bg-slate-100 items-center justify-center text-slate-500 text-xs font-black">
                      {client.name.charAt(0)}
                    </div>
                    <span className="text-slate-800 font-extrabold text-sm md:font-bold">{client.name}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3 md:mb-0 text-slate-500">
                    <FaMapMarkerAlt className="md:hidden text-blue-400" size={12} />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">{client.address}</span>
                      <span className="text-[11px] text-slate-400">{client.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6 md:mb-0 text-slate-600">
                    <FaPhoneAlt className="md:hidden text-blue-400" size={12} />
                    <span className="text-xs font-semibold bg-slate-100 md:bg-transparent px-3 py-1 md:px-0 rounded-full">
                      {client.number}
                    </span>
                  </div>

                  <div className="flex justify-between md:justify-center items-center pt-4 md:pt-0 border-t md:border-none border-slate-50">
                    <span className="md:hidden text-[10px] font-black text-slate-300 uppercase">Acciones</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingClient(client); setShowModalHistory(true); setSearchTerm(client.cif); }}
                        className="p-3 md:p-2.5 rounded-xl text-emerald-500 bg-emerald-50 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                      >
                        <FaFileInvoice size={18} />
                      </button>
                      
                      <button
                        onClick={() => { setEditingClient(client); setShowModal(true); }}
                        className="p-3 md:p-2.5 rounded-xl text-amber-500 bg-amber-50 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                      >
                        <FaRegEdit size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteClient(client)} // Enviamos el objeto cliente completo para la alerta
                        className="p-3 md:p-2.5 rounded-xl text-red-400 bg-red-50 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <FaRegTrashAlt size={18} />
                      </button>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="bg-white rounded-[2rem] py-20 text-center text-slate-300 font-bold italic">
                No se encontraron clientes...
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <CreateClientsModal
          isOpen={true}
          onClose={() => { setShowModal(false); setEditingClient(null); }}
          onSubmit={handleSaveClient}
          client={editingClient}
          company={empresas[0]?.cif || null}
        />
      )}

      <HistoryModals
        isOpen={showModalHistory}
        onClose={() => setShowModalHistory(false)}
        title="Logo"
        searchTerm={searchTerm}
      />
    </div>
  );
};