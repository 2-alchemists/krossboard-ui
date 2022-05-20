/*
Copyright (c) 2020 2Alchemists SAS.

This file is part of Krossboard.

Krossboard is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3
of the License, or (at your option) any later version.

Krossboard is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Krossboard.
If not, see <https://www.gnu.org/licenses/>.
*/

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
export type NodeName = string
export type PodName = string

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
