import * as React from 'react'
import * as d3 from 'd3'
import * as britecharts from 'britecharts'

export interface StackedAreaChartProps {
  width?: number
  height?: number
  animated?: boolean
  grid?: StackedAreaGridEnum
  keyLabel?: string
  dateLabel?: string
  valueLabel?: string

  showTooltips?: boolean
  tooltipThreshold?: number
  tooltipTitle?: string

  dataset: any[]
}

export enum StackedAreaGridEnum {
  Vertical = "vertical",
  Horizontal = "horizontal",
  Full = "full",
}

export const StackedAreaChart = ({
  animated = false,
  width,
  height,
  grid = StackedAreaGridEnum.Horizontal,
  keyLabel = 'name',
  dateLabel = 'date',
  valueLabel = 'value',
  showTooltips = false,
  tooltipThreshold = 400,
  tooltipTitle = 'Values',
  dataset = [],
}: StackedAreaChartProps) => {
  const elem = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (elem.current && dataset) {
      const container = d3.select(elem.current)
      const node = container.node()

      const chart = britecharts.stackedArea()
      const tooltip = britecharts.tooltip()

      chart
        .isAnimated(animated)
        .grid(grid)
        .keyLabel(keyLabel)
        .dateLabel(dateLabel)
        .valueLabel(valueLabel)
        .width(width ? width : ( node ? node.getBoundingClientRect().width : 600 ))
        .height(height ? height : 400 )
        .tooltipThreshold(tooltipThreshold)

      if (showTooltips) {
        chart
          .on('customMouseOver', tooltip.show)
          .on('customMouseMove', tooltip.update)
          .on('customMouseOut', tooltip.hide)

        tooltip
          .title(tooltipTitle)
          .topicLabel('values')
      }

      container.selectAll('*').remove()
      container.datum(dataset).call(chart)

      if (showTooltips) {
        container
          .select('.metadata-group .vertical-marker-container')
          .datum([])
          .call(tooltip)
      }
    }
  }, [elem, dataset])

  return <div ref={elem} className="britechart" style={{ fill: 'none' }} />
}
