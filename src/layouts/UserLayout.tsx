import Footer from "@/features/user/components/Footer";
import MarketClock from "@/features/user/components/MarketClock";
import Navbar from "@/features/user/components/NavBar";
import SectorPerformance from "@/features/user/components/SectorPerformance";
import WatchlistSidebar from "@/features/user/components/WatchlistSidebar";

type AppLayoutProps = {
  children: React.ReactNode;
  sidebar?: boolean;
};

export default function AppLayout({
  children,
  sidebar = true,
}: AppLayoutProps) {
  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">

      {/* NAVBAR */}
      <Navbar />

      {/* BODY */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* SIDEBAR */}
        {sidebar && (
          <aside className="hidden lg:flex lg:w-[320px] xl:w-[360px] shrink-0 border-r border-border bg-background">

            <div className="w-full overflow-y-auto p-4 space-y-4 scrollbar-hide">

              <MarketClock />

              <div className="p-2">
                <WatchlistSidebar />
              </div>

              <div className="p-2">
                <SectorPerformance />
              </div>

            </div>

          </aside>
        )}

        {/* MAIN */}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">

          {/* PAGE CONTENT */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">

            <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-6">
              {children}
            </div>

          </div>

          {/* FOOTER */}
          <Footer />

        </main>

      </div>
    </div>
  );
}