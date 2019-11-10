import * as React from 'react'

import { StackedArea } from 'britecharts-react'
import ReactResizeDetector from 'react-resize-detector'

export const Test: React.FC = () => {
  const dataset = () => [
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
    {name: "Email", views: 20, date: "2011-01-08T00:00:00"}
  ]

  return (
    <ReactResizeDetector handleWidth>
      <StackedArea
        data={dataset}
        height={400}
        keyLabel='name' dateLabel='date' valueLabel='views'
    />
    </ReactResizeDetector>
  )
}
