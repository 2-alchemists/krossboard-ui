import { useObserver } from 'mobx-react-lite'
import * as React from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
    paddingTop: 0
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}))

export const MultiClusterView = () => {
  const classes = useStyles()
  // const store = useStore()

  return useObserver(() => {
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>

          <Grid item xs={12} sm={6}>
            <div>TODO</div>
          </Grid>

        </Grid>
      </div>
    )
  })
}