import { useObserver } from 'mobx-react-lite'
import * as React from 'react'

import DateFnsUtils from '@date-io/date-fns'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import {
    KeyboardDatePicker, MuiPickersUtilsProvider
} from '@material-ui/pickers'

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

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      store.setUsageHistoryStartDate(date)
    }
  }

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      store.setUsageHistoryEndDate(date)
    }
  }

  return useObserver(() => {
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid container justify="center" alignItems="center">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid item xs={12} sm={3}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-start"
                  label="Start date"
                  value={store.usageHistoryDateRange.start}
                  onChange={handleStartDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-end"
                  label="End date"
                  value={store.usageHistoryDateRange.end}
                  onChange={handleEndDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
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