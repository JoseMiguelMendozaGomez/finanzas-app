# tests

Tests del proyecto: unitarios, de integración y end-to-end.

## Organización prevista

```
tests/
  unit/         # Tests unitarios de funciones puras (lib/utils, schemas, etc.)
  integration/  # Tests de integración (Server Actions, queries de base de datos)
  e2e/          # Tests end-to-end con Playwright o similar
```

## Notas

- Los tests de componentes React se colocan junto al componente (`Button.test.tsx` al lado de `Button.tsx`).
- Esta carpeta es para tests que no pertenecen claramente a un único módulo.
