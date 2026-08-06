/**
 * FormField — wrapper de compatibilidad sobre Input.
 *
 * Mantiene la API que ya usan LoginForm y RegisterForm
 * (tema "dark", labelSuffix) sin romper nada.
 */
import Input from "@/components/ui/Input";

interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  autoComplete?: string;
  /** Slot derecho junto al label */
  labelSuffix?: React.ReactNode;
}

export default function FormField({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  labelSuffix,
}: FormFieldProps) {
  return (
    <Input
      id={id}
      label={label}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      labelSuffix={labelSuffix}
      theme="dark"
    />
  );
}
