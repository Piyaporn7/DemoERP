import {
  accountingRows,
  costingRows,
  costingSummary,
  dashboardMonthlySales,
  dashboardRecentOrders,
  dashboardSummaryCards,
  inventoryRows,
  manufacturingCalendarDays,
  manufacturingJobOrders,
  manufacturingMonitoringSummary,
  purchaseCalendarDays,
  purchaseRows,
  salesCalendarDays,
  salesRows,
} from "@/data/mockData";
import { masterData } from "@/data/masterData";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type InventoryRow = (typeof inventoryRows)[number];
type SalesRow = (typeof salesRows)[number];
type PurchaseRow = (typeof purchaseRows)[number];
type AccountingRow = (typeof accountingRows)[number];
type CostingRow = (typeof costingRows)[number];
type ManufacturingRow = (typeof manufacturingJobOrders)[number];

const inventoryRoutes = [
  "/inventory/goods-receive", "/inventory/sales-return", "/inventory/stock-adjust-in", "/inventory/opening-stock",
  "/inventory/purchase-return", "/inventory/issue-for-sale", "/inventory/general-issue", "/inventory/stock-adjust-out", "/inventory/warehouse-transfer",
  "/inventory/report-balance", "/inventory/report-movement", "/inventory/qr-code", "/inventory/report-reorder", "/inventory/report-overstock",
  "/inventory/shelf-in", "/inventory/shelf-out", "/inventory/shelf-transfer", "/inventory/shelf-balance", "/inventory/shelf-movement", "/inventory/shelf-count",
];

const salesRoutes = ["/sales/quotation", "/sales/order", "/sales/delivery", "/sales/calendar", "/sales/report-quotation", "/sales/report-order", "/sales/report-delivery"];
const purchaseRoutes = ["/purchase/request", "/purchase/order", "/purchase/calendar", "/purchase/report-request", "/purchase/report-cost", "/purchase/report-pending"];
const accountingRoutes = [
  "/accounting/ap-purchase", "/accounting/ap-service", "/accounting/ap-expense", "/accounting/ap-payment", "/accounting/ap-report",
  "/accounting/ar-sale", "/accounting/ar-service", "/accounting/ar-other", "/accounting/ar-receive", "/accounting/ar-report",
  "/accounting/gl-withholding", "/accounting/gl-journal", "/accounting/gl-input-tax", "/accounting/gl-output-tax", "/accounting/gl-pnd53",
];
const costingRoutes = ["/costing/allocation", "/costing/actual-cost", "/costing/ending-stock", "/costing/stock-card"];
const manufacturingRoutes = [
  "/manufacturing/mps", "/manufacturing/mrp", "/manufacturing/calendar", "/manufacturing/bom", "/manufacturing/job-order", "/manufacturing/job-transaction", "/manufacturing/monitoring",
  "/manufacturing/work-centers", "/manufacturing/machines", "/manufacturing/resources",
  "/manufacturing/material-issue", "/manufacturing/material-return", "/manufacturing/fg-receive", "/manufacturing/subcontract-issue", "/manufacturing/subcontract-receive",
  "/manufacturing/aql", "/manufacturing/qa-inspection",
  "/manufacturing/report-plan", "/manufacturing/report-daily", "/manufacturing/report-material", "/manufacturing/report-job-status",
];

const state = {
  inventoryByPath: {} as Record<string, InventoryRow[]>,
  salesByPath: {} as Record<string, SalesRow[]>,
  salesCalendarByPath: {} as Record<string, { day: number; items: string[] }[]>,
  purchaseByPath: {} as Record<string, PurchaseRow[]>,
  purchaseCalendarByPath: {} as Record<string, { day: number; items: string[] }[]>,
  accountingByPath: {} as Record<string, AccountingRow[]>,
  costingByPath: {} as Record<string, CostingRow[]>,
  manufacturingByPath: {} as Record<string, ManufacturingRow[]>,
  manufacturingCalendarByPath: {} as Record<string, { day: number; items: string[] }[]>,
};

