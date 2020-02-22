import clsx from 'clsx'
import * as React from 'react'
import { Cell, Legend, LegendPayload, Pie, PieChart, PieLabelRenderProps, ResponsiveContainer, Sector } from 'recharts'

import { Card, CardContent, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { IUsageHistoryItem } from '../store/model'
import { greenRedColorScheme } from '../theme'

export interface IClusterCurrentLoadProps {
    clusterName: string
    resourceType: string
    outToDate: boolean
    data: IUsageHistoryItem[]
}

const chartHeight = 300

const useStyles = makeStyles(theme => ({
    chartContainer: {
        position: 'relative',
        '& .donut-chart': {
            display: 'block',
            margin: '0 auto'
        }
    },
    name: {
        fontSize: 14
    },
    type: {
        letterSpacing: '0.02857em',
        textTransform: 'uppercase'
    },
    outToDate: {
        filter: 'blur(3px)'
    },
    outToDateText: {
        height: '0px',
        top: `-${chartHeight / 1.7}px`,
        position: 'relative',
        textAlign: 'center',
        letterSpacing: '0.02857em',
        textTransform: 'uppercase'
    }
}))

const legend = (value?: LegendPayload['value'], entry?: LegendPayload, i?: number) => {
    switch (i) {
        case 0:
            return 'used'
        case 1:
            return 'non-allocatable'
        case 2:
            return 'available'
        default:
            return '?'
    }
}

export const ClusterCurrentLoad: React.FC<IClusterCurrentLoadProps> = ({ clusterName, resourceType, outToDate, data }) => {
    const classes = useStyles()
    const [activeIndex, setActiveIndex] = React.useState(0)

    return (
        <Card>
            <CardContent>
                <Typography className={classes.name} color="textSecondary" gutterBottom>
                    {clusterName}
                </Typography>
                <Typography className={classes.type} variant="body2" component="p">
                    {resourceType}
                </Typography>
                <Divider />
                <ResponsiveContainer width="100%" height={chartHeight}>
                    <PieChart className={clsx(outToDate && classes.outToDate)} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                        <Legend verticalAlign="bottom" height={26} formatter={legend} />
                        <Pie
                            activeIndex={outToDate ? undefined : activeIndex}
                            activeShape={outToDate ? undefined : renderActiveShape}
                            legendType="circle"
                            data={data}
                            dataKey="value"
                            nameKey="tag"
                            innerRadius="35%"
                            outerRadius="70%"
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                        >
                            <Cell fill={greenRedColorScheme[0]} />
                            <Cell fill={greenRedColorScheme[1]} />
                            <Cell fill={outToDate ? greenRedColorScheme[3] : greenRedColorScheme[2]} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {outToDate && (
                    <div className={classes.outToDateText}>
                        <Typography variant="body2" component="span">
                            no recent data
                        </Typography>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

const renderActiveShape = (props: PieLabelRenderProps) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props

    const sin = Math.sin(-RADIAN * (midAngle ?? 0))
    const cos = Math.cos(-RADIAN * (midAngle ?? 0))
    const mx = Number(cx) + (Number(outerRadius) + 30) * cos
    const my = Number(cy) + (Number(outerRadius) + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos < 0 ? 'start' : 'end'

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector
                cx={Number(cx)}
                cy={Number(cy)}
                innerRadius={Number(innerRadius)}
                outerRadius={Number(outerRadius)}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={Number(cx)}
                cy={Number(cy)}
                startAngle={Number(startAngle)}
                endAngle={Number(endAngle)}
                innerRadius={Number(outerRadius) + 6}
                outerRadius={Number(outerRadius) + 10}
                fill={fill}
            />

            <text x={ex} y={ey - 10 * (sin >= 0 ? 1 : -1)} textAnchor={textAnchor} fill="#333">
                {' '}
                {`${((percent ?? 0) * 100).toFixed(1)}%`}
            </text>
        </g>
    )
}
