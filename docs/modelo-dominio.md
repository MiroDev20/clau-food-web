# 🧩 Modelo del Dominio

Este documento describe las entidades principales del negocio, sus responsabilidades y las relaciones que existen entre ellas.

Su propósito es representar el funcionamiento del negocio desde una perspectiva conceptual, antes de diseñar la base de datos o implementar el sistema.

---

# 🎯 Objetivo

Identificar todos los elementos que participan en el funcionamiento del negocio y comprender cómo se relacionan entre sí.

---

# 📦 Entidades del Dominio

## Producto

Representa un alimento o bebida que el negocio ofrece a sus clientes.

### Atributos

* id
* nombre
* descripción
* precio
* imagen
* disponible
* categoría

### Responsabilidades

* Mostrar información al cliente.
* Formar parte de un pedido.
* Pertenecer a una categoría.
* Participar en promociones.

---

## Categoría

Agrupa productos con características similares.

### Ejemplos

* Hamburguesas
* Perros Calientes
* Salchipapas
* Bebidas
* Adicionales

### Atributos

* id
* nombre
* descripción

---

## Pedido

Representa una solicitud realizada por un cliente.

### Atributos

* id
* fecha
* estado
* dirección
* observaciones
* subtotal
* costo de domicilio
* total

### Responsabilidades

* Agrupar productos.
* Registrar el estado del pedido.
* Servir como base para reportes.

---

## DetallePedido

Representa cada producto incluido dentro de un pedido.

### Atributos

* cantidad
* precio_unitario
* observaciones

### Responsabilidades

* Relacionar pedidos con productos.
* Conservar el precio del producto al momento de la compra.
* Registrar personalizaciones.

---

## Cliente

Representa a la persona que realiza un pedido.

### Atributos

* id
* nombre
* teléfono
* dirección

### Responsabilidades

* Realizar pedidos.
* Consultar el menú.
* Recibir domicilios.

---

## Usuario

Representa una persona con acceso administrativo al sistema.

### Roles

* Administrador
* Chef

### Atributos

* id
* nombre
* correo
* contraseña
* rol

### Responsabilidades

* Administrar el sistema.
* Gestionar pedidos.
* Administrar productos.

---

## Promoción

Representa un descuento o combo temporal.

### Atributos

* id
* nombre
* descripción
* precio
* fecha_inicio
* fecha_fin
* activa

### Responsabilidades

* Mostrar ofertas.
* Agrupar productos.

---

## Inventario *(Versión futura)*

Representa los ingredientes y productos disponibles.

### Atributos

* id
* nombre
* cantidad
* unidad_medida
* stock_mínimo

### Responsabilidades

* Controlar existencias.
* Generar alertas.
* Registrar movimientos.

---

# 🔗 Relaciones

## Categoría

Una categoría puede contener muchos productos.

```text
Categoría
     │
     └──────► Producto
```

---

## Pedido

Un pedido contiene varios productos.

```text
Pedido
     │
     └──────► DetallePedido
                     │
                     └──────► Producto
```

---

## Cliente

Un cliente puede realizar muchos pedidos.

```text
Cliente
     │
     └──────► Pedido
```

---

## Usuario

Un usuario administra muchos pedidos y productos.

```text
Usuario
      │
      ├────► Producto
      └────► Pedido
```

---

## Promoción

Una promoción puede incluir varios productos.

```text
Promoción
      │
      └────► Producto
```

---

# 🔄 Ciclo de Vida del Pedido

Todo pedido pasa por los siguientes estados.

```text
 Pendiente
     │
     ▼
 Confirmado
     │
     ▼
En preparación
     │
     ▼
   Listo
     │
     ▼
 Entregado
```

En cualquier momento un pedido podrá pasar al estado:

```text
Cancelado
```

---

# 📌 Reglas de Negocio

## Productos

* Todo producto debe pertenecer a una categoría.
* Un producto puede estar disponible o no.

---

## Pedidos

* Todo pedido debe contener al menos un producto.
* El total se calcula automáticamente.
* El estado inicial será **Pendiente**.

---

## Clientes

* Un cliente puede realizar múltiples pedidos.
* El número telefónico será el principal medio de contacto.

---

## Promociones

* Solo podrán mostrarse cuando estén activas.
* Tendrán una fecha de inicio y una fecha de finalización.

---

# 🔮 Evolución del Dominio

En futuras versiones podrán incorporarse nuevas entidades, como:

* Método de Pago
* Domiciliario
* Cupón
* Notificación
* Historial de Cambios
* Movimiento de Inventario
* Proveedor
* Ingrediente
* Receta

La arquitectura del dominio deberá permitir incorporar estas entidades sin modificar significativamente las existentes.
