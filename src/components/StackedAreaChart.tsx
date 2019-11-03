import * as britecharts from 'britecharts'
import * as d3 from 'd3'
import * as React from 'react'

import { makeStyles } from '@material-ui/core/styles'

export interface IStackedAreaChartProps {
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

const useStyles = makeStyles(theme => ({
  root: {
    fill: 'none'
  }
}))

export const StackedAreaChart = ({
  animated = false,
  height,
  grid = StackedAreaGridEnum.Horizontal,
  keyLabel = 'name',
  dateLabel = 'date',
  valueLabel = 'value',
  showTooltips = false,
  tooltipThreshold = 400,
  tooltipTitle = 'Values',
  dataset = [],
}: IStackedAreaChartProps) => {
  const elem = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(600)
  const classes = useStyles()

  React.useEffect(() => {
    const resizeChart = () => {
      if (elem.current) {
        console.log('resize: ')
        const node = d3.select(elem.current).node()
        if (node) {
          setWidth(node.getBoundingClientRect().width)
        }
      }
    }
    window.addEventListener("resize", resizeChart)
    return () => {
      window.removeEventListener("resize", resizeChart)
    }
  })

  React.useEffect(() => {
    const node = d3.select(elem.current).node()
    if (node) {
      setWidth(node.getBoundingClientRect().width)
    }
  }, [elem])

  React.useEffect(() => {
    if (elem.current && dataset) {
      const container = d3.select(elem.current)
      const chart = britecharts.stackedArea()
      const tooltip = britecharts.tooltip()

      chart
        .isAnimated(animated)
        .grid(grid)
        .keyLabel(keyLabel)
        .dateLabel(dateLabel)
        .valueLabel(valueLabel)
        .width(width)
        .height(height ? height : 400)
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
  }, [dataset, width])

  return <div ref={elem} className={`britechart ${classes.root}`} />
}
