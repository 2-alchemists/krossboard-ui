import axios from 'axios'
import { ResourceError } from '../store/model'

export interface IGetCurrentUsagePayload {
	status: string
	message?: string
	clusterUsage?: Array<{
		clusterName: string
		cpuUsed: number
		memUsed: number
		cpuNonAllocatable: number
		memNonAllocatable: number
		outToDate: boolean
	}>
}

export const getCurrentusage = async (endpoint: string): Promise<IGetCurrentUsagePayload> => {
	const resource = '/currentusage'
	return axios.get(endpoint + '/api/currentusage')
		.then(res => res.data)
		.then(data => {
			if (data.status !== 'ok') {
				throw new ResourceError(`Error returned from server: ${data.message ? data.message : "unknown"}`, resource)
			}
			return data
		})
		.catch(e => { throw new ResourceError(e.toString(), resource) })
}