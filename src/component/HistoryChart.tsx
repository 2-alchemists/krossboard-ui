import { timeFormat } from 'd3-time-format'
import { useObserver } from 'mobx-react-lite'
import * as React from 'react'
import {
  Area, AreaChart, CartesianGrid, Label, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'

import { Card, CardContent, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { IUsageHistoryItem } from '../store/model'
import { seriesColorSchema } from '../theme'

export type Type = "cpu" | "mem"

export interface IHistoryChartProps {
  type: Type
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

function label(type: Type): string {
  switch (type) {
    case "cpu":
      return "CPU Usage"
    case "mem":
      return "Memory Usage"
  }
}

export const HistoryChart: React.FC<IHistoryChartProps> = ({ type, data }) => {
  const classes = useStyles()

  const names = Array.from(new Set(data.flatMap(it => Object.keys(it)).filter(it => it !== "tag")).values()).sort()

  return useObserver(() => (
    <Card>
      <CardContent>
        <Typography className={classes.name} color="textSecondary" gutterBottom>{label(type)}</Typography>
        <Divider className={classes.divider} />
        <ResponsiveContainer width="100%" height={300}>

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
        </ResponsiveContainer>
      </CardContent>
    </Card>
  ))
}
