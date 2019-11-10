import { Donut, Legend } from 'britecharts-react'
import * as React from 'react'

import { Card, CardContent, CardHeader, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

export interface IClusterCurrentLoadProps {
  resourceType: string
}

const useStyles = makeStyles(theme => ({
  chartContainer: {
    position: 'relative'
  }
}))

export const ClusterCurrentLoad: React.FC<IClusterCurrentLoadProps> = ({ resourceType }) => {
  const classes = useStyles()

  const dataset = [
    {
      quantity: 75,
      percentage: 75,
      name: 'used',
      id: 1
    },
    {
      quantity: 25,
      percentage: 25,
      name: 'available',
      id: 2
    }
  ]
  

  return (
    <Card>
      <CardHeader title={resourceType}/>
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <Donut data={dataset} />
          <Legend data={dataset} numberFormat=".0f" unit='%' />    
        </div>
      </CardContent>
    </Card>
  )
}
