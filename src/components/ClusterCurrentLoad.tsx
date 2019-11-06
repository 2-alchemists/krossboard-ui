import * as React from 'react'

import { Donut } from 'britecharts-react'
import { Legend } from 'britecharts-react'

export const ClusterCurrentLoad: React.FC <{ resourceType?: string}> = ({resourceType = 'resource type not defined'}) => {

  const dataset = [
    {
        quantity: 3,
        percentage: 75,
        name: 'used',
        id: 1
    },
    {
        quantity: 1,
        percentage: 25,
        name: 'available',
        id: 2
    }
]

  return (
    <div>
      <h2>{resourceType}</h2>
      <Donut data={dataset} />
      <div>
      <Legend data={dataset} margin={0} marginRatio={2} />
      </div>
      
    </div>
  )
}
