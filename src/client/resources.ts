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

const fetchSeriesFaked = async (): Promise<ISeriesPayload> => {
    const payload = [
        { "name": "kube-system", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() },
        { "name": "kube-system", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() },
        { "name": "kube-system", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() },
        { "name": "non-allocatable", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() * 50 },
        { "name": "non-allocatable", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() * 50 },
        { "name": "non-allocatable", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() * 50 },
        { "name": "default", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() * 25 },
        { "name": "default", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() * 25 },
        { "name": "default", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() * 25 },
        { "name": "linkerd", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() * 25 },
        { "name": "linkerd", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() * 25 },
        { "name": "linkerd", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() * 25 },
        { "name": "argo", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() },
        { "name": "argo", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() },
        { "name": "argo", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() },
        { "name": "monitoring", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() },
        { "name": "monitoring", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() },
        { "name": "monitoring", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() },
        { "name": "kubeless", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() },
        { "name": "kubeless", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() },
        { "name": "kubeless", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() }
    ]

    return new Promise((resolve, _) => {
        setTimeout(() => resolve(
            payload.map(it => ({ ...it, dateUTC: new Date(it.dateUTC) }))
        ), 20  /* ms */)
    })
}

export const fetchSeries = async (endpoint: string, type: SeriesType): Promise<ISeriesPayload> =>
    fetchSeriesFaked()