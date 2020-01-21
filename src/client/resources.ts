import axios from 'axios'

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

export const fetchSeries = async (endpoint: string, type: SeriesType): Promise<ISeriesPayload> =>
    axios
        .get(endpoint + `/resource/${type}.json`)
        .then(res => res.data as ISeriesPayload)
        .then(data => data.map(it => ({ ...it, dateUTC: new Date(it.dateUTC) })))