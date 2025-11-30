import { LuneLogo } from "@/components/LuneLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  themeColor: "#111111", // Matches body background oklch(17% 0 0)
};

export default function RutPage() {
  // Embossed/carved text style - sharp 0.5px peek: black on top, near-white on bottom
  const embossedText = {
    color: "rgba(180, 150, 130, 0.75)",
    textShadow: "0 -0.75px 0 rgba(0,0,0,0.7), 0 0.5px 0 rgba(255,250,240,0.55)",
  };

  const embossedTextLight = {
    color: "rgba(175, 145, 125, 0.80)",
    textShadow: "0 -0.75px 0 rgba(0,0,0,0.6), 0 0.5px 0 rgba(255,250,240,0.5)",
  };

  const embossedLabel = {
    color: "rgba(190, 160, 140, 0.95)",
    textShadow: "0 -0.75px 0 rgba(0,0,0,0.5), 0 0.5px 0 rgba(255,250,240,0.4)",
  };

  return (
    <main className="h-dvh w-dvw flex items-center justify-center overflow-hidden relative">
      {/* Rotation wrapper - rotates content 90° for landscape viewing on portrait phone */}
      <div
        className="flex items-center justify-center"
        style={{
          transform: "rotate(90deg)",
        }}
      >
        {/* Outer card - leather base */}
        <div
          className="rounded-3xl relative"
          style={{
            width: "70dvh",
            aspectRatio: "16/9",
            backgroundColor: "rgb(75,40,30)",
            boxShadow:
              "0 30px 60px -15px rgba(0,0,0,0.5), 0 15px 30px -10px rgba(0,0,0,0.4), inset -1px -1px 0 0 rgba(255,255,255,0.2), inset 1px 1.5px 0 0 rgba(0,0,0,0.175)",
            filter: "saturate(1.225) brightness(0.89)",
          }}
        >
          {/* Carved logo - top right */}
          <div
            className="absolute top-8 right-8 z-10 rounded-full"
            style={{
              boxShadow:
                "inset 2px 2px 4px rgba(0,0,0,0.6), inset -1px -1px 2px rgba(255,240,220,0.25), 0 1px 1px rgba(255,240,220,0.15), -0.5px 0.55px 0.5px rgba(255,240,220,0.085)",
            }}
          >
            <LuneLogo size={40} className="rounded-full opacity-80" />
          </div>
          {/* Left-side lighting overlay - diffused light source */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse 180% 150% at -10% 40%, rgba(180,120,80,0.15) 0%, rgba(160,100,60,0.18) 30%, transparent 70%)",
            }}
          />

          {/* Subtle shadow gradient on right side for depth */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.11) 100%)",
            }}
          />

          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none rounded-3xl overflow-hidden"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.45' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
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
      </div>
    </main>
  );
}
