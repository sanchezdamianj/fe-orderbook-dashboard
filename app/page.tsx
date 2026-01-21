import { OrderbookDisplay } from "@/presentation/components/orderbook/OrderbookDisplay";
import { ConnectionFallbackNotice } from "@/presentation/components/connection/ConnectionFallbackNotice";
import { DashboardHeader } from "@/presentation/components/layout/DashboardHeader";
import { DashboardSidebar } from "@/presentation/components/layout/DashboardSidebar";

export default function Home() {
  return (
    <main className="h-screen bg-background flex flex-col overflow-hidden">
      <ConnectionFallbackNotice />
      <div className="mx-auto w-full max-w-7xl flex flex-col h-full px-4 sm:px-6">
        <DashboardHeader />

        <div className="flex-1 grid gap-3 lg:grid-cols-3 py-3 overflow-hidden min-h-0">
          <div className="lg:col-span-2 flex flex-col overflow-hidden">
            <OrderbookDisplay />
          </div>

          <DashboardSidebar />
        </div>
      </div>
    </main>
  );
}
