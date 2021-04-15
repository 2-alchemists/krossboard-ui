import { format } from 'date-fns'
import { TFunction } from 'i18next'
import { useObserver } from 'mobx-react-lite'
import * as React from 'react'
import { Area, AreaChart, CartesianGrid, Label, Legend, LegendPayload, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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

const legendFormatter = (value?: LegendPayload['value'], entry?: LegendPayload, i?: number) => {
    const legend = value?.toString() ?? ''

    if(legend.endsWith('NonAllocatable')) {
        return 'non-allocatable'
    }

    if(legend.endsWith('Available')) {
        return 'available'
    }

    if(legend.endsWith('UsedResource')) {
        return 'used'
    }

    return legend
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
                        <Legend verticalAlign="bottom" height={26} formatter={legendFormatter} />
                        <XAxis dataKey="tag" tickFormatter={(tick: number) => format(tick as number, dateFormat(t))} />
                        <YAxis type="number" domain={[0, 'dataMax']} tickFormatter={(tick: number) => yTicksFormat(tick as number, type)}>
                            <Label className={classes.label} value={label(type)} angle={-90} position="insideBottomLeft" />
                        </YAxis>
                        <Tooltip labelFormatter={(tick: number | string) => <p>{format(tick as number, dateFormat(t))}</p>} />

                        <Area
                            type="monotone"
                            dataKey={`${type}NonAllocatable`}
                            stackId="1"
                            stroke={greenRedColorScheme[0]}
                            fill={greenRedColorScheme[0]}
                        />

                        <Area
                            type="monotone"
                            dataKey={`${type}Available`}
                            stackId="1"
                            stroke={greenRedColorScheme[2]}
                            fill={greenRedColorScheme[2]}
                        />

                        <Area
                            type="monotone"
                            dataKey={`${type}UsedResource`}
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