const masterState = JSON.parse(JSON.stringify(masterData)) as typeof masterData;

type MasterType = "vendor" | "customer" | "payment-term";
const masterIdKeys: Record<MasterType, string> = {
  vendor: "vendorCode",
  customer: "customerCode",
  "payment-term": "paymentTermCode",
};

function getMasterCollection(type: MasterType) {
  if (type === "vendor") return masterState.vendorMaster;
  if (type === "customer") return masterState.customerMaster;
  return masterState.paymentTermMaster;
}

const softDeleteHistory = {
  inventoryByPath: {} as Record<string, InventoryRow[][]>,
  salesByPath: {} as Record<string, SalesRow[][]>,
  purchaseByPath: {} as Record<string, PurchaseRow[][]>,
  accountingByPath: {} as Record<string, AccountingRow[][]>,
  costingByPath: {} as Record<string, CostingRow[][]>,
  manufacturingByPath: {} as Record<string, ManufacturingRow[][]>,
};

const DEFAULT_PATHS = {
  inventory: "/inventory/goods-receive",
  sales: "/sales/quotation",
  purchase: "/purchase/request",
  accounting: "/accounting/ap-purchase",
  costing: "/costing/allocation",
  manufacturing: "/manufacturing/mps",
};

function upsertById<T extends Record<string, any>>(rows: T[], idKey: keyof T, idValue: string, patch: Partial<T>) {
  const idx = rows.findIndex((row) => String(row[idKey]) === idValue);
  if (idx === -1) return false;
  rows[idx] = { ...rows[idx], ...patch };
  return true;
}

function removeByIds<T extends Record<string, any>>(rows: T[], idKey: keyof T, ids: string[]) {
  const idSet = new Set(ids);
  return rows.filter((row) => !idSet.has(String(row[idKey])));
}

function getDeletedRows<T extends Record<string, any>>(rows: T[], idKey: keyof T, ids: string[]) {
  const idSet = new Set(ids);
  return rows.filter((row) => idSet.has(String(row[idKey])));
}

function getRouteCode(pathname: string, fallback: string) {
  const segment = pathname.split("/").filter(Boolean).pop() || fallback;
  const code = segment
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 4);
  return code || fallback;
}

function ensurePathRows<T>(container: Record<string, T[]>, pathname: string, seedFactory: (path: string) => T[]) {
  if (!container[pathname]) {
    container[pathname] = seedFactory(pathname);
  }
  return container[pathname];
}

function ensureHistory<T>(container: Record<string, T[][]>, pathname: string) {
  if (!container[pathname]) {
    container[pathname] = [];
  }
  return container[pathname];
}

function normalizePath(pathname: string | undefined, validPaths: string[], fallback: string) {
  if (pathname && validPaths.includes(pathname)) return pathname;
  return fallback;
}

function seedInventoryRows(pathname: string): InventoryRow[] {
  const code = getRouteCode(pathname, "INV");
  const year = new Date().getFullYear();
  return inventoryRows.map((row, i) => ({
    ...row,
    doc_no: `${code}-${year}-${String(i + 1).padStart(4, "0")}`,
    item_name: `${row.item_name} (${code})`,
  }));
}

function seedSalesRows(pathname: string): SalesRow[] {
  const code = getRouteCode(pathname, "SO");
  const year = new Date().getFullYear();
  return salesRows.map((row, i) => ({
    ...row,
    doc_no: `${code}-${year}-${String(i + 1).padStart(4, "0")}`,
    customer: `${row.customer} (${code})`,
  }));
}

function seedSalesCalendar(pathname: string) {
  const code = getRouteCode(pathname, "SO");
  return salesCalendarDays.map((d) => ({
    day: d.day,
    items: d.items.map((item) => `${item} (${code})`),
  }));
}

