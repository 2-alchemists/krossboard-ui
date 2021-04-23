import clsx from 'clsx'
import * as React from 'react'
import { Cell, LegendPayload, Pie, PieChart, PieLabelRenderProps, ResponsiveContainer, Sector } from 'recharts'

import { Card, CardContent, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { IUsageHistoryItem } from '../store/model'

export interface IClusterCurrentLoadProps {
    resourceName: string
    resourceType: string
    outToDate: boolean
    data: IUsageHistoryItem[]
    nameKey?: string
    dataKey?: string
    legend?: (item?: IUsageHistoryItem, i?: number) => string
    color?: (item?: IUsageHistoryItem, i?: number) => string | undefined
}

const chartHeight = 300

const useStyles = makeStyles(theme => ({
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
    },
    chartWrapper: {
        height: `${chartHeight}px`
    },
    legendItem: {
        display: 'inline',
        whiteSpace: 'nowrap'
    },
    legendDot: {
        height: '0.7em',
        width: '0.7em',
        borderRadius: '50%',
        display: 'inline-block',
        marginRight: '5px',
        marginLeft: '7px'
    },
    legendText: {
        whiteSpace: 'normal'
    },
    legendActive: {
        fontWeight: 'bold'
    }

}))

export const CurrentLoad: React.FC<IClusterCurrentLoadProps> = ({
    resourceName,
    resourceType,
    outToDate,
    data,
    nameKey = 'tag',
    dataKey = 'value',
    legend,
    color
}) => {
    const classes = useStyles()
    const [activeIndex, setActiveIndex] = React.useState(0)

    const legendFormatter = (value?: LegendPayload['value'], i?: number) => {
        if (legend && i && data) {
            return legend(data[i], i)
        }

        return value
    }

    return (
        <Card>
            <CardContent>
                <Typography className={classes.name} color="textSecondary" gutterBottom>
                    {resourceName}
                </Typography>
                <Typography className={classes.type} variant="body2" component="p">
                    {resourceType}
                </Typography>
                <Divider />
                <div className={classes.chartWrapper}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart
                            width={100}
                            height={200}
                            className={clsx(outToDate && classes.outToDate)}
                            margin={{ top: 0, right: 5, bottom: 0, left: 5 }}
                        >
                            <Pie
                                activeIndex={outToDate ? undefined : activeIndex}
                                activeShape={outToDate ? undefined : renderActiveShape}
                                legendType="circle"
                                data={data}
                                dataKey={dataKey}
                                nameKey={nameKey}
                                innerRadius="30%"
                                outerRadius="65%"
                                onMouseEnter={(_, index) => setActiveIndex(index)}
                            >
                                {color && data && data.map((it, idx) => <Cell key={`cell-${idx}`} fill={color(it, idx)} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <ul>
                    {color &&
                        data &&
                        data.map((it, idx) => (
                            <li className={classes.legendItem} key={`cell-${idx}`}>
                                <span className={classes.legendDot} style={{ backgroundColor: color(it, idx) }} />
                                <span className={clsx(classes.legendText, idx === activeIndex && classes.legendActive)}>
                                    {legendFormatter(it[nameKey], idx)}
                                </span>
                            </li>
                        ))}
                </ul>
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
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, percent } = props

    const sin = Math.sin(-RADIAN * (midAngle ?? 0))
    const cos = Math.cos(-RADIAN * (midAngle ?? 0))

    const tx = Number(cx) + (Number(outerRadius) + 15) * cos
    const ty = Number(cy) + (Number(outerRadius) + 20) * sin

    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
        <g>
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

            <text x={tx} y={ty} dy={3} textAnchor={textAnchor} fill="#999">
                {`${((percent ?? 0) * 100).toFixed(1)}%`}
            </text>
        </g>
    )
}
