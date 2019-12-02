import { StackedArea, StackedBar } from 'britecharts-react'
import * as React from 'react'
import ReactResizeDetector from 'react-resize-detector'

import { IMeasurement, ISeries, SeriesType } from '../app/harvester'

export interface IClusterResourceProps {
  series: ISeries
}

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
  return (
    <React.Fragment>
      <div>{series.measurements.length} {series.clusterName}</div>
      <ReactResizeDetector handleWidth>
        {
          series.type === SeriesType.cpu_usage_trends || series.type === SeriesType.memory_usage_trends
            ? <StackedArea
              data={series.measurements}
              aspectRatio={0.5}
              keyLabel="name"
              grid="full"
              dateLabel="dateUTC"
              valueLabel="usage"
              height={400}
              isAnimated={false}
              xAxisFormat="custom"
              xAxisCustomFormat="%b %d %H:%M"
              xTicks={2}
              yAxisLabel={label(series.type)}
              shouldShowLoadingState={series.state.loading && series.measurements.length === 0}
            />
            : <StackedBar
              data={withLabel(series.measurements)}
              aspectRatio={0.5}
              stackLabel="name"
              grid="horizontal"
              nameLabel="label"
              valueLabel="usage"
              height={400}
              isAnimated={false}
              // nameLabelFormat="%b %d"
              betweenBarsPadding={0.2}
              yAxisLabel={label(series.type)}
              shouldShowLoadingState={series.state.loading && series.measurements.length === 0}
            />
        }

      </ReactResizeDetector>
    </React.Fragment>
  )
}, (prevProps: IClusterResourceProps, nextProps: IClusterResourceProps) => {
  // TODO: optimize refresh by using a suitable predicate
  // (prevProps.series.state.updateDate === nextProps.series.state.updateDate) && (prevProps.series.state.loading === nextProps.series.state.loading)
  return false
})

const withLabel = (measurements: IMeasurement[]) => measurements.map(it => ({...it, label: it.dateUTC.toISOString() /* TODO change me */ }))