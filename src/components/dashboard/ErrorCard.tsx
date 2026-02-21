import { AlertCircle } from 'lucide-react';

interface ErrorCardProps {
  title?: string;
  message?: string;
}

export function ErrorCard({ title = 'Ошибка', message = 'Не удалось загрузить данные' }: ErrorCardProps) {
  return (
    <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">{title}</h3>
          <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
        </div>
      </div>
    </div>
  );
}
