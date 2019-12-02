import { Donut, Legend } from 'britecharts-react'
import * as React from 'react'

import { Card, CardContent, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ReactResizeDetector from 'react-resize-detector'

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
  const [width, setWidth] = React.useState(0)

  const used = Math.floor(Math.random() * 100)
  const available = 100 - used

  const dataset = [
    {
      quantity: used,
      percentage: used,
      name: 'used',
      id: 1
    },
    {
      quantity: available,
      percentage: available,
      name: 'available',
      id: 2
    }
  ]
  const shouldShowLoadingState = dataset.length === 0

  return (
    <Card>
      <CardContent>
        <Typography className={classes.name} color="textSecondary" gutterBottom>{clusterName}</Typography>
        <Typography className={classes.type} variant="body2" component="p">{resourceType}</Typography>
        <Divider />
        <ReactResizeDetector handleWidth handleHeight onResize={(w, _) => setWidth(w)}>
          <div className={classes.chartContainer}>
            <Donut 
              data={dataset}
              shouldShowLoadingState={shouldShowLoadingState}
              width={width} height={width} externalRadius={width / 2.5} internalRadius={width / 7} />
            <Legend height={100} markerSize={17} data={dataset} numberFormat=".0f" unit='%' />
          </div>
        </ReactResizeDetector>
      </CardContent>
    </Card>
  )
})
