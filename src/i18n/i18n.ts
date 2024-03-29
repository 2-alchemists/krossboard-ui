/*
  Copyright (C) 2020  2ALCHEMISTS SAS.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*/

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
