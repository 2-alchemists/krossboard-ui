import { format } from 'date-fns'
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

const label = (type: Type): string => {
  switch (type) {
    case "cpu":
      return "Hourly Usage"
    case "mem":
      return "Hourly Usage"
  }
}

const xFormat = "dd hh:mm"

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
            <XAxis dataKey="tag" tickFormatter={(tick: number) => format(tick as number, xFormat)} />
            <YAxis>
              <Label value={label(type)} angle={-90} position="insideBottomLeft" />
            </YAxis>
            <Tooltip labelFormatter={(tick: number | string) => (<p>{format(tick as number, xFormat)}</p>)} />
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
