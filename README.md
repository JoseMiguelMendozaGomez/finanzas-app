# Finanzas

Aplicación de gestión de finanzas personales construida con Next.js 16, React 19 y TypeScript.

## Descripción

Finanzas permite a los usuarios llevar un control completo de su economía personal: registrar transacciones, organizar gastos por categorías, definir metas de ahorro y recibir recordatorios de pagos y vencimientos.

## Funcionalidades principales

- **Autenticación** — registro, inicio de sesión y gestión de sesión
- **Dashboard** — resumen visual del estado financiero
- **Transacciones** — registro de ingresos y gastos
- **Categorías** — clasificación personalizada de movimientos
- **Metas** — seguimiento de objetivos de ahorro
- **Recordatorios** — alertas de pagos y fechas importantes

## Stack tecnológico

- [Next.js 16](https://nextjs.org/) — framework fullstack con App Router
- [React 19](https://react.dev/) — biblioteca de UI
- [TypeScript 5](https://www.typescriptlang.org/) — tipado estático
- [Tailwind CSS 4](https://tailwindcss.com/) — estilos utilitarios
- [Prisma](https://www.prisma.io/) — ORM para base de datos

## Estructura del proyecto

```
app/                    # App Router — rutas y layouts
  (auth)/               # Rutas de autenticación (sin layout de dashboard)
  (dashboard)/          # Rutas protegidas con layout de dashboard
features/               # Lógica de negocio por dominio
  auth/
  dashboard/
  transactions/
  categories/
  goals/
  reminders/
components/             # Componentes React reutilizables
lib/                    # Utilidades e integraciones
  prisma/               # Cliente de Prisma
  auth/                 # Helpers de autenticación
  utils/                # Funciones utilitarias generales
docs/                   # Documentación del proyecto
tests/                  # Tests unitarios e integración
```

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
