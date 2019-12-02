import * as React from 'react'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { IClusters } from '../app/harvester'
import { ClusterCurrentLoad } from '../component/ClusterCurrentLoad'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
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

export const CurrentLoadView: React.FC<{ clusters: Readonly<IClusters> }> = ({ clusters }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {
        clusters.length === 0 ?
          <Container fixed>
            <Typography component="div" className={classes.noDataContainer}>
            <Typography color="inherit" align="center" variant="h5" className={classes.noData}>
              No Data
            </Typography>
            </Typography>
          </Container>
          : <Grid container spacing={3}>
            {clusters.map(cluster => (
              <React.Fragment key={cluster.clusterName}>
                <Grid item xs={12} sm={3}>
                  <ClusterCurrentLoad clusterName={cluster.clusterName} resourceType="CPU" />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <ClusterCurrentLoad clusterName={cluster.clusterName} resourceType="Memory" />
                </Grid>
              </React.Fragment>
            ))
            }
          </Grid>
      }
    </div>
  )
}