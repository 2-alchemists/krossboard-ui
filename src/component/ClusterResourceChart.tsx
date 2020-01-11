import { timeFormat } from 'd3-time-format'
import * as React from 'react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Label, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'

import { Card, CardContent, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { IMeasurement, ISeries, SeriesType } from '../app/harvester'
import { koaColorSchema } from '../theme'

export interface IClusterResourceProps {
  series: ISeries
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

export const ClusterResourceChart: React.FC<IClusterResourceProps> = React.memo(({ series }) => {
  const [names, values] = prepareData(series.measurements)
  const classes = useStyles()

  return (
    <Card>
      <CardContent>
        <Typography className={classes.name} color="textSecondary" gutterBottom>{label(series.type)}</Typography>
        <Divider className={classes.divider} />
        <ResponsiveContainer width="100%" height={300}>
          {
            series.type === SeriesType.cpu_usage_trends || series.type === SeriesType.memory_usage_trends
              ?
              <AreaChart
                height={400}
                data={values}
                margin={{
                  top: 5, right: 0, left: 10, bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="key" tickFormatter={(tick: Date) => timeFormat("%b %d %H:%M")(tick)} />
                <YAxis>
                  <Label value={label(series.type)} angle={-90} position="insideBottomLeft" />
                </YAxis>
                <Tooltip />
                {
                  names.map((name, idx) => (
                    <Area key={name} type="monotone" dataKey={name} stackId="1" stroke="#8884d8" fill={koaColorSchema[idx % koaColorSchema.length]} />
                  ))
                }
              </AreaChart>
              :
              <BarChart
                height={400}
                data={values}
                margin={{
                  top: 5, right: 0, left: 10, bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="key" tickFormatter={(tick: Date) => timeFormat("%b %d")(tick)} />
                <YAxis>
                  <Label value={label(series.type)} angle={-90} position="insideBottomLeft" />
                </YAxis>
                <Tooltip />
                {
                  names.map((name, idx) => (
                    <Bar key={name} dataKey={name} stackId="1" fill={koaColorSchema[idx % koaColorSchema.length]} />
                  ))
                }
              </BarChart>
          }
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}, (prevProps: IClusterResourceProps, nextProps: IClusterResourceProps) =>
  (prevProps.series.state.updateDate === nextProps.series.state.updateDate)
  && (prevProps.series.state.loading === nextProps.series.state.loading)
  && (prevProps.series.measurements.length === nextProps.series.measurements.length)
)

// Converts incoming measurements into 2 kinds of data, spreaded into an array:
// - the names of all measurement types (as an array of string)
// - the values of the measurements as an array of object:
//   - key for the identifier of the object (which is the date)
//   - all values as properties (property names are the one returned by the "names" dataset above) 
const prepareData = (measurements: IMeasurement[]) => {
  const dataset = new Map()
  const names = new Set()

  measurements.forEach(it => {
    const key = it.dateUTC.toISOString()
    const data = dataset.has(key) ? dataset.get(key) : { key: it.dateUTC }

    data[it.name] = it.usage
    dataset.set(key, data)

    names.add(it.name)
  })

  return [Array.from(names), Array.from(dataset.values())]
}