/**
 * Система управления предустановленными фильтрами
 * Админ может создавать, редактировать и удалять фильтры для всех пользователей
 */

export interface FilterPreset {
    id: string;
    name: string;
    description?: string;
    filters: {
        period: string;
        categories: string[];
        regions: string[];
        clientTypes: string[];
    };
    createdBy: string;
    createdAt: Date;
    isPublic: boolean; // Доступен всем пользователям
    targetRoles?: ('admin' | 'manager')[]; // Если пусто - для всех
}

// Хранилище фильтров (в памяти для MVP)
const FILTERS_KEY = 'sales_compass_filter_presets';

let filterPresets: FilterPreset[] = [
    {
        id: 'preset-1',
        name: 'Месячная выручка B2B',
        description: 'Выручка за месяц по B2B клиентам',
        filters: {
            period: 'month',
            categories: [],
            regions: [],
            clientTypes: ['B2B'],
        },
        createdBy: 'admin@example.com',
        createdAt: new Date('2026-02-01'),
        isPublic: true,
    },
    {
        id: 'preset-2',
        name: 'Все регионы',
        description: 'Полный обзор всех регионов',
        filters: {
            period: 'month',
            categories: [],
            regions: [],
            clientTypes: [],
        },
        createdBy: 'admin@example.com',
        createdAt: new Date('2026-02-01'),
        isPublic: true,
    },
    {
        id: 'preset-3',
        name: 'CRM категория',
        description: 'Только продукты CRM-системы',
        filters: {
            period: 'month',
            categories: ['CRM-системы'],
            regions: [],
            clientTypes: [],
        },
        createdBy: 'admin@example.com',
        createdAt: new Date('2026-02-01'),
        isPublic: true,
    },
];

export class FilterPresetsManager {
    /**
     * Загрузить все фильтры
     */
    static getAll(): FilterPreset[] {
        const stored = localStorage.getItem(FILTERS_KEY);
        if (stored) {
            try {
                const presets: FilterPreset[] = JSON.parse(stored);
                return presets.map((p: FilterPreset) => ({
                    ...p,
                    createdAt: new Date(p.createdAt),
                }));
            } catch (e) {
                console.error('Error loading filter presets:', e);
                return filterPresets;
            }
        }
        return filterPresets;
    }

    /**
     * Получить все публичные фильтры
     */
    static getPublic(): FilterPreset[] {
        return this.getAll().filter(f => f.isPublic);
    }

    /**
     * Получить фильтр по ID
     */
    static getById(id: string): FilterPreset | undefined {
        return this.getAll().find(f => f.id === id);
    }

    /**
     * Создать новый фильтр
     */
    static create(
        name: string,
        filters: FilterPreset['filters'],
        createdBy: string,
        description?: string,
        isPublic = true,
        targetRoles?: ('admin' | 'manager')[]
    ): FilterPreset {
        const preset: FilterPreset = {
            id: `preset-${Date.now()}`,
            name,
            description,
            filters,
            createdBy,
            createdAt: new Date(),
            isPublic,
            targetRoles,
        };

        const all = this.getAll();
        all.push(preset);
        this.save(all);
        return preset;
    }

    /**
     * Обновить фильтр
     */
    static update(
        id: string,
        updates: Partial<Omit<FilterPreset, 'id' | 'createdBy' | 'createdAt'>>
    ): FilterPreset | null {
        const all = this.getAll();
        const index = all.findIndex(f => f.id === id);

        if (index === -1) return null;

        const updated = {
            ...all[index],
            ...updates,
        };

        all[index] = updated;
        this.save(all);
        return updated;
    }

    /**
     * Удалить фильтр
     */
    static delete(id: string): boolean {
        const all = this.getAll();
        const filtered = all.filter(f => f.id !== id);

        if (filtered.length === all.length) return false; // Не найден

        this.save(filtered);
        return true;
    }

    /**
     * Сохранить в localStorage
     */
    private static save(presets: FilterPreset[]): void {
        localStorage.setItem(FILTERS_KEY, JSON.stringify(presets));
    }

    /**
     * Сбросить на значения по умолчанию
     */
    static reset(): void {
        localStorage.removeItem(FILTERS_KEY);
        filterPresets = [
            {
                id: 'preset-1',
                name: 'Месячная выручка B2B',
                description: 'Выручка за месяц по B2B клиентам',
                filters: {
                    period: 'month',
                    categories: [],
                    regions: [],
                    clientTypes: ['B2B'],
                },
                createdBy: 'admin@example.com',
                createdAt: new Date('2026-02-01'),
                isPublic: true,
            },
            {
                id: 'preset-2',
                name: 'Все регионы',
                description: 'Полный обзор всех регионов',
                filters: {
                    period: 'month',
                    categories: [],
                    regions: [],
                    clientTypes: [],
                },
                createdBy: 'admin@example.com',
                createdAt: new Date('2026-02-01'),
                isPublic: true,
            },
            {
                id: 'preset-3',
                name: 'CRM категория',
                description: 'Только продукты CRM-системы',
                filters: {
                    period: 'month',
                    categories: ['CRM-системы'],
                    regions: [],
                    clientTypes: [],
                },
                createdBy: 'admin@example.com',
                createdAt: new Date('2026-02-01'),
                isPublic: true,
            },
        ];
    }
}