function seedPurchaseRows(pathname: string): PurchaseRow[] {
  const code = getRouteCode(pathname, "PO");
  const year = new Date().getFullYear();
  return purchaseRows.map((row, i) => ({
    ...row,
    doc_no: `${code}-${year}-${String(i + 1).padStart(4, "0")}`,
    supplier: `${row.supplier} (${code})`,
  }));
}

function seedPurchaseCalendar(pathname: string) {
  const code = getRouteCode(pathname, "PO");
  return purchaseCalendarDays.map((d) => ({
    day: d.day,
    items: d.items.map((item) => `${item} (${code})`),
  }));
}

function seedAccountingRows(pathname: string): AccountingRow[] {
  const code = getRouteCode(pathname, "ACC");
  const year = new Date().getFullYear();
  return accountingRows.map((row, i) => ({
    ...row,
    doc_no: `${code}-${year}-${String(i + 1).padStart(4, "0")}`,
    description: `${row.description} (${code})`,
  }));
}

function seedCostingRows(pathname: string): CostingRow[] {
  const code = getRouteCode(pathname, "CST");
  return costingRows.map((row, i) => ({
    ...row,
    item_code: `${code}-${String(i + 1).padStart(3, "0")}`,
    item_name: `${row.item_name} (${code})`,
  }));
}

function seedManufacturingRows(pathname: string): ManufacturingRow[] {
  const code = getRouteCode(pathname, "MFG");
  const year = new Date().getFullYear();
  return manufacturingJobOrders.map((row, i) => ({
    ...row,
    doc_no: `${code}-${year}-${String(i + 1).padStart(4, "0")}`,
    product: `${row.product} (${code})`,
  }));
}

function seedManufacturingCalendar(pathname: string) {
  const code = getRouteCode(pathname, "MFG");
  return manufacturingCalendarDays.map((d) => ({
    day: d.day,
    items: d.items.map((item) => `${item} (${code})`),
  }));
}

