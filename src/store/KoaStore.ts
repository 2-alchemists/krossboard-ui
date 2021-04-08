import { sub } from 'date-fns'
import { action, computed, observable } from 'mobx'

import { ClusterEndpoint, ClusterName, defaultState, IError, IHarvesterState, IUsageHistoryItem, IWithHarvesterState, NodeName } from './model'

export class KoaStore {
    public get discoveryURL() {
        return window.location.hostname === 'localhost' ? 'http://localhost:1519' : `${window.location.protocol}//${window.location.host}`
    }
    @observable public pollingInterval: number = 5 * 60 * 1000 // ms

    @observable public instances: IWithHarvesterState<Record<ClusterName, ClusterEndpoint>> = { state: defaultState(), data: {} }
    @observable public currentLoad: IWithHarvesterState<Record<ClusterName, Record<string /*type*/, IUsageHistoryItem[]>>> = {
        state: defaultState(),
        data: {}
    }
    @observable public currentNodesLoad: Record<ClusterName, IWithHarvesterState<Record<NodeName, IUsageHistoryItem[]>>> = {}
    @observable public resourcesUsages: Record<ClusterName, Record<string /* type */, IWithHarvesterState<IUsageHistoryItem[]>>> = {}
    @observable public usageHistoryDateRange: Interval = { start: sub(new Date(), { hours: 24 }), end: new Date() }
    @observable public usageHistoryEndDate: Date | number = this.usageHistoryDateRange.end
    @observable public usageHistory: Record<'hourly' | 'monthly' /* period */, IWithHarvesterState<Record<'cpu' | 'mem' /* type */, IUsageHistoryItem[]>>> = {
        hourly: {
            state: defaultState(),
            data: {
                cpu: [],
                mem: []
            }
        },
        monthly: {
            state: defaultState(),
            data: {
                cpu: [],
                mem: []
            }
        }
    }
    @observable public nodesUsage: Record<ClusterName, IWithHarvesterState<IUsageHistoryItem[]>> = {}

    @action public setError = (state: IHarvesterState, e: any) => {
        const error: IError = {
            message: (() => {
                if (typeof e === 'string') {
                    return e as string
                }
                if (e.message) {
                    return e.message as string
                }
                return e.toString()
            })(),

            date: e.date ? (e.date as Date) : new Date(),
            resource: e.resource ? (e.resource as string) : null,
            seen: false
        }

        state.error = error
    }

    @action public clearError = (state: IHarvesterState) => {
        state.error = null
    }

    @action public markErrorsSeen = () => {
        return this.errors.forEach(err => (err.seen = true))
    }

    @computed public get errors() {
        return this.states.map(it => it.error).filter(it => it !== null) as IError[]
    }

    @computed public get hasErrors() {
        return this.errors.length > 0
    }

    @computed public get hasErrorsNotSeen() {
        return this.errors.filter(it => !it?.seen).length > 0
    }

    @computed public get loading() {
        return this.states.map(it => it.loading).reduce((a, b) => a || b, false)
    }

    @computed public get states() {
        return [
            this.instances.state,
            this.currentLoad.state,
            ...Object.keys(this.resourcesUsages)
                .map(it => this.resourcesUsages[it])
                .flatMap(it => Object.keys(it).map(ot => it[ot]))
                .map(it => it.state),
            this.usageHistory.hourly.state,
            this.usageHistory.monthly.state,
            ...Object.keys(this.currentNodesLoad)
               .map(it => this.currentNodesLoad[it])
               .map(it => it.state)
        ]
    }

    @computed
    public get isClustersEmpty() {
        return this.clusterNames.length === 0
    }

    @computed
    public get clusterNames() {
        return Object.keys(this.instances.data)
    }

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
