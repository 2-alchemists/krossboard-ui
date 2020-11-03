import { isAfter, isSameDay } from 'date-fns'
import { autorun, runInAction } from 'mobx'

import { getUsageHistory, PeriodType } from '../client/usagehistory'
import { koaStore } from '../store/KoaStore'
import { IUsageHistoryItem } from '../store/model'

autorun(
    /// () => (koaStore.usageHistoryDateRange.start === koaStore.usageHistoryDateRange.end),
    async () => {
        if (koaStore.discoveryURL === '') {
            return
        }

        console.log("ici")

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
