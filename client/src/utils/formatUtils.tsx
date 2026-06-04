export const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

// Formatea la fecha como PREyyMMDD
export const formatDateFor = (prefix, dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) throw new Error("Fecha inválida");

  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 06
  const day = String(date.getDate()).padStart(2, "0");

  return `${prefix}${year}${month}${day}`;
};

export const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);
  
  // Validar que es una fecha válida
  if (isNaN(d.getTime())) return "Fecha inválida";

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};
