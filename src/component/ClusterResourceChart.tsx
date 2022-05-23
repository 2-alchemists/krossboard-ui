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

import { format } from 'date-fns'
import { TFunction } from 'i18next'
import { useObserver } from 'mobx-react-lite'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { SeriesType } from '../client/resources'
import { IUsageHistoryItem } from '../store/model'
import { seriesColorSchema } from '../theme'

export interface IClusterResourceProps {
    type: SeriesType
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

const label = (type: SeriesType): string => {
    switch (type) {
        case SeriesType.cpu_usage_trends:
            return 'CPU Usage'
        case SeriesType.memory_usage_trends:
            return 'Memory Usage'
        case SeriesType.cpu_usage_period_1209600:
            return 'Cumulative CPU Usage'
        case SeriesType.memory_usage_period_1209600:
            return 'Cumulative Memory Usage'
        case SeriesType.cpu_usage_period_31968000:
            return 'Cumulative CPU Usage'
        case SeriesType.memory_usage_period_31968000:
            return 'Cumulative Memory Usage'
    }
}

const title = (type: SeriesType): string => {
    switch (type) {
        case SeriesType.cpu_usage_trends:
            return 'Hourly CPU Usage'
        case SeriesType.memory_usage_trends:
            return 'Hourly Memory Usage'
        case SeriesType.cpu_usage_period_1209600:
            return 'Daily CPU Usage'
        case SeriesType.memory_usage_period_1209600:
            return 'Daily Memory Usage'
        case SeriesType.cpu_usage_period_31968000:
            return 'Monthly CPU Usage'
        case SeriesType.memory_usage_period_31968000:
            return 'Monthly Memory Usage'
    }
}

const dateFormat = (t: TFunction, type: SeriesType): string => {
    switch (type) {
        case SeriesType.cpu_usage_trends:
        case SeriesType.memory_usage_trends:
            return t('format.day-month-hour')
        case SeriesType.cpu_usage_period_1209600:
        case SeriesType.memory_usage_period_1209600:
            return t('format.day-month')
        case SeriesType.cpu_usage_period_31968000:
        case SeriesType.memory_usage_period_31968000:
            return t('format.month-year')
        default:
            return t('format.day-month-year')
    }
}

export const ClusterResourceChart: React.FC<IClusterResourceProps> = ({ type, data }) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const names = Array.from(new Set(data.flatMap(it => Object.keys(it)).filter(it => it !== 'tag')).values()).sort()

    return useObserver(() => (
        <Card>
            <CardContent>
                <Typography className={classes.name} color="textSecondary" gutterBottom>
                    {title(type)}
                </Typography>
                <Divider className={classes.divider} />
                <ResponsiveContainer width="100%" height={300}>
                    {type === SeriesType.cpu_usage_trends || type === SeriesType.memory_usage_trends ? (
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
                            <XAxis dataKey="tag" tickFormatter={(tick: Date) => format(tick, dateFormat(t, type))} />
                            <YAxis>
                                <Label className={classes.label} value={label(type)} angle={-90} position="insideBottomLeft" />
                            </YAxis>
                            <Tooltip labelFormatter={(tick: number | string) => <p>{format(tick as number, dateFormat(t, type))}</p>} />
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
                        </AreaChart>
                    ) : (
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
                            <XAxis dataKey="tag" tickFormatter={(tick: Date) => format(tick, dateFormat(t, type))} />
                            <YAxis>
                                <Label className={classes.label} value={label(type)} angle={-90} position="insideBottomLeft" />
                            </YAxis>
                            <Tooltip labelFormatter={(tick: number | string) => <p>{format(tick as number, dateFormat(t, type))}</p>} />
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
