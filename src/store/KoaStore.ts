import { sub } from 'date-fns'
import { action, computed, observable } from 'mobx'

import {
    ClusterEndpoint, ClusterName, defaultState, IHarvesterState, IUsageHistoryItem,
    IWithHarvesterState
} from './model'

export class KoaStore {
    @observable public discoveryURL: string = "http://localhost:8080/discovery"
    @observable public pollingInterval: number = 6000

    @observable public state: IHarvesterState = defaultState()
    @observable public instances: IWithHarvesterState<Record<ClusterName, ClusterEndpoint>> = { state: defaultState(), data: {} }
    @observable public currentLoad: IWithHarvesterState<Record<ClusterName, Record<string /*type*/, IUsageHistoryItem[]>>> = { state: defaultState(), data: {} }
    @observable public resourcesUsages: Record<ClusterName, Record<string /* type */, IWithHarvesterState<IUsageHistoryItem[]>>> = {}
    @observable public usageHistoryDateRange: Interval = { start: sub(new Date(), { hours: 24 }), end: new Date() }
    @observable public usageHistory: IWithHarvesterState<Record<"cpu" | "mem" /* type */, IUsageHistoryItem[]>> = { state: defaultState(), data: { cpu: [], mem: [] } }

    @computed
    public get isClustersEmpty() { return this.clusterNames.length === 0 }

    @computed
    public get clusterNames() { return Object.keys(this.instances.data) }

    @action
    public setClusters = (clusters: Record<ClusterName, ClusterEndpoint>) => {
        // remove old clusters not existing in new ones    
        for (const key of Object.keys(this.instances.data)) {
            if (!clusters[key]) {
                this.deleteCluster(key)
            }
        }

        // add new clusters
        for (const key of Object.keys(clusters)) {
            this.addCluster(key, clusters[key])
        }
    }

    @action
    public setUsageHistoryStartDate = (date: Date) => {
        this.usageHistoryDateRange.start = date
    }

    @action
    public setUsageHistoryEndDate = (date: Date) => {
        this.usageHistoryDateRange.end = date
    }

    protected addCluster = (name: string, endpoint: string) => {
        if (!this.instances.data[name]) {
            this.currentLoad.data[name] = {}
            this.resourcesUsages[name] = {}
            this.instances.data[name] = endpoint
        }
    }

    protected deleteCluster = (cluster: string) => {
        delete this.instances.data[cluster]
        delete this.currentLoad.data[name]
        delete this.resourcesUsages[name]
    }
}

export const koaStore = new KoaStore()