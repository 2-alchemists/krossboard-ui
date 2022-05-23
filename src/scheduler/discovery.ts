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
                        if( data.status === 'warning' ) {
                            koaStore.setError(koaStore.instances.state, { message: data.message, resource: 'license' })
                        } else {
                            koaStore.clearError(koaStore.instances.state)
                        }
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
