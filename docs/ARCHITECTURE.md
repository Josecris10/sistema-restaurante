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
TABLE ||--o{ ORDER : "has"
ORDER ||--|{ ITEM_DETAIL: "contains"
SUPPLY ||--o{ RECIPE_SUPPLY : "is used in"
ITEM_DETAIL }o--|| ITEM: "corresponds to "
ITEM ||--o| RECIPE: "corresponds to"
ITEM |o--o| SUPPLY : "corresponds to"
USER ||--o{ ORDER: "takes care of"
MENU ||--|{ RECIPE_MENU : "has"
DAILY_PRODUCTION }o--|| RECIPE : "tracks"
SUPPLY ||--o{ SUPPLY_BATCH:"has lots of"



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
        string order_state
        string client_name
        datetime closed_at
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

    RECIPE_SUPPLY {
      int id PK
      int supply_id FK
      int recipe_id FK
      float quantity
    }

    SUPPLY {
      int id PK
      string name
      int minimum_stock
      string unit_measurement
      enum type
    }

    SUPPLY_BATCH {
      int id PK
      int supply_id FK
      int initial_quantity
      int remaining_quantity
      date expiration_date
      date received_date
      int cost_price
    }

    MENU {
      int id PK
      string name
      datetime scheduled_date
    }

    RECIPE_MENU {
      int id PK
      int recipe_id FK
      int menu_id FK
      enum course_type

    }

    DAILY_PRODUCTION {
      int id PK
      int recipe_id FK
      datetime scheduled_date
      int total
      int remaining
    }


```
