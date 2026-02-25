import { createContext, useContext, useState, ReactNode } from 'react';

export type PeriodValue = 'month' | 'quarter' | 'year' | 'custom';

export interface GlobalFilters {
  period: PeriodValue;
  product: string;         // '' = все
  clientType: string;      // '' = все
  region: string;          // '' = все
  department: string;      // '' = все, 'sales' | 'marketing' | 'dev'
  dateFrom: string | null;
  dateTo: string | null;
}

interface FiltersContextType {
  filters: GlobalFilters;
  setFilters: (f: GlobalFilters) => void;
  resetFilters: () => void;
}

const defaultFilters: GlobalFilters = {
  period: 'month',
  product: '',
  clientType: '',
  region: '',
  department: '',
  dateFrom: null,
  dateTo: null,
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<GlobalFilters>(defaultFilters);

  const resetFilters = () => setFilters(defaultFilters);

  return (
    <FiltersContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters(): FiltersContextType {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters must be used within FiltersProvider');
  return ctx;
}
