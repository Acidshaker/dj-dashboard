# Etapa 1: Build con Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Copia archivos base
COPY package.json ./
COPY tsconfig.* ./
COPY vite.config.* ./
COPY .env.production .env.production

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Compila la app
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine AS production-stage

# Copia archivos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]