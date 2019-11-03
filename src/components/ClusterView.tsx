import * as React from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import { Test } from './Test'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  }
}))

export const ClusterView = () => {
  const classes = useStyles()

  return <Grid className={classes.root} container spacing={3}>
    <Grid item xs={12} sm={6}>
      <Test />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Test />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Test />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Test />
    </Grid>

  </Grid>
}