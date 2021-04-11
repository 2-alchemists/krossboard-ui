import { format } from 'date-fns'
import { TFunction } from 'i18next'
import { useObserver } from 'mobx-react-lite'
import * as React from 'react'
import { Area, AreaChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useTranslation } from 'react-i18next'

import { Card, CardContent, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { computeIfAbsent, IUsageHistoryItem, NodeName } from '../store/model'
import { seriesColorSchema } from '../theme'

export type Type = 'cpu' | 'mem'

export interface INodesUsageHistoryChartProps {
    type: Type
    data: Record<NodeName, IUsageHistoryItem[]>
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

export const NodesUsageHistoryChart: React.FC<INodesUsageHistoryChartProps> = ({ type, data }) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const names = Object.keys(data).filter(it => it !== 'tag')
    const dataframe: IUsageHistoryItem[] = React.useMemo(() => {
        const series: Record<string | number, IUsageHistoryItem> = {}

        Object.values(data)
            .flatMap(it => it)
            .forEach(it => {
                const serie: IUsageHistoryItem = computeIfAbsent(series, it.tag, () => ({
                    tag: it.tag
                }))

                serie[it.name as string] = type === 'cpu' ? it['cpuUsage'] : it['memUsage']
            })

        console.log(Object.values(series))

        return Object.values(series)
    }, [type, data])

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
                        data={dataframe}
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
                        <YAxis>
                            <Label className={classes.label} value={label(type)} angle={-90} position="insideBottomLeft" />
                        </YAxis>
                        <Tooltip labelFormatter={(tick: number | string) => <p>{format(tick as number, dateFormat(t))}</p>} />
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
                </ResponsiveContainer>
            </CardContent>
        </Card>
    ))
}
