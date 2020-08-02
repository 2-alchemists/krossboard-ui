import axios from 'axios'
import { ResourceError } from '../store/model'

export interface IUsageHistoryItem {
    dateUTC: string
    value: number
}

export interface IGetUsageHistoryPayload {
    status: string
    message?: string
    usageHistory?: Record<
        string /* clustername*/,
        {
            cpuUsage: IUsageHistoryItem[]
            memUsage: IUsageHistoryItem[]
        }
    >
}

export enum FormatType {
    JSON = 'json',
    CSV = 'csv'
}

export const getUsageHistory = async (endpoint: string, startDateUTC?: Date, endDateUTC?: Date): Promise<IGetUsageHistoryPayload> => {
    const resource = '/usagehistory'

    return axios
        .get(getUsageHistoryDownloadLink(endpoint, startDateUTC, endDateUTC))
        .then(res => res.data)
        .then(data => {
            if (data.status !== 'ok') {
                throw new ResourceError(`Error returned from server: ${data.message ? data.message : 'unknown'}`, resource)
            }
            return data
        })
        .catch(e => {
            throw new ResourceError(e.toString(), resource)
        })
}

export const getUsageHistoryDownloadLink = (endpoint: string, startDateUTC?: Date, endDateUTC?: Date, formatType?: FormatType) => {
    let url = endpoint + '/api/usagehistory?'

    let prepend = ''

    if (startDateUTC) {
        url = url + `${prepend}startDateUTC=${toUTC(startDateUTC)}`
        prepend = '&'
    }

    if (endDateUTC) {
        url = url + `${prepend}endDateUTC=${toUTC(endDateUTC)}`
        prepend = '&'
    }

    if (formatType) {
        url = url + `${prepend}format=${formatType}`
        prepend = '&'
    }

    return url
}

const toUTC = (date?: Date) =>
    date?.toISOString().replace(/(\.\d*)?Z/, "")
