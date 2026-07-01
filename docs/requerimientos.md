# 📋 Requerimientos del Sistema

Este documento define las funcionalidades y características que deberá cumplir
el sistema para satisfacer las necesidades del negocio.

Los requerimientos se dividen en dos categorías:

* **Requerimientos funcionales:** describen las acciones que el sistema
debe realizar.
* **Requerimientos no funcionales:** describen las cualidades y restricciones
del sistema.

---

## 🎯 Objetivo

Definir de forma clara y organizada el comportamiento esperado del sistema para
servir como guía durante el diseño, desarrollo y pruebas.

---

## 👥 Actores del Sistema

### Cliente

Persona que consulta el menú y realiza pedidos.

### Chef

Persona encargada de preparar los pedidos recibidos.

### Administrador (Jefe)

Persona responsable de administrar el negocio mediante el sistema.

### Desarrollador

Responsable del mantenimiento y evolución del software.

---

## ⚙️ Requerimientos Funcionales

### RF-001 — Consultar el menú

El sistema debe permitir al cliente visualizar el menú completo con:

* Nombre del producto.
* Imagen.
* Descripción.
* Precio.
* Categoría.

---

### RF-002 — Consultar información del negocio

El sistema debe mostrar:

* Horarios de atención.
* Ubicación.
* Métodos de pago.
* Información de contacto.

---

### RF-003 — Consultar promociones

El sistema debe mostrar los combos y promociones vigentes.

---

### RF-004 — Personalizar productos

El cliente podrá agregar observaciones al pedido, por ejemplo:

* Sin cebolla.
* Poco picante.
* Extra queso.

---

### RF-005 — Generar pedido

El sistema deberá generar un resumen con:

* Productos seleccionados.
* Cantidades.
* Observaciones.
* Total del pedido.

---

### RF-006 — Enviar pedido mediante WhatsApp

El sistema deberá generar automáticamente un mensaje estructurado para ser
enviado por WhatsApp.

---

### RF-007 — Administrar el menú *(Versión futura)*

El administrador podrá:

* Crear productos.
* Editar productos.
* Eliminar productos.
* Cambiar precios.
* Actualizar imágenes.
* Cambiar disponibilidad.

---

### RF-008 — Gestionar pedidos *(Versión futura)*

El sistema permitirá:

* Consultar pedidos.
* Cambiar su estado.
* Priorizar pedidos.
* Cancelarlos cuando sea necesario.

---

### RF-009 — Gestionar inventario *(Versión futura)*

El sistema permitirá registrar y controlar la disponibilidad de ingredientes y
productos.

---

### RF-010 — Generar reportes *(Versión futura)*

El sistema permitirá generar reportes relacionados con:

* Ventas.
* Productos más vendidos.
* Ingresos.
* Historial de pedidos.

---

## 🛡️ Requerimientos No Funcionales

### RNF-001 — Rendimiento

El sistema deberá cargar rápidamente incluso con conexiones móviles.

---

### RNF-002 — Adaptabilidad

La interfaz deberá ser completamente responsive y ofrecer una buena experiencia
en dispositivos móviles.

---

### RNF-003 — Usabilidad

La navegación deberá ser intuitiva y sencilla para cualquier usuario.

---

### RNF-004 — Seguridad

El sistema deberá validar todas las entradas del usuario y proteger el acceso a
las funciones administrativas.

---

### RNF-005 — Disponibilidad

El sistema deberá estar disponible durante el horario de atención del negocio y
mostrar un mensaje claro cuando este se encuentre cerrado.

---

### RNF-006 — Mantenibilidad

El código deberá organizarse de manera modular para facilitar futuras
modificaciones.

---

### RNF-007 — Escalabilidad

La arquitectura deberá permitir incorporar nuevas funcionalidades sin afectar
las existentes.

---

### RNF-008 — Accesibilidad

El sitio deberá seguir buenas prácticas de accesibilidad para facilitar su uso
por la mayor cantidad posible de usuarios.

---

## 📌 Prioridad de Implementación

### MVP

* Mostrar menú.
* Mostrar promociones.
* Mostrar horarios.
* Mostrar ubicación.
* Mostrar métodos de pago.
* Mostrar contacto.
* Generar pedido.
* Enviar pedido mediante WhatsApp.

---

### Segunda Versión

* Panel administrativo.
* Gestión del menú.
* Gestión de pedidos.
* Autenticación.

---

### Versiones Futuras

* Inventario.
* Reportes.
* Estadísticas.
* Gestión de clientes.
* Automatización de procesos.

---

## ✅ Criterios de Aceptación

El sistema será considerado funcional cuando:

* Un cliente pueda consultar el menú desde cualquier dispositivo.
* El cliente pueda generar un pedido correctamente.
* El pedido pueda enviarse mediante WhatsApp.
* La información del negocio permanezca actualizada.
* El administrador pueda ampliar el sistema en futuras versiones sin modificar
su arquitectura principal.
