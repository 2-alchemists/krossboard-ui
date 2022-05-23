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

import { autorun, runInAction } from 'mobx'

import { getCurrentNodesUsage } from '../client/nodes'
import { koaStore } from '../store/KoaStore'
import { computeIfAbsent, defaultState, IUsageHistoryItem, NodeName } from '../store/model'

autorun(
    async () => {
        if (koaStore.discoveryURL !== '') {
            koaStore.clusterNames.forEach(clusterName => {
                runInAction(() => {
                    computeIfAbsent(koaStore.currentNodesLoad, clusterName, _ => ({ state: defaultState(), data: {} })).state.loading = true
                })

                getCurrentNodesUsage(koaStore.discoveryURL, clusterName)
                    .then(nodes => {
                        const currentNodeUsage: Record<NodeName, IUsageHistoryItem[]> = {}

                        Object.keys(nodes).forEach(nodeName => {
                            const usages: IUsageHistoryItem[] = []

                            usages.push({
                                tag: 'non-allocatable',
                                cpuUsage: nodes[nodeName].cpuCapacity - nodes[nodeName].cpuAllocatable,
                                memUsage: nodes[nodeName].memCapacity - nodes[nodeName].memAllocatable
                            })

                            let sumCpuPodUsage = 0
                            let sumMemPodUsage = 0
                            nodes[nodeName].podsRunning.forEach(pod => {
                                usages.push({
                                    tag: pod.name,
                                    cpuUsage: pod.cpuUsage,
                                    memUsage: pod.memUsage
                                })

                                sumCpuPodUsage += pod.cpuUsage
                                sumMemPodUsage += pod.memUsage
                            })

                            usages.push({
                                tag: 'available',
                                cpuUsage: nodes[nodeName].cpuAllocatable - sumCpuPodUsage,
                                memUsage: nodes[nodeName].memAllocatable - sumMemPodUsage
                            })

                            currentNodeUsage[nodeName] = usages
                        })
                        runInAction(() => {
                            koaStore.currentNodesLoad[clusterName].data = currentNodeUsage
                            koaStore.currentNodesLoad[clusterName].state.updatedAt = new Date()
                            koaStore.clearError(koaStore.currentNodesLoad[clusterName].state)
                        })
                    })
                    .catch(e => {
                        runInAction(() => {
                            koaStore.setError(koaStore.currentNodesLoad[clusterName].state, e)
                        })
                    })
                    .finally(() => {
                        runInAction(() => (koaStore.currentNodesLoad[clusterName].state.loading = false))
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
