# TechHelpDesk API - Sistema de Soporte Técnico

**Desarrollador:** Kaled Mesa  
**Clan:** Linus

## 📋 Descripción

TechHelpDesk es una API REST completa para la gestión de tickets de soporte técnico, desarrollada con NestJS, TypeORM, PostgreSQL y JWT. El sistema permite administrar el ciclo completo de vida de tickets con diferentes roles de usuario (Administrador, Técnico, Cliente).

## 🚀 Características Principales

- ✅ Autenticación JWT con roles (Admin, Técnico, Cliente)
- ✅ CRUD completo de usuarios, categorías, clientes y técnicos
- ✅ Gestión de tickets con validaciones de negocio
- ✅ Control de estados secuencial (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
- ✅ Límite de 5 tickets en progreso por técnico
- ✅ Documentación completa con Swagger
- ✅ Pruebas unitarias con Jest
- ✅ Dockerizado para fácil despliegue

## 📦 Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Docker y Docker Compose (opcional)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd nest-assessment
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Environment Configuration
NODE_ENV=development
PORT=3000

# Database Configuration (Supabase PostgreSQL)
DB_HOST=aws-0-us-west-2.pooler.supabase.com
DB_PORT=6543
DB_USERNAME=postgres.eqrueaufobcabmnyodfu
DB_PASSWORD=v7jZMZGh6pV6wMhJ
DB_DATABASE=postgres
DB_SCHEMA=public

# JWT Configuration
JWT_SECRET=techhelpdesk_secret_key_2024_kaled_mesa_linus_clan_super_secure
JWT_EXPIRATION=24h
```

### 4. Poblar la base de datos con datos iniciales

```bash
npm run seed
```

Este comando creará:
- 3 usuarios (Admin, Técnico, Cliente)
- 3 categorías de incidencias
- 5 clientes de ejemplo
- 3 técnicos
- 10 tickets de ejemplo

**Credenciales de acceso:**
- **Admin:** admin@techhelpdesk.com / admin123
- **Técnico:** tech@techhelpdesk.com / admin123
- **Cliente:** client@techhelpdesk.com / admin123

## 🏃 Ejecución

### Modo desarrollo

```bash
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000`

### Modo producción

```bash
npm run build
npm run start:prod
```

## 📚 Documentación Swagger

Una vez iniciada la aplicación, accede a la documentación interactiva de Swagger:

**URL:** `http://localhost:3000/api`

### Cómo usar Swagger:

1. **Registrar un usuario** (opcional):
   - POST `/auth/register`
   - Body: `{ "name": "Tu Nombre", "email": "tu@email.com", "password": "password123", "role": "client" }`

2. **Iniciar sesión**:
   - POST `/auth/login`
   - Body: `{ "email": "admin@techhelpdesk.com", "password": "admin123" }`
   - Copiar el `access_token` de la respuesta

3. **Autorizar en Swagger**:
   - Hacer clic en el botón "Authorize" (candado verde)
   - Pegar el token en el campo "Value"
   - Hacer clic en "Authorize"

4. **Probar endpoints**:
   - Ahora puedes probar todos los endpoints protegidos

## 🔑 Endpoints Principales

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión

### Usuarios (Solo Admin)
- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario
- `POST /users` - Crear usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Categorías (Solo Admin)
- `GET /categories` - Listar categorías
- `GET /categories/:id` - Obtener categoría
- `POST /categories` - Crear categoría
- `PATCH /categories/:id` - Actualizar categoría
- `DELETE /categories/:id` - Eliminar categoría

### Clientes (Solo Admin)
- `GET /clients` - Listar clientes
- `GET /clients/:id` - Obtener cliente
- `POST /clients` - Crear cliente
- `PATCH /clients/:id` - Actualizar cliente
- `DELETE /clients/:id` - Eliminar cliente

### Técnicos (Solo Admin)
- `GET /technicians` - Listar técnicos
- `GET /technicians/:id` - Obtener técnico
- `POST /technicians` - Crear técnico
- `PATCH /technicians/:id` - Actualizar técnico
- `DELETE /technicians/:id` - Eliminar técnico

### Tickets
- `POST /tickets` - Crear ticket (Cliente, Admin)
- `GET /tickets` - Listar todos los tickets (Admin)
- `GET /tickets/:id` - Obtener ticket por ID (Todos los roles)
- `GET /tickets/client/:id` - Tickets por cliente (Cliente, Admin)
- `GET /tickets/technician/:id` - Tickets por técnico (Técnico, Admin)
- `PATCH /tickets/:id/status` - Actualizar estado (Técnico, Admin)
- `DELETE /tickets/:id` - Eliminar ticket (Admin)

## 🧪 Pruebas

### Ejecutar pruebas unitarias

```bash
npm run test
```

### Ejecutar pruebas con cobertura

```bash
npm run test:cov
```

La cobertura debe ser mínimo del 40%.

## 🐳 Docker

### Construir la imagen

```bash
docker build -t techhelpdesk-api .
```

### Ejecutar con Docker Compose

```bash
docker-compose up
```

La API estará disponible en `http://localhost:3000`

### Detener los contenedores

```bash
docker-compose down
```

## 📊 Estructura del Proyecto

```
src/
├── auth/                    # Módulo de autenticación
│   ├── decorators/         # Decoradores personalizados (@Roles, @CurrentUser)
│   ├── dto/                # DTOs de autenticación
│   ├── guards/             # Guards (JWT, Roles)
│   └── strategies/         # Estrategia JWT
├── users/                  # Módulo de usuarios
├── categories/             # Módulo de categorías
├── clients/                # Módulo de clientes
├── technicians/            # Módulo de técnicos
├── tickets/                # Módulo de tickets
├── common/                 # Recursos compartidos
│   ├── interceptors/       # TransformInterceptor
│   └── filters/            # ExceptionFilter
├── database/               # Configuración de base de datos
│   └── seeders/            # Scripts de seeders
├── app.module.ts           # Módulo raíz
└── main.ts                 # Punto de entrada
```

## 🔒 Validaciones Implementadas

### Tickets
- ✅ No se puede crear un ticket sin categoría válida
- ✅ No se puede crear un ticket sin cliente válido
- ✅ Un técnico no puede tener más de 5 tickets "en progreso"
- ✅ El estado solo puede cambiar siguiendo la secuencia: OPEN → IN_PROGRESS → RESOLVED → CLOSED
- ✅ No se puede retroceder en los estados
- ✅ Un ticket cerrado no puede cambiar de estado

### Usuarios
- ✅ Email único
- ✅ Contraseña hasheada con bcrypt
- ✅ Validación de roles

## 🎯 Principios SOLID Aplicados

- **Single Responsibility:** Cada servicio maneja una única entidad
- **Open/Closed:** Guards y decoradores extensibles
- **Liskov Substitution:** DTOs intercambiables
- **Interface Segregation:** Interfaces específicas
- **Dependency Inversion:** Inyección de dependencias

## 📝 Notas Técnicas

- La base de datos está alojada en Supabase (PostgreSQL)
- TypeORM está configurado con `synchronize: true` solo para desarrollo
- Las contraseñas se hashean con bcrypt (10 rounds)
- Los tokens JWT expiran en 24 horas
- Todas las respuestas siguen el formato: `{ success: boolean, data: any, message: string }`

## 🤝 Soporte

Para más información, consulta el archivo `JUSTIFICACION.md` que contiene una explicación detallada del flujo del sistema, requisitos técnicos y criterios de aceptación.

## 📄 Licencia

MIT

---

**Desarrollado por Kaled Mesa - Clan Linus**
