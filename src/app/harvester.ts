import { useEffect, useReducer, useState } from 'react'

import useInterval from '@use-it/interval'

import { fetchClusters } from '../client/cluster'
import { fetchSeries } from '../client/resources'

export interface ICluster {
    clusterName: string
    endpoint: string
}

export type IClusters = ICluster[]

export interface IAudit {
    harvestedAt: Date
    lastHarvestedSuccessAt: Date
}

export interface IHarvesterState {
    loading: boolean
    progress?: number
    error?: string
    updateDate: string
}

export interface IHarvesterOptions {
    discoveryURL: string
    pollingInterval?: number
}

export interface ISeriesSpec {
    clusterName: string
    type: SeriesType
    endpoint: string
}

export interface IMeasurement {
    name: string
    dateUTC: Date
    usage: number
}

export interface ISeries extends ISeriesSpec {
    state: IHarvesterState
    measurements: IMeasurement[]
}

export type ISeriesSet = ISeries[]

export enum SeriesType {
    cpu_usage_trends,
    memory_usage_trends,
    cpu_usage_period_1209600,
    memory_usage_period_1209600,
    cpu_usage_period_31968000,
    memory_usage_period_31968000
}

const seriesTypeValues = [
    SeriesType.cpu_usage_trends,
    SeriesType.memory_usage_trends,
    SeriesType.cpu_usage_period_1209600,
    SeriesType.memory_usage_period_1209600,
    SeriesType.cpu_usage_period_31968000,
    SeriesType.memory_usage_period_31968000]

type SeriesSetAction =
    | { type: 'prepare', seriesSpecs: ISeriesSpec[] }
    | { type: 'resolve', seriesSpec: ISeriesSpec, measurements: IMeasurement[] }

export const useHarvester = ({
    // Endpoint from which all discovered clusters are retrieved. 
    discoveryURL,
    // Interval (ms) at which you want your component to poll for data.
    // Defaults to 0 (no polling).
    pollingInterval = 0
}: IHarvesterOptions): [Readonly<IHarvesterState>, Readonly<IClusters>, Readonly<ISeriesSet>] => {
    const [loadingState, setLoadingState] = useState({ loading: false } as IHarvesterState)
    const [clusters, setClusters] = useState([] as IClusters)
    const [seriesSet, dispatchSeries] = useReducer(
        (state: ISeriesSet, a: SeriesSetAction) => {
            switch (a.type) {
                case 'prepare':
                    // retain old clusters existing in new discovery ones     
                    const olds: ISeriesSet =
                        state
                            .filter(it => a.seriesSpecs.findIndex(s => s.clusterName === it.clusterName) !== -1)
                            .map(s => ({
                                ...s,
                                state: { ...s.state, loading: true },
                            }))
                    // add new discovery clusters not present in old ones (in loading state)
                    const news: ISeriesSet =
                        a.seriesSpecs
                            .filter(it => state.findIndex(s => s.clusterName === it.clusterName) === -1)
                            .map(s => ({
                                ...s,
                                state: { loading: true, updateDate: new Date("1970-1-1").toISOString() },
                                measurements: []
                            }))
                    return [
                        ...olds,
                        ...news
                    ]
                case 'resolve':
                    const series = state.find(it => (it.clusterName === a.seriesSpec.clusterName) && (it.type === a.seriesSpec.type))

                    if (series) {
                        series.measurements = a.measurements
                        series.state = { loading: false, updateDate: new Date().toISOString() }
                    }

                    // update progress
                    const total = state.length
                    const count = state.filter(it => !it.state.loading).length

                    setLoadingState({
                        ...loadingState,
                        loading: total !== count,
                        progress: total === 0 ? 0 : count * 100 / total
                    })

                    return state
            }
        },
        [] as ISeriesSet
    )

    const doHarvest = async () => {
        setLoadingState({ ...loadingState, loading: true })

        try {
            const data = await fetchClusters(discoveryURL)
            const instances = data.instances ? data.instances : []

            setClusters(instances)

            // prepare
            const seriesSpecs: ISeriesSpec[] = []
            for (const type of seriesTypeValues) {
                for (const cluster of instances) {
                    seriesSpecs.push({
                        type,
                        clusterName: cluster.clusterName,
                        endpoint: `${cluster.endpoint}/${type}.json`
                    })
                }
            }

            dispatchSeries({
                type: 'prepare',
                seriesSpecs
            })

            // load
            for (const seriesSpec of seriesSpecs) {
                const measurements = await fetchSeries(seriesSpec.endpoint)

                dispatchSeries({
                    type: 'resolve',
                    seriesSpec,
                    measurements
                })
            }
        } catch (e) {
            console.log("error:", e)
            setLoadingState({ ...loadingState, loading: false, error: e.toString() })
            return
        }
    }

    useEffect(() => {
        doHarvest()
    }, [])

    useInterval(() => {
        doHarvest()
    }, pollingInterval === 0 ? null : pollingInterval)

    return [
        loadingState,
        clusters,
        seriesSet
    ]
}