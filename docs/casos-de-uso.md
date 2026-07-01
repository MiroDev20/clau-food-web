# 👥 Casos de Uso del Sistema

Este documento describe las interacciones entre los actores y el sistema.

Cada caso de uso representa un objetivo que un actor desea alcanzar mediante el
uso de la aplicación.

---

## 📋 Actores

### Cliente

Persona que consulta el menú y realiza pedidos.

### Chef

Persona encargada de preparar los pedidos.

### Administrador

Persona responsable de administrar el negocio y el contenido del sistema.

---

## 🍔 Casos de Uso del Cliente

---

## CU-001 — Consultar Menú

### Objetivo

Permitir al cliente visualizar los productos disponibles.

### Flujo principal

1. El cliente ingresa al sitio web.
2. El sistema muestra las categorías del menú.
3. El cliente selecciona una categoría.
4. El sistema muestra los productos correspondientes.

### Resultado esperado

El cliente conoce los productos disponibles.

---

## CU-002 — Consultar Información del Negocio

### Objetivo

Permitir al cliente conocer la información básica del negocio.

### Flujo principal

1. El cliente accede a la página principal.
2. El sistema muestra:

* Horarios.
* Ubicación.
* Métodos de pago.
* Información de contacto.

### Resultado esperado

El cliente obtiene la información necesaria para realizar un pedido.

---

## CU-003 — Crear un Pedido

### Objetivo

Permitir al cliente seleccionar productos antes de enviarlos por WhatsApp.

### Flujo principal

1. El cliente selecciona uno o varios productos.
2. Agrega las cantidades deseadas.
3. Puede incluir observaciones.
4. El sistema calcula el total.
5. El sistema genera el resumen del pedido.

### Resultado esperado

El pedido queda listo para ser enviado.

---

## CU-004 — Enviar Pedido

### Objetivo

Enviar el pedido al negocio utilizando WhatsApp.

### Flujo principal

1. El cliente revisa el resumen.
2. Presiona el botón **Enviar pedido**.
3. El sistema genera automáticamente el mensaje.
4. Se abre WhatsApp con el pedido preparado para su envío.

### Resultado esperado

El pedido es recibido por el negocio.

---

## 👨‍🍳 Casos de Uso del Chef

---

## CU-005 — Consultar Pedidos *(Versión futura)*

### Objetivo

Visualizar los pedidos pendientes de preparación.

### Flujo principal

1. El chef accede al sistema.
2. Consulta la lista de pedidos.
3. Selecciona uno para comenzar la preparación.

### Resultado esperado

El chef conoce el siguiente pedido que debe preparar.

---

## CU-006 — Actualizar Estado del Pedido *(Versión futura)*

### Objetivo

Informar el avance de un pedido.

### Estados disponibles

* Pendiente
* Confirmado
* En preparación
* Listo
* Entregado
* Cancelado

### Resultado esperado

El sistema mantiene actualizado el estado del pedido.

---

# 👨‍💼 Casos de Uso del Administrador

---

## CU-007 — Administrar Productos *(Versión futura)*

### Objetivo

Gestionar el menú del negocio.

### Acciones disponibles

* Crear productos.
* Editar productos.
* Eliminar productos.
* Cambiar precios.
* Cambiar disponibilidad.

### Resultado esperado

El menú permanece actualizado.

---

## CU-008 — Administrar Promociones *(Versión futura)*

### Objetivo

Gestionar los combos y promociones.

### Acciones disponibles

* Crear promociones.
* Modificarlas.
* Eliminarlas.
* Programar fechas de vigencia.

---

## CU-009 — Consultar Reportes *(Versión futura)*

### Objetivo

Obtener información sobre el desempeño del negocio.

### Reportes disponibles

* Ventas.
* Productos más vendidos.
* Ingresos.
* Pedidos realizados.

---

## CU-010 — Administrar Inventario *(Versión futura)*

### Objetivo

Mantener actualizado el inventario.

### Acciones disponibles

* Registrar entradas.
* Registrar salidas.
* Consultar existencias.
* Recibir alertas de bajo stock.

---

## 🔗 Relaciones entre Casos de Uso

Algunos casos de uso dependen de otros.

Por ejemplo:

* **Crear un Pedido** requiere previamente **Consultar Menú**.
* **Enviar Pedido** requiere previamente **Crear un Pedido**.
* **Consultar Reportes** depende de que existan pedidos registrados.

---

## 📌 Observaciones

Durante la primera versión (MVP), únicamente estarán disponibles los siguientes
casos de uso:

* CU-001 — Consultar Menú.
* CU-002 — Consultar Información del Negocio.
* CU-003 — Crear un Pedido.
* CU-004 — Enviar Pedido.

Los demás casos de uso se implementarán en versiones posteriores, conforme
evolucione el proyecto.
