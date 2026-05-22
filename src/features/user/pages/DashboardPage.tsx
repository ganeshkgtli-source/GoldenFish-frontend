import StatsCards from "../components/StatsCards";
import TodaysOrders from "../components/TodaysOrders";
 
export default function DashboardPage() {
  return (
   
      <div className="space-y-6">
        {/* STATS */}
        <StatsCards />

        {/* ORDERS */}
        <TodaysOrders />
      </div> 
  );
}