import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onHome?: () => void;
  showButtons?: boolean;
}

export function ErrorState({
  title = 'Ошибка загрузки данных',
  description = 'Не удалось загрузить данные. Пожалуйста, попробуйте еще раз или вернитесь на главную страницу.',
  onRetry,
  onHome,
  showButtons = true,
}: ErrorStateProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
            <div className="relative bg-gradient-to-br from-red-500 to-red-600 rounded-full p-6">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>

        {showButtons && (
          <div className="flex gap-3 justify-center flex-wrap">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="gap-2 font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                Попробовать снова
              </Button>
            )}
            {onHome && (
              <Button
                variant="outline"
                onClick={onHome}
                className="gap-2 font-semibold"
              >
                <Home className="w-4 h-4" />
                На главную
              </Button>
            )}
          </div>
        )}

        <div className="mt-8 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
          <p className="text-xs text-red-600 dark:text-red-400">
            Если проблема persists, пожалуйста, свяжитесь с администратором системы.
          </p>
        </div>
      </div>
    </div>
  );
}
