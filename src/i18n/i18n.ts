import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import translations_en from './translations_en.json'

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false,
        detection: {
            order: ['querystring'],
            lookupQuerystring: 'lang'
        },
        fallbackLng: 'en',
        ns: ['translations'],
        defaultNS: 'translations',

        interpolation: {
            escapeValue: false // not needed for react as it escapes by default
        },
        react: {
            wait: true
        }
    })

i18n.addResourceBundle('en', 'translations', translations_en, true)

export default i18n
