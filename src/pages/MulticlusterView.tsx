import * as React from 'react'

import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { ISeriesSet } from '../app/harvester'

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

export const MulticlusterView: React.FC<{ seriesSet: Readonly<ISeriesSet> }> = ({ seriesSet }) => {
  const classes = useStyles()

  return (
    <div className={classes.root} >
      <Container fixed>
        <Typography component="div" className={classes.noDataContainer}>
          <Typography color="inherit" align="center" variant="h5" className={classes.noData}>
            Coming soon...
            </Typography>
        </Typography>
      </Container>
    </div>
  )
}