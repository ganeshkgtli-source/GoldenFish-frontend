import Navbar from "../components/NavBar";
import WatchlistSidebar from "../components/WatchlistSidebar";
import StatsCards from "../components/StatsCards";
import TodaysOrders from "../components/TodaysOrders";
import SectorPerformance from "../components/SectorPerformance";
import Footer from "../components/Footer";
 
 export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <div className="flex flex-col lg:flex-row flex-1 w-full">

        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0 bg-background border-b lg:border-b-0 lg:border-r border-border">
          
          <div className="w-full p-4 flex flex-col gap-4 overflow-y-auto">

            <div className="p-3">
              <WatchlistSidebar />
            </div>

            {/* 🔥 Divider */}
            <div className="h-px bg-border opacity-50" />

            <div className="p-3">
              <SectorPerformance />
            </div>

          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 flex flex-col">

          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            <StatsCards />

            <div className="p-4">
              <TodaysOrders />
            </div>

          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
 