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

// Importamos el Contexto Único
import { useApiCompanyContext } from "@/context/CompanyProvider";

const EnterpriseForm = () => {
  // Extraemos los datos y la función de actualización del contexto
  const { empresas, actualizarEmpresa, loading: contextLoading } = useApiCompanyContext();
  
  const [status, setStatus] = useState('idle');
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const fileInputRef = useRef(null);

  // Estado del formulario
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

  // Sincronizamos el formulario cuando los datos del contexto cambian (o cargan por primera vez)
  useEffect(() => {
    if (empresas && empresas.length > 0) {
      const companyData = empresas[0];
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
      if (companyData.logo) {
        // Añadimos timestamp para evitar caché visual en el formulario
        setLogoPreview(`${companyData.logo}?t=${new Date().getTime()}`);
      }
    }
  }, [empresas]);

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

    // 1. Añadimos campos de texto
    Object.keys(formData).forEach((key) => {
      if (key !== 'logo' && formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    // 2. Añadimos archivo de logo solo si es nuevo
    if (logoFile instanceof File) {
      data.append('logo', logoFile);
    }

    try {
      const cifActual = empresas[0]?.cif || formData.cif;
      
      // USAMOS LA FUNCIÓN DE LA CLASE ÚNICA
      // Esta función ya hace el "refetch" interno
      await actualizarEmpresa(cifActual, data);

      setStatus('success');
      setLogoFile(null); // Limpiamos el estado del archivo
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
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

  // Loader inicial mientras el Provider trae los datos de Neon/PostgreSQL
  if (contextLoading && empresas.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-12 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <span className="text-lg font-bold text-slate-600 tracking-tight">
          Sincronizando con el servidor...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configuración de Empresa</h2>
          <p className="text-slate-400 text-sm mt-1">
            Gestión centralizada de datos fiscales y branding.
          </p>
        </div>

        {/* Logo interactivo */}
        <div
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          <div className="w-28 h-28 rounded-full border-4 border-slate-800 bg-slate-800 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 shadow-xl">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Preview"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="CIF / NIF" name="cif" icon={Hash} placeholder="B12345678" half />
          <div className="md:col-span-2">
            <InputField label="Nombre de la Empresa" name="name" icon={Building2} placeholder="Nombre Comercial" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <InputField label="Dirección" name="address" icon={MapPin} placeholder="Calle, número..." />
          </div>
          <InputField label="C.P." name="zip_code" icon={Globe} placeholder="00000" half />
          <InputField label="Ciudad" name="city" icon={MapPin} placeholder="Ciudad" half />
          <InputField label="Provincia" name="province" icon={MapPin} placeholder="Provincia" half />
          <InputField label="IVA General (%)" name="iva_comp" icon={Percent} placeholder="21" half />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <InputField label="Teléfono" name="number" icon={Phone} placeholder="600 000 000" />
          <InputField label="Email de Contacto" name="email" icon={Mail} type="email" placeholder="email@empresa.com" />
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 ${
              status === 'success' ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
            } ${status === 'error' ? 'bg-red-500' : ''}`}
          >
            {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : 
             status === 'success' ? <CheckCircle2 size={20} /> : <Send size={20} />}
            <span className="text-lg">
              {status === 'loading' ? 'Sincronizando...' : 
               status === 'success' ? '¡Actualizado!' : 'Guardar Cambios'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnterpriseForm;