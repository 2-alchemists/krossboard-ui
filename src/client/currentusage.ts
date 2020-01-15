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

const getCurrentusageFaked = async (): Promise<IGetCurrentUsagePayload> =>
	new Promise((resolve, _) => {
		const randomUsage = () => Math.floor(Math.random() * 100)		
		setTimeout(() => resolve({
			"status": "ok",
			"clusterUsage": [
				{
					"clusterName": "gke_kubernetes-opex-analytics_us-central1-a_koa-dev",
					"cpuUsed": randomUsage(),
					"memUsed": randomUsage(),
					"cpuNonAllocatable": 0,
					"memNonAllocatable": 0,
					"outToDate": true
				},
				{
					"clusterName": "gke_kubernetes-opex-analytics_us-central1-a_koamc-test-1",
					"cpuUsed": randomUsage(),
					"memUsed": randomUsage(),
					"cpuNonAllocatable": 6,
					"memNonAllocatable": 28.656786999999998,
					"outToDate": false
				},
				{
					"clusterName": "gke_kubernetes-opex-analytics_us-central1-a_koamc-test-2",
					"cpuUsed": randomUsage(),
					"memUsed": randomUsage(),
					"cpuNonAllocatable": 0,
					"memNonAllocatable": 0,
					"outToDate": true
				}
			]
		}), 50 /* ms */)
	})

export const getCurrentusage = async (endpoint: string): Promise<IGetCurrentUsagePayload> =>
	getCurrentusageFaked()
