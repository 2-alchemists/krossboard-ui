import { autorun, runInAction } from 'mobx'

import { getDiscovery } from '../client/discovery'
import { koaStore } from '../store/KoaStore'

autorun(
    async () => {
        if (koaStore.discoveryURL !== '') {
            runInAction(() => {
                koaStore.instances.state.loading = true
            })

            getDiscovery(koaStore.discoveryURL)
                .then(data => {
                    runInAction(() => {
                        const instances: Record<string, string> = {}
                        if (data.instances) {
                            data.instances?.forEach(it => (instances[it.clusterName] = it.endpoint))
                        }
                        koaStore.setClusters(instances)
                        koaStore.instances.state.updatedAt = new Date()
                        koaStore.clearError(koaStore.instances.state)
                    })
                })
                .catch(e => {
                    runInAction(() => {
                        koaStore.setError(koaStore.instances.state, e)
                    })
                })
                .finally(() => {
                    runInAction(() => {
                        koaStore.instances.state.loading = false
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
