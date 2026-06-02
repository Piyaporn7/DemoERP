import * as XLSX from "xlsx";

export interface ExcelColumn {
  key: string;
  label: string;
}

function buildFileName(title: string, ext: string) {
  const safe = title
    .replace(/[^a-zA-Z0-9-_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
  const date = new Date().toISOString().slice(0, 10);
  return `${safe || "export"}-${date}.${ext}`;
}

export function exportRowsToExcel(title: string, columns: ExcelColumn[], rows: Array<Record<string, unknown>>) {
  if (!rows.length) return false;

  const header = columns.map((col) => col.label);
  const body = rows.map((row) => columns.map((col) => row[col.key]));
  const sheet = XLSX.utils.aoa_to_sheet([header, ...body]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
  XLSX.writeFile(workbook, buildFileName(title, "xlsx"));
  return true;
}
