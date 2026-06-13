import { buildAnalyticsDashboardData } from "@/lib/analytics/dashboard";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const initialData = await buildAnalyticsDashboardData();

  return <AnalyticsDashboard initialData={initialData} />;
}
