import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function CompanyModal({ toggleModal, dats }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  // Función para inicializar el formulario con los datos de la empresa
  const initializeForm = () => {
    if (!dats || !dats[0]) return; // Verifica que haya datos

    const fields = [
      "name_company",
      "addres_company",
      "zip_code_company",
      "city_company",
      "number_company",
      "nie_cif_dni_company",
      "email_company"
    ];

    fields.forEach((field) => {
      setValue(field, dats[0]?.[field] || ""); // Asigna valores al formulario
    });
  };

  // Inicializa el formulario cuando cambia `dats`
  useEffect(() => {
    initializeForm();
  }, [dats]);

  // Manejo de envío exitoso del formulario
  const onSubmit = handleSubmit((data) => {
    console.log("✅ Datos del formulario:", data);
    //toggleModal(); // Cierra el modal después de enviar
  });

  // Manejo de errores de validación
  const onError = (errorList) => {
    console.log("❌ Errores de validación:", errorList);
  };

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          {/* Botón de cierre */}
          <button
            onClick={toggleModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            X
          </button>
          {/* Título del modal */}
          <h2 className="text-xl font-bold mb-4">Datos de la Empresa</h2>

          <form onSubmit={onSubmit}>
            {/* Nombre */}
            <input
              type="text"
              placeholder={dats && dats[0]?.name_company || "Nombre"} // Usa el valor de name_company como placeholder
              {...register("name_company", { required: "Este Campo es Obligatorio" })}
              className="w-full border border-purple-500 p-2 rounded focus:outline-none focus:border-purple-700"
            />

            <button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
