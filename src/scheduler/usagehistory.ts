import { isAfter, isSameDay } from 'date-fns'
import { autorun, runInAction } from 'mobx'

import { getUsageHistory } from '../client/usagehistory'
import { koaStore } from '../store/KoaStore'
import { IUsageHistoryItem } from '../store/model'

autorun(async () => {
    if (koaStore.discoveryURL === '') {
        return
    }

    const start = koaStore.usageHistoryDateRange.start as Date
    const end = koaStore.usageHistoryEndDate as Date

    runInAction(() => {
        koaStore.usageHistory.state.loading = true
    })

    getUsageHistory(koaStore.discoveryURL, start, end)
        .then(data => {
            runInAction(() => {
                koaStore.usageHistory.state.updatedAt = new Date()
                koaStore.clearError(koaStore.usageHistory.state)

                const cpus: Map<string | number, IUsageHistoryItem> = new Map()
                const mems: Map<string | number, IUsageHistoryItem> = new Map()
                
                if (data.usageHistory) {
                    const history = data.usageHistory
                    Object.keys(history).forEach(clusterName => {
                        history[clusterName].cpuUsage.forEach(v => {
                            const tag = new Date(v.dateUTC).getTime()
                            const entry = cpus.get(tag)
                            if(entry === undefined) {
                                cpus.set(tag, { tag, [clusterName]: v.value })
                            } else {
                                entry[clusterName] = v.value
                            }
                        })

                        history[clusterName].memUsage.forEach(v => {
                            const tag = new Date(v.dateUTC).getTime()
                            const entry = mems.get(tag)
                            if(entry === undefined) {
                                mems.set(tag, { tag, [clusterName]: v.value })
                            } else {
                                entry[clusterName] = v.value
                            }
                        })
                    })
                }

                koaStore.usageHistory.data.cpu = Array.from(cpus.values())
                koaStore.usageHistory.data.mem = Array.from(mems.values())
            })
        })
        .catch(e => {
            runInAction(() => {
                koaStore.setError(koaStore.usageHistory.state, e)
            })
        })
        .finally(() => {
            runInAction(() => (koaStore.usageHistory.state.loading = false))
        })
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
