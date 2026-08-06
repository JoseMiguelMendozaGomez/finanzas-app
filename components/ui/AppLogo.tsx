import Link from "next/link";

interface AppLogoProps {
  /** Si se omite, el logo no es un enlace */
  href?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { wrap: "w-7 h-7", icon: "w-4 h-4", text: "text-base" },
  md: { wrap: "w-10 h-10", icon: "w-6 h-6", text: "text-xl" },
  lg: { wrap: "w-12 h-12", icon: "w-7 h-7", text: "text-2xl" },
};

function LogoIcon({ size = "md" }: { size?: AppLogoProps["size"] }) {
  const s = sizeMap[size ?? "md"];
  return (
    <div className="flex items-center gap-2">
      <div
        className={`${s.wrap} bg-blue-600 rounded-xl flex items-center justify-center shadow-md shrink-0`}
      >
        <svg
          className={`${s.icon} text-white`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      </div>
      <span className={`text-white font-bold ${s.text} tracking-tight`}>
        Finanzas App
      </span>
    </div>
  );
}

export default function AppLogo({ href, size = "md" }: AppLogoProps) {
  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex group hover:opacity-90 transition-opacity duration-200"
        aria-label="Finanzas App — inicio"
      >
        <LogoIcon size={size} />
      </Link>
    );
  }

  return (
    <div className="inline-flex">
      <LogoIcon size={size} />
    </div>
  );
}
