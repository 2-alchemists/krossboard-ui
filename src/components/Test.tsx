import * as React from 'react'

import { StackedAreaChart } from './StackedAreaChart'

export const Test: React.FC = () => {
  const [count, setCount] = React.useState(10)

  const dataset = [
    {name: "Direct", views: 0, date: "2011-01-05T00:00:00"},
    {name: "Direct", views: 10, date: "2011-01-06T00:00:00"},
    {name: "Direct", views: 7, date: "2011-01-07T00:00:00"},
    {name: "Direct", views: 6, date: "2011-01-08T00:00:00"},
    {name: "Eventbrite", views: 3, date: "2011-01-05T00:00:00"},
    {name: "Eventbrite", views: 16, date: "2011-01-06T00:00:00"},
    {name: "Eventbrite", views: 10, date: "2011-01-07T00:00:00"},
    {name: "Eventbrite", views: 0, date: "2011-01-08T00:00:00"},
    {name: "Email", views: 10, date: "2011-01-05T00:00:00"},
    {name: "Email", views: 15, date: "2011-01-06T00:00:00"},
    {name: "Email", views: 3, date: "2011-01-07T00:00:00"},
    {name: "Email", views: count, date: "2011-01-08T00:00:00"}
  ]

  return (
    <div>
      <button onClick={() => setCount(10)}>Reset</button>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <div />
      <StackedAreaChart 
        dataset={dataset} animated={true} showTooltips={true} 
        keyLabel='name' dateLabel='date' valueLabel='views'/>
    </div>
  )
}
