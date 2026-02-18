import { useCallback, useSyncExternalStore } from 'react';

export type Language = 'en' | 'id';

export type UseLanguageReturn = {
    readonly language: Language;
    readonly updateLanguage: (lang: Language) => void;
};

const listeners = new Set<() => void>();
let currentLanguage: Language = 'en';

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') return;
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredLanguage = (): Language => {
    if (typeof window === 'undefined') return 'en';

    return (localStorage.getItem('language') as Language) || 'en';
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

export function initializeLanguage(): void {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem('language')) {
        localStorage.setItem('language', 'en');
        setCookie('language', 'en');
    }

    currentLanguage = getStoredLanguage();
}

export function useLanguage(): UseLanguageReturn {
    const language: Language = useSyncExternalStore(
        subscribe,
        () => currentLanguage,
        () => 'en',
    );

    const updateLanguage = useCallback((lang: Language): void => {
        currentLanguage = lang;

        // Store in localStorage for client-side persistence
        localStorage.setItem('language', lang);

        // Store in cookie for SSR
        setCookie('language', lang);

        // Reload page to apply language changes
        window.location.reload();
    }, []);

    return { language, updateLanguage } as const;
}
