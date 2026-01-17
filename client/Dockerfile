# 1. Imagen base de Node.js
FROM node:18-alpine

# 2. Instalar pnpm
RUN npm install -g pnpm

# 3. Establecer variables de entorno
ENV NODE_ENV=development

# 4. Directorio de trabajo dentro del contenedor
WORKDIR /app

# 5. Copiar package files
COPY package*.json ./

# 6. Instalar dependencias con pnpm
RUN pnpm install

# 7. Copiar el resto del código del frontend
COPY . .

# 8. Exponer el puerto
EXPOSE 5173

# 9. Servir la aplicación con el servidor de desarrollo de Vite
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]
