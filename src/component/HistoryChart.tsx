/*
Copyright (c) 2020 2Alchemists SAS.

This file is part of Krossboard.

Krossboard is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3
of the License, or (at your option) any later version.

Krossboard is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Krossboard.
If not, see <https://www.gnu.org/licenses/>.
*/

import { format } from 'date-fns'
import { TFunction } from 'i18next'
import { useObserver } from 'mobx-react-lite'
import * as React from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useTranslation } from 'react-i18next'

import { Card, CardContent, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { IUsageHistoryItem } from '../store/model'
import { seriesColorSchema } from '../theme'

export type Type = 'cpu' | 'mem'
export type Period = 'hourly' | 'monthly'

export interface IHistoryChartProps {
    type: Type
    period: Period
    data: IUsageHistoryItem[]
}

const useStyles = makeStyles(theme => ({
    name: {
        fontSize: 14
    },
    divider: {
        marginBottom: '7px'
    },
    label: {
        fill: theme.palette.text.secondary
    }
}))

const typeLabel = (type: Type): string => {
    switch (type) {
        case 'cpu':
            return 'CPU'
        case 'mem':
            return 'Memory'
    }
}

const periodLabel = (period: Period): string => {
    switch (period) {
        case 'hourly':
            return 'Cumulative usage ratio'
        case 'monthly':
            return 'Cumulative usage ratio'
    }
}

const periodTitle = (period: Period): string => {
    switch (period) {
        case 'hourly':
            return 'Hourly'
        case 'monthly':
            return 'Monthly'
    }
}

const dateFormat = (t: TFunction, period: Period): string => {
    switch(period) {
        case 'hourly':
            return t('format.day-hour')
        case 'monthly':
            return t('format.month-year')
    }
}

const title = (type: Type, period: Period): string => {
    return `${periodTitle(period)} ${typeLabel(type)} usage`
}

const label = (type: Type, period: Period): string => {
    return `${periodLabel(period)}`
}

export const HistoryChart: React.FC<IHistoryChartProps> = ({ type, data, period }) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const names = Array.from(new Set(data.flatMap(it => Object.keys(it)).filter(it => it !== 'tag')).values()).sort()

    return useObserver(() => (
        <Card>
            <CardContent>
                <Typography className={classes.name} color="textSecondary" gutterBottom>
                    {title(type, period)}
                </Typography>
                <Divider className={classes.divider} />
                <ResponsiveContainer width="100%" height={300}>
                    {period === 'hourly' ? (
                    <AreaChart
                        height={400}
                        data={data}
                        margin={{
                            top: 5,
                            right: 0,
                            left: 10,
                            bottom: 0
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <Legend verticalAlign="bottom" height={26} />
                        <XAxis dataKey="tag" tickFormatter={(tick: number) => format(tick as number, dateFormat(t, period))} />
                        <YAxis>
                            <Label className={classes.label} value={label(type,period)} angle={-90} position="insideBottomLeft" />
                        </YAxis>
                        <Tooltip labelFormatter={(tick: number | string) => <p>{format(tick as number, dateFormat(t, period))}</p>} />
                        {names.map((name, idx) => (
                            <Area
                                key={name}
                                type="monotone"
                                dataKey={name}
                                stackId="1"
                                stroke={seriesColorSchema[idx % seriesColorSchema.length]}
                                fill={seriesColorSchema[idx % seriesColorSchema.length]}
                            />
                        ))}
                    </AreaChart>) : (
                        <BarChart
                            height={400}
                            data={data}
                            margin={{
                                top: 5,
                                right: 0,
                                left: 10,
                                bottom: 0
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <Legend verticalAlign="bottom" height={26} />
                            <XAxis dataKey="tag" tickFormatter={(tick: number) => format(tick as number, dateFormat(t, period))} />
                            <YAxis>
                            <Label className={classes.label} value={label(type,period)} angle={-90} position="insideBottomLeft" />
                              </YAxis>
                            <Tooltip labelFormatter={(tick: number | string) => <p>{format(tick as number, dateFormat(t, period))}</p>} />
                            {names.map((name, idx) => (
                                <Bar key={name} dataKey={name} stackId="1" fill={seriesColorSchema[idx % seriesColorSchema.length]} />
                            ))}
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    ))
}
