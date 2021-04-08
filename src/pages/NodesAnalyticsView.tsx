import { useObserver } from 'mobx-react-lite'
import * as React from 'react'

import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'

import { CurrentLoad } from '../component/CurrentLoad'
import { IUsageHistoryItem } from '../store/model'
import { useStore } from '../store/storeProvider'
import { seriesColorSchema } from '../theme'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
        paddingTop: 0
    },
    formControl: {
        margin: theme.spacing(1, 3),
        minWidth: 120
    },
    links: {
        marginTop: '20px'
    },
    linkSeparator: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    centeredGrid: {
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    dashboardForm: {
        minWidth: '14rem'
    },
    grid: {}
}))

enum DashboardTypes {
    NodesRecentOccupation = "Nodes' recent occupation",
    NodesUsageHistory = "Nodes' usage history"
}

export const NodesAnalyticsView = () => {
    const classes = useStyles()
    const store = useStore()
    const [selectedCluster, setSelectedCluster] = React.useState(store.clusterNames.length === 0 ? '' : store.clusterNames[0])
    const onClusterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedCluster(event.target.value as string)
    }

    const [selectedDashboard, setSelectedDashboard] = React.useState(Object.keys(DashboardTypes)[0])
    const onDashboardChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedDashboard(event.target.value as string)
    }

    React.useEffect(() => {
        if (selectedCluster === '' && store.clusterNames.length !== 0) {
            setSelectedCluster(store.clusterNames[0])
        }
    })

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item className={classes.centeredGrid} xs={12} sm={12} md={12}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="cluster-label">cluster</InputLabel>
                        <Select labelId="cluster-label" id="cluster" value={selectedCluster} onChange={onClusterChange}>
                            {store.clusterNames
                                .filter((it, index, self) => self.indexOf(it) === index)
                                .map(it => (
                                    <MenuItem key={it} value={it}>
                                        {it}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="dashboard-label">dashboard</InputLabel>
                        <Select
                            className={classes.dashboardForm}
                            labelId="dashboard-label"
                            id="dashboard"
                            value={selectedDashboard}
                            onChange={onDashboardChange}
                        >
                            {Object.keys(DashboardTypes).map(it => (
                                <MenuItem key={it} value={it}>
                                    {DashboardTypes[it as keyof typeof DashboardTypes]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <NodesRecentOccupationView selectedCluster={selectedCluster}/>
        </div>
    )
}

const NodesRecentOccupationView: React.FC<{selectedCluster: string}> = ({selectedCluster}) => {
    const classes = useStyles()
    const store = useStore()

    return useObserver(() => {
        const data = store.currentNodesLoad[selectedCluster] ? store.currentNodesLoad[selectedCluster].data : {}
        const color = (value?: IUsageHistoryItem, idx?: number) => seriesColorSchema[(idx || 0) % seriesColorSchema.length]

        return (
            <Grid container spacing={3}>
                {Object.keys(data).map(nodeName => {
                    const usages = data[nodeName]

                    return (
                        <React.Fragment key={nodeName}>
                            <Grid item xs={12} sm={6} md={3} className={classes.grid}>
                                <CurrentLoad
                                    resourceName={nodeName}
                                    resourceType="CPU"
                                    outToDate={false}
                                    data={usages}
                                    nameKey="tag"
                                    dataKey="cpuUsage"
                                    color={color}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3} className={classes.grid}>
                                <CurrentLoad
                                    resourceName={nodeName}
                                    resourceType="Memory"
                                    outToDate={false}
                                    data={usages}
                                    nameKey="tag"
                                    dataKey="memUsage"
                                    color={color}
                                />
                            </Grid>
                        </React.Fragment>
                    )
                })}
            </Grid>
        )
    })
}
