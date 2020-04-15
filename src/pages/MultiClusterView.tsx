import { action } from 'mobx'
import { useLocalStore, useObserver } from 'mobx-react-lite'
import * as React from 'react'

import DateFnsUtils from '@date-io/date-fns'
import { Button } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

import { FormatType, getUsageHistoryDownloadLink } from '../client/usagehistory'
import { HistoryChart } from '../component/HistoryChart'
import { useStore } from '../store/storeProvider'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0, 4, 4, 4)
    },
    formControl: {
        margin: theme.spacing(1, 3)
    },
    dateField: {
        minWidth: '10em',
        maxWidth: '15em',
        margin: theme.spacing(0, 1)
    },
    centeredGrid: {
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
    }
}))

export const MultiClusterView = () => {
    const classes = useStyles()
    const store = useStore()
    const dateRange = useLocalStore(() => ({
        startDate: store.usageHistoryDateRange.start,
        endDate: store.usageHistoryDateRange.end,
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
        isDirty: () => dateRange.startDate !== store.usageHistoryDateRange.start || dateRange.endDate !== store.usageHistoryDateRange.end,
        commit: action(() => {
            store.usageHistoryDateRange.start = dateRange.startDate
            store.usageHistoryDateRange.end = dateRange.endDate
        })
    }))

    return useObserver(() => {
        return (
            <div className={classes.root}>
                <Grid container direction="row" spacing={3}>
                    <Grid item className={classes.centeredGrid} xs={12} sm={12} md={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <div className={classes.formControl}>
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
                                <Button className={classes.formControl} variant="outlined" disabled={!dateRange.isDirty()} onClick={dateRange.commit}>
                                    Apply
                                </Button>
                            </div>
                            <div>
                                <Link
                                    color="secondary"
                                    underline="always"
                                    href={getUsageHistoryDownloadLink(
                                        store.discoveryURL,
                                        store.usageHistoryDateRange.start as Date,
                                        store.usageHistoryDateRange.end as Date,
                                        FormatType.CSV
                                    )}
                                    target="_blank"
                                    rel="noopener">
                                    export data
                                </Link>
                            </div>
                        </MuiPickersUtilsProvider>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <HistoryChart type={'cpu'} data={store.usageHistory.data.cpu}/>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <HistoryChart type={'mem'} data={store.usageHistory.data.mem}/>
                    </Grid>
                </Grid>
            </div>
        )
    })
}
