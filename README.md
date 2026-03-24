# Sistema de Gestión de Restaurante
Sistema integral para la gestión operativa y de inventario de restaurantes. Este repositorio está estructurado como un Monorepo, alojando tanto el backend como el frontend, compartiendo configuraciones y estándares de desarrollo.

# Estructura del Repositorio
```bash
├── sistema-restaurante-backend/  # Backend en NestJS (API REST)
├── sistema-restaurante-frontend/  # Frontend en React + Vite
├── docs/                   # Documentación técnica, visión y arquitectura
│   ├── ARCHITECTURE.md  # Arquitectura del sistema
│   ├── VISION.md  # Problemática y objetivos del sistema
└── README.md               # Este archivo
```

# Documentación Técnica
Toda la documentación sobre decisiones de diseño, reglas de negocio y flujos del sistema se encuentra en la carpeta `/docs`. Revisa los documentos a continuación:
- [Visión y alcance del proyecto](./docs/VISION.md)
- [Arquitectura del sistema](./docs/ARCHITECTURE.md)

# Requisitos Previos
Asegúrate de tener instalado en tu entorno local:
- Node.js (v18 o superior)
- Gestor de paquetes: `npm`
- PostgreSQL (instalado localmente y corriendo)

# Levantar entorno de desarrollo
## 1. Clonar el repositorio
Asegurate de estar en la carpeta [/sistema-restaurante-backend](./sistema-restaurante-backend/)
## 2. Instalar dependencias
```bash
 npm install
```
## 3. Configurar variables de entorno
Duplica el archivo `.env.template` y renombralo a `.env` y ajusta según tu información de tu base de datos local.
## 4. Levantar el servidor
Inicia NestJS en modo "watch" para desarrollo.
```bash
npm run start:dev
```
La API correrá por defecto en `http://localhost:3000`.
   
