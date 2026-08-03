# lib/prisma

Instancia singleton del cliente de Prisma y helpers de base de datos.

## Contenido previsto

- `client.ts` — exporta el cliente de Prisma con patrón singleton (evita múltiples conexiones en desarrollo)
- `seed.ts` — script de datos iniciales para desarrollo

## Notas

El schema de Prisma (`schema.prisma`) vive en la raíz del proyecto bajo `prisma/schema.prisma`, siguiendo la convención estándar de la herramienta.
