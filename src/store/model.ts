export interface IHarvesterState {
    loading: boolean
    error?: string
    updatedAt: Date
}

export interface IWithHarvesterState<T> {
    state: IHarvesterState
    data: T
}

export type ClusterName = string
export type ClusterEndpoint = string

export interface IUsageHistoryItem {
    tag: string | Date | number
    [_: string]: string | Date | number
}

export const defaultState = (): IHarvesterState => ({
    loading: false,
    updatedAt: new Date()
})

export function withInitializedState<T>(withState: IWithHarvesterState<T>): IWithHarvesterState<T> {
    if (!withState.state) {
        withState.state = defaultState()
    }

    return withState
}

/* If the specified key is not already associated with a value (or is mapped to null), 
 * attempts to compute its value using the given mapping function and enters it into this map unless null.
 */
export function computeIfAbsent<K extends keyof any, V>(record: Record<K, V>, key: K, mappingFunction: (key: K) => V): V {
    let value = record[key]
    if (!value) {
        const newValue = mappingFunction(key)
        if (newValue) {
            record[key] = newValue
            value = newValue
        }
    }
    return value
}
