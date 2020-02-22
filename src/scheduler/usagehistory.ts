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

                const cpus: IUsageHistoryItem[] = []
                const mems: IUsageHistoryItem[] = []
                if (data.usageHistory) {
                    const history = data.usageHistory
                    Object.keys(history).forEach(clusterName => {
                        if (cpus.length === 0) {
                            history[clusterName].cpuUsage.forEach(v => {
                                cpus.push({ tag: new Date(v.dateUTC).getTime(), [clusterName]: v.value })
                            })
                        } else {
                            history[clusterName].cpuUsage.forEach((v, idx) => {
                                cpus[idx][clusterName] = v.value
                            })
                        }
                        if (mems.length === 0) {
                            history[clusterName].memUsage.forEach(v => {
                                mems.push({ tag: new Date(v.dateUTC).getTime(), [clusterName]: v.value })
                            })
                        } else {
                            history[clusterName].memUsage.forEach((v, idx) => {
                                mems[idx][clusterName] = v.value
                            })
                        }
                    })
                }

                koaStore.usageHistory.data.cpu = cpus
                koaStore.usageHistory.data.mem = mems
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
