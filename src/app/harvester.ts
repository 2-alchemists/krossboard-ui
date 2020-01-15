import { runInAction } from 'mobx'

import useInterval from '@use-it/interval'

import { getCurrentusage } from '../client/currentusage'
import { getDiscovery } from '../client/discovery'
import { fetchSeries, seriesTypeValues } from '../client/resources'
import { KoaStore } from '../store/KoaStore'
import { computeIfAbsent, defaultState, IUsageHistoryItem } from '../store/model'
import { useStore } from '../store/storeProvider'

export interface IHarvesterOptions {
    discoveryURL: string
    pollingInterval?: number
}

export const useHarvester = ({
    // Endpoint from which all discovered clusters are retrieved. 
    discoveryURL,
    // Interval (ms) at which you want your component to poll for data.
    // Defaults to 0 (no polling).
    pollingInterval = 0
}: IHarvesterOptions): void => {
    const store = useStore()

    const doHarvest = () => {
        runInAction(async () => {
            store.state.loading = true

            await loadDiscovery(store, discoveryURL)

            runInAction(() => { // FIXME: maybe better to use an @action bound to a store
                loadCurrentUsage(store, discoveryURL)
                loadResourcesUsage(store, discoveryURL)

                store.state.loading = false // FIXME: improper, must wait for the loading of all resources
                store.state.updatedAt = new Date()
            })

        })
    }

    useInterval(() => {
        doHarvest()
    }, pollingInterval === 0 ? null : pollingInterval)

    doHarvest()
}

const loadDiscovery = async (store: KoaStore, discoveryURL: string) => {
    store.instances.state.loading = true
    const data = await getDiscovery(discoveryURL)

    const instances: Record<string, string> = {}
    if (data.instances) {
        data.instances?.forEach(it => instances[it.clusterName] = it.endpoint)
    }
    store.setClusters(instances)
}

const loadCurrentUsage = async (store: KoaStore, discoveryURL: string) => {
    runInAction(() => {
        store.currentLoad.state.loading = true

        const data = store.currentLoad.data
        getCurrentusage(discoveryURL)
            .then(res => {
                runInAction(() => {
                    res.clusterUsage?.forEach(it => {
                        data[it.clusterName]["cpu"] = [
                            { tag: "used", value: it.cpuUsed },
                            { tag: "available", value: 100 - it.cpuUsed }
                        ]
                        data[it.clusterName]["mem"] = [
                            { tag: "used", value: it.memUsed },
                            { tag: "available", value: 100 - it.memUsed }
                        ]
                    })
                    store.currentLoad.state.updatedAt = new Date()
                })
            })
            .finally(() => {
                runInAction(() => store.currentLoad.state.loading = false)
            })
    })
}

const loadResourcesUsage = async (store: KoaStore, discoveryURL: string) => {
    Object.keys(store.instances.data).forEach(clusterName => { // for all clusters
        seriesTypeValues.forEach(type => { // for each kind of series
            runInAction(() => {
                const series = computeIfAbsent(store.resourcesUsages[clusterName], type, (key) => ({ state: defaultState(), data: [] }))

                series.state.loading = true

                fetchSeries(discoveryURL, type)
                    .then(res => {
                        runInAction(() => {
                            const values: Record<string, IUsageHistoryItem> = {}
                            res.forEach(measurement => {
                                const item = computeIfAbsent(values, measurement.dateUTC.toISOString(), (key) => ({ tag: measurement.dateUTC }))

                                item[measurement.name] = measurement.usage
                            })

                            series.data = Object.keys(values).map(it => values[it]) // TODO: is there a better idiomatic way of retrieving values
                            series.state.updatedAt = new Date()
                        })
                    })
                    .finally(() => {
                        runInAction(() => series.state.loading = false)
                    })
            })
        })
    })
}