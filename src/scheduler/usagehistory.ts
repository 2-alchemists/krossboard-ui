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

import { isAfter, isSameDay } from 'date-fns'
import { autorun, runInAction } from 'mobx'

import { getUsageHistory, PeriodType } from '../client/usagehistory'
import { koaStore } from '../store/KoaStore'
import { IUsageHistoryItem } from '../store/model'

autorun(
    async () => {
        if (koaStore.discoveryURL === '') {
            return
        }

        const start = koaStore.usageHistoryDateRange.start as Date
        const end = koaStore.usageHistoryEndDate as Date
        const fetchHistory = (period: PeriodType) => {
            const usageHistory = period === PeriodType.MONTHLY ? koaStore.usageHistory.monthly : koaStore.usageHistory.hourly

            runInAction(() => {
                usageHistory.state.loading = true
            })

            getUsageHistory(koaStore.discoveryURL, period, start, end)
                .then(data => {
                    runInAction(() => {
                        usageHistory.state.updatedAt = new Date()
                        koaStore.clearError(usageHistory.state)

                        const cpus: Map<string | number, IUsageHistoryItem> = new Map()
                        const mems: Map<string | number, IUsageHistoryItem> = new Map()

                        if (data.usageHistory) {
                            const history = data.usageHistory
                            Object.keys(history).forEach(clusterName => {
                                history[clusterName].cpuUsage.forEach(v => {
                                    const tag = new Date(v.dateUTC).getTime()
                                    const entry = cpus.get(tag)
                                    if (entry === undefined) {
                                        cpus.set(tag, { tag, [clusterName]: v.value })
                                    } else {
                                        entry[clusterName] = v.value
                                    }
                                })

                                history[clusterName].memUsage.forEach(v => {
                                    const tag = new Date(v.dateUTC).getTime()
                                    const entry = mems.get(tag)
                                    if (entry === undefined) {
                                        mems.set(tag, { tag, [clusterName]: v.value })
                                    } else {
                                        entry[clusterName] = v.value
                                    }
                                })
                            })
                        }

                        usageHistory.data.cpu = Array.from(cpus.values())
                        usageHistory.data.mem = Array.from(mems.values())
                    })
                })
                .catch(e => {
                    runInAction(() => {
                        koaStore.setError(usageHistory.state, e)
                    })
                })
                .finally(() => {
                    runInAction(() => (usageHistory.state.loading = false))
                })
        }

        fetchHistory(PeriodType.HOURLY)
        fetchHistory(PeriodType.MONTHLY)
    })

autorun(
    async () => {
        const now = new Date()
        const end = koaStore.usageHistoryDateRange.end

        runInAction(() => {
            koaStore.usageHistoryEndDate = isSameDay(end, now) || isAfter(end, now) ? now : end
        })
    },
    {
        scheduler: (run: any) => {
            run()
            setInterval(run, koaStore.pollingInterval)
        }
    }
)
