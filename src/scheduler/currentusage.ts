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

import { getCurrentusage } from '../client/currentusage'
import { koaStore } from '../store/KoaStore'

autorun(
    async () => {
        if (koaStore.discoveryURL !== '') {
            const data = koaStore.currentLoad.data

            if (koaStore.clusterNames.length > 0) {
                runInAction(() => {
                    koaStore.currentLoad.state.loading = true
                })

                getCurrentusage(koaStore.discoveryURL)
                    .then(res => {
                        runInAction(() => {
                            res.clusterUsage?.forEach(it => {
                                if (data[it.clusterName]) {
                                    data[it.clusterName]['cpu'] = [
                                        { tag: 'used', value: it.cpuUsed },
                                        { tag: 'nonAllocatable', value: it.cpuNonAllocatable },
                                        { tag: 'available', value: 100 - it.cpuUsed - it.cpuNonAllocatable }
                                    ]
                                    data[it.clusterName]['mem'] = [
                                        { tag: 'used', value: it.memUsed },
                                        { tag: 'nonAllocatable', value: it.memNonAllocatable },
                                        { tag: 'available', value: 100 - it.memUsed - it.memNonAllocatable }
                                    ]
                                    data[it.clusterName]['outToDate'] = [{ tag: 'outToDate', value: it.outToDate ? 1 : 0 }]
                                }
                            })
                            koaStore.currentLoad.state.updatedAt = new Date()
                            koaStore.clearError(koaStore.currentLoad.state)
                        })
                    })
                    .catch(e => {
                        runInAction(() => {
                            koaStore.setError(koaStore.currentLoad.state, e)
                        })
                    })
                    .finally(() => {
                        runInAction(() => (koaStore.currentLoad.state.loading = false))
                    })
            }
        }
    },
    {
        scheduler: (run: any) => {
            run()
            setInterval(run, koaStore.pollingInterval)
        }
    }
)
