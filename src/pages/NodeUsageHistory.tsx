/*
Copyright (c) 2020 2Alchemists SAS.

This file is part of Krossboard.

Krossboard is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3
of the License, or (at your option) any later version.

Krossboard is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Krossboard.
If not, see <https://www.gnu.org/licenses/>.
*/

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

import { NodesUsageHistoryChart } from '../component/NodesUsageHistoryChart'
import { IUsageHistoryItem, NodeName } from '../store/model'
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

export const NodeUsageHistoryView = () => {
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
                    </Grid>
                </Grid>

                <NodesUsageHistoryView selectedCluster={selectedCluster} />
            </div>
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
