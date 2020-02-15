import axios from 'axios'

import { parse } from 'date-fns'
import { ResourceError } from '../store/model'

export interface IMeasurementPayload {
    name: string
    dateUTC: Date
    usage: number
}

export type ISeriesPayload = IMeasurementPayload[]

export enum SeriesType {
    cpu_usage_trends = "cpu_usage_trends",
    memory_usage_trends = "memory_usage_trends",
    cpu_usage_period_1209600 = "cpu_usage_period_1209600",
    memory_usage_period_1209600 = "memory_usage_period_1209600",
    cpu_usage_period_31968000 = "cpu_usage_period_31968000",
    memory_usage_period_31968000 = "memory_usage_period_31968000"
}

export const seriesTypeValues = [
    SeriesType.cpu_usage_trends,
    SeriesType.memory_usage_trends,
    SeriesType.cpu_usage_period_1209600,
    SeriesType.memory_usage_period_1209600,
    SeriesType.cpu_usage_period_31968000,
    SeriesType.memory_usage_period_31968000,
]

export const fetchSeries = async (endpoint: string, clusterName: string, type: SeriesType): Promise<ISeriesPayload> => {
    const resource = `/dataset/${type}`

    return axios
        .get(endpoint + `/api/dataset/${type}.json`, { headers: { 'X-Krossboard-Cluster': clusterName } })
        .then(res => res.data)
        .then(data => {
            switch (type) {
                case SeriesType.cpu_usage_trends:
                case SeriesType.memory_usage_trends:
                    // e.g.:
                    return data.map((it: any) => ({ ...it, dateUTC: new Date(it.dateUTC) }))

                case SeriesType.cpu_usage_period_1209600:
                case SeriesType.memory_usage_period_1209600: {
                    const year = new Date().getFullYear()
                    const defaultDate = new Date(year, 0)
                    // e.g.: 22 Jan
                    return data.map((it: any) => ({ name: it.stack, dateUTC: parse(`${it.date} (Z)`, 'dd MMM (x)', defaultDate), usage: it.usage }))
                }
                case SeriesType.cpu_usage_period_31968000:
                case SeriesType.memory_usage_period_31968000: {
                    const year = new Date().getFullYear()
                    const defaultDate = new Date(year, 0, 1)
                    // e.g.: Jan 2020
                    return data.map((it: any) => ({ name: it.stack, dateUTC: parse(`${it.date} (Z)`, 'MMM yyyy (x)', defaultDate), usage: it.usage }))
                }
            }
        })
        .then(data => data as ISeriesPayload)
        .then(data => data.map(it => ({ ...it, dateUTC: new Date(it.dateUTC) })))
        .catch(e => { throw new ResourceError(e.toString(), resource) })
    }