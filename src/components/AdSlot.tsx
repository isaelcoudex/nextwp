"use client";

interface AdSlotProps {
  /** Identificador do slot para diferenciar posições (ex: "after-title", "sidebar") */
  slot?: string;
}

// Cole aqui o código do seu anúncio (ex: Google AdSense).
// Se vazio, o slot não renderiza nada em produção.
const ADS: Record<string, string> = {
  "after-title": "", // ex: '<ins class="adsbygoogle" ...></ins><script>...</script>'
};

export default function AdSlot({ slot = "after-title" }: AdSlotProps) {
  const adCode = ADS[slot];

  // Em desenvolvimento mostra um placeholder visível
  if (process.env.NODE_ENV === "development" && !adCode) {
    return (
      <div
        className="w-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-xs font-medium my-4"
        style={{ minHeight: 80 }}
      >
        Anúncio — slot: <span className="font-mono ml-1 text-slate-500">{slot}</span>
      </div>
    );
  }

  if (!adCode) return null;

  return (
    <div
      className="w-full my-4"
      dangerouslySetInnerHTML={{ __html: adCode }}
    />
  );
}
