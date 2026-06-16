import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function escapeCSV(value: string) {
  if (value.includes(';') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function escapeHTML(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function exportToCSV(filename: string, headers: string[], rows: string[][]) {
  const delimiter = ';';
  const csvContent = [
    headers.map(escapeCSV).join(delimiter),
    ...rows.map(row => row.map(escapeCSV).join(delimiter)),
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToExcel(filename: string, headers: string[], rows: string[][]) {
  const headerRow = `<tr>${headers.map(h => `<th style="background:#D4AF37;color:#1A1A2E;font-weight:700;padding:8px 12px;text-align:left;font-size:11px;font-family:Inter,sans-serif;border:1px solid #B8962E;">${escapeHTML(h)}</th>`).join('')}</tr>`;
  const dataRows = rows.map(row =>
    `<tr>${row.map((cell, i) => {
      const isTotal = i === 0 && cell === 'TOTAL' || row[2] === 'TOTAL';
      const cellStyle = isTotal
        ? 'background:#F5F5F5;font-weight:700;'
        : (i % 2 === 0 ? 'background:#FAFAFA;' : '');
      return `<td style="${cellStyle}padding:6px 12px;text-align:${i === 0 ? 'left' : 'right'};font-size:11px;font-family:'JetBrains Mono',monospace;border:1px solid #E0E0E0;">${escapeHTML(cell)}</td>`;
    }).join('')}</tr>`
  ).join('\n');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<table style="border-collapse:collapse;width:100%;font-family:Inter,sans-serif;">
${headerRow}
${dataRows}
</table>
</body>
</html>`;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
