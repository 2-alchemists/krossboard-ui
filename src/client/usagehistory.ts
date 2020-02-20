import axios from 'axios'
import { ResourceError } from '../store/model'

export interface IUsageHistoryItem {
	dateUTC: string
	value: number
}

export interface IGetUsageHistoryPayload {
	status: string
	message?: string
	usageHistory?: Record<string /* clustername*/, {
		cpuUsage: IUsageHistoryItem[]
		memUsage: IUsageHistoryItem[]
	}>
}

export const getUsageHistory = async (endpoint: string, startDateUTC?: Date, endDateUTC?: Date): Promise<IGetUsageHistoryPayload> => {
	const resource = '/usagehistory'

	return axios
		.get(endpoint + '/api/usagehistory',
			{ params: { startDate: startDateUTC?.toISOString(), endDate: endDateUTC?.toISOString() } }
		)
		.then(res => res.data)
		.then(data => {
			if (data.status !== 'ok') {
				throw new ResourceError(`Error returned from server: ${data.message ? data.message : "unknown"}`, resource)
			}
			return data
		})
		.catch(e => { throw new ResourceError(e.toString(), resource) })
	}