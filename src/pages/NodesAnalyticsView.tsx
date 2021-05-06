import { action } from 'mobx'
import { useLocalStore, useObserver } from 'mobx-react-lite'
import * as React from 'react'

import DateFnsUtils from '@date-io/date-fns'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

import { CurrentLoad } from '../component/CurrentLoad'
import { NodesUsageHistoryChart } from '../component/NodesUsageHistoryChart'
import { IUsageHistoryItem, NodeName } from '../store/model'
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
    dateField: {
        minWidth: '8em',
        maxWidth: '10em',
        margin: theme.spacing(0, 1)
    },
    dateRangeApply: {
        marginTop: '12px'
    },
    controls: {
        marginBottom: '15px'
    }
}))

enum DashboardTypes {
    NodesRecentOccupation = 'NodesRecentOccupation', // = "Nodes' recent occupation",
    NodesUsageHistory = 'NodesUsageHistory' // = "Nodes' usage history"
}
type DashboardTypesKeys = keyof typeof DashboardTypes

const nameOfDashboardTypes = (type: DashboardTypes): string => {
    switch (type) {
        case DashboardTypes.NodesRecentOccupation:
            return 'Nodes recent occupation'
        case DashboardTypes.NodesUsageHistory:
            return 'Nodes usage history'
    }
}

export const NodesAnalyticsView = () => {
    const classes = useStyles()
    const store = useStore()
    const dateRange = useLocalStore(() => ({
        startDate: store.nodesUsagesDateRange.start,
        endDate: store.nodesUsagesDateRange.end,
        setStartDate: action((date: Date | null) => {
            if (date) {
                dateRange.startDate = date
            }
        }),
        setEndDate: action((date: Date | null) => {
            if (date) {
                dateRange.endDate = date
            }
        }),
        isDirty: () => dateRange.startDate !== store.nodesUsagesDateRange.start || dateRange.endDate !== store.nodesUsagesDateRange.end,
        commit: action(() => {
            store.nodesUsagesDateRange.start = dateRange.startDate
            store.nodesUsagesDateRange.end = dateRange.endDate
        })
    }))
    const [selectedCluster, setSelectedCluster] = React.useState(store.clusterNames.length === 0 ? '' : store.clusterNames[0])
    const onClusterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedCluster(event.target.value as string)
    }

    const [selectedDashboard, setSelectedDashboard] = React.useState(DashboardTypes.NodesRecentOccupation)
    const onDashboardChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedDashboard(DashboardTypes[event.target.value as DashboardTypesKeys])
    }

    React.useEffect(() => {
        if (selectedCluster === '' && store.clusterNames.length !== 0) {
            setSelectedCluster(store.clusterNames[0])
        }
    })

    return useObserver(() => {
        return (
            <div className={classes.root}>
                <Grid container className={classes.controls}>
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
                                    <MenuItem key={it} value={DashboardTypes[it as DashboardTypesKeys]}>
                                        {nameOfDashboardTypes(it as DashboardTypes)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {selectedDashboard === DashboardTypes.NodesUsageHistory && (
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <FormControl>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        className={classes.dateField}
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-start"
                                        label="start date"
                                        value={dateRange.startDate}
                                        onChange={dateRange.setStartDate}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date'
                                        }}
                                    />
                                </FormControl>
                                <FormControl>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        className={classes.dateField}
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-end"
                                        label="end date"
                                        value={dateRange.endDate}
                                        onChange={dateRange.setEndDate}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date'
                                        }}
                                    />
                                </FormControl>
                                <IconButton
                                    color="primary"
                                    className={classes.dateRangeApply}
                                    aria-label="apply date range"
                                    disabled={!dateRange.isDirty()}
                                    onClick={dateRange.commit}
                                >
                                    <CheckCircleOutlineIcon />
                                </IconButton>
                            </MuiPickersUtilsProvider>
                        )}
                    </Grid>
                </Grid>
                {selectedDashboard === DashboardTypes.NodesRecentOccupation && (
                    <NodesRecentOccupationView selectedCluster={selectedCluster} />
                )}
                {selectedDashboard === DashboardTypes.NodesUsageHistory && <NodesUsageHistoryView selectedCluster={selectedCluster} />}
            </div>
        )
    })
}

const NodesRecentOccupationView: React.FC<{ selectedCluster: string }> = ({ selectedCluster }) => {
    const store = useStore()

    return useObserver(() => {
        const data = store.currentNodesLoad[selectedCluster] ? store.currentNodesLoad[selectedCluster].data : {}
        const color = (_?: IUsageHistoryItem, idx?: number) => seriesColorSchema[(idx || 0) % seriesColorSchema.length]

        return (
            <Grid container spacing={3}>
                {Object.keys(data).map(nodeName => {
                    const usages = data[nodeName]

                    return (
                        <React.Fragment key={nodeName}>
                            <Grid item xs={12} sm={6} md={3}>
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
                            <Grid item xs={12} sm={6} md={3}>
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

const NodesUsageHistoryView: React.FC<{ selectedCluster: string }> = ({ selectedCluster }) => {
    const store = useStore()

    return useObserver(() => {
        const data: Record<NodeName, IUsageHistoryItem[]> = store.nodesUsages[selectedCluster]
            ? store.nodesUsages[selectedCluster].data
            : {}

        return (
            <Grid container spacing={3}>
                {Object.keys(data).map(nodeName => {
                    return (
                        <React.Fragment key={nodeName}>
                            <Grid item xs={12}>
                                <Typography color="textPrimary" gutterBottom>
                                    {nodeName}
                                </Typography>{' '}
                                <hr />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <NodesUsageHistoryChart type={'cpu'} data={data[nodeName]} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <NodesUsageHistoryChart type={'mem'} data={data[nodeName]} />
                            </Grid>
                        </React.Fragment>
                    )
                })}
            </Grid>
        )
    })
}
