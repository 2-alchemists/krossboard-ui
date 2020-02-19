import axios from 'axios'

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

export const getCurrentusage = async (endpoint: string): Promise<IGetCurrentUsagePayload> =>
	axios.get(endpoint + '/api/currentusage')
		.then(res => res.data)
