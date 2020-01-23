import axios from 'axios'

export interface IGetDiscoveryPayload {
	status: string
	message?: string
	instances?: Array<{
		clusterName: string
		endpoint: string
	}>
}

export const getDiscovery = async (endpoint: string): Promise<IGetDiscoveryPayload> =>
	axios.get(endpoint + '/discovery')
		.then(res => res.data)
