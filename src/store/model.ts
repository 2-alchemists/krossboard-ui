export interface IHarvesterState {
    loading: boolean
    error?: string
    updatedAt: Date
}

export interface IWithHarvesterState {
    state: IHarvesterState
}

export type ClusterName = string
export type ClusterEndpoint = string

export interface IInstances extends IWithHarvesterState {
    clusters: Record<ClusterName, ClusterEndpoint>
}

export interface IUsages {
    currentUsage: ICurrentUsage
    usageHistories: Record<string, IUsageHistoryItems>
}

export interface ICurrentUsage extends IWithHarvesterState {
    cpuUsed: number
    memUsed: number
    cpuNonAllocatable: number
    memNonAllocatable: number
    outToDate: boolean
}

export interface IUsageHistoryItems extends IWithHarvesterState {
    values: Record<string, IUsageHistoryItem[]>
}

export interface IUsageHistoryItem {
    date: Date
    value: number
}

export const defaultState = (): IHarvesterState => ({
    loading: false,
    updatedAt: new Date()
})

export const defaultUsageHistoryItems = (): IUsageHistoryItems => ({
    state: defaultState(),
    values: {}
})