export const mockApi = {
  async getMasterData() {
    await delay(60);
    return masterState;
  },
  async createMasterData(type: MasterType, row: Record<string, unknown>) {
    await delay(80);
    const collection = getMasterCollection(type) as Record<string, unknown>[];
    const idKey = masterIdKeys[type];
    const idValue = String(row[idKey] ?? "");
    if (!idValue) return false;
    const exists = collection.some((item) => String(item[idKey]) === idValue);
    if (exists) return false;
    collection.unshift(row);
    return true;
  },
  async updateMasterData(type: MasterType, idValue: string, patch: Record<string, unknown>) {
    await delay(80);
    const collection = getMasterCollection(type) as Record<string, unknown>[];
    const idKey = masterIdKeys[type];
    return upsertById(collection, idKey as keyof Record<string, unknown>, idValue, patch);
  },
  async getDashboard() {
    await delay(120);
    return {
      summaryCards: dashboardSummaryCards,
      monthlySales: dashboardMonthlySales,
      recentOrders: dashboardRecentOrders,
    };
  },
  async getInventory(pathname?: string) {
    await delay(120);
    const path = normalizePath(pathname, inventoryRoutes, DEFAULT_PATHS.inventory);
    const rows = ensurePathRows(state.inventoryByPath, path, seedInventoryRows);
    return [...rows];
  },
  async createInventory(pathname: string, row: InventoryRow) {
    await delay(80);
    const path = normalizePath(pathname, inventoryRoutes, DEFAULT_PATHS.inventory);
    const rows = ensurePathRows(state.inventoryByPath, path, seedInventoryRows);
    state.inventoryByPath[path] = [row, ...rows];
    return row;
  },
  async updateInventory(pathname: string, docNo: string, patch: Partial<InventoryRow>) {
    await delay(80);
    const path = normalizePath(pathname, inventoryRoutes, DEFAULT_PATHS.inventory);
    const rows = ensurePathRows(state.inventoryByPath, path, seedInventoryRows);
    return upsertById(rows, "doc_no", docNo, patch);
  },
  async deleteInventory(pathname: string, docNos: string[]) {
    await delay(80);
    const path = normalizePath(pathname, inventoryRoutes, DEFAULT_PATHS.inventory);
    const rows = ensurePathRows(state.inventoryByPath, path, seedInventoryRows);
    const deleted = getDeletedRows(rows, "doc_no", docNos);
    if (deleted.length) ensureHistory(softDeleteHistory.inventoryByPath, path).push(deleted);
    state.inventoryByPath[path] = removeByIds(rows, "doc_no", docNos);
    return true;
  },
  async undoDeleteInventory(pathname: string) {
    await delay(80);
    const path = normalizePath(pathname, inventoryRoutes, DEFAULT_PATHS.inventory);
    const latest = ensureHistory(softDeleteHistory.inventoryByPath, path).pop();
    if (!latest?.length) return false;
    const rows = ensurePathRows(state.inventoryByPath, path, seedInventoryRows);
    state.inventoryByPath[path] = [...latest, ...rows];
    return true;
  },
  async getSales(pathname?: string) {
    await delay(120);
    const path = normalizePath(pathname, salesRoutes, DEFAULT_PATHS.sales);
    const rows = ensurePathRows(state.salesByPath, path, seedSalesRows);
    const calendarDays = ensurePathRows(state.salesCalendarByPath, path, seedSalesCalendar);
    return { rows: [...rows], calendarDays: [...calendarDays] };
  },
  async createSales(pathname: string, row: SalesRow) {
    await delay(80);
    const path = normalizePath(pathname, salesRoutes, DEFAULT_PATHS.sales);
    const rows = ensurePathRows(state.salesByPath, path, seedSalesRows);
    state.salesByPath[path] = [row, ...rows];
    return row;
  },
  async updateSales(pathname: string, docNo: string, patch: Partial<SalesRow>) {
    await delay(80);
    const path = normalizePath(pathname, salesRoutes, DEFAULT_PATHS.sales);
    const rows = ensurePathRows(state.salesByPath, path, seedSalesRows);
    return upsertById(rows, "doc_no", docNo, patch);
  },
  async deleteSales(pathname: string, docNos: string[]) {
    await delay(80);
    const path = normalizePath(pathname, salesRoutes, DEFAULT_PATHS.sales);
    const rows = ensurePathRows(state.salesByPath, path, seedSalesRows);
    const deleted = getDeletedRows(rows, "doc_no", docNos);
    if (deleted.length) ensureHistory(softDeleteHistory.salesByPath, path).push(deleted);
    state.salesByPath[path] = removeByIds(rows, "doc_no", docNos);
    return true;
  },
  async undoDeleteSales(pathname: string) {
    await delay(80);
    const path = normalizePath(pathname, salesRoutes, DEFAULT_PATHS.sales);
    const latest = ensureHistory(softDeleteHistory.salesByPath, path).pop();
    if (!latest?.length) return false;
    const rows = ensurePathRows(state.salesByPath, path, seedSalesRows);
    state.salesByPath[path] = [...latest, ...rows];
    return true;
  },
  async getPurchase(pathname?: string) {
    await delay(120);
    const path = normalizePath(pathname, purchaseRoutes, DEFAULT_PATHS.purchase);
    const rows = ensurePathRows(state.purchaseByPath, path, seedPurchaseRows);
    const calendarDays = ensurePathRows(state.purchaseCalendarByPath, path, seedPurchaseCalendar);
    return { rows: [...rows], calendarDays: [...calendarDays] };
  },
  async createPurchase(pathname: string, row: PurchaseRow) {
    await delay(80);
    const path = normalizePath(pathname, purchaseRoutes, DEFAULT_PATHS.purchase);
    const rows = ensurePathRows(state.purchaseByPath, path, seedPurchaseRows);
    state.purchaseByPath[path] = [row, ...rows];
    return row;
  },
  async updatePurchase(pathname: string, docNo: string, patch: Partial<PurchaseRow>) {
    await delay(80);
    const path = normalizePath(pathname, purchaseRoutes, DEFAULT_PATHS.purchase);
    const rows = ensurePathRows(state.purchaseByPath, path, seedPurchaseRows);
    return upsertById(rows, "doc_no", docNo, patch);
  },
  async deletePurchase(pathname: string, docNos: string[]) {
    await delay(80);
    const path = normalizePath(pathname, purchaseRoutes, DEFAULT_PATHS.purchase);
    const rows = ensurePathRows(state.purchaseByPath, path, seedPurchaseRows);
    const deleted = getDeletedRows(rows, "doc_no", docNos);
    if (deleted.length) ensureHistory(softDeleteHistory.purchaseByPath, path).push(deleted);
    state.purchaseByPath[path] = removeByIds(rows, "doc_no", docNos);
    return true;
  },
  async undoDeletePurchase(pathname: string) {
    await delay(80);
    const path = normalizePath(pathname, purchaseRoutes, DEFAULT_PATHS.purchase);
    const latest = ensureHistory(softDeleteHistory.purchaseByPath, path).pop();
    if (!latest?.length) return false;
    const rows = ensurePathRows(state.purchaseByPath, path, seedPurchaseRows);
    state.purchaseByPath[path] = [...latest, ...rows];
    return true;
  },
  async getAccounting(pathname?: string) {
    await delay(120);
    const path = normalizePath(pathname, accountingRoutes, DEFAULT_PATHS.accounting);
    const rows = ensurePathRows(state.accountingByPath, path, seedAccountingRows);
    return [...rows];
  },
  async createAccounting(pathname: string, row: AccountingRow) {
    await delay(80);
    const path = normalizePath(pathname, accountingRoutes, DEFAULT_PATHS.accounting);
    const rows = ensurePathRows(state.accountingByPath, path, seedAccountingRows);
    state.accountingByPath[path] = [row, ...rows];
    return row;
  },
  async updateAccounting(pathname: string, docNo: string, patch: Partial<AccountingRow>) {
    await delay(80);
    const path = normalizePath(pathname, accountingRoutes, DEFAULT_PATHS.accounting);
    const rows = ensurePathRows(state.accountingByPath, path, seedAccountingRows);
    return upsertById(rows, "doc_no", docNo, patch);
  },
  async deleteAccounting(pathname: string, docNos: string[]) {
    await delay(80);
    const path = normalizePath(pathname, accountingRoutes, DEFAULT_PATHS.accounting);
    const rows = ensurePathRows(state.accountingByPath, path, seedAccountingRows);
    const deleted = getDeletedRows(rows, "doc_no", docNos);
    if (deleted.length) ensureHistory(softDeleteHistory.accountingByPath, path).push(deleted);
    state.accountingByPath[path] = removeByIds(rows, "doc_no", docNos);
    return true;
  },
  async undoDeleteAccounting(pathname: string) {
    await delay(80);
    const path = normalizePath(pathname, accountingRoutes, DEFAULT_PATHS.accounting);
    const latest = ensureHistory(softDeleteHistory.accountingByPath, path).pop();
    if (!latest?.length) return false;
    const rows = ensurePathRows(state.accountingByPath, path, seedAccountingRows);
    state.accountingByPath[path] = [...latest, ...rows];
    return true;
  },
  async getCosting(pathname?: string) {
    await delay(120);
    const path = normalizePath(pathname, costingRoutes, DEFAULT_PATHS.costing);
    const rows = ensurePathRows(state.costingByPath, path, seedCostingRows);
    return { rows: [...rows], summary: costingSummary };
  },
  async createCosting(pathname: string, row: CostingRow) {
    await delay(80);
    const path = normalizePath(pathname, costingRoutes, DEFAULT_PATHS.costing);
    const rows = ensurePathRows(state.costingByPath, path, seedCostingRows);
    state.costingByPath[path] = [row, ...rows];
    return row;
  },
  async updateCosting(pathname: string, itemCode: string, patch: Partial<CostingRow>) {
    await delay(80);
    const path = normalizePath(pathname, costingRoutes, DEFAULT_PATHS.costing);
    const rows = ensurePathRows(state.costingByPath, path, seedCostingRows);
    return upsertById(rows, "item_code", itemCode, patch);
  },
  async deleteCosting(pathname: string, itemCodes: string[]) {
    await delay(80);
    const path = normalizePath(pathname, costingRoutes, DEFAULT_PATHS.costing);
    const rows = ensurePathRows(state.costingByPath, path, seedCostingRows);
    const deleted = getDeletedRows(rows, "item_code", itemCodes);
    if (deleted.length) ensureHistory(softDeleteHistory.costingByPath, path).push(deleted);
    state.costingByPath[path] = removeByIds(rows, "item_code", itemCodes);
    return true;
  },
  async undoDeleteCosting(pathname: string) {
    await delay(80);
    const path = normalizePath(pathname, costingRoutes, DEFAULT_PATHS.costing);
    const latest = ensureHistory(softDeleteHistory.costingByPath, path).pop();
    if (!latest?.length) return false;
    const rows = ensurePathRows(state.costingByPath, path, seedCostingRows);
    state.costingByPath[path] = [...latest, ...rows];
    return true;
  },
  async getManufacturing(pathname?: string) {
    await delay(120);
    const path = normalizePath(pathname, manufacturingRoutes, DEFAULT_PATHS.manufacturing);
    const rows = ensurePathRows(state.manufacturingByPath, path, seedManufacturingRows);
    const calendarDays = ensurePathRows(state.manufacturingCalendarByPath, path, seedManufacturingCalendar);
    return {
      rows: [...rows],
      monitoring: manufacturingMonitoringSummary,
      calendarDays: [...calendarDays],
    };
  },
  async createManufacturing(pathname: string, row: ManufacturingRow) {
    await delay(80);
    const path = normalizePath(pathname, manufacturingRoutes, DEFAULT_PATHS.manufacturing);
    const rows = ensurePathRows(state.manufacturingByPath, path, seedManufacturingRows);
    state.manufacturingByPath[path] = [row, ...rows];
    return row;
  },
  async updateManufacturing(pathname: string, docNo: string, patch: Partial<ManufacturingRow>) {
    await delay(80);
    const path = normalizePath(pathname, manufacturingRoutes, DEFAULT_PATHS.manufacturing);
    const rows = ensurePathRows(state.manufacturingByPath, path, seedManufacturingRows);
    return upsertById(rows, "doc_no", docNo, patch);
  },
  async deleteManufacturing(pathname: string, docNos: string[]) {
    await delay(80);
    const path = normalizePath(pathname, manufacturingRoutes, DEFAULT_PATHS.manufacturing);
    const rows = ensurePathRows(state.manufacturingByPath, path, seedManufacturingRows);
    const deleted = getDeletedRows(rows, "doc_no", docNos);
    if (deleted.length) ensureHistory(softDeleteHistory.manufacturingByPath, path).push(deleted);
    state.manufacturingByPath[path] = removeByIds(rows, "doc_no", docNos);
    return true;
  },
  async undoDeleteManufacturing(pathname: string) {
    await delay(80);
    const path = normalizePath(pathname, manufacturingRoutes, DEFAULT_PATHS.manufacturing);
    const latest = ensureHistory(softDeleteHistory.manufacturingByPath, path).pop();
    if (!latest?.length) return false;
    const rows = ensurePathRows(state.manufacturingByPath, path, seedManufacturingRows);
    state.manufacturingByPath[path] = [...latest, ...rows];
    return true;
  },
};
