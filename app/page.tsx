import { OrderbookDisplay } from "@/presentation/components/orderbook/OrderbookDisplay";
import { ConnectionFallbackNotice } from "@/presentation/components/connection/ConnectionFallbackNotice";
import { DashboardHeader } from "@/presentation/components/layout/DashboardHeader";
import { DashboardSidebar } from "@/presentation/components/layout/DashboardSidebar";
import { MobileInfo } from "@/presentation/components/layout/MobileInfo";

export default function Home() {
  return (
    <main className="h-screen bg-background flex flex-col">
      <ConnectionFallbackNotice />
      <div className="mx-auto w-full max-w-7xl flex flex-col flex-1 px-4 sm:px-6 overflow-y-auto lg:overflow-hidden min-h-0">
        <DashboardHeader />

        <div className="flex-1 grid gap-3 lg:grid-cols-3 pb-3 overflow-hidden min-h-0 lg:min-h-0">
          <div className="lg:col-span-2 flex flex-col min-h-[600px] lg:min-h-0 overflow-hidden">
            <OrderbookDisplay />
          </div>

          <DashboardSidebar />
        </div>
      </div>
      
      <MobileInfo />
    </main>
  );
}
