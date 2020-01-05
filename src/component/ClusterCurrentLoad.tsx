import * as React from 'react'
import { Cell, Legend, Pie, PieChart, PieLabelRenderProps, ResponsiveContainer, Sector } from 'recharts'

import { Card, CardContent, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { koaColorSchema } from '../theme'

export interface IClusterCurrentLoadProps {
  clusterName: string
  resourceType: string
}

const useStyles = makeStyles(theme => ({
  chartContainer: {
    position: 'relative',
    '& .donut-chart': {
      display: 'block',
      margin: '0 auto'
    }
  },
  name: {
    fontSize: 14,
  },
  type: {
    letterSpacing: '0.02857em',
    textTransform: 'uppercase',
  }
}))

export const ClusterCurrentLoad: React.FC<IClusterCurrentLoadProps> = React.memo(({ clusterName, resourceType }) => {
  const classes = useStyles()
  const [activeIndex, setActiveIndex] = React.useState(0)

  const used = Math.floor(Math.random() * 100)
  const available = 100 - used

  // TODO: to remove
  const [dataset, ] = React.useState([
    {
      quantity: used,
      name: 'used',
      id: 1
    },
    {
      quantity: available,
      name: 'available',
      id: 2
    }
  ])
  // const shouldShowLoadingState = dataset.length === 0

  return (
    <Card>
      <CardContent>
        <Typography className={classes.name} color="textSecondary" gutterBottom>{clusterName}</Typography>
        <Typography className={classes.type} variant="body2" component="p">{resourceType}</Typography>
        <Divider />
        <ResponsiveContainer width="100%" height={300}>
            <PieChart margin={ {top: 5, right: 5, bottom: 5, left: 5} }>
              <Legend verticalAlign="bottom" height={26} />
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                legendType="circle"
                data={dataset}
                dataKey="quantity" nameKey="name"
                innerRadius="35%"
                outerRadius="70%"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              
              >
                <Cell fill={koaColorSchema[0]} />
                <Cell fill={koaColorSchema[1]} />
              </Pie>
            </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

const renderActiveShape = (props: PieLabelRenderProps) => {
  const RADIAN = Math.PI / 180
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent
  } = props

  const sin = Math.sin(-RADIAN * (midAngle ?? 0))
  const cos = Math.cos(-RADIAN * (midAngle ?? 0))
  const mx = Number(cx) + (Number(outerRadius) + 30) * cos
  const my = Number(cy) + (Number(outerRadius) + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos < 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
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

      <text x={ex} y={ey - 10 * (sin >= 0 ? 1 : -1)} textAnchor={textAnchor} fill="#333"> {`${((percent ?? 0) * 100).toFixed(1)}%`}</text>
    </g>
  )
}