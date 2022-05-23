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

import { createMuiTheme } from '@material-ui/core'

const palette = {
    primary: {
        main: '#434B64',
    },
    secondary: {
        main: '#4DB6AC'
    }
}

export const theme = createMuiTheme({
    palette
})

// Color schema for chart fills.
export const greenRedColorScheme = ['#CD5C5C', '#FF6347', '#32CD32', '#F5F5F5']

export const seriesColorSchema = [
    '#6600ff',
    '#9966ff',
    '#cc66ff',
    '#ff99ff',
    '#ff99cc',
    '#ff9999',
    '#ff9966',
    '#ff9933',
    '#cc6600',
    '#cc3300',
    '#9900ff',
    '#cc00ff',
    '#ff00ff',
    '#ff33cc',
    '#ff3399',
    '#ff0066',
    '#ff5050',
    '#ff0000',
    '#990000',
    '#6600cc',
    '#9933ff',
    '#cc33ff',
    '#ff66ff',
    '#ff66cc',
    '#ff6699',
    '#ff6666',
    '#ff6600',
    '#ff3300',
    '#993300',
    '#9900cc',
    '#cc00cc',
    '#cc0099',
    '#cc3399',
    '#cc6699',
    '#cc0066',
    '#cc0000',
    '#800000',
    '#660066',
    '#993399',
    '#990099',
    '#993366',
    '#660033',
    '#660033',
    '#990033',
    '#993333'
]
