import axios from 'axios'

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

export const getUsageHistory = async (endpoint: string, startDateUTC?: Date, endDateUTC?: Date): Promise<IGetUsageHistoryPayload> =>
	axios
		.get(endpoint + '/api/usagehistory',
			{ params: { startDate: startDateUTC?.toISOString(), endDate: endDateUTC?.toISOString() } }
		)
		.then(res => res.data)
