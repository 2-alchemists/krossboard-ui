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

import axios from 'axios'
import { ResourceError } from '../store/model'

export type NodeName = string

export type IGetDatasetNodesPayload = Record<NodeName, INodePayload>

export interface INodePayload {
    id: string
    name: string
    state: string
    message: string
    cpuCapacity: number
    cpuAllocatable: number
    cpuUsage: number
    memCapacity: number
    memAllocatable: number
    memUsage: number
    containerRuntime: string
    podsRunning: IPodPayload[]
    podsNotRunning: IPodPayload[]
}

export interface IPodPayload {
    id: string
    name: string
    nodeName: string
    phase: string
    state: string
    cpuUsage: number
    memUsage: number
}

export const getCurrentNodesUsage = async (endpoint: string, clusterName: string ): Promise<IGetDatasetNodesPayload> => {
    const resource = '/dataset/nodes.json'
    return axios
        .get(endpoint + `/api${resource}`, { headers: { 'X-Krossboard-Cluster': clusterName } })
        .then(res => res.data)
        .then(data => {
            if (data.status && data.status !== 'ok') {
                throw new ResourceError(`Error returned from server: ${data.message ? data.message : 'unknown'}`, resource)
            }
            return data
        })
        .catch(e => {
            throw new ResourceError(e.toString(), resource)
        })
}
