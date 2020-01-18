import { autorun } from 'mobx'

import { getDiscovery } from '../client/discovery'
import { koaStore } from '../store/KoaStore'

autorun(async () => {
    if (koaStore.discoveryURL !== "") {
        koaStore.instances.state.loading = true
        const data = await getDiscovery(koaStore.discoveryURL)

        const instances: Record<string, string> = {}
        if (data.instances) {
            data.instances?.forEach(it => instances[it.clusterName] = it.endpoint)
        }
        koaStore.setClusters(instances)
    }
}, { scheduler: (run: any) => { run(); setInterval(run, koaStore.pollingInterval) } })
