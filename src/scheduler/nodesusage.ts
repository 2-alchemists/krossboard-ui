import { isAfter, isSameDay } from 'date-fns'
import { autorun, runInAction } from 'mobx'
import { getNodesUsage, INodeUsagePayload } from '../client/nodesusage'

import { koaStore } from '../store/KoaStore'
import { computeIfAbsent, defaultState, IUsageHistoryItem, NodeName } from '../store/model'

autorun(async () => {
    if (koaStore.discoveryURL !== '') {
        const start = koaStore.nodesUsagesDateRange.start as Date
        const end = koaStore.nodesUsagesEndDate as Date

        koaStore.clusterNames.forEach(clusterName => {
            runInAction(() => {
                computeIfAbsent(koaStore.nodesUsages, clusterName, _ => ({ state: defaultState(), data: {} })).state.loading = true
            })

            getNodesUsage(koaStore.discoveryURL, clusterName, start, end)
                .then(items => {
                    const nodesUsage: Record<NodeName, IUsageHistoryItem[]> = {}

                    Object.keys(items).forEach(nodeName => {
                        const usages: Record<number, IUsageHistoryItem> = {}
                        const node: INodeUsagePayload = items[nodeName]

                        node.allocatableItems.cpuUsage?.forEach(v => {
                            const tag = new Date(v.dateUTC).getTime()
                            const usage = computeIfAbsent(usages, tag, _ => ({
                                tag
                            }))

                            usage.cpuAllocatable = v.value
                        })

                        node.allocatableItems.memUsage?.forEach(v => {
                            const tag = new Date(v.dateUTC).getTime()
                            const usage = computeIfAbsent(usages, tag, _ => ({
                                tag
                            }))

                            usage.memAllocatable = v.value
                        })

                        node.capacityItems.cpuUsage?.forEach(v => {
                            const tag = new Date(v.dateUTC).getTime()
                            const usage = computeIfAbsent(usages, tag, _ => ({
                                tag
                            }))

                            usage.cpuCapacity = v.value
                        })

                        node.capacityItems.memUsage?.forEach(v => {
                            const tag = new Date(v.dateUTC).getTime()
                            const usage = computeIfAbsent(usages, tag, _ => ({
                                tag
                            }))

                            usage.memCapacity = v.value
                        })

                        node.usageByPodItems.cpuUsage?.forEach(v => {
                            const tag = new Date(v.dateUTC).getTime()
                            const usage = computeIfAbsent(usages, tag, _ => ({
                                tag
                            }))

                            usage.cpuUsageByPods = v.value
                        })

                        node.usageByPodItems.memUsage?.forEach(v => {
                            const tag = new Date(v.dateUTC).getTime()
                            const usage = computeIfAbsent(usages, tag, _ => ({
                                tag
                            }))

                            usage.memUsageByPods = v.value
                        })

                        nodesUsage[nodeName] = Object.values(usages)
                            .map(item => item as { tag: number; [_: string]: number })
                            .map(item => {
                                item.cpuNonAllocatable = item.cpuCapacity - item.cpuAllocatable
                                item.cpuAvailable = Math.max(0, item.cpuAllocatable - item.cpuUsageByPods)
                                item.memNonAllocatable = item.memCapacity - item.memAllocatable
                                item.memAvailable = Math.max(0, item.memAllocatable - item.memUsageByPods)

                                return item
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
})

autorun(
    async () => {
        const now = new Date()
        const end = koaStore.nodesUsagesDateRange.end

        runInAction(() => {
            koaStore.nodesUsagesEndDate = isSameDay(end, now) || isAfter(end, now) ? now : end
        })
    },
    {
        scheduler: (run: any) => {
            run()
            setInterval(run, koaStore.pollingInterval)
        }
    }
)
