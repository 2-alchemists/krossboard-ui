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
import { Area, AreaChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useTranslation } from 'react-i18next'

import { Card, CardContent, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { IUsageHistoryItem } from '../store/model'
import { greenRedColorScheme } from '../theme'
import { formatBytes } from '../util/formatters'

export type Type = 'cpu' | 'mem'

export interface INodesUsageHistoryChartProps {
    type: Type
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

const dateFormat = (t: TFunction): string => {
    return t('format.day-month-year')
}

const dateFormatWithTime = (t: TFunction): string => {
    return t('format.day-month-year-hour')
}

const title = (type: Type): string => {
    return `${typeLabel(type)} usage`
}

const label = (type: Type): string => {
    return ''
}

const yTicksFormat = (v: number, type: Type): string => {
    switch (type) {
        case 'cpu':
            return v === 0 ? "0" : v.toFixed(3)
        case 'mem':
            return formatBytes(v)
    }
}

export const NodesUsageHistoryChart: React.FC<INodesUsageHistoryChartProps> = ({ type, data }) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return useObserver(() => (
        <Card>
            <CardContent>
                <Typography className={classes.name} color="textSecondary" gutterBottom>
                    {title(type)}
                </Typography>
                <Divider className={classes.divider} />
                <ResponsiveContainer width="100%" height={300}>
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
                        <XAxis dataKey="tag" tickFormatter={(tick: number) => format(tick as number, dateFormat(t))} />
                        <YAxis type="number" domain={[0, 'dataMax']} tickFormatter={(tick: number) => yTicksFormat(tick as number, type)}>
                            <Label className={classes.label} value={label(type)} angle={-90} position="insideBottomLeft" />
                        </YAxis>
                        <Tooltip labelFormatter={(tick: number | string) => <p>{format(tick as number, dateFormatWithTime(t))}</p>} />

                        <Area
                            name="non-allocatable"
                            type="monotone"
                            dataKey={`${type}NonAllocatable`}
                            stackId="1"
                            stroke={greenRedColorScheme[0]}
                            fill={greenRedColorScheme[0]}
                        />

                        <Area
                            name="available"
                            type="monotone"
                            dataKey={`${type}Available`}
                            stackId="1"
                            stroke={greenRedColorScheme[2]}
                            fill={greenRedColorScheme[2]}
                        />

                        <Area
                            name="used by pods"
                            type="monotone"
                            dataKey={`${type}UsageByPods`}
                            stackId="1"
                            stroke={greenRedColorScheme[1]}
                            fill={greenRedColorScheme[1]}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    ))
}
