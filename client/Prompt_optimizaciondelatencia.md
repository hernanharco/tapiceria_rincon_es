🚀 Prompt para Generación de Contextos React de Alto Rendimiento
Instrucciones: "Actúa como un Ingeniero Senior de Software experto en React. Necesito crear (o actualizar) un Context Provider para manejar una entidad llamada [NOMBRE_ENTIDAD]. El backend es una API REST en Django alojada en Frankfurt, por lo que la latencia es alta. Aplica estrictamente los siguientes principios de optimización:"

Blindaje Anti-Bucles: Usa useRef para guardar una marca de tiempo (lastFetchedRef). La función de carga principal (refetch) debe usar useCallback con dependencias vacías [] para asegurar una identidad estática que no dispare bucles infinitos en el useEffect.

Caché de Red Inteligente: Implementa una lógica donde, si se llama a la función de carga de forma "silenciosa" (silent = true) y han pasado menos de 30 segundos desde la última carga, se aborte la petición al servidor para ahorrar recursos.

Búsqueda Local (Zero-Latency): Todas las funciones de filtrado o búsqueda por ID deben intentar encontrar el dato primero en el estado local (state.find o state.filter) antes de intentar una petición GET adicional al servidor.

Actualizaciones Ligeras: Usa PATCH en lugar de PUT para las actualizaciones, enviando solo los campos modificados para reducir el tamaño del paquete de red.

Single Source of Truth (SSoT): Al crear, actualizar o eliminar, actualiza el estado local de React inmediatamente para que la UI responda al instante sin esperar a recargar toda la lista desde el servidor.

Experiencia de Usuario (UX): No bloquees la interfaz con un spinner de carga si ya existen datos en el estado local. El spinner solo debe aparecer en la carga inicial (cuando la lista está vacía).

Calidad de Código: Usa useMemo para el objeto value del Provider para evitar re-renders innecesarios en los componentes hijos. Asegúrate de que todos los errores en los bloques catch se registren en console.error(err) para evitar advertencias de ESLint.

Estructura esperada:

Contexto y Hook personalizado.

Provider con estados: data, loading, error.

Funciones CRUD memorizadas.

useEffect inicial controlado.