/**
 * Barrel de componentes UI.
 * Importa desde "@/components/ui" en lugar de rutas individuales.
 *
 * Ejemplo:
 *   import { Button, Badge, Card, Input, EmptyState, PageHeader } from "@/components/ui";
 */

export { default as AppLogo }    from "./AppLogo";
export { default as BackLink }   from "./BackLink";
export { default as Badge }      from "./Badge";
export { default as Button }     from "./Button";
export { default as Card }       from "./Card";
export { default as EmptyState } from "./EmptyState";
export { default as FormField }  from "./FormField";
export { default as Input }      from "./Input";
export { default as PageHeader } from "./PageHeader";

// Re-export de tipos para uso externo
export type { BadgeColor, BadgeSize, BadgeVariant }      from "./Badge";
export type { ButtonProps, ButtonSize, ButtonVariant }   from "./Button";
export type { CardColor, CardPadding, CardVariant }      from "./Card";
export type { EmptyStateProps }                          from "./EmptyState";
export type { InputProps, InputSize, InputTheme }        from "./Input";
export type { PageHeaderProps }                          from "./PageHeader";
