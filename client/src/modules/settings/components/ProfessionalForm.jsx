import React, { useState, useRef } from "react";
import { 
  User, Mail, Briefcase, Send, CheckCircle2, Loader2, 
  Building2, MapPin, Hash, Globe, Phone, Image as ImageIcon, Percent 
} from "lucide-react";

const EnterpriseForm = () => {
  const [status, setStatus] = useState('idle');
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    cif: "",
    nombre: "",
    direccion: "",
    cp: "",
    ciudad: "",
    provincia: "",
    movil: "",
    correo: "",
    iva: "21",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    // Simulación de guardado profesional
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  // Helper para renderizar campos con icono de forma limpia
  const InputField = ({ label, name, icon: Icon, placeholder, type = "text", half = false }) => (
    <div className={`space-y-1.5 ${half ? 'col-span-1' : 'col-span-full'}`}>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
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

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      
      {/* Header con diseño profesional */}
      <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold">Configuración de Empresa</h2>
          <p className="text-slate-400 text-sm mt-1">Define los datos de facturación y contacto de tu negocio.</p>
        </div>
        
        {/* Selector de Logo Circular */}
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
          <div className="w-24 h-24 rounded-full border-4 border-slate-800 bg-slate-800 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="text-slate-500" size={32} />
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-2 border-slate-900">
            <PlusIcon size={12} className="text-white" />
          </div>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleLogoChange} accept="image/*" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
        
        {/* Sección: Identificación Fiscal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="CIF / NIF" name="cif" icon={Hash} placeholder="B12345678" half />
          <div className="md:col-span-2">
            <InputField label="Nombre Comercial" name="nombre" icon={Building2} placeholder="Tapicería El Rincón" />
          </div>
        </div>

        {/* Sección: Ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <InputField label="Dirección Fiscal" name="direccion" icon={MapPin} placeholder="Calle Principal 123" />
          </div>
          <InputField label="Cód. Postal" name="cp" icon={Globe} placeholder="28001" half />
          <InputField label="Ciudad" name="ciudad" icon={MapPin} placeholder="Madrid" half />
          <InputField label="Provincia" name="provincia" icon={MapPin} placeholder="Madrid" half />
          <InputField label="IVA Aplicable (%)" name="iva" icon={Percent} type="number" placeholder="21" half />
        </div>

        {/* Sección: Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <InputField label="Teléfono Móvil" name="movil" icon={Phone} placeholder="+34 600 000 000" />
          <InputField label="Correo Electrónico" name="correo" icon={Mail} type="email" placeholder="contacto@empresa.com" />
        </div>

        {/* Botón de Acción */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 ${
              status === 'success' ? 'bg-green-500 shadow-green-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
            }`}
          >
            {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : status === 'success' ? <CheckCircle2 size={20} /> : <Send size={20} />}
            <span className="text-lg">{status === 'loading' ? 'Guardando...' : status === 'success' ? '¡Actualizado!' : 'Guardar Empresa'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// Pequeño componente interno para el icono de suma
const PlusIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default EnterpriseForm;