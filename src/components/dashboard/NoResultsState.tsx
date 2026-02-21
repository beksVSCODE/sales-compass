import { Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoResultsStateProps {
  onReset?: () => void;
  title?: string;
  description?: string;
}

export function NoResultsState({ 
  onReset, 
  title = 'Нет результатов',
  description = 'По вашим текущим фильтрам не найдено продуктов. Попробуйте изменить параметры фильтра или сбросить фильтры.'
}: NoResultsStateProps) {
  return (
    <div className="rounded-lg border border-border bg-gradient-to-br from-card to-secondary/20 p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-secondary/40 rounded-full blur-xl" />
          <div className="relative bg-gradient-to-br from-secondary to-secondary/60 rounded-full p-6">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        {onReset && (
          <Button 
            variant="outline" 
            onClick={onReset}
            className="font-semibold gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Сбросить фильтры
          </Button>
        )}
      </div>
    </div>
  );
}
