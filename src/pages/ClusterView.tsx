import { useObserver } from 'mobx-react-lite'
import * as React from 'react'

import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'

import { SeriesType } from '../client/resources'
import { ClusterResourceChart } from '../component/ClusterResourceChart'
import { useStore } from '../store/storeProvider'

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

export const ClusterView = () => {
  const classes = useStyles()
  const store = useStore()

  const [selectedCluster, setSelectedCluster] = React.useState(store.clusterNames.length === 0 ? "" : store.clusterNames[0])

  const onClusterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCluster(event.target.value as string)
  }

  React.useEffect(() => {
    if (selectedCluster === "" && store.clusterNames.length !== 0) {
      setSelectedCluster(store.clusterNames[0])
    }
  })

  return useObserver(() => {
    const histories = selectedCluster ? store.resourcesUsages[selectedCluster] : {}
    const types =  Object.keys(histories)

    return (
      <div className={classes.root}>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControl className={classes.formControl}>
              <InputLabel id="cluster-label">Cluster</InputLabel>
              <Select
                labelId="cluster-label"
                id="cluster"
                value={selectedCluster}
                onChange={onClusterChange}
              >
                {
                  store.clusterNames
                    .filter((it, index, self) => self.indexOf(it) === index)
                    .map(it => <MenuItem key={it} value={it}>{it}</MenuItem>)
                }
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {
           types
              .map(it =>
                <Grid key={`${selectedCluster}-${it}`} item xs={12} sm={6}>
                  <ClusterResourceChart type={SeriesType[it as keyof typeof SeriesType]} data={histories[it].data} />
                </Grid>
              )
          }
        </Grid>
      </div>
    )
  })
}
