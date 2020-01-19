import { autorun, runInAction } from 'mobx'

import { getDiscovery } from '../client/discovery'
import { koaStore } from '../store/KoaStore'

autorun(async () => {
    if (koaStore.discoveryURL !== "") {
        runInAction(() => {
            koaStore.instances.state.loading = true
        })
        const data = await getDiscovery(koaStore.discoveryURL)

        runInAction(() => {
            const instances: Record<string, string> = {}
            if (data.instances) {
                data.instances?.forEach(it => instances[it.clusterName] = it.endpoint)
            }
            koaStore.setClusters(instances)
            koaStore.instances.state.loading = false
            koaStore.instances.state.updatedAt = new Date()
        })
    }
}, { scheduler: (run: any) => { run(); setInterval(run, koaStore.pollingInterval) } })
