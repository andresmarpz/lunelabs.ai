import Image from "next/image";

interface LuneLogoProps {
  size?: number;
  className?: string;
}

export function LuneLogo({ size = 40, className = "" }: LuneLogoProps) {
  return (
    <Image
      src="/android-chrome-192x192.png"
      alt="Lune Labs logo"
      width={size}
      height={size}
      className={className}
    />
  );
}
