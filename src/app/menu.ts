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
            secondary: 'current resources consumption',
            view: ClusterUsageCurrentView
        },
        {
            to: '/clusters-usage/history',
            primary: 'Clusters usage',
            secondary: 'usage history',
            view: ClusterUsageHistoryView
        }
    ],
    [
        {
            to: '/namespaces-usage',
            primary: 'Namespaces usage',
            secondary: 'namespaces usage',
            view: NamespaceUsageView
        }
    ],
    [
        {
            to: '/node-usages/pods-consumption-occupation',
            primary: 'Nodes usage',
            secondary: 'pods consumption & occupation',
            view: NodeUsageRecentOccupationView
        },
        {
            to: '/node-usages/history',
            primary: 'Nodes usage',
            secondary: 'usage history',
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
