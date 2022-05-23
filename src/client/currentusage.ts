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

export interface IGetCurrentUsagePayload {
    status: string
    message?: string
    clusterUsage?: Array<{
        clusterName: string
        cpuUsed: number
        memUsed: number
        cpuNonAllocatable: number
        memNonAllocatable: number
        outToDate: boolean
    }>
}

export const getCurrentusage = async (endpoint: string): Promise<IGetCurrentUsagePayload> => {
    const resource = '/currentusage'
    return axios
        .get(endpoint + '/api/currentusage')
        .then(res => res.data)
        .then(data => {
            if (data.status !== 'ok') {
                throw new ResourceError(`Error returned from server: ${data.message ? data.message : 'unknown'}`, resource)
            }
            return data
        })
        .catch(e => {
            throw new ResourceError(e.toString(), resource)
        })
}
