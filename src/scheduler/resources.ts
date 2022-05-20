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

import { autorun, runInAction } from 'mobx'

import { fetchSeries, seriesTypeValues } from '../client/resources'
import { koaStore } from '../store/KoaStore'
import { computeIfAbsent, defaultState, IUsageHistoryItem } from '../store/model'

autorun(
    () => {
        koaStore.clusterNames.forEach(clusterName => {
            // for all clusters
            seriesTypeValues.forEach(type => {
                // for each kind of series
                const resourceUsages = koaStore.resourcesUsages[clusterName]

                runInAction(() => {
                    computeIfAbsent(resourceUsages, type, key => ({ state: defaultState(), data: [] })).state.loading = true
                })
                const series = resourceUsages[type]
                fetchSeries(koaStore.discoveryURL, clusterName, type)
                    .then(res => {
                        const values: Record<string, IUsageHistoryItem> = {}
                        res.forEach(measurement => {
                            const item = computeIfAbsent(values, measurement.dateUTC.toISOString(), key => ({
                                tag: measurement.dateUTC.getTime()
                            }))

                            item[measurement.name] = measurement.usage
                        })
                        runInAction(() => {
                            series.data = Object.keys(values).sort().map(it => values[it]) // TODO: is there a better idiomatic way of retrieving values
                            series.state.updatedAt = new Date()
                            koaStore.clearError(series.state)
                        })
                    })
                    .catch(e => {
                        runInAction(() => {
                            koaStore.setError(series.state, e)
                        })
                    })
                    .finally(() => {
                        runInAction(() => (series.state.loading = false))
                    })
            })
        })
    },
    {
        scheduler: (run: any) => {
            run()
            setInterval(run, koaStore.pollingInterval)
        }
    }
)
