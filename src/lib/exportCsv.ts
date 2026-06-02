export interface CsvColumn {
  key: string;
  label: string;
}

function escapeCsv(value: unknown): string {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function buildFileName(title: string, ext: string) {
  const safe = title
    .replace(/[^a-zA-Z0-9-_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
  const date = new Date().toISOString().slice(0, 10);
  return `${safe || "export"}-${date}.${ext}`;
}

export function exportRowsToCsv(title: string, columns: CsvColumn[], rows: Array<Record<string, unknown>>) {
  if (!rows.length) return false;

  const header = columns.map((col) => escapeCsv(col.label)).join(",");
  const body = rows
    .map((row) => columns.map((col) => escapeCsv(row[col.key])).join(","))
    .join("\n");
  const csv = `\ufeff${header}\r\n${body.replace(/\n/g, "\r\n")}`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = buildFileName(title, "csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return true;
}
