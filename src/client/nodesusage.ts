/*
  Copyright (C) 2020  2ALCHEMISTS SAS.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*/

import axios from 'axios'

import { ResourceError } from '../store/model'

export interface INodeUsagesPayload {
    [node: string]: INodeUsagePayload
}

export interface INodeUsagePayload {
    allocatableItems: IResourceUsagePayload
    capacityItems: IResourceUsagePayload
    usageByPodItems: IResourceUsagePayload
}

export interface IResourceUsagePayload {
    cpuUsage: IResourceUsageValuesPayload
    memUsage: IResourceUsageValuesPayload
}

export type IResourceUsageValuesPayload = [IResourceUsageValuePayload] | null

export interface IResourceUsageValuePayload {
    dateUTC: string
    value: number
}

export const getNodesUsage = async (
    endpoint: string,
    clusterName: string,
    startDateUTC?: Date,
    endDateUTC?: Date
): Promise<INodeUsagesPayload> => {
    const resource = `/nodesusage/${clusterName}`

    return axios
        .get(getNodesUsageLink(`${endpoint}/api${resource}`, startDateUTC, endDateUTC))
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

export const getNodesUsageLink = (resource: string, startDateUTC?: Date, endDateUTC?: Date) => {
    let url = resource + '?'

    let prepend = ''

    if (startDateUTC) {
        url = url + `${prepend}startDateUTC=${toUTC(startDateUTC)}`
        prepend = '&'
    }

    if (endDateUTC) {
        url = url + `${prepend}endDateUTC=${toUTC(endDateUTC)}`
        prepend = '&'
    }

    return url
}

const toUTC = (date?: Date) => date?.toISOString().replace(/(\.\d*)?Z/, '')
