import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sin conexión — Inverza",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf7f6] px-6">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-slate-900 mb-2">
          Estás sin conexión
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          No pudimos cargar esta página porque no tenés internet en este
          momento. Si ya la habías abierto antes, probá volver atrás — puede
          que esa versión sí esté disponible sin conexión.
        </p>
      </div>
    </div>
  );
}
