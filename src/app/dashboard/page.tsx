import { Dashboard } from "@/components/dashboard";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <main className="bg-muted/40">
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </main>
  );
}
