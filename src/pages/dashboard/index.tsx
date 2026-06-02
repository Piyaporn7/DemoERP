import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingCart, TrendingUp, Factory, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { mockApi } from "@/data/mockApi";
import { PageDataSkeleton } from "@/components/shared/PageDataSkeleton";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { exportRowsToPdf } from "@/lib/exportPdf";
import { toast } from "sonner";

const cardIconMap = {
  "ยอดขายเดือนนี้": TrendingUp,
  "ยอดซื้อเดือนนี้": ShoppingCart,
  "สินค้าคงเหลือ": Package,
  "ใบสั่งผลิต": Factory,
};

const orderColumns = [
  { key: "id", label: "เลขที่" },
  { key: "customer", label: "ลูกค้า" },
  { key: "date", label: "วันที่" },
  { key: "amount", label: "จำนวนเงิน", className: "text-right" },
  { key: "status", label: "สถานะ", render: (v: string) => <StatusBadge status={v} /> },
];

const Dashboard = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: mockApi.getDashboard,
  });

  const summaryCards = data?.summaryCards ?? [];
  const monthlySales = data?.monthlySales ?? [];
  const recentOrders = data?.recentOrders ?? [];

  const handleExportPdf = () => {
    const ok = exportRowsToPdf(
      "คำสั่งซื้อล่าสุด",
      orderColumns.map((col) => ({
        key: col.key,
        label: col.label,
        alignRight: col.className?.includes("text-right") ?? false,
      })),
      recentOrders as Array<Record<string, unknown>>,
    );
    if (!ok) toast.error("ไม่สามารถ Export PDF ได้");
  };

  if (isLoading) {
    return <PageDataSkeleton rows={6} />;
  }

  if (isError) {
    return <PageErrorState onRetry={() => refetch()} />;
  }

  return (
    <div>
      <PageHeader title="Dashboard" description="ภาพรวมระบบ DemoERP" secondaryActionLabel="Export PDF" onSecondaryAction={handleExportPdf} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => {
          const Icon = cardIconMap[card.title as keyof typeof cardIconMap] ?? Package;
          return (
            <Card key={card.title}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{card.title}</p>
                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {card.up ? <ArrowUpRight className="h-3 w-3 text-success" /> : <ArrowDownRight className="h-3 w-3 text-destructive" />}
                      <span className={`text-xs font-medium ${card.up ? "text-success" : "text-destructive"}`}>{card.change}</span>
                      <span className="text-xs text-muted-foreground">vs เดือนก่อน</span>
                    </div>
                  </div>
                  <div className={`h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">ยอดขาย vs ยอดซื้อ (รายเดือน)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => `฿${v.toLocaleString()}`} />
                <Bar dataKey="sales" fill="hsl(213, 56%, 24%)" name="ยอดขาย" radius={[4, 4, 0, 0]} />
                <Bar dataKey="purchase" fill="hsl(210, 100%, 70%)" name="ยอดซื้อ" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">แนวโน้มยอดขาย</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => `฿${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="sales" stroke="hsl(213, 56%, 24%)" strokeWidth={2} name="ยอดขาย" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">คำสั่งซื้อล่าสุด</h2>
        <DataTable columns={orderColumns} data={recentOrders} />
      </div>
    </div>
  );
};

export default Dashboard;
