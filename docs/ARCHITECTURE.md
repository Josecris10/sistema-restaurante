# Arquitectura del Sistema

## 1. Diagrama de Contexto

Este diagrama representa la vista de alto nivel del sistema. Se enfoca en las interacciones entre los actores y el sistema.

![Diagrama de Contexto](./img/contexto-sistema.png)

### Actores y Responsabilidades

- **Sistema Restaurante:** El núcleo digital que centraliza la operación.
- **Garzón:**
  - Ingresa comandas y cierra cuentas.
  - Consulta el estado de los platos (para informar tiempos al cliente) y la disponibilidad de comida.
- **Cocina:**
  - Visualiza comandas en orden de llegada.
  - Marca el inicio de preparación y entrega de platos.
  - Define la disponibilidad de las comidas del día (se descuentan automáticamente los insumos del inventario).
- **Administrador:**
  - Define el catálogo maestro (Recetas) y planifica el menú semanal/diario.
  - Gestiona el inventario de insumos (compras).
  - Visualiza reportes de ventas y rendimiento.

## 2. Modelo de Datos

Este diagrama define la estructura de la base de datos y las relaciones entre entidades.

```mermaid

erDiagram
%% Esto es un comentario: Define la relación
TABLE ||--o{ ORDER : "tiene"
ORDER ||--|{ ITEM_DETAIL: "contiene"
INGREDIENT ||--o{ INGREDIENT_RECIPE : "se usa en"
ITEM ||--o| RECIPE: "corresponde a"
ITEM_DETAIL }o--|| ITEM: "tiene"
USER ||--o{ ORDER: "se encarga de"


    USER {
      int id PK
      string name
      string last_name
      string role

    }

    TABLE {
        int id PK
        int number
        string state
    }

    ORDER {
        int id PK
        int table_id FK
        int waiter_id FK
        string kitchen_state
        bool is_paid
        string client_name
    }

    ITEM {
      int id PK
      string name
      int unit_price
    }

    ITEM_DETAIL {
      int id PK
      int order_id FK
      int item_id FK
      int quantity
      int actual_price
      string detail
    }


    RECIPE {
      int id PK
      string name
      string additional_info

    }

    INGREDIENT_RECIPE {
      int id PK
      int ingredient_id FK
      int recipe_id FK
      float quantity
    }

    INGREDIENT {
      int id PK
      string name
      int actual_stock
      int minimum_stock
      string unit_measurement
    }



```
