
import { useState } from "react";
import { useForm } from 'react-hook-form'

import { useFormAction } from "react-router-dom";

export function CompanyModal({ toggleModal, dats }) { 

  const { handleSubmit } = useForm();

  //Trae los datos que suministra Dat_Company y se comienza a mostrar en pantalla
  const [formData, setFormData] = useState({
    name_company : dats?[0]?.name_company || '',
    addres_company : dats?[0].addres_company || '',
    zip_code_company : dats?[0].zip_code_company || '',
    city_company : dats?[0].city_company || '',
    number_company : dats?[0].number_company || '',
    nie_cif_dni_company : dats?[0].nie_cif_dni_company || '',
    email_company : dats?[0].email_company || '',
  })

  //console.log(toggleModal)

  //Este metodo ayuda que se pueda modificar el recuadro con la información
  const handleChange = (e) => {
    const {name, value} = e.target;    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  //Con este metodo vamos actualizar la información en la base de datos
  const onSubmit = handleSubmit (async (data) => {
    console.log(data)
    //await updateTask(params.id, data)
  })

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          {/* Datos de la Empresa */}
          <h2 className="text-xl font-bold mb-4">Datos de la Empresa</h2>

          {/* Formulario */}
          <form onSubmit={onSubmit}>
            {/* Campo de Nombre */}
            <div className="mb-4">
              <input
                type="text"
                id="idname_company"
                name="name_company"
                value={formData.name_company}
                onChange={handleChange}
                className="w-full border border-purple-500 p-2 rounded focus:outline-none focus:border-purple-700"
              />
              <input
                type="text"
                id="idaddres_company"
                name="addres_company"
                value={formData.addres_company}
                onChange={handleChange}
                className="w-full border border-purple-500 p-2 rounded focus:outline-none focus:border-purple-700"
              />
              <input
                type="text"
                id="idzip_code_company"
                name="zip_code_company"
                value={formData.zip_code_company}
                onChange={handleChange}
                className="w-full border border-purple-500 p-2 rounded focus:outline-none focus:border-purple-700"
              />
              <input
                type="text"
                id="idcity_company"
                name="city_company"
                value={formData.city_company}
                onChange={handleChange}
                className="w-full border border-purple-500 p-2 rounded focus:outline-none focus:border-purple-700"
              />
              <input
                type="text"
                id="idnumber_company"
                name="number_company"
                value={formData.number_company}
                onChange={handleChange}
                className="w-full border border-purple-500 p-2 rounded focus:outline-none focus:border-purple-700"
              />
              <input
                type="text"
                id="idnie_cif_dni_company"
                name="nie_cif_dni_company"
                value={formData.nie_cif_dni_company}
                onChange={handleChange}
                className="w-full border border-purple-500 p-2 rounded focus:outline-none focus:border-purple-700"
              />
              <input
                type="text"
                id="idemail_company"
                name="email_company"
                value={formData.email_company}
                onChange={handleChange}
                className="w-full border border-purple-500 p-2 rounded focus:outline-none focus:border-purple-700"
              />
            </div>

            {/* Botón de envío */}
            <button
              //onClick={toggleModal}
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
