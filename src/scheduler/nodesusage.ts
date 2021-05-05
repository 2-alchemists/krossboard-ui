import { autorun, runInAction } from 'mobx'
import { getNodesUsage } from '../client/nodesusage'

import { koaStore } from '../store/KoaStore'
import { computeIfAbsent, defaultState, IUsageHistoryItem, NodeName } from '../store/model'

autorun(
    async () => {
        if (koaStore.discoveryURL !== '') {
            koaStore.clusterNames.forEach(clusterName => {
                runInAction(() => {
                    computeIfAbsent(koaStore.nodesUsages, clusterName, _ => ({ state: defaultState(), data: {} })).state.loading = true
                })

                getNodesUsage(koaStore.discoveryURL, clusterName)
                    .then(items => {
                        const nodesUsage: Record<NodeName, IUsageHistoryItem[]> = {}

                        items.forEach(item => {
                            computeIfAbsent(nodesUsage, item.name, _ => [])

                            nodesUsage[item.name].push({
                                tag: new Date(item.dateUTC).getTime(),
                                name: item.name,

                                cpuCapacity: item.cpuCapacity,
                                cpuAllocatable: item.cpuAllocatable,
                                cpuUsageByPods: item.cpuUsageByPods,
                                cpuNonAllocatable: item.cpuCapacity - item.cpuAllocatable,
                                cpuAvailable: Math.max(0., item.cpuAllocatable - item.cpuUsageByPods),

                                memCapacity: item.memCapacity,
                                memAllocatable: item.memAllocatable,
                                memUsageByPods: item.memUsageByPods,
                                memNonAllocatable: item.memCapacity - item.memAllocatable,
                                memAvailable: Math.max(0., item.memAllocatable - item.memUsageByPods),
                            })
                        })

                        runInAction(() => {
                            koaStore.nodesUsages[clusterName].data = nodesUsage
                            koaStore.nodesUsages[clusterName].state.updatedAt = new Date()
                            koaStore.clearError(koaStore.nodesUsages[clusterName].state)
                        })
                    })
                    .catch(e => {
                        runInAction(() => {
                            koaStore.setError(koaStore.nodesUsages[clusterName].state, e)
                        })
                    })
                    .finally(() => {
                        runInAction(() => (koaStore.nodesUsages[clusterName].state.loading = false))
                    })
            })
        }
    },
    {
        scheduler: (run: any) => {
            run()
            setInterval(run, koaStore.pollingInterval)
        }
    }
)
