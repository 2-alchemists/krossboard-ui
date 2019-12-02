import * as React from 'react'

import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'

import { ISeriesSet } from '../app/harvester'
import { ClusterResourceChart } from '../component/ClusterResourceChart'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}))

export const ClusterView: React.FC<{ seriesSet: Readonly<ISeriesSet> }> = ({ seriesSet }) => {
  const classes = useStyles()
  const [selectedCluster, setSelectedCluster] = React.useState(seriesSet.length === 0 ? "" : seriesSet[0].clusterName)

  const onClusterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCluster(event.target.value as string)
  }

  React.useEffect(() => {
    if (selectedCluster === "" && seriesSet.length !== 0) {
      setSelectedCluster(seriesSet[0].clusterName)
    }
  }, [seriesSet])

  return (
    <div className={classes.root}>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={6} sm={6}>
          <FormControl className={classes.formControl}>
            <InputLabel id="cluster-label">Cluster</InputLabel>
            <Select
              labelId="cluster-label"
              id="cluster"
              value={selectedCluster}
              onChange={onClusterChange}
            >
              {
                seriesSet
                  .map(it => it.clusterName)
                  .filter((it, index, self) => self.indexOf(it) === index)
                  .map(it => <MenuItem key={it} value={it}>{it}</MenuItem>)
              }
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={10}>
        {seriesSet
          .filter(series => series.clusterName === selectedCluster)
          .map(series =>
            <Grid key={`${series.clusterName}-${series.type}`} item xs={12} sm={6}>
              <ClusterResourceChart series={series} />
            </Grid>
          )
        }
      </Grid>

    </div>
  )
}