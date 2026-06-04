// src/components/company/Company.jsx
import useCompany from '../../hooks/company/useCompany';

export const Company = () => {
  const { empresas } = useCompany();

  // Validación segura: si no hay datos, no muestra nada
  if (!empresas) return null;

  const empresa = empresas[0];

  return (
    <div className="space-y-1">
      <p className="text-sm font-semibold text-gray-700">{empresa.name}</p>
      <p className="text-sm text-gray-700">{empresa.address}</p>
      <p className="text-sm text-gray-700">
        {empresa.zip_code} {empresa.city}
      </p>
      <p className="text-sm text-gray-700">TFNO. {empresa.number}</p>
      <p className="text-sm text-gray-700">N.I.E: {empresa.cif}</p>
      <p className="text-sm text-gray-700">e-mail: {empresa.email}</p>
    </div>
  );
};
