export interface PdfColumn {
  key: string;
  label: string;
  alignRight?: boolean;
}

function escapeHtml(input: unknown): string {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function exportRowsToPdf(title: string, columns: PdfColumn[], rows: Array<Record<string, unknown>>) {
  if (!rows.length) {
    return false;
  }

  const win = window.open("", "_blank", "width=1000,height=700");
  if (!win) return false;

  const headerHtml = columns
    .map((col) => `<th${col.alignRight ? " class=\"right\"" : ""}>${escapeHtml(col.label)}</th>`)
    .join("");

  const rowHtml = rows
    .map(
      (row) => `<tr>${columns
        .map((col) => {
          const value = row[col.key];
          return `<td${col.alignRight ? " class=\"right\"" : ""}>${escapeHtml(value)}</td>`;
        })
        .join("")}</tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
      h1 { font-size: 20px; margin: 0 0 8px; }
      .meta { margin-bottom: 16px; font-size: 12px; color: #475569; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border: 1px solid #e2e8f0; padding: 8px; font-size: 12px; text-align: left; }
      th { background: #f8fafc; }
      .right { text-align: right; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <div class="meta">จำนวนรายการ: ${rows.length}</div>
    <table>
      <thead><tr>${headerHtml}</tr></thead>
      <tbody>${rowHtml}</tbody>
    </table>
  </body>
</html>`;

  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 100);
  return true;
}
