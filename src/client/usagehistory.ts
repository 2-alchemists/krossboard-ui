export interface IUsageHistoryItem {
	dateUTC: string
	value: number
}

export interface IGetUsageHistoryPayload {
	status: string
	message?: string
	clustersUsageHistory?: Record<string /* clustername*/, {
		cpuUsage: IUsageHistoryItem[]
		memUsage: IUsageHistoryItem[]
	}>
}

const getUsageHistoryFaked = async (): Promise<IGetUsageHistoryPayload> =>
	new Promise((resolve, _) => {
		setTimeout(() => resolve({
			"status": "ok",
			"clustersUsageHistory": {
				"gke_kubernetes-opex-analytics_us-central1-a_koa-dev": {
					"cpuUsage": [
						{
							"dateUTC": "2020-01-10T15:35:00Z",
							"value": 14.258297397180797
						},
						{
							"dateUTC": "2020-01-10T15:50:00Z",
							"value": 6.645603664899999
						},
						{
							"dateUTC": "2020-01-10T15:55:00Z",
							"value": 9.421281912809
						}
					],
					"memUsage": [
						{
							"dateUTC": "2020-01-10T15:35:00Z",
							"value": 91.74985422350002
						},
						{
							"dateUTC": "2020-01-10T15:50:00Z",
							"value": 45.8829871791
						},
						{
							"dateUTC": "2020-01-10T15:55:00Z",
							"value": 64.69386541766433
						}
					]
				},
				"gke_kubernetes-opex-analytics_us-central1-a_koamc-test-1": {
					"cpuUsage": [
						{
							"dateUTC": "2020-01-10T15:50:00Z",
							"value": 13.071534647310136
						},
						{
							"dateUTC": "2020-01-10T16:05:00Z",
							"value": 8.012650921866667
						},
						{
							"dateUTC": "2020-01-10T16:10:00Z",
							"value": 10.595404208698668
						}
					],
					"memUsage": [
						{
							"dateUTC": "2020-01-10T15:45:00Z",
							"value": 62.59192411439833
						},
						{
							"dateUTC": "2020-01-10T15:50:00Z",
							"value": 88.78249153983333
						},
						{
							"dateUTC": "2020-01-10T16:05:00Z",
							"value": 44.42215358563334
						}
					]
				},
				"gke_kubernetes-opex-analytics_us-central1-a_koamc-test-2": {
					"cpuUsage": [
						{
							"dateUTC": "2020-01-10T15:50:00Z",
							"value": 13.071534647310136
						},
						{
							"dateUTC": "2020-01-10T16:05:00Z",
							"value": 8.012650921866667
						},
						{
							"dateUTC": "2020-01-10T16:10:00Z",
							"value": 10.595404208698668
						}
					],
					"memUsage": [
						{
							"dateUTC": "2020-01-10T15:45:00Z",
							"value": 62.59192411439833
						},
						{
							"dateUTC": "2020-01-10T15:50:00Z",
							"value": 88.78249153983333
						},
						{
							"dateUTC": "2020-01-10T16:05:00Z",
							"value": 44.42215358563334
						}
					]
				}
			}
		}), 50 /* ms */)
	})

export const getUsageHistory = async (endpoint: string, startDateUTC?: Date, endDateUTC?: Date): Promise<IGetUsageHistoryPayload> =>
	getUsageHistoryFaked()
