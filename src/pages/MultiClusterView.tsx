import { action } from 'mobx'
import { useLocalStore, useObserver } from 'mobx-react-lite'
import * as React from 'react'

import DateFnsUtils from '@date-io/date-fns'
import { Button } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

import { HistoryChart } from '../component/HistoryChart'
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
  },
  dateField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
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
    isDirty: () =>
      dateRange.startDate !== store.usageHistoryDateRange.start || dateRange.endDate !== store.usageHistoryDateRange.end,
    commit: action(() => {
      store.usageHistoryDateRange.start = dateRange.startDate
      store.usageHistoryDateRange.end = dateRange.endDate
    })
  }))

  return useObserver(() => {
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid container justify="center" alignItems="center">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid item xs={6} sm={3}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-start"
                  label="Start date"
                  value={dateRange.startDate}
                  onChange={dateRange.setStartDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-end"
                  label="End date"
                  value={dateRange.endDate}
                  onChange={dateRange.setEndDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <Grid item xs={6} sm={3}>
              <Button variant="outlined" disabled={!dateRange.isDirty()} onClick={dateRange.commit}>
                Apply
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <HistoryChart type={"cpu"} data={store.usageHistory.data.cpu} />
          </Grid>
          <Grid item xs={12} sm={12}>
            <HistoryChart type={"mem"} data={store.usageHistory.data.mem} />
          </Grid>
        </Grid>
      </div >
    )
  })
}