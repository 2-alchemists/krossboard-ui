import { useObserver } from 'mobx-react-lite'
import * as React from 'react'

import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import Link from '@material-ui/core/Link'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { SeriesType } from '../client/resources'
import { ClusterResourceChart } from '../component/ClusterResourceChart'
import { IUsageHistoryItem, IWithHarvesterState } from '../store/model'
import { useStore } from '../store/storeProvider'

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
    }
}))

enum PeriodType {
    hourly = 'hourly',
    daily = 'daily',
    monthly = 'monthly'
}

export const ClusterView = () => {
    const classes = useStyles()
    const store = useStore()

    const [selectedCluster, setSelectedCluster] = React.useState(store.clusterNames.length === 0 ? '' : store.clusterNames[0])

    const onClusterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedCluster(event.target.value as string)
    }

    React.useEffect(() => {
        if (selectedCluster === '' && store.clusterNames.length !== 0) {
            setSelectedCluster(store.clusterNames[0])
        }
    })

    return useObserver(() => {
        const histories = selectedCluster ? store.resourcesUsages[selectedCluster] : {}
        const types = Object.keys(histories)

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
                            <InputLabel shrink={true}>export data</InputLabel>
                            <Typography className={classes.links} color="textPrimary" gutterBottom>
                                {Object.keys(PeriodType).map((it, i) => (
                                    <React.Fragment key={i} >
                                        <Link
                                            color="secondary"
                                            underline="always"
                                            href={csvDataURL(selectedCluster, PeriodType[it as keyof typeof PeriodType], histories)}
                                            target="_blank"
                                            download={`usage-trends-${it}.csv`}>
                                            {it}
                                        </Link>
                                        {(i + 1 < Object.keys(PeriodType).length) && <span className={classes.linkSeparator}>|</span>}
                                    </React.Fragment>
                                ))}
                            </Typography>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    {types.map(it => (
                        <Grid key={`${selectedCluster}-${it}`} item xs={12} md={6}>
                            <ClusterResourceChart type={SeriesType[it as keyof typeof SeriesType]} data={histories[it].data} />
                        </Grid>
                    ))}
                </Grid>
            </div>
        )
    })
}



// return the URL of the blob of data for the period considered (both cpu & memory)
const csvDataURL = (clusterName: string, periodType: PeriodType, histories: Record<string /* type */, IWithHarvesterState<IUsageHistoryItem[]>>): string => {
    const { cpuData, memoryData } = (() => {
        switch (periodType) {
            case PeriodType.hourly:
                return {
                    cpuData: histories[SeriesType.cpu_usage_trends]?.data || [],
                    memoryData: histories[SeriesType.memory_usage_trends]?.data || []
                }
            case PeriodType.daily:
                return {
                    cpuData: histories[SeriesType.cpu_usage_period_1209600]?.data || [],
                    memoryData: histories[SeriesType.memory_usage_period_1209600]?.data || []
                }
            case PeriodType.monthly:
                return {
                    cpuData: histories[SeriesType.cpu_usage_period_31968000]?.data || [],
                    memoryData: histories[SeriesType.memory_usage_period_31968000]?.data || []
                }
            default:
                return {
                    cpuData: [],
                    memoryData: []
                }
        }
    })()

    let csv = ''

    // header
    const header = "dateUTC;cluster;namespace;resource;usage"
    csv += `${header}\n`

    // content
    const toRow = (resource: string, historyItem: IUsageHistoryItem) => (
        Object
            .keys(historyItem)
            .filter(k => k !== "tag")
            .map(k => [new Date(historyItem.tag).toISOString(), clusterName, k, resource, historyItem[k]])
    )

    csv +=
        [
            ...(cpuData.flatMap(it => toRow("cpu", it))),
            ...(memoryData.flatMap(it => toRow("memory", it)))
        ]
            .sort((a, b) => {
                if (a[0] < b[0]) {
                    return -1
                }
                if (a[0] > b[0]) {
                    return 1
                }
                return 0
            })
            .map(row => row.join(";"))
            .join("\n")

    const blob = new Blob(
        [csv],
        { type: 'text/csv;charset=utf-8' })

    return window.URL.createObjectURL(blob)
}