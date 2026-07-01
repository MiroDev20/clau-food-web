# 🏗️ Arquitectura del Sistema

Este documento describe la arquitectura propuesta para el sistema, los componentes que lo conforman y la forma en que interactúan entre sí.

El objetivo es construir una aplicación organizada, mantenible y preparada para evolucionar conforme crezcan las necesidades del negocio.

---

# 🎯 Objetivo de la Arquitectura

Diseñar una arquitectura modular que permita separar las responsabilidades del sistema, facilitando su desarrollo, mantenimiento y escalabilidad.

La solución debe ser capaz de comenzar como un sitio web para la gestión de pedidos mediante WhatsApp y evolucionar posteriormente hacia un sistema completo de administración del negocio.

---

# 🧩 Tipo de Arquitectura

Se utilizará una arquitectura **Cliente–Servidor** organizada en tres capas principales.

```text
                Cliente
                   │
                   ▼
        ┌─────────────────────┐
        │      Frontend       │
        │ Interfaz de usuario │
        └─────────────────────┘
                   │
              HTTP / HTTPS
                   │
                   ▼
        ┌─────────────────────┐
        │       Backend       │
        │  Lógica del negocio │
        └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │      PostgreSQL     │
        │     Base de datos   │
        └─────────────────────┘
```

Cada capa tendrá responsabilidades claramente definidas y evitará depender directamente de las demás.

---

# 📦 Componentes del Sistema

## Frontend

Responsable de la interacción con el usuario.

### Responsabilidades

* Mostrar el menú.
* Mostrar promociones.
* Mostrar información del negocio.
* Gestionar el carrito de compras.
* Validar datos básicos.
* Consumir la API del backend.
* Mostrar mensajes y estados.

El frontend **no contendrá lógica de negocio**.

---

## Backend

Responsable de toda la lógica del sistema.

### Responsabilidades

* Validar solicitudes.
* Gestionar pedidos.
* Administrar productos.
* Controlar inventario.
* Generar reportes.
* Gestionar usuarios.
* Comunicarse con la base de datos.

El backend será el único componente autorizado para acceder directamente a PostgreSQL.

---

## Base de Datos

Responsable del almacenamiento permanente de la información.

Almacenará entidades como:

* Productos
* Categorías
* Pedidos
* Clientes
* Usuarios
* Promociones
* Inventario

Toda modificación deberá realizarse exclusivamente desde el backend.

---

# 🔄 Flujo General del Sistema

Cuando un cliente interactúa con el sistema ocurrirá el siguiente flujo:

1. El usuario realiza una acción desde la interfaz.
2. El frontend valida la información básica.
3. Se envía una solicitud al backend.
4. El backend valida la solicitud.
5. Si es necesario, consulta la base de datos.
6. PostgreSQL devuelve la información.
7. El backend procesa la respuesta.
8. Se devuelve un resultado al frontend.
9. El frontend actualiza la interfaz.

---

# 🗂️ Organización por Módulos

El sistema estará dividido por dominios de negocio.

## Menú

Gestiona:

* Productos.
* Categorías.
* Promociones.

---

## Pedidos

Gestiona:

* Carrito.
* Pedidos.
* Estados.
* Historial.

---

## Administración

Gestiona:

* Usuarios.
* Roles.
* Configuración.

---

## Inventario *(Versión futura)*

Gestiona:

* Ingredientes.
* Existencias.
* Alertas.

---

## Reportes *(Versión futura)*

Gestiona:

* Ventas.
* Estadísticas.
* Productos más vendidos.

---

# 🧱 Organización del Backend

Se utilizará una arquitectura por capas.

```text
 Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
PostgreSQL
```

## Routes

Definen los endpoints de la API.

---

## Controllers

Reciben las solicitudes HTTP y coordinan la ejecución de los servicios.

---

## Services

Implementan la lógica del negocio.

Aquí se toman las decisiones importantes del sistema.

---

## Repositories

Se encargan exclusivamente del acceso a la base de datos.

Ninguna otra capa podrá ejecutar consultas SQL directamente.

---

# 🖥️ Organización del Frontend

El frontend estará organizado por responsabilidades.

```text
pages/
components/
layouts/
services/
hooks/
assets/
styles/
utils/
```

Cada carpeta tendrá una única responsabilidad.

---

# 🔒 Seguridad

La arquitectura deberá garantizar:

* Validación de datos de entrada.
* Protección de rutas administrativas.
* Manejo centralizado de errores.
* Uso de variables de entorno.
* Comunicación mediante HTTPS.
* Principio de mínimo privilegio.

---

# 📈 Escalabilidad

La arquitectura permitirá incorporar nuevas funcionalidades sin modificar significativamente las existentes.

Entre ellas:

* Autenticación.
* Pagos en línea.
* Sistema de domicilios.
* Inventario.
* Reportes.
* Estadísticas.
* Programa de fidelización.

---

# 🧠 Principios de Diseño

Durante el desarrollo se buscará seguir los siguientes principios:

* Separación de responsabilidades.
* Bajo acoplamiento.
* Alta cohesión.
* Modularidad.
* Reutilización de código.
* Código limpio.
* Convenciones consistentes.
* Desarrollo incremental.

---

# ⚙️ Decisiones Técnicas

| Decisión                      | Justificación                                                    |
| ----------------------------- | ---------------------------------------------------------------- |
| PostgreSQL                    | Base de datos relacional robusta y escalable.                    |
| Node.js                       | Excelente manejo de operaciones asíncronas y gran ecosistema.    |
| Arquitectura Cliente–Servidor | Facilita la separación entre interfaz y lógica del negocio.      |
| Mobile First                  | La mayoría de los clientes accederán desde dispositivos móviles. |
| Cloudinary                    | Centraliza el almacenamiento y optimización de imágenes.         |

---

# 🔮 Evolución de la Arquitectura

La arquitectura ha sido diseñada para crecer de forma incremental.

La primera versión implementará únicamente los módulos necesarios para el MVP.

Las siguientes versiones incorporarán nuevos módulos sin afectar el funcionamiento de los existentes, permitiendo que el sistema evolucione conforme crezcan las necesidades del negocio.
