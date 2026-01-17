import React, { useState, useRef, useEffect } from 'react';
import {
  Mail,
  Loader2,
  Building2,
  MapPin,
  Hash,
  Globe,
  Phone,
  Image as ImageIcon,
  CheckCircle2,
  Send,
  Plus as PlusIcon,
  Percent,
} from 'lucide-react';
import { companyService } from '@/api/companyService';

const EnterpriseForm = () => {
  const [status, setStatus] = useState('idle');
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [existingData, setExistingData] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    cif: '',
    name: '',
    address: '',
    zip_code: '',
    city: '',
    province: '',
    number: '',
    email: '',
    iva_comp: '',
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setIsLoading(true);
        const data = await companyService.getCompanyData();
        // Asumimos que la API devuelve un array y tomamos el primer registro
        if (data && data.length > 0) {
          const companyData = data[0];
          setExistingData(companyData);
          setFormData({
            cif: companyData.cif || '',
            name: companyData.name || '',
            address: companyData.address || '',
            zip_code: companyData.zip_code || '',
            city: companyData.city || '',
            province: companyData.province || '',
            number: companyData.number || '',
            email: companyData.email || '',
            iva_comp: companyData.iva_comp || '',
          });
          if (companyData.logo_url) {
            setLogoPreview(companyData.logo_url);
          }
        }
      } catch (error) {
        console.error('Error loading company data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCompanyData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const data = new FormData();

    // 1. Añadimos los campos de texto uno por uno
    // FILTRO CRÍTICO: No permitimos que 'logo' entre en este bucle
    Object.keys(formData).forEach((key) => {
      if (
        key !== 'logo' &&
        formData[key] !== null &&
        formData[key] !== undefined &&
        formData[key] !== ''
      ) {
        data.append(key, formData[key]);
      }
    });

    // 2. Solo añadimos el logo si el usuario seleccionó un ARCHIVO nuevo
    // Si logoFile es la URL antigua (string), no se añade nada.
    if (logoFile instanceof File) {
      data.append('logo', logoFile);
    }

    try {
      const cif = existingData?.cif || formData.cif;
      await companyService.updateCompanyData(cif, data);

      setStatus('success');

      // 3. Refrescar datos
      const updated = await companyService.getCompanyData();
      if (updated && updated.length > 0) {
        const companyData = updated[0];
        setExistingData(companyData);
        setLogoPreview(companyData.logo_url);
        setLogoFile(null);
      }

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error detallado del Backend:', error.response?.data);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const InputField = ({
    label,
    name,
    icon: Icon,
    placeholder,
    type = 'text',
    half = false,
  }) => (
    <div className={`space-y-1.5 ${half ? 'md:col-span-1' : 'col-span-full'}`}>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Icon size={18} />
        </div>
        <input
          name={name}
          type={type}
          value={formData[name]}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium text-slate-700"
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-12 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mr-3" size={32} />
        <span className="text-lg font-medium text-slate-600">
          Cargando datos maestros...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
      {/* Header con diseño Dark Mode de Slate */}
      <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold">Configuración de Empresa</h2>
          <p className="text-slate-400 text-sm mt-1">
            Personaliza tus datos fiscales y el logo de tus documentos.
          </p>
        </div>

        {/* Carga de Logo circular */}
        <div
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          <div className="w-28 h-28 rounded-full border-4 border-slate-800 bg-slate-800 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 shadow-xl">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo Empresa"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <ImageIcon className="text-slate-500" size={32} />
            )}
          </div>
          <div className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full border-2 border-slate-900 shadow-lg group-hover:bg-blue-500 transition-colors">
            <PlusIcon size={14} className="text-white" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleLogoChange}
            accept="image/*"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
        {/* Identificación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="CIF / NIF"
            name="cif"
            icon={Hash}
            placeholder="B12345678"
            half
          />
          <div className="md:col-span-2">
            <InputField
              label="Nombre de la Empresa"
              name="name"
              icon={Building2}
              placeholder="Nombre Comercial"
            />
          </div>
        </div>

        {/* Localización */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <InputField
              label="Dirección"
              name="address"
              icon={MapPin}
              placeholder="Calle, número, piso..."
            />
          </div>
          <InputField
            label="C.P."
            name="zip_code"
            icon={Globe}
            placeholder="00000"
            half
          />
          <InputField
            label="Ciudad"
            name="city"
            icon={MapPin}
            placeholder="Ciudad"
            half
          />
          <InputField
            label="Provincia"
            name="province"
            icon={MapPin}
            placeholder="Provincia"
            half
          />
          <InputField
            label="iva"
            name="iva_comp"
            icon={Percent}
            placeholder="iva"
            half
          />
        </div>

        {/* Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <InputField
            label="Teléfono"
            name="number"
            icon={Phone}
            placeholder="Ej: 600 000 000"
          />
          <InputField
            label="Email de Contacto"
            name="email"
            icon={Mail}
            type="email"
            placeholder="email@empresa.com"
          />
        </div>

        {/* Botón de acción con Feedback de estado */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 ${
              status === 'success'
                ? 'bg-green-500 shadow-green-200'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
            } ${status === 'error' ? 'bg-red-500 shadow-red-200' : ''}`}
          >
            {status === 'loading' ? (
              <Loader2 className="animate-spin" size={20} />
            ) : status === 'success' ? (
              <CheckCircle2 size={20} />
            ) : (
              <Send size={20} />
            )}
            <span className="text-lg">
              {status === 'loading'
                ? 'Guardando...'
                : status === 'success'
                  ? '¡Actualizado!'
                  : 'Guardar Cambios'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnterpriseForm;
