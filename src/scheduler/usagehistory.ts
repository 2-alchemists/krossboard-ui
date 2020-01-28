import { autorun, runInAction } from 'mobx'

import { getUsageHistory } from '../client/usagehistory'
import { koaStore } from '../store/KoaStore'
import { IUsageHistoryItem } from '../store/model'

autorun(async () => {
    if (koaStore.discoveryURL !== "") {
        runInAction(() => {
            koaStore.usageHistory.state.loading = true
        })

        const data = await getUsageHistory(koaStore.discoveryURL, koaStore.usageHistoryDateRange.start as Date, koaStore.usageHistoryDateRange.end as Date)

        runInAction(() => {
            koaStore.usageHistory.state.loading = false
            koaStore.usageHistory.state.updatedAt = new Date()

            const cpus: IUsageHistoryItem[] = []
            const mems: IUsageHistoryItem[] = []
            if (data.usageHistory) {
                const history = data.usageHistory
                Object.keys(history)
                    .forEach( clusterName => {
                        if (cpus.length === 0) {
                            history[clusterName].cpuUsage.forEach(v => {
                                cpus.push( { tag: new Date(v.dateUTC).getTime(), [clusterName]: v.value } )
                            })
                        } else {
                            history[clusterName].cpuUsage.forEach( (v, idx) => {
                                cpus[idx][clusterName] = v.value
                            })
                        }
                        if (mems.length === 0) {
                            history[clusterName].memUsage.forEach(v => {
                                mems.push( { tag: new Date(v.dateUTC).getTime(), [clusterName]: v.value } )
                            })
                        } else {
                            history[clusterName].memUsage.forEach( (v, idx) => {
                                mems[idx][clusterName] = v.value
                            })
                        }
                    })
            }
            koaStore.usageHistory.data.cpu = cpus
            koaStore.usageHistory.data.mem = mems
        })
    }
})
