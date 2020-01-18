import { autorun, runInAction } from 'mobx'

import { fetchSeries, seriesTypeValues } from '../client/resources'
import { koaStore } from '../store/KoaStore'
import { computeIfAbsent, defaultState, IUsageHistoryItem } from '../store/model'

autorun(() => {
    koaStore.clusterNames.forEach(clusterName => { // for all clusters
        seriesTypeValues.forEach(type => { // for each kind of series
            runInAction(() => {
                const series = computeIfAbsent(koaStore.resourcesUsages[clusterName], type, (key) => ({ state: defaultState(), data: [] }))

                series.state.loading = true
        
                fetchSeries(koaStore.discoveryURL, type)
                    .then(res => {
                        runInAction(() => {
                            const values: Record<string, IUsageHistoryItem> = {}
                            res.forEach(measurement => {
                                const item = computeIfAbsent(values, measurement.dateUTC.toISOString(), (key) => ({ tag: measurement.dateUTC }))

                                item[measurement.name] = measurement.usage
                            })

                            series.data = Object.keys(values).map(it => values[it]) // TODO: is there a better idiomatic way of retrieving values
                            series.state.updatedAt = new Date()
                        })
                    })
                    .finally(() => {
                        runInAction(() => series.state.loading = false)
                    })
            })
        })
    })
}, { scheduler: (run: any) => { run(); setInterval(run, koaStore.pollingInterval) } })
