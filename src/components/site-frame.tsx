"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import AppOverlays from "@/components/app-overlays";
import ScrollProgress from "@/components/ui/scroll-progress";
import AuroraBackground from "@/components/aurora-background";

/**
 * Wraps the app shell. The `/components*` showcase routes are rendered
 * "bare" (no header / footer / decorative overlays) so the component
 * galleries can be judged in isolation. Everything else gets full chrome.
 */
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname?.startsWith("/components") ?? false;

  if (bare) return <>{children}</>;

  return (
    <>
      <AuroraBackground />
      <ScrollProgress />
      <Header />
      {children}
      <Footer />
      <AppOverlays />
    </>
  );
}
