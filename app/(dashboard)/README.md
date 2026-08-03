# app/(dashboard)

Route group para las rutas protegidas que comparten el layout del dashboard.

El grupo `(dashboard)` no añade ningún segmento a la URL — `/dashboard`, `/transactions`, etc. se resuelven directamente desde la raíz.

## Rutas previstas

| Archivo                              | URL               |
| ------------------------------------ | ----------------- |
| `dashboard/page.tsx`                 | `/dashboard`      |
| `transactions/page.tsx`              | `/transactions`   |
| `categories/page.tsx`                | `/categories`     |
| `goals/page.tsx`                     | `/goals`          |
| `reminders/page.tsx`                 | `/reminders`      |

## Notas

- Un `layout.tsx` en esta carpeta envuelve todas las rutas hijas con la navegación lateral, header, etc.
- Las rutas requieren sesión activa; la protección se aplicará en el middleware o en el layout.
