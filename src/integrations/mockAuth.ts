/**
 * Mock Authentication System
 * Используется для локального тестирования без подключения к Supabase
 */

export type AppRole = 'admin' | 'manager' | 'ceo';

export interface MockUser {
    id: string;
    email: string;
    full_name: string;
}

export interface MockProfile {
    id: string;
    user_id: string;
    email: string;
    full_name: string | null;
    region: string | null;
    category: string | null;
}

export interface MockSession {
    user: MockUser;
}

// Тестовые пользователи
export const mockUsers: Record<string, { password: string; profile: Omit<MockProfile, 'id'>; role: AppRole }> = {
    'ceo@example.com': {
        password: 'ceo123',
        profile: {
            user_id: 'ceo-001',
            email: 'ceo@example.com',
            full_name: 'Генеральный Директор',
            region: null,     // CEO видит все регионы
            category: null,   // CEO видит все категории
        },
        role: 'ceo',
    },
    'admin@example.com': {
        password: 'admin123',
        profile: {
            user_id: 'admin-001',
            email: 'admin@example.com',
            full_name: 'Администратор Системы',
            region: null, // Admin видит все
            category: null, // Admin видит все
        },
        role: 'admin',
    },
    'manager.bishkek@example.com': {
        password: 'manager123',
        profile: {
            user_id: 'manager-bishkek-001',
            email: 'manager.bishkek@example.com',
            full_name: 'Менеджер Бишкек',
            region: 'Бишкек',
            category: null,
        },
        role: 'manager',
    },
    'manager.osh@example.com': {
        password: 'manager123',
        profile: {
            user_id: 'manager-osh-001',
            email: 'manager.osh@example.com',
            full_name: 'Менеджер Ош',
            region: 'Ош',
            category: null,
        },
        role: 'manager',
    },
    'manager.crm@example.com': {
        password: 'manager123',
        profile: {
            user_id: 'manager-crm-001',
            email: 'manager.crm@example.com',
            full_name: 'Менеджер CRM',
            region: null,
            category: 'CRM-системы',
        },
        role: 'manager',
    },
};

// Хранилище для сессий (локальное)
const SESSION_KEY = 'sales_compass_session';

export class MockAuthClient {
    private session: MockSession | null = null;
    private currentRole: AppRole | null = null;

    constructor() {
        this.loadSession();
    }

    private loadSession() {
        const stored = localStorage.getItem(SESSION_KEY);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.session = data;
                // Восстанавливаем роль из mockUsers
                if (data?.user?.email) {
                    const user = mockUsers[data.user.email];
                    if (user) {
                        this.currentRole = user.role;
                    }
                }
            } catch (e) {
                localStorage.removeItem(SESSION_KEY);
            }
        }
    }

    private saveSession(session: MockSession | null) {
        if (session) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } else {
            localStorage.removeItem(SESSION_KEY);
        }
        this.session = session;
    }

    async signInWithPassword(email: string, password: string) {
        const user = mockUsers[email];

        if (!user || user.password !== password) {
            return {
                data: null,
                error: new Error('Invalid login credentials'),
            };
        }

        const mockUser: MockUser = {
            id: user.profile.user_id,
            email: email,
            full_name: user.profile.full_name || '',
        };

        const session: MockSession = { user: mockUser };
        this.saveSession(session);
        this.currentRole = user.role;

        return { data: { session }, error: null };
    }

    async signUp(email: string, password: string, options?: { data?: { full_name?: string } }) {
        // Проверяем, не зарегистрирован ли уже
        if (mockUsers[email]) {
            return {
                data: null,
                error: new Error('User already exists'),
            };
        }

        // Добавляем нового пользователя как менеджер
        const fullName = options?.data?.full_name || 'New User';
        const userId = `user-${Date.now()}`;

        mockUsers[email] = {
            password: password,
            profile: {
                user_id: userId,
                email: email,
                full_name: fullName,
                region: null,
                category: null,
            },
            role: 'manager',
        };

        const mockUser: MockUser = {
            id: userId,
            email: email,
            full_name: fullName,
        };

        const session: MockSession = { user: mockUser };
        this.saveSession(session);
        this.currentRole = 'manager';

        return { data: { user: mockUser }, error: null };
    }

    async signOut() {
        this.saveSession(null);
        this.currentRole = null;
        return { error: null };
    }

    getSession() {
        return { data: { session: this.session }, error: null };
    }

    onAuthStateChange(callback: (event: string, session: MockSession | null) => void) {
        // Имитируем инициальный вызов
        callback('INITIAL_SESSION', this.session);

        // Возвращаем функцию отписки
        return {
            data: { subscription: { unsubscribe: () => { } } },
        };
    }

    getCurrentRole(): AppRole | null {
        if (!this.session) return null;
        return this.currentRole || 'manager';
    }

    getCurrentProfile(): Omit<MockProfile, 'id'> | null {
        if (!this.session) return null;
        const user = mockUsers[this.session.user.email];
        return user ? user.profile : null;
    }
}

export const mockAuthClient = new MockAuthClient();
