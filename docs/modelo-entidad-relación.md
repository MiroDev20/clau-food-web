# 🗄️ Modelo Entidad–Relación

Este documento describe el diseño lógico de la base de datos del sistema.

Su propósito es transformar el modelo del dominio en entidades, relaciones y restricciones listas para ser implementadas en PostgreSQL.

---

# 🎯 Objetivo

Diseñar una base de datos consistente, normalizada y preparada para soportar el crecimiento del sistema.

---

# 📦 Entidades

## Categoría

| Campo       | Tipo         | Restricciones    |
| ----------- | ------------ | ---------------- |
| id          | UUID         | PK               |
| nombre      | VARCHAR(100) | NOT NULL, UNIQUE |
| descripción | TEXT         | NULL             |

---

## Producto

| Campo        | Tipo          | Restricciones |
| ------------ | ------------- | ------------- |
| id           | UUID          | PK            |
| categoria_id | UUID          | FK            |
| nombre       | VARCHAR(150)  | NOT NULL      |
| descripción  | TEXT          | NULL          |
| precio       | NUMERIC(10,2) | NOT NULL      |
| imagen_url   | TEXT          | NULL          |
| disponible   | BOOLEAN       | DEFAULT TRUE  |

---

## Cliente

| Campo     | Tipo         | Restricciones |
| --------- | ------------ | ------------- |
| id        | UUID         | PK            |
| nombre    | VARCHAR(150) | NOT NULL      |
| teléfono  | VARCHAR(20)  | NOT NULL      |
| dirección | TEXT         | NULL          |

---

## Pedido

| Campo         | Tipo          | Restricciones |
| ------------- | ------------- | ------------- |
| id            | UUID          | PK            |
| cliente_id    | UUID          | FK            |
| fecha         | TIMESTAMP     | NOT NULL      |
| estado        | VARCHAR(30)   | NOT NULL      |
| observaciones | TEXT          | NULL          |
| subtotal      | NUMERIC(10,2) | NOT NULL      |
| domicilio     | NUMERIC(10,2) | DEFAULT 0     |
| total         | NUMERIC(10,2) | NOT NULL      |

---

## DetallePedido

| Campo           | Tipo          | Restricciones |
| --------------- | ------------- | ------------- |
| id              | UUID          | PK            |
| pedido_id       | UUID          | FK            |
| producto_id     | UUID          | FK            |
| cantidad        | INTEGER       | NOT NULL      |
| precio_unitario | NUMERIC(10,2) | NOT NULL      |
| observaciones   | TEXT          | NULL          |

---

## Usuario

| Campo           | Tipo         | Restricciones |
| --------------- | ------------ | ------------- |
| id              | UUID         | PK            |
| nombre          | VARCHAR(150) | NOT NULL      |
| correo          | VARCHAR(255) | UNIQUE        |
| contraseña_hash | TEXT         | NOT NULL      |
| rol             | VARCHAR(30)  | NOT NULL      |

---

## Promoción

| Campo        | Tipo          | Restricciones |
| ------------ | ------------- | ------------- |
| id           | UUID          | PK            |
| nombre       | VARCHAR(150)  | NOT NULL      |
| descripción  | TEXT          | NULL          |
| precio       | NUMERIC(10,2) | NOT NULL      |
| fecha_inicio | DATE          | NOT NULL      |
| fecha_fin    | DATE          | NOT NULL      |
| activa       | BOOLEAN       | DEFAULT TRUE  |

---

# 🔗 Relaciones

## Categoría — Producto

Una categoría puede contener muchos productos.

```text
Categoría (1)
      │
      │
      └─────────────── (N) Producto
```

---

## Cliente — Pedido

Un cliente puede realizar muchos pedidos.

```text
Cliente (1)
      │
      │
      └─────────────── (N) Pedido
```

---

## Pedido — DetallePedido

Un pedido contiene uno o varios productos.

```text
Pedido (1)
      │
      │
      └─────────────── (N) DetallePedido
```

---

## Producto — DetallePedido

Un producto puede aparecer en muchos pedidos.

```text
Producto (1)
       │
       │
       └─────────────── (N) DetallePedido
```

---

## Promoción — Producto

Una promoción puede incluir varios productos y un producto puede pertenecer a varias promociones.

```text
Promoción (N)
        │
        │
        └──── Tabla Intermedia ──── Producto (N)
```

La implementación utilizará una tabla denominada:

```text
promocion_producto
```

---

# 🔒 Restricciones de Integridad

## Integridad de Entidad

* Todas las tablas poseen una clave primaria (`UUID`).
* Ninguna clave primaria puede ser nula.

---

## Integridad Referencial

* No podrá existir un producto sin categoría.
* No podrá existir un pedido sin cliente.
* No podrá existir un detalle sin pedido.
* No podrá existir un detalle sin producto.

---

## Integridad de Dominio

### Precio

Debe ser mayor que cero.

---

### Cantidad

Debe ser mayor que cero.

---

### Estado del pedido

Solo podrá tomar uno de los siguientes valores:

* Pendiente
* Confirmado
* En preparación
* Listo
* Entregado
* Cancelado

---

# 📈 Índices Recomendados

Para mejorar el rendimiento se crearán índices sobre:

* nombre del producto.
* categoría.
* fecha del pedido.
* estado del pedido.
* teléfono del cliente.

---

# 🧠 Normalización

El diseño busca cumplir como mínimo con la **Tercera Forma Normal (3FN)**.

Para ello:

* No existirán grupos repetitivos.
* Cada atributo dependerá únicamente de la clave primaria.
* Se evitará duplicar información.

---

# 🚀 Posibles Ampliaciones

La base de datos permitirá incorporar nuevas tablas sin modificar la estructura principal.

Ejemplos:

* ingredientes
* recetas
* movimientos_inventario
* cupones
* domicilios
* pagos
* notificaciones
* auditoría

---

# 📋 Resumen del Modelo

| Entidad       | Relación Principal              |
| ------------- | ------------------------------- |
| Categoría     | Tiene muchos productos          |
| Producto      | Pertenece a una categoría       |
| Cliente       | Realiza muchos pedidos          |
| Pedido        | Contiene muchos detalles        |
| DetallePedido | Relaciona pedidos con productos |
| Usuario       | Administra el sistema           |
| Promoción     | Agrupa varios productos         |
