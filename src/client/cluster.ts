export interface IClustersResourcePayload {
	status: string
	message?: string
	instances?: Array<{
		clusterName: string
		endpoint: string
	}>
}

const fetchClustersFaked = async (): Promise<IClustersResourcePayload> =>
	new Promise((resolve, _) => {
		setTimeout(() => resolve({
			status: 'ok',
			instances: [
				{
					clusterName: 'gke_kubernetes-opex-analytics_us-central1-a_koa-dev',
					endpoint: 'http://127.0.0.1:49008'
				},
				{
					clusterName: 'gke_kubernetes-opex-analytics_us-central1-a_koamc-test-1',
					endpoint: 'http://127.0.0.1:49009'
				},
				{
					clusterName: 'gke_kubernetes-opex-analytics_us-central1-a_koamc-test-2',
					endpoint: 'http://127.0.0.1:49010'
				}
			]
		}), 50 /* ms */)
	})

export const fetchClusters = async (endpoint: string): Promise<IClustersResourcePayload> =>
	fetchClustersFaked()
