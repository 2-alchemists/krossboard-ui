import axios from 'axios'

import { ResourceError } from '../store/model'

export interface INodeUsagePayload {
    dateUTC: string
    name: string
    state: string
    message: string
    cpuCapacity: number
    cpuAllocatable: number
    cpuUsage: number
    memCapacity: number
    memAllocatable: number
    memUsage: number
}

export const getNodesUsage = async (endpoint: string, clusterName: string): Promise<INodeUsagePayload[]> => {
    const resource = `/nodesusage/${clusterName}`
    return axios
        .get(endpoint + `/api${resource}`)
        .then(res => res.data)
        .then(data => {
            if (data.status && data.status !== 'ok') {
                throw new ResourceError(`Error returned from server: ${data.message ? data.message : 'unknown'}`, resource)
            }
            return data
        })
        .catch(e => {
            throw new ResourceError(e.toString(), resource)
        })
}
