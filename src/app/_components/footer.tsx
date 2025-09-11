import Link from "next/link";

function BlueSquare() {
  return (
    <div className="bg-blue-700 size-[10px] rounded-[3px] mr-1 inline-block"></div>
  );
}

const Linkage = ({ children, ...props }: React.ComponentProps<typeof Link>) => {
  return (
    <Link {...props} className="text-sm flex items-center gap-[6px]">
      {children}
    </Link>
  );
};

export default function Footer() {
  return (
    <footer
      className={[
        "my-4 col-span-full",
        "border-t-[0.5px]",
        "border-neutral-400",
        "py-4",
        "text-sm text-center text-black",
        "leading-normal",
      ].join(" ")}
    >
      <div className="w-full text-[19vw] font-extrabold whitespace-nowrap font-sans">
        Lune Labs
      </div>
      <div className="container max-w-4xl mx-auto px-4 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        {/* Left: Email + Location */}
        <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
          <Linkage href="mailto:hey@lunelabs.ai">
            <BlueSquare />
            HEY@LUNELABS.AI
          </Linkage>
          <Linkage href="/">
            <BlueSquare />
            MONTEVIDEO, URUGUAY
          </Linkage>
        </div>

        {/* Right: Socials title + links */}
        <div className="flex flex-col gap-2 items-center md:items-end text-center md:text-right">
          <div className="uppercase text-xs tracking-wide text-neutral-600">
            Socials
          </div>
          <div className="flex flex-col gap-2 items-center md:items-end">
            <Linkage href="https://x.com/lunelabs">{"𝕏"}</Linkage>
            <Linkage href="https://instagram.com/lunelabs">Instagram</Linkage>
            <Linkage href="https://linkedin.com/company/lunelabs">
              LinkedIn
            </Linkage>
          </div>
        </div>
      </div>
    </footer>
  );
}
