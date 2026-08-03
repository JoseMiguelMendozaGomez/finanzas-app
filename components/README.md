# components

Componentes React reutilizables compartidos en toda la aplicación.

## Organización prevista

```
components/
  ui/           # Componentes base (Button, Input, Modal, Card, etc.)
  layout/       # Componentes estructurales (Sidebar, Header, Footer, etc.)
  charts/       # Gráficos y visualizaciones financieras
  forms/        # Componentes de formulario compuestos
```

## Notas

- Los componentes aquí son **agnósticos al dominio** — no importan lógica de `features/`.
- Los componentes específicos de una feature se colocan junto a su route en `app/` o dentro de `features/`.
