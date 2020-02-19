import { sub } from 'date-fns'
import { action, autorun, computed, observable, runInAction } from 'mobx'

import {
    ClusterEndpoint, ClusterName, defaultState, IHarvesterState, IUsageHistoryItem,
    IWithHarvesterState
} from './model'



export class KoaStore {
    public get discoveryURL() { return window.location.hostname === 'localhost' ? 'http://localhost:1519' : `${window.location.protocol}//${window.location.host}` }
    @observable public pollingInterval: number = 30000

    @observable public state: IHarvesterState = defaultState()
    @observable public instances: IWithHarvesterState<Record<ClusterName, ClusterEndpoint>> = { state: defaultState(), data: {} }
    @observable public currentLoad: IWithHarvesterState<Record<ClusterName, Record<string /*type*/, IUsageHistoryItem[]>>> = { state: defaultState(), data: {} }
    @observable public resourcesUsages: Record<ClusterName, Record<string /* type */, IWithHarvesterState<IUsageHistoryItem[]>>> = {}
    @observable public usageHistoryDateRange: Interval = { start: sub(new Date(), { hours: 24 }), end: new Date() }
    @observable public usageHistoryEndDate: Date | number = this.usageHistoryDateRange.end
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
        // starting from YYYY/MM/DD 00:00:00 Z
        const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))

        this.usageHistoryDateRange.start = target
    }

    @action
    public setUsageHistoryEndDate = (date: Date) => {
        // ending to YYYY/MM/DD 23:59:59 Z
        const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999))

        this.usageHistoryDateRange.end = target
        this.usageHistoryEndDate = target
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

autorun(() => {
    // FIXME: not efficient but does the job for now
    const state = (() => {
        if (koaStore.instances.state.loading) {
            return true
        }
        if (koaStore.currentLoad.state.loading) {
            return true
        }

        if (Object.keys(koaStore.resourcesUsages)
            .map(it => koaStore.resourcesUsages[it])
            .flatMap(it => Object.keys(it).map(ot => it[ot]))
            .map(it => it.state.loading)
            .reduce((a, b) => a || b, false)) {
            return true
        }

        if (koaStore.usageHistory.state.loading) {
            return true
        }

        return false
    })()

    if (koaStore.state.loading !== state) {
        runInAction(() => {
            if (koaStore.state.loading) {
                koaStore.state.updatedAt = new Date()
            }
            koaStore.state.loading = state
        })
    }
})