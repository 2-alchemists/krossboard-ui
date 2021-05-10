import { action } from 'mobx'
import { useLocalStore, useObserver } from 'mobx-react-lite'
import * as React from 'react'

import DateFnsUtils from '@date-io/date-fns'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

import { FormatType, getUsageHistoryDownloadLink, PeriodType } from '../client/usagehistory'
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
        minWidth: '8em',
        maxWidth: '10em',
        margin: theme.spacing(0, 1)
    },
    dateRangeApply: {
        marginTop: '12px'
    },
    centeredGrid: {
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    links: {
        marginTop: '20px'
    },
    linkSeparator: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
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
                                <IconButton
                                    color="primary"
                                    className={classes.dateRangeApply}
                                    aria-label="apply date range"
                                    disabled={!dateRange.isDirty()}
                                    onClick={dateRange.commit}
                                >
                                    <CheckCircleOutlineIcon />
                                </IconButton>
                                <FormControl className={classes.formControl}>
                                    <InputLabel shrink={true}>export data</InputLabel>
                                    <Typography className={classes.links} color="textPrimary" gutterBottom>
                                        {Object.keys(PeriodType).map((it, i) => (
                                            <React.Fragment key={i} >
                                                <Link
                                                    color="secondary"
                                                    underline="always"
                                                    href={getUsageHistoryDownloadLink(
                                                        store.discoveryURL,
                                                        PeriodType[it as keyof typeof PeriodType],
                                                        store.usageHistoryDateRange.start as Date,
                                                        store.usageHistoryDateRange.end as Date,
                                                        FormatType.CSV
                                                    )}
                                                    target="_blank"
                                                    rel="noopener">
                                                    {it.toLowerCase()}
                                                </Link>
                                                {(i + 1 < Object.keys(PeriodType).length) && <span className={classes.linkSeparator}>|</span>}
                                            </React.Fragment>
                                        ))}
                                    </Typography>
                                </FormControl>
                            </div>
                        </MuiPickersUtilsProvider>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <HistoryChart type="cpu" period="hourly" data={store.usageHistory.hourly.data.cpu} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <HistoryChart type="mem" period="hourly" data={store.usageHistory.hourly.data.mem} />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <HistoryChart type="cpu" period="monthly" data={store.usageHistory.monthly.data.cpu} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <HistoryChart type="mem" period="monthly" data={store.usageHistory.monthly.data.mem} />
                    </Grid>
                </Grid>
            </div>
        )
    })
}
