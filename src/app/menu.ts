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

import { useEffect, useState } from 'react'
import { matchPath, useLocation } from 'react-router'
import { ClusterUsageCurrentView } from '../pages/ClusterUsageCurrent'
import { ClusterUsageHistoryView } from '../pages/ClusterUsageHistory'
import { NamespaceUsageView } from '../pages/NamespaceUsage'
import { NodeUsageHistoryView } from '../pages/NodeUsageHistory'
import { NodeUsageRecentOccupationView } from '../pages/NodeUsageRecentOccupation'

export interface IMenu {
    to: string
    primary: string
    secondary: string
    view: () => JSX.Element
}

export interface IMenuWithMatches extends IMenu {
    // The group into which the menu belongs.
    group: number,
    // Tells if the menu matches the browser route.
    matching: boolean
    // Tells if the current menu has other entries in the same group.
    hasChildren: boolean
}

export const menus: IMenu[][] = [
    [
        {
            to: '/clusters-usage/current',
            primary: 'Clusters usage',
            secondary: 'Current Resources Consumption',
            view: ClusterUsageCurrentView
        },
        {
            to: '/clusters-usage/history',
            primary: 'Clusters usage',
            secondary: 'Usage History',
            view: ClusterUsageHistoryView
        }
    ],
    [
        {
            to: '/namespaces-usage',
            primary: 'Namespaces usage',
            secondary: 'Namespaces Usage',
            view: NamespaceUsageView
        }
    ],
    [
        {
            to: '/node-usages/pods-consumption-occupation',
            primary: 'Nodes usage',
            secondary: 'Pods Consumption & Occupation',
            view: NodeUsageRecentOccupationView
        },
        {
            to: '/node-usages/history',
            primary: 'Nodes usage',
            secondary: 'Usage History',
            view: NodeUsageHistoryView
        }
    ],
]

export const homeMenu = menus[0][0]

export const useMatchingMenus: () => IMenuWithMatches[] = () => {
    const [matchingMenus, setMatchingMenus] = useState([] as IMenuWithMatches[])
    const { pathname } = useLocation()

    useEffect( () => {
        let currentGroup = 0
        const newMenus = menus.map(it => {
            const found: IMenu | undefined = it.find(
                (menu: IMenu) =>
                    matchPath(pathname, {
                        path: menu.to,
                        exact: false,
                        strict: false
                    }) !== null
            )
            const hasChildren = it.length > 1
            const group = currentGroup
    
            currentGroup++
    
            if (found) {
                return { ...found, matching: true, hasChildren, group }
            } else {
                const menu = matchingMenus.length > 0 ? matchingMenus[group] : it[0]
                return { ...menu, matching: false, hasChildren, group }
            }
        })

        setMatchingMenus(newMenus)
    }, [pathname])

    return matchingMenus
}
