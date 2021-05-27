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
            to: '/cluster-usage/current',
            primary: 'Clusters usage',
            secondary: 'Current usage',
            view: ClusterUsageCurrentView
        },
        {
            to: '/cluster-usage/history',
            primary: 'Clusters usage',
            secondary: 'Usage history',
            view: ClusterUsageHistoryView
        }
    ],
    [
        {
            to: '/namespace-usage',
            primary: 'Namespaces usage',
            secondary: 'Namespaces usage',
            view: NamespaceUsageView
        }
    ],
    [
        {
            to: '/node-usage/recent-occupation',
            primary: 'Nodes usage',
            secondary: 'Recent occupation',
            view: NodeUsageRecentOccupationView
        },
        {
            to: '/node-usage/history',
            primary: 'Nodes usage',
            secondary: 'Usage history',
            view: NodeUsageHistoryView
        }
    ]
]

export const homeMenu = menus[0][0]

export const useMatchingMenus: () => IMenuWithMatches[] = () => {
    const { pathname } = useLocation()

    let currentGroup = 0
    const matchingMenus = menus.map(it => {
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
            return { ...it[0], matching: false, hasChildren, group }
        }
    })

    return matchingMenus
}
