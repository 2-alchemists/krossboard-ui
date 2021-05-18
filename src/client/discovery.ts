import axios from 'axios'
import { ResourceError } from '../store/model'

export interface IGetDiscoveryPayload {
    status: string
    message?: string
    instances?: Array<{
        clusterName: string
        endpoint: string
    }>
}

export const getDiscovery = async (endpoint: string): Promise<IGetDiscoveryPayload> => {
    const resource = '/discovery'

    return axios
        .get(endpoint + '/api/discovery')
        .then(res => res.data)
        .then(data => {
            if (data.status === 'error') {
                throw new ResourceError(`Error returned from server: ${data.message ? data.message : 'unknown'}`, resource)
            }
            return data
        })
        .catch(e => {
            throw new ResourceError(e.toString(), resource)
        })
}
