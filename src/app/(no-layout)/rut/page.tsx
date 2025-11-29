export default function RutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-neutral-950">
      <div
        className="w-full max-w-lg aspect-video bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white rounded-2xl p-6 flex flex-col justify-between shadow-2xl"
        style={{
          aspectRatio: "16/9",
          boxShadow:
            "0 1px 15px 0 rgba(154,170,255,.02),0 0 8px -4px rgba(154,170,255,.02),inset 0 1px 1px 0 hsla(0,0%,100%,.22)",
        }}
      >
        {/* Top row: Company name and tagline */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Lune Labs</h1>
            <p className="text-neutral-400 text-xs">
              Applied AI engineering company
            </p>
          </div>
        </div>

        {/* Middle: RUT number styled like a card number */}
        <div className="font-mono text-2xl tracking-[0.125em] font-extrabold">
          2204 3789 0012
        </div>

        {/* Bottom row: Contact details */}
        <div className="flex justify-between items-end text-xs">
          <div className="space-y-1">
            <div>
              <span className="text-white/50 uppercase text-[10px] tracking-wider">
                Email
              </span>
              <p>contact@lunelabs.ai</p>
            </div>
            <div>
              <span className="text-white/50 uppercase text-[10px] tracking-wider">
                Phone
              </span>
              <p>+598 98 106 476</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-white/50 uppercase text-[10px] tracking-wider">
              Address
            </span>
            <p>Piovene 1357</p>
            <p>Pando, Canelones 15600</p>
          </div>
        </div>
      </div>
    </main>
  );
}
