import { autorun, runInAction } from 'mobx'

import { getCurrentusage } from '../client/currentusage'
import { koaStore } from '../store/KoaStore'

autorun(async () => {
    if (koaStore.discoveryURL !== "") {
        runInAction(() => {
            koaStore.currentLoad.state.loading = true
        })

        const data = koaStore.currentLoad.data

        if (koaStore.clusterNames.length > 0) {
            getCurrentusage(koaStore.discoveryURL)
                .then(res => {
                    runInAction(() => {
                        res.clusterUsage?.forEach(it => {
                            if (data[it.clusterName]) {
                                data[it.clusterName]["cpu"] = [
                                    { tag: "used", value: it.cpuUsed },
                                    { tag: "nonAllocatable", value: it.cpuNonAllocatable },
                                    { tag: "available", value: 100 - it.cpuUsed - it.cpuNonAllocatable }
                                ]
                                data[it.clusterName]["mem"] = [
                                    { tag: "used", value: it.memUsed },
                                    { tag: "nonAllocatable", value: it.memNonAllocatable },
                                    { tag: "available", value: 100 - it.memUsed - it.memNonAllocatable }
                                ]
                                data[it.clusterName]["outToDate"] = [
                                    { tag: "outToDate", value: it.outToDate ? 1 : 0 }
                                ]
                            }
                        })
                        koaStore.currentLoad.state.updatedAt = new Date()
                    })
                })
                .finally(() => {
                    runInAction(() => koaStore.currentLoad.state.loading = false)
                })
        }
    }
}, { scheduler: (run: any) => { run(); setInterval(run, koaStore.pollingInterval) } })
