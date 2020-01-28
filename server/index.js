// Quick & dirty implementation of the server which mimics backend, for testing purposes.
const express = require('express')
const cors = require('cors')
const app = express()
const port = 1519

app.use(cors())

app.listen(1519, () => console.log(`Listening on port ${port}!`))

app.get('/', (req, res) => res.send('I\m running!'))

app.get('/discovery', (req, res) => {
    res.json(
        {
            status: 'ok',
            instances: [
                {
                    clusterName: 'gke_kubernetes-opex-analytics_us-central1-a_koa-dev',
                    endpoint: `http://${req.hostname}:${port}/49008`
                },
                {
                    clusterName: 'gke_kubernetes-opex-analytics_us-central1-a_koamc-test-1',
                    endpoint: `http://${req.hostname}:${port}/49009`
                },
                {
                    clusterName: 'gke_kubernetes-opex-analytics_us-central1-a_koamc-test-2',
                    endpoint: `http://${req.hostname}:${port}/49010`
                }
            ]
        })
})

app.get('/currentusage', (req, res) => {
    const randomUsage = () => Math.floor(Math.random() * 100)
    res.json(
        {
            "status": "ok",
            "clusterUsage": [
                {
                    "clusterName": "gke_kubernetes-opex-analytics_us-central1-a_koa-dev",
                    "cpuUsed": randomUsage(),
                    "memUsed": randomUsage(),
                    "cpuNonAllocatable": 0,
                    "memNonAllocatable": 0,
                    "outToDate": true
                },
                {
                    "clusterName": "gke_kubernetes-opex-analytics_us-central1-a_koamc-test-1",
                    "cpuUsed": randomUsage(),
                    "memUsed": randomUsage(),
                    "cpuNonAllocatable": 6,
                    "memNonAllocatable": 28.656786999999998,
                    "outToDate": false
                },
                {
                    "clusterName": "gke_kubernetes-opex-analytics_us-central1-a_koamc-test-2",
                    "cpuUsed": randomUsage(),
                    "memUsed": randomUsage(),
                    "cpuNonAllocatable": 0,
                    "memNonAllocatable": 0,
                    "outToDate": true
                }
            ]
        }
    )
})

app.get('/usagehistory', (req, res) => {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 86400000)
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date()

    const series = () => {
        const values = []
        for (t = startDate.getTime(); t < endDate.getTime(); t += 3600000) {
            values.push({
                "dateUTC": new Date(t).toISOString(),
                "value": Math.floor(Math.random() * 100)
            })
        }
        return values
    }

    res.json(
        {
            "status": "ok",
            "usageHistory": {
                "gke_kubernetes-opex-analytics_us-central1-a_koa-dev": {
                    "cpuUsage": series(),
                    "memUsage": series()
                },
                "gke_kubernetes-opex-analytics_us-central1-a_koamc-test-1": {
                    "cpuUsage": series(),
                    "memUsage": series()
                },
                "gke_kubernetes-opex-analytics_us-central1-a_koamc-test-2": {
                    "cpuUsage": series(),
                    "memUsage": series()
                }
            }
        })
})

app.get('/:c/dataset/:type', (req, res) => {
    switch (req.params.type) {
        case 'cpu_usage_trends.json':
            res.json(
                [
                    { "name": "kube-system", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() },
                    { "name": "kube-system", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() },
                    { "name": "kube-system", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() },
                    { "name": "non-allocatable", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() * 50 },
                    { "name": "non-allocatable", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() * 50 },
                    { "name": "non-allocatable", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() * 50 },
                    { "name": "default", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() * 25 },
                    { "name": "default", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() * 25 },
                    { "name": "default", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() * 25 },
                    { "name": "linkerd", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() * 25 },
                    { "name": "linkerd", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() * 25 },
                    { "name": "linkerd", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() * 25 },
                    { "name": "argo", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() },
                    { "name": "argo", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() },
                    { "name": "argo", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() },
                    { "name": "monitoring", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() },
                    { "name": "monitoring", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() },
                    { "name": "monitoring", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() },
                    { "name": "kubeless", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() },
                    { "name": "kubeless", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() },
                    { "name": "kubeless", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() }
                ])
        case 'memory_usage_trends.json':
            res.json(
                [
                    { "name": "kube-system", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() },
                    { "name": "kube-system", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() },
                    { "name": "kube-system", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() },
                    { "name": "non-allocatable", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() * 50 },
                    { "name": "non-allocatable", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() * 50 },
                    { "name": "non-allocatable", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() * 50 },
                    { "name": "default", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() * 25 },
                    { "name": "default", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() * 25 },
                    { "name": "default", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() * 25 },
                    { "name": "linkerd", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() * 25 },
                    { "name": "linkerd", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() * 25 },
                    { "name": "linkerd", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() * 25 },
                    { "name": "argo", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() },
                    { "name": "argo", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() },
                    { "name": "argo", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() },
                    { "name": "monitoring", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() },
                    { "name": "monitoring", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() },
                    { "name": "monitoring", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() },
                    { "name": "kubeless", "dateUTC": "2019-11-24T18:00:00Z", "usage": Math.random() },
                    { "name": "kubeless", "dateUTC": "2019-11-24T19:00:00Z", "usage": Math.random() },
                    { "name": "kubeless", "dateUTC": "2019-11-24T20:00:00Z", "usage": Math.random() }
                ])
        case 'memory_usage_period_1209600.json':
            res.json([{ "stack": "non-allocatable", "usage": 200.653026, "date": "22 Jan" }, { "stack": ".usagehistory", "usage": 501.790922, "date": "22 Jan" }, { "stack": "kube-system", "usage": 59.101217, "date": "22 Jan" }])
        case 'cpu_usage_period_1209600.json':
            res.json([{ "stack": "non-allocatable", "usage": 42.000000, "date": "22 Jan" }, { "stack": ".usagehistory", "usage": 110.169476, "date": "22 Jan" }, { "stack": "kube-system", "usage": 10.402329, "date": "22 Jan" }])
        case 'memory_usage_period_31968000.json':
            res.json([{ "stack": "non-allocatable", "usage": 200.653026, "date": "Jan 2020" }, { "stack": ".usagehistory", "usage": 501.790922, "date": "Jan 2020" }, { "stack": "kube-system", "usage": 59.101217, "date": "Jan 2020" }])
        case 'cpu_usage_period_31968000.json':
            res.json([{ "stack": "non-allocatable", "usage": 42.000000, "date": "Jan 2020" }, { "stack": ".usagehistory", "usage": 110.169476, "date": "Jan 2020" }, { "stack": "kube-system", "usage": 10.402329, "date": "Jan 2020" }])
        default:
            res.send(404)
    }


})