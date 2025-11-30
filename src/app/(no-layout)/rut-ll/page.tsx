import { LuneLogo } from "@/components/LuneLogo";

export default function RutPage() {
  // Embossed/carved text style - sharp 0.5px peek: black on top, near-white on bottom
  const embossedText = {
    color: "rgba(185, 155, 135, 0.75)",
    textShadow: "0 -0.75px 0 rgba(0,0,0,0.7), 0 0.5px 0 rgba(255,250,240,0.55)",
  };

  const embossedTextLight = {
    color: "rgba(200, 170, 150, 0.85)",
    textShadow: "0 -0.75px 0 rgba(0,0,0,0.6), 0 0.5px 0 rgba(255,250,240,0.5)",
  };

  const embossedLabel = {
    color: "rgba(190, 160, 140, 0.95)",
    textShadow: "0 -0.75px 0 rgba(0,0,0,0.5), 0 0.5px 0 rgba(255,250,240,0.4)",
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-black">
      {/* Outer card - leather base */}
      <div
        className="w-full max-w-lg rounded-3xl relative"
        style={{
          aspectRatio: "16/9",
          backgroundColor: "rgb(78,43,33)",
          boxShadow:
            "0 30px 60px -15px rgba(0,0,0,0.6), 0 15px 30px -10px rgba(0,0,0,0.4), inset -1px -1px 0 0 rgba(255,255,255,0.15), inset 1px 1.5px 0 0 rgba(0,0,0,0.15)",
        }}
      >
        {/* Floating logo - top right */}
        <div className="absolute top-8 right-8 z-10">
          <LuneLogo
            size={40}
            className="rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          />
        </div>
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none rounded-3xl overflow-hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Stitching border - individual stitch marks */}
        <svg
          className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] pointer-events-none"
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter
              id="stitchShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="1"
                stdDeviation="0.5"
                floodColor="rgba(150,120,90,0.5)"
              />
              <feDropShadow
                dx="0"
                dy="-0.5"
                stdDeviation="0.3"
                floodColor="rgba(0,0,0,0.4)"
              />
            </filter>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="16"
            ry="16"
            fill="none"
            stroke="rgba(45, 30, 20, 0.8)"
            strokeWidth="2"
            strokeDasharray="8 6"
            strokeLinecap="round"
            filter="url(#stitchShadow)"
          />
        </svg>

        {/* Inner content area */}
        <div className="relative h-full flex flex-col justify-between p-8">
          {/* Top row: Company name and tagline */}
          <div className="flex justify-between items-start">
            <div>
              <h1
                className="text-xl font-semibold tracking-tight"
                style={embossedText}
              >
                Lune Labs
              </h1>
              <p className="text-xs" style={embossedTextLight}>
                Applied AI Engineering
              </p>
            </div>
          </div>

          {/* Middle: RUT number styled like embossed card number */}
          <div
            className="font-mono text-xl tracking-[0.2em]"
            style={embossedText}
          >
            2204 3789 0012
          </div>

          {/* Bottom row: Contact details */}
          <div className="flex justify-between items-end text-xs">
            <div className="space-y-0.5">
              <div>
                <span
                  className="uppercase text-[9px] tracking-wider"
                  style={embossedLabel}
                >
                  Email
                </span>
                <p style={embossedTextLight}>contact@lunelabs.ai</p>
              </div>
              <div>
                <span
                  className="uppercase text-[9px] tracking-wider"
                  style={embossedLabel}
                >
                  Phone
                </span>
                <p style={embossedTextLight}>+598 98 106 476</p>
              </div>
            </div>
            <div className="text-right">
              <span
                className="uppercase text-[9px] tracking-wider"
                style={embossedLabel}
              >
                Address
              </span>
              <p style={embossedTextLight}>Piovene 1357</p>
              <p style={embossedTextLight}>Pando, Canelones 15600</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
