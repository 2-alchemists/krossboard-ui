import * as React from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import { ClusterCurrentLoad } from '../components/ClusterCurrentLoad'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4)
  }
}))

export const CurrentLoadView = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <ClusterCurrentLoad resourceType="Cluster 1 - CPU" />
        </Grid>
        <Grid item xs={12} sm={3}>
          <ClusterCurrentLoad resourceType="Cluster 1 - Memory" />
        </Grid>
        <Grid item xs={12} sm={3}>
          <ClusterCurrentLoad resourceType="Cluster 2 - CPU" />
        </Grid>
        <Grid item xs={12} sm={3}>
          <ClusterCurrentLoad resourceType="Cluster 2 - Memory" />
        </Grid>
      </Grid>
    </div>
  )
}