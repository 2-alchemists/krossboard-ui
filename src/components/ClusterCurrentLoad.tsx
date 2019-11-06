import * as React from 'react'

import { DonutChart } from './DonutChart'


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
      <div />
      <DonutChart
        dataset={dataset} animated={true} showTooltips={true} />
    </div>
  )
}
