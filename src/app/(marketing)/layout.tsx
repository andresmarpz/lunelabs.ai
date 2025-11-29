import Footer from "@/app/_components/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-rows-[1fr_auto] grid-cols-1 lg:grid-cols-[1fr_auto_1fr]">
      {children}
      <Footer />
    </div>
  );
}
