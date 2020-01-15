import { timeFormat } from 'd3-time-format'
import { useObserver } from 'mobx-react-lite'
import * as React from 'react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Label, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'

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
    fontSize: 14,
  },
  divider: {
    marginBottom: '7px'
  }
}))

function label(type: SeriesType): string {
  switch (type) {
    case SeriesType.cpu_usage_trends:
      return "CPU Usage"
    case SeriesType.memory_usage_trends:
      return "Memory Usage"
    case SeriesType.cpu_usage_period_1209600:
      return "Cumulative CPU Usage"
    case SeriesType.memory_usage_period_1209600:
      return "Cumulative Memory Usage"
    case SeriesType.cpu_usage_period_31968000:
      return "Cumulative CPU Usage"
    case SeriesType.memory_usage_period_31968000:
      return "Cumulative Memory Usage"
  }
}

export const ClusterResourceChart: React.FC<IClusterResourceProps> = ({ type, data }) => {
  const classes = useStyles()

  const names = Array.from(new Set(data.flatMap(it => Object.keys(it)).filter(it => it !== "tag")).values()).sort()

  return useObserver(() => (
    <Card>
      <CardContent>
        <Typography className={classes.name} color="textSecondary" gutterBottom>{label(type)}</Typography>
        <Divider className={classes.divider} />
        <ResponsiveContainer width="100%" height={300}>
          {
            type === SeriesType.cpu_usage_trends || type === SeriesType.memory_usage_trends
              ?
              <AreaChart
                height={400}
                data={data}
                margin={{
                  top: 5, right: 0, left: 10, bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tag" tickFormatter={(tick: Date) => timeFormat("%b %d %H:%M")(tick)} />
                <YAxis>
                  <Label value={label(type)} angle={-90} position="insideBottomLeft" />
                </YAxis>
                <Tooltip />
                {
                  names.map((name, idx) => (
                    <Area key={name} type="monotone" dataKey={name} stackId="1" stroke={seriesColorSchema[idx % seriesColorSchema.length]} fill={seriesColorSchema[idx % seriesColorSchema.length]} />
                  ))
                }
              </AreaChart>
              :
              <BarChart
                height={400}
                data={data}
                margin={{
                  top: 5, right: 0, left: 10, bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tag" tickFormatter={(tick: Date) => timeFormat("%b %d")(tick)} />
                <YAxis>
                  <Label value={label(type)} angle={-90} position="insideBottomLeft" />
                </YAxis>
                <Tooltip />
                {
                  names.map((name, idx) => (
                    <Bar key={name} dataKey={name} stackId="1" fill={seriesColorSchema[idx % seriesColorSchema.length]} />
                  ))
                }
              </BarChart>
          }
        </ResponsiveContainer>
      </CardContent>
    </Card>
  ))
}
