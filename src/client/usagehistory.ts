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

export interface IUsageHistoryItem {
    dateUTC: string
    value: number
}

export interface IGetUsageHistoryPayload {
    status: string
    message?: string
    usageHistory?: Record<
        string /* clustername*/,
        {
            cpuUsage: IUsageHistoryItem[]
            memUsage: IUsageHistoryItem[]
        }
    >
}

export enum FormatType {
    JSON = 'json',
    CSV = 'csv'
}

export enum PeriodType {
    HOURLY = 'hourly',
    MONTHLY = 'monthly'
}

export const getUsageHistory = async (endpoint: string, period: PeriodType, startDateUTC?: Date, endDateUTC?: Date): Promise<IGetUsageHistoryPayload> => {
    const resource = '/usagehistory'

    return axios
        .get(getUsageHistoryDownloadLink(endpoint, period, startDateUTC, endDateUTC))
        .then(res => res.data)
        .then(data => {
            if (data.status !== 'ok') {
                throw new ResourceError(`Error returned from server: ${data.message ? data.message : 'unknown'}`, resource)
            }

            // handle special case of result nullity
            if (data.usageHistory) {
                Object.keys(data.usageHistory).forEach(key => {
                    const value = data.usageHistory[key]
                    if (value.cpuUsage === null) {
                        value.cpuUsage = []
                    }
                    if (value.memUsage === null) {
                        value.memUsage = []
                    }
                })
            }

            return data
        })
        .catch(e => {
            throw new ResourceError(e.toString(), resource)
        })
}

export const getUsageHistoryDownloadLink = (endpoint: string, periodType?: PeriodType, startDateUTC?: Date, endDateUTC?: Date, formatType?: FormatType) => {
    let url = endpoint + '/api/usagehistory?'

    let prepend = ''

    if (periodType) {
        url = url + `${prepend}period=${periodType}`
        prepend = '&'
    }

    if (startDateUTC) {
        url = url + `${prepend}startDateUTC=${toUTC(startDateUTC)}`
        prepend = '&'
    }

    if (endDateUTC) {
        url = url + `${prepend}endDateUTC=${toUTC(endDateUTC)}`
        prepend = '&'
    }

    if (formatType) {
        url = url + `${prepend}format=${formatType}`
        prepend = '&'
    }

    return url
}

const toUTC = (date?: Date) =>
    date?.toISOString().replace(/(\.\d*)?Z/, "")
