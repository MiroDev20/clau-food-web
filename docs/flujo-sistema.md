# 🔄 Flujo del Sistema

Este documento describe cómo interactúan los distintos actores con el sistema
y cómo fluye la información desde que un cliente realiza un pedido hasta que
este es entregado.

---

## 🎯 Objetivo

Definir el comportamiento general del sistema antes de diseñar la base de datos,
la arquitectura y la implementación.

---

## 👥 Actores

- Cliente
- Chef
- Jefe (Administrador)

---

## 🍔 Flujo Principal: Realizar un Pedido

1. El cliente ingresa al sitio web.
2. Consulta el menú disponible.
3. Selecciona uno o varios productos.
4. Personaliza el pedido (ingredientes, observaciones, etc.).
5. Confirma el pedido.
6. El sistema genera un resumen del pedido.
7. El cliente envía el pedido mediante WhatsApp.
8. El jefe recibe el pedido.
9. El jefe confirma que el pedido fue recibido.
10. El pedido pasa al chef para su preparación.
11. El chef prepara el pedido.
12. El pedido se marca como listo.
13. El pedido se entrega al cliente.

---

## 📋 Flujo de Administración del Menú

1. El jefe inicia sesión.
2. Accede al panel administrativo.
3. Consulta la lista de productos.
4. Puede:

   - Crear un producto.
   - Editar un producto.
   - Eliminar un producto.
   - Cambiar precios.
   - Cambiar disponibilidad.
   - Actualizar imágenes.

5. Los cambios quedan disponibles inmediatamente para los clientes.

---

## 📦 Flujo de Publicación de Combos

1. El jefe crea un nuevo combo.
2. Define:

   - Nombre.
   - Productos incluidos.
   - Precio.
   - Imagen.
   - Fecha de vigencia.

3. El sistema publica automáticamente el combo en la página principal.

---

## 📈 Flujo de Reportes

1. El administrador solicita un reporte.
2. El sistema consulta los pedidos almacenados.
3. Calcula:

   - Ventas del día.
   - Productos más vendidos.
   - Horas de mayor demanda.
   - Total de ingresos.

4. Se genera un reporte visual.

---

## 📦 Flujo de Inventario

1. El administrador registra entradas de inventario.
2. Cada venta descuenta automáticamente las cantidades correspondientes.
3. El sistema detecta productos con poco stock.
4. Se generan alertas cuando un ingrediente está próximo a agotarse.

---

## 🔄 Estados de un Pedido

Durante su ciclo de vida un pedido puede encontrarse en alguno de los siguientes
estados:

1. Pendiente
2. Confirmado
3. En preparación
4. Listo
5. Entregado
6. Cancelado

---

## ⚠️ Posibles Excepciones

### Producto agotado

El sistema debe informar que el producto no está disponible antes de que el
cliente confirme el pedido.

---

### Horario fuera de servicio

El sistema debe impedir nuevos pedidos fuera del horario de atención.

---

### Pedido cancelado

El administrador puede cancelar un pedido indicando el motivo.

---

### Error de comunicación

Si ocurre un error al generar o enviar el pedido, el sistema debe informar al
usuario y permitir reintentar la operación.

---

## 📌 Observaciones

Durante las primeras versiones del proyecto el flujo finalizará cuando el
cliente envíe el pedido mediante WhatsApp.

Las versiones futuras incorporarán un sistema de pedidos completamente
integrado, autenticación de usuarios, inventario y reportes.
