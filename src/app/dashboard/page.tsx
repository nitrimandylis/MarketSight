import { Dashboard } from "@/components/dashboard";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </main>
  );
}
