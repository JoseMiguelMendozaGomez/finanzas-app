import { getInitial } from "@/lib/utils/format";

interface UserAvatarImageProps {
  userId?: string;
  name?: string | null;
  email?: string | null;
  /** Timestamp de la última subida — undefined si no tiene foto. Sirve como cache-buster. */
  avatarUpdatedAt?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: { wrap: "w-8 h-8", text: "text-xs" },
  md: { wrap: "w-10 h-10", text: "text-sm" },
  lg: { wrap: "w-16 h-16", text: "text-2xl" },
  xl: { wrap: "w-24 h-24", text: "text-3xl" },
};

export default function UserAvatarImage({
  userId,
  name,
  email,
  avatarUpdatedAt,
  size = "md",
  className = "",
}: UserAvatarImageProps) {
  const s = sizes[size];
  const wrapClasses = `${s.wrap} rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden ${className}`;

  if (userId && avatarUpdatedAt) {
    return (
      <div className={wrapClasses}>
        {/* eslint-disable-next-line @next/next/no-img-element -- imagen dinámica servida por nuestra propia API, no apta para el optimizador estático de next/image */}
        <img
          src={`/api/avatar/${userId}?v=${avatarUpdatedAt}`}
          alt={name ?? "Foto de perfil"}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${wrapClasses} bg-gradient-to-br from-blue-500 to-blue-600`}
    >
      <span className={`text-white font-bold ${s.text}`}>
        {getInitial(name, email)}
      </span>
    </div>
  );
}
