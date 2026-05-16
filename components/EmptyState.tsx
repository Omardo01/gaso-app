"use client";

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-28 h-28 rounded-full bg-primary-100 flex items-center justify-center mb-5">
        <svg
          viewBox="0 0 64 64"
          fill="none"
          className="w-14 h-14 text-primary-600"
          aria-hidden
        >
          <path
            d="M20 14h16a4 4 0 0 1 4 4v30H16V18a4 4 0 0 1 4-4Z"
            fill="currentColor"
            opacity="0.18"
          />
          <path
            d="M20 14h16a4 4 0 0 1 4 4v30H16V18a4 4 0 0 1 4-4Z"
            stroke="currentColor"
            strokeWidth="3"
          />
          <rect
            x="21"
            y="20"
            width="14"
            height="9"
            rx="2"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            d="M44 24l4 3v15a3 3 0 0 1-3 3 3 3 0 0 1-3-3V28l2-4Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-foreground">
        Aún no hay llenados
      </h3>
      <p className="text-sm text-default-500 mt-1 max-w-xs">
        Registra tu primera carga de gasolina para empezar a monitorear el
        rendimiento de tu vehículo.
      </p>
      <button
        onClick={onAdd}
        className="mt-6 px-6 py-3 rounded-full bg-primary-600 text-white font-semibold shadow-md shadow-primary-200 tap-target active:scale-95 transition-transform"
      >
        Agregar primer llenado
      </button>
    </div>
  );
}
