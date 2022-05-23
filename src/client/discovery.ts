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

export interface IGetDiscoveryPayload {
    status: string
    message?: string
    instances?: Array<{
        clusterName: string
        endpoint: string
    }>
}

export const getDiscovery = async (endpoint: string): Promise<IGetDiscoveryPayload> => {
    const resource = '/discovery'

    return axios
        .get(endpoint + '/api/discovery')
        .then(res => res.data)
        .then(data => {
            if (data.status === 'error') {
                throw new ResourceError(`Error returned from server: ${data.message ? data.message : 'unknown'}`, resource)
            }
            return data
        })
        .catch(e => {
            throw new ResourceError(e.toString(), resource)
        })
}
