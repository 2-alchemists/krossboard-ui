import { action, observable } from 'mobx'

import {
    ClusterEndpoint, ClusterName, defaultState, IHarvesterState, IUsageHistoryItem,
    IWithHarvesterState
} from './model'

export class KoaStore {
    @observable public state: IHarvesterState = defaultState()
    @observable public instances: IWithHarvesterState<Record<ClusterName, ClusterEndpoint>> = { state: defaultState(), data: {} }
    @observable public currentLoad: IWithHarvesterState<Record<ClusterName, Record<string /*type*/, IUsageHistoryItem[]>>> = { state: defaultState(), data: {} }
    @observable public resourcesUsages: Record<ClusterName, Record<string /* type */, IWithHarvesterState<IUsageHistoryItem[]>>> = {}


    public isClustersEmpty = () => (this.clusterNames().length === 0)

    public clusterNames = () => (Object.keys(this.instances.data))

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
    public addCluster = (name: string, endpoint: string) => {
        if (!this.instances.data[name]) {
            this.currentLoad.data[name] = {}
            this.resourcesUsages[name] = {}
            this.instances.data[name] = endpoint
        }
    }

    @action
    public deleteCluster = (cluster: string) => {
        delete this.instances.data[cluster]
        delete this.currentLoad.data[name]
        delete this.resourcesUsages[name]
    }
}

export const koaStore = new KoaStore()