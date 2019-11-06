import * as britecharts from 'britecharts'
import * as d3 from 'd3'
import * as React from 'react'

import { makeStyles } from '@material-ui/core/styles'

export interface IDonutChartProps {
  width?: number
  height?: number
  animated?: boolean
  showTooltips?: boolean
  tooltipTitle?: string
  dataset: any[]
}


const useStyles = makeStyles(theme => ({
  root: {
    fill: 'none'
  }
}))

export const DonutChart = ({
  animated = false,
  height,
  showTooltips = false,
  tooltipTitle = 'Values',
  dataset = [],
}: IDonutChartProps) => {
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
      const chart = britecharts.donut()
      const tooltip = britecharts.tooltip()

      chart
        .isAnimated(true)
        .highlightSliceById(2)
        .width(width)
        .height(height ? height : 300)
        // .on('customMouseOver', function(data) {
        //     legendChart.highlight(data.data.id);
        // })
        // .on('customMouseOut', function() {
        //     legendChart.clearHighlight();
        // });

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
