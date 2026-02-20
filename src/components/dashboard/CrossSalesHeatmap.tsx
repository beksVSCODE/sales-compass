import { type CrossSale } from '@/data/mockData';
import { useMemo, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CrossSalesHeatmapProps {
  crossSales: CrossSale[];
  productNames: string[];
}

export function CrossSalesHeatmap({ crossSales, productNames }: CrossSalesHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const matrix = useMemo(() => {
    const map: Record<string, number> = {};
    let maxCount = 0;
    crossSales.forEach((cs) => {
      const key1 = `${cs.product1}|${cs.product2}`;
      const key2 = `${cs.product2}|${cs.product1}`;
      map[key1] = cs.count;
      map[key2] = cs.count;
      if (cs.count > maxCount) maxCount = cs.count;
    });
    return { map, maxCount };
  }, [crossSales]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-secondary';
    const intensity = count / matrix.maxCount;
    if (intensity > 0.7) return 'bg-primary';
    if (intensity > 0.4) return 'bg-primary/60';
    return 'bg-primary/30';
  };

  const shortName = (name: string) => name.length > 10 ? name.slice(0, 10) + '…' : name;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Кросс-продажи</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-24" />
              {productNames.map((name) => (
                <th key={name} className="text-[10px] text-muted-foreground font-medium p-1 text-center" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', height: 80 }}>
                  {shortName(name)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productNames.map((row) => (
              <tr key={row}>
                <td className="text-[10px] text-muted-foreground font-medium pr-2 text-right whitespace-nowrap">{shortName(row)}</td>
                {productNames.map((col) => {
                  const key = `${row}|${col}`;
                  const count = matrix.map[key] || 0;
                  const isHovered = hoveredCell === key;
                  const isSame = row === col;
                  return (
                    <td key={col} className="p-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-8 h-8 rounded-sm flex items-center justify-center text-[9px] font-mono transition-all cursor-default ${
                              isSame ? 'bg-muted' : getColor(count)
                            } ${isHovered ? 'ring-2 ring-primary scale-110' : ''} ${count > 0 && !isSame ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                            onMouseEnter={() => setHoveredCell(key)}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            {isSame ? '—' : count || ''}
                          </div>
                        </TooltipTrigger>
                        {!isSame && count > 0 && (
                          <TooltipContent>
                            <p className="text-xs">{row} + {col}: <span className="font-semibold">{count} сделок</span></p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
