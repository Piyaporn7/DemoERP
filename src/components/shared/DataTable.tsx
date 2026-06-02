import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  selectable?: boolean;
  selectedRowIds?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
  getRowId?: (row: any, index: number) => string;
  selectionActions?: React.ReactNode;
}

export function DataTable({
  columns,
  data,
  onRowClick,
  selectable = false,
  selectedRowIds,
  onSelectionChange,
  getRowId,
  selectionActions,
}: DataTableProps) {
  const resolveRowId = (row: any, index: number) => (getRowId ? getRowId(row, index) : String(index));
  const allRowIds = data.map(resolveRowId);
  const selected = selectedRowIds ?? new Set<string>();
  const allSelected = allRowIds.length > 0 && allRowIds.every((id) => selected.has(id));
  const someSelected = allRowIds.some((id) => selected.has(id));

  const toggleAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? new Set(allRowIds) : new Set());
  };

  const toggleRow = (rowId: string, checked: boolean) => {
    if (!onSelectionChange) return;
    const next = new Set(selected);
    if (checked) next.add(rowId);
    else next.delete(rowId);
    onSelectionChange(next);
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {selectable && (
              <TableHead className="w-28">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={(value) => toggleAll(Boolean(value))}
                  />
                  {selectionActions}
                </div>
              </TableHead>
            )}
            {columns.map(col => (
              <TableHead key={col.key} className={col.className}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            (() => {
              const rowId = resolveRowId(row, i);
              return (
            <TableRow
              key={i}
              className={onRowClick ? "cursor-pointer hover:bg-muted/30" : ""}
              onClick={() => onRowClick?.(row)}
            >
              {selectable && (
                <TableCell className="text-center">
                  <Checkbox
                    checked={selected.has(rowId)}
                    onCheckedChange={(value) => toggleRow(rowId, Boolean(value))}
                    onClick={(event) => event.stopPropagation()}
                  />
                </TableCell>
              )}
              {columns.map(col => (
                <TableCell key={col.key} className={col.className}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
              );
            })()
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
