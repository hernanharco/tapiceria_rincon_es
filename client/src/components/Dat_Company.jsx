import { useEffect, useState } from "react";
import { getAllTasks } from "../api/dats.api";
import { CompanyModal } from "./modals/companyModal";

export function Dat_Company({ isOpen, toggleModal }) {

    const [dats, setDats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para abrir/cerrar el modal
    const fun_toggleModal = () => {
        toggleModal(!isOpen);
    };  

    //UseEffect en donde trae la información de la empresa para poderla  mostrar en pantalla
    useEffect(() => {
        async function loadTasks() {
            try {
                const res = await getAllTasks();
                setDats(res.data);
            } catch (err) {
                setError(err.message);
                console.log('Error fetching data: ', err);
            } finally {
                setLoading(false);
            }
        }

        loadTasks();
    }, []);

    //useEffect que se utiliza para cerrar el modal a partir del boton escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                toggleModal(false);
            }
        };

        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando Datos...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen">Error:</div>;
    if (!dats || dats.length === 0)
        return <div className="flex items-center justify-center min-h-screen">No hay datos disponibles</div>;

    // Estado para controlar el modal

    return (
        <div>
            {/* Botón para abrir el modal */}
            <button
                onClick={fun_toggleModal}
                className={`relative flex items-center justify-center min-h-screen bg-gray-100 ${isOpen ? "blur-[3px] " : ""
                    }`}
            >
                {dats[0].name_company || "nombre"}
            </button>

            {/* Backdrop oscuro con transparencia */}
            {isOpen && (
                <div className="fixed inset-0 bg-opacity-30 z-40" />
            )}

            {/* Modal */}
            {isOpen && <CompanyModal fun_toggleModal={fun_toggleModal} dats={dats} />}
        </div>
    );
}