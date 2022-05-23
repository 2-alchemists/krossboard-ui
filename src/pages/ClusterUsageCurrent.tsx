/*
  Copyright (C) 2020  2ALCHEMISTS SAS.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*/

import { useObserver } from 'mobx-react-lite'
import * as React from 'react'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { CurrentLoad } from '../component/CurrentLoad'
import { useStore } from '../store/storeProvider'

import { greenRedColorScheme } from '../theme'

import { IUsageHistoryItem } from '../store/model'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3),
    },
    noDataContainer: {
        height: '40vh'
    },
    noData: {
        textTransform: 'uppercase',
        marginBottom: theme.spacing(4),
        marginTop: theme.spacing(4),
        [theme.breakpoints.up('sm')]: {
            marginTop: theme.spacing(10)
        }
    },
    grid: {
        //  height: "400px"
    }
}))

const legend = (value?: IUsageHistoryItem) => {
    switch (value?.tag) {
        case 'used':
            return 'used'
        case 'nonAllocatable':
            return 'non-allocatable'
        case 'available':
            return 'available'
        default:
            return '?'
    }
}

export const ClusterUsageCurrentView = () => {
    const classes = useStyles()
    const store = useStore()

    return useObserver(() => (
        <div className={classes.root}>
            {store.isClustersEmpty ? (
                <Container fixed>
                    <Typography component="div" className={classes.noDataContainer}>
                        <Typography color="inherit" align="center" variant="h5" className={classes.noData}>
                            No Data
                        </Typography>
                    </Typography>
                </Container>
            ) : (
                <Grid container spacing={3}>
                    {store.clusterNames.map(clusterName => {
                        const usages = store.currentLoad.data[clusterName]
                        const outToDate = usages.outToDate ? (usages.outToDate[0].value as number) === 1 : false
                        const color = (value?: IUsageHistoryItem) => {
                            switch (value?.tag) {
                                case 'used':
                                    return greenRedColorScheme[0]
                                case 'nonAllocatable':
                                    return greenRedColorScheme[1]
                                case 'available':
                                    return outToDate ? greenRedColorScheme[3] : greenRedColorScheme[2]
                                default:
                                    return undefined
                            }
                        }

                        return (
                            <React.Fragment key={clusterName}>
                                <Grid item xs={12} sm={6} md={3} className={classes.grid}>
                                    <CurrentLoad
                                        resourceName={clusterName}
                                        resourceType="CPU"
                                        outToDate={outToDate}
                                        data={usages.cpu}
                                        legend={legend}
                                        color={color}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} className={classes.grid}>
                                    <CurrentLoad
                                        resourceName={clusterName}
                                        resourceType="Memory"
                                        outToDate={outToDate}
                                        data={usages.mem}
                                        legend={legend}
                                        color={color}
                                    />
                                </Grid>
                            </React.Fragment>
                        )
                    })}
                </Grid>
            )}
        </div>
    ))
}
