import { useCallback } from 'react';
import { toast } from 'sonner';

interface ExportRow {
  [key: string]: string | number;
}

/**
 * Хук для экспорта данных в Excel (XLSX) и PDF (jsPDF)
 */
export function useExport() {

  /** Экспорт в Excel через библиотеку xlsx */
  const exportToExcel = useCallback(async (data: ExportRow[], filename = 'export') => {
    try {
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Данные');
      XLSX.writeFile(wb, `${filename}.xlsx`);
      toast.success('Файл Excel загружен');
    } catch {
      toast.error('Ошибка при создании Excel файла');
    }
  }, []);

  /** Экспорт видимой области страницы в PDF */
  const exportToPdf = useCallback(async (elementId: string, filename = 'dashboard') => {
    try {
      toast.info('Генерирую PDF...');
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = document.getElementById(elementId);
      if (!element) {
        toast.error('Элемент для экспорта не найден');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * ratio, canvas.height * ratio);
      pdf.save(`${filename}.pdf`);
      toast.success('PDF загружен');
    } catch (e) {
      toast.error('Ошибка при создании PDF');
    }
  }, []);

  return { exportToExcel, exportToPdf };
}
