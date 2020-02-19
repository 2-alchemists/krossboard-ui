import { useObserver } from 'mobx-react-lite'
import * as React from 'react'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { ClusterCurrentLoad } from '../component/ClusterCurrentLoad'
import { useStore } from '../store/storeProvider'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  noDataContainer: {
    height: '40vh'
  },
  noData: {
    textTransform: 'uppercase',
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(10),
    }
  }
}))

export const CurrentLoadView = () => {
  const classes = useStyles()
  const store = useStore()

  return useObserver(() => (
    <div className={classes.root}>
      {
        store.isClustersEmpty ?
          <Container fixed>
            <Typography component="div" className={classes.noDataContainer}>
              <Typography color="inherit" align="center" variant="h5" className={classes.noData}>
                No Data
            </Typography>
            </Typography>
          </Container>
          :
          <Grid container spacing={3}>
            {store.clusterNames.map(clusterName => {
              const usages = store.currentLoad.data[clusterName]
              const outToDate = usages.outToDate ? (usages.outToDate[0].value as number) === 1 : false
              return (
                <React.Fragment key={clusterName}>
                  <Grid item xs={12} sm={3}>
                    <ClusterCurrentLoad clusterName={clusterName} resourceType="CPU" outToDate={outToDate} data={usages.cpu} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <ClusterCurrentLoad clusterName={clusterName} resourceType="Memory" outToDate={outToDate} data={usages.mem} />
                  </Grid>
                </React.Fragment>
              )
            })
            }
          </Grid>
      }
    </div>
  ))
}