import Navbar from "../components/NavBar";
import WatchlistSidebar from "../components/WatchlistSidebar";
import StatsCards from "../components/StatsCards";
import TodaysOrders from "../components/TodaysOrders";
import SectorPerformance from "../components/SectorPerformance";
import Footer from "../components/Footer";
import MarketClock from "../components/MarketClock";
 
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
<div  >
      <MarketClock />
    </div>
            <div className="p-2">
              <WatchlistSidebar />
            </div>
 

            <div className="p-2">
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
<button
  onClick={async () => {
    const token = localStorage.getItem("access");

    const res = await fetch("http://127.0.0.1:8000/api/marketdata/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log(data);
  }}
  className="bg-red-600 p-3 rounded-l"
>
  Fetch Market Data
</button>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
 