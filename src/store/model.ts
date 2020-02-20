export class ResourceError extends Error {
    public readonly resource: string
    public readonly date: Date
    constructor(message: string, resource: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
        this.resource = resource
        this.date = new Date()
    }
}

export interface IError {
    date: Date
    message: string
    resource: string | null
    seen?: boolean
}

export interface IHarvesterState {
    loading: boolean
    error: IError | null
    updatedAt: Date
}

export interface IWithHarvesterState<T> {
    state: IHarvesterState
    data: T
}

export type ClusterName = string
export type ClusterEndpoint = string

export interface IUsageHistoryItem {
    tag: string | number
    [_: string]: string | Date | number
}

export const defaultState = (): IHarvesterState => ({
    loading: false,
    error: null,
    updatedAt: new Date()
})

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

