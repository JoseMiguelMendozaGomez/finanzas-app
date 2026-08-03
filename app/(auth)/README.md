# app/(auth)

Route group para las rutas públicas de autenticación.

El grupo `(auth)` no añade ningún segmento a la URL — `/login` y `/register` se resuelven directamente desde la raíz.

## Rutas previstas

| Archivo                        | URL         |
| ------------------------------ | ----------- |
| `login/page.tsx`               | `/login`    |
| `register/page.tsx`            | `/register` |
| `forgot-password/page.tsx`     | `/forgot-password` |

## Notas

- Estas rutas **no** aplican el layout del dashboard.
- Un `layout.tsx` propio puede definir la UI mínima de autenticación (logo, fondo, etc.).
