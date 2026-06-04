/**
 * JERARQUÍA DE ROLES - CONTROL DE ACCESO BASADO EN ROLES (RBAC)
 * Definimos el peso de cada rol. A mayor valor numérico, mayor nivel de autoridad.
 */
export const ROLE_HIERARCHY = {  
  SuperAdmin: 100, // Control absoluto
  Owner: 80,      // Dueño del negocio: finanzas y gestión total
  Admin: 60,      // Gestión de personal y reportes
  Editor: 40,     // Gestión de contenidos y proyectos de tapicería
  Viewer: 20,     // Solo lectura
};

/**
 * FUNCIÓN: hasPermission
 * Determina si un usuario tiene el nivel suficiente para realizar una acción.
 * * @param {string} userRole - El rol actual del usuario (de la cookie o context)
 * @param {string} minRequiredRole - El rol mínimo necesario
 * @returns {boolean}
 */
export const hasPermission = (userRole, minRequiredRole) => {
  // 1. Si no hay rol o el rol mínimo no existe en nuestra tabla, denegamos
  if (!userRole || !ROLE_HIERARCHY[minRequiredRole]) {
    return false;
  }

  // 2. Obtenemos el "peso" numérico
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[minRequiredRole];

  // 3. Lógica de umbral
  return userLevel >= requiredLevel;
};