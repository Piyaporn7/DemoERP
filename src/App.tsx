import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/dashboard";
import Inventory from "./pages/inventory";
import Sales from "./pages/sales";
import Purchase from "./pages/purchase";
import Accounting from "./pages/accounting";
import Costing from "./pages/costing";
import Manufacturing from "./pages/manufacturing";
import MasterData from "./pages/master-data";
import NotFound from "./pages/error";

const queryClient = new QueryClient();

const inventoryRoutes = [
  "goods-receive", "sales-return", "stock-adjust-in", "opening-stock",
  "purchase-return", "issue-for-sale", "general-issue", "stock-adjust-out", "warehouse-transfer",
  "report-balance", "report-movement", "qr-code", "report-reorder", "report-overstock",
  "shelf-in", "shelf-out", "shelf-transfer", "shelf-balance", "shelf-movement", "shelf-count",
];

const salesRoutes = ["quotation", "order", "delivery", "calendar", "report-quotation", "report-order", "report-delivery"];

const purchaseRoutes = ["request", "order", "calendar", "report-request", "report-cost", "report-pending"];

const accountingRoutes = [
  "ap-purchase", "ap-service", "ap-expense", "ap-payment", "ap-report",
  "ar-sale", "ar-service", "ar-other", "ar-receive", "ar-report",
  "gl-withholding", "gl-journal", "gl-input-tax", "gl-output-tax", "gl-pnd53",
];

const costingRoutes = ["allocation", "actual-cost", "ending-stock", "stock-card"];

const manufacturingRoutes = [
  "mps", "mrp", "calendar", "bom", "job-order", "job-transaction", "monitoring",
  "work-centers", "machines", "resources",
  "material-issue", "material-return", "fg-receive", "subcontract-issue", "subcontract-receive",
  "aql", "qa-inspection",
  "report-plan", "report-daily", "report-material", "report-job-status",
];

const masterDataRoutes = ["vendor", "customer", "payment-term"];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {inventoryRoutes.map(r => (
              <Route key={r} path={`/inventory/${r}`} element={<Inventory />} />
            ))}
            {salesRoutes.map(r => (
              <Route key={r} path={`/sales/${r}`} element={<Sales />} />
            ))}
            {purchaseRoutes.map(r => (
              <Route key={r} path={`/purchase/${r}`} element={<Purchase />} />
            ))}
            {accountingRoutes.map(r => (
              <Route key={r} path={`/accounting/${r}`} element={<Accounting />} />
            ))}
            {costingRoutes.map(r => (
              <Route key={r} path={`/costing/${r}`} element={<Costing />} />
            ))}
            {manufacturingRoutes.map(r => (
              <Route key={r} path={`/manufacturing/${r}`} element={<Manufacturing />} />
            ))}
            {masterDataRoutes.map(r => (
              <Route key={r} path={`/master-data/${r}`} element={<MasterData />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
