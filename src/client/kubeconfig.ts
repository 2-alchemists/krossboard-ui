import axios from 'axios'
import { ResourceError } from '../store/model'

export interface IGetDiscoveryPayload {
    status: string
    message?: string
}

export const uploadKubeconfig = async (
    endpoint: string,
    kubeconfig: File,
    onProgress?: (progressEvent: any) => void
): Promise<void> => {
    const resource = `/kubeconfig`

    const bodyFormData = new FormData()

    bodyFormData.append('kubeconfig', kubeconfig)

    return axios
        .post(endpoint + `/api${resource}`, bodyFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: onProgress
        })
        .then(res => res.data)
        .then((data: IGetDiscoveryPayload) => {
            if (data.status !== 'ok') {
                throw new ResourceError(`${data.message ? data.message : 'unknown'}`, resource)
            }
        })
        .catch(e => {
            throw new ResourceError(e.toString(), resource)
        })
}
