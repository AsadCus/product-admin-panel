import { en, type TranslationKey } from './en';
import { id } from './id';
import type { Language } from '@/hooks/use-language';

const translations = {
    en,
    id,
};

export function t(key: TranslationKey, lang?: Language): string {
    const language = lang || (localStorage.getItem('language') as Language) || 'en';
    return translations[language][key] || key;
}

export function useTranslation() {
    const language = (localStorage.getItem('language') as Language) || 'en';
    
    return {
        t: (key: TranslationKey) => t(key, language),
        language,
    };
}
