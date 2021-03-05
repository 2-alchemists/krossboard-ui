// Quick & dirty implementation of the server which mimics backend, for testing purposes.
const express = require('express')
const cors = require('cors')
const app = express()
const port = 1519

app.use(cors())

app.listen(1519, () => console.log(`Listening on port ${port}!`))

app.get('/', (req, res) => res.send('I\m running!'))

app.get('/api/discovery', (req, res) => {
    res.json(
        {
            status: 'ok',
            instances: [
                {
                    clusterName: 'gke_kubernetes-opex-analytics_us-central1-a_koa-dev',
                    endpoint: `http://${req.hostname}:${port}` // no more used
                },
                {
                    clusterName: 'gke_kubernetes-opex-analytics_us-central1-a_koamc-test-1',
                    endpoint: `http://${req.hostname}:${port}` // no more used
                },
                {
                    clusterName: 'gke_kubernetes-opex-analytics_us-central1-a_koamc-test-2',
                    endpoint: `http://${req.hostname}:${port}/` // no more used
                }
            ]
        })
})

app.get('/api/currentusage', (req, res) => {
    const randomUsage = () => Math.floor(Math.random() * 70)
    res.json(
        {
            "status": "ok",
            "clusterUsage": [
                {
                    "clusterName": "gke_kubernetes-opex-analytics_us-central1-a_koa-dev",
                    "cpuUsed": randomUsage(),
                    "memUsed": randomUsage(),
                    "cpuNonAllocatable": 15.4356,
                    "memNonAllocatable": 9.0909,
                    "outToDate": false
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
                    "cpuUsed": 0,
                    "memUsed": 0,
                    "cpuNonAllocatable": 0,
                    "memNonAllocatable": 0,
                    "outToDate": true
                }
            ]
        }
    )
})

app.get('/api/usagehistory', (req, res) => {
    const startDate = req.query.startDateUTC ? new Date(req.query.startDateUTC + "Z") : new Date(Date.now() - 86400000)
    const endDate = req.query.endDateUTC ? new Date(req.query.endDateUTC + "Z") : new Date()
    const period = req.query.period ? req.query.period : 'hourly'

    if (period !== "hourly" && period !== "monthly") {
        res.send(401)
    }

    const series = () => {
        const values = []
        switch (period) {
            case "hourly":
                for (t = startDate.getTime(); t < endDate.getTime(); t += 3600000) {
                    values.push({
                        "dateUTC": new Date(t).toISOString(),
                        "value": Math.floor(Math.random() * 100)
                    })
                }
            case "monthly":
                var year = startDate.getFullYear()
                var month = startDate.getMonth()

                for (t = new Date(year, month); t.getTime() < endDate.getTime();) {
                    values.push({
                        "dateUTC": t.toISOString(),
                        "value": Math.floor(Math.random() * 100)
                    })

                    if (month < 11) {
                        month++
                    } else {
                        month = 0
                        year++
                    }
                    console.log(t.toISOString())
                    t = new Date(year, month)
                }
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
                    "cpuUsage": null,
                    "memUsage": null
                }
            }
        })
})

app.get('/api/dataset/:type', (req, res) => {
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
            break
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
            break
        case 'memory_usage_period_1209600.json':
            res.json([{ "stack": "non-allocatable", "usage": 200.653026, "date": "22 Jan" }, { "stack": ".usagehistory", "usage": 501.790922, "date": "22 Jan" }, { "stack": "kube-system", "usage": 59.101217, "date": "22 Jan" }])
            break
        case 'cpu_usage_period_1209600.json':
            res.json([{ "stack": "non-allocatable", "usage": 42.000000, "date": "22 Jan" }, { "stack": ".usagehistory", "usage": 110.169476, "date": "22 Jan" }, { "stack": "kube-system", "usage": 10.402329, "date": "22 Jan" }])
            break
        case 'memory_usage_period_31968000.json':
            res.json([{ "stack": "non-allocatable", "usage": 200.653026, "date": "Jan 2020" }, { "stack": ".usagehistory", "usage": 501.790922, "date": "Jan 2020" }, { "stack": "kube-system", "usage": 59.101217, "date": "Jan 2020" }])
            break
        case 'cpu_usage_period_31968000.json':
            res.json([{ "stack": "non-allocatable", "usage": 42.000000, "date": "Jan 2020" }, { "stack": ".usagehistory", "usage": 110.169476, "date": "Jan 2020" }, { "stack": "kube-system", "usage": 10.402329, "date": "Jan 2020" }])
            break
        default:
            res.send(404)
    }
})


app.get('/api/datasets/nodes.json', (req, res) => {
    res.json(
        {
            "gke-cluster-1-default-pool-7f5e6673-kz41": {
                "id": "5016f4a1-e24d-42da-8046-40c98ff166bf",
                "name": "gke-cluster-1-default-pool-7f5e6673-kz41",
                "state": "Ready",
                "message": "kubelet is posting ready status. AppArmor enabled",
                "cpuCapacity": 2,
                "cpuAllocatable": 0.9400000000000001,
                "cpuUsage": 0.118247216,
                "memCapacity": 4130848768,
                "memAllocatable": 2957492224,
                "memUsage": 743170048,
                "containerRuntime": "docker://19.3.9",
                "podsRunning": [
                {
                    "id": "f7c79d88-baa7-4169-90f5-2b045c0f2087",
                    "name": "event-exporter-gke-666b7ffbf7-cjnj4.kube-system",
                    "nodeName": "gke-cluster-1-default-pool-7f5e6673-kz41",
                    "phase": "Running",
                    "state": "Initialized",
                    "cpuUsage": 0.000221408,
                    "memUsage": 14426112.0
                },
                {
                    "id": "19bc246b-f7fd-4b6b-996d-17549cfd590d",
                    "name": "fluentbit-gke-rtsqb.kube-system",
                    "nodeName": "gke-cluster-1-default-pool-7f5e6673-kz41",
                    "phase": "Running",
                    "state": "Initialized",
                    "cpuUsage": 0.002824047,
                    "memUsage": 21295104.0
                },
                {
                    "id": "81cdc542-4100-4998-9168-d09997a27410",
                    "name": "gke-metrics-agent-ql22h.kube-system",
                    "nodeName": "gke-cluster-1-default-pool-7f5e6673-kz41",
                    "phase": "Running",
                    "state": "Initialized",
                    "cpuUsage": 0.003870604,
                    "memUsage": 24215552.0
                },
                {
                    "id": "85018053-8bbe-4888-ae68-b9de564d5f86",
                    "name": "kube-dns-6bd88c9b66-gwlkv.kube-system",
                    "nodeName": "gke-cluster-1-default-pool-7f5e6673-kz41",
                    "phase": "Running",
                    "state": "Initialized",
                    "cpuUsage": 0.0016355050000000002,
                    "memUsage": 34226176.0
                },
                {
                    "id": "a5eb5ffe-2c08-4fee-bb4c-34bc13479e87",
                    "name": "kube-dns-autoscaler-7f89fb6b79-4w75n.kube-system",
                    "nodeName": "gke-cluster-1-default-pool-7f5e6673-kz41",
                    "phase": "Running",
                    "state": "Initialized",
                    "cpuUsage": 0.00015833400000000002,
                    "memUsage": 13062144.0
                },
                {
                    "id": "081e87ba-615a-4261-9ff8-d759ae3d9c9d",
                    "name": "kube-proxy-gke-cluster-1-default-pool-7f5e6673-kz41.kube-system",
                    "nodeName": "gke-cluster-1-default-pool-7f5e6673-kz41",
                    "phase": "Running",
                    "state": "Initialized",
                    "cpuUsage": 0.0009093730000000001,
                    "memUsage": 28467200.0
                },
                {
                    "id": "93249190-8cd1-46d1-893a-6755c2246707",
                    "name": "l7-default-backend-5b76b455d-g9v4m.kube-system",
                    "nodeName": "gke-cluster-1-default-pool-7f5e6673-kz41",
                    "phase": "Running",
                    "state": "Initialized",
                    "cpuUsage": 6.1059e-05,
                    "memUsage": 2777088.0
                },
                {
                    "id": "ec58fe92-7314-449e-b84b-d5c874ff085c",
                    "name": "metrics-server-v0.3.6-7c5cb99b6f-wrm6n.kube-system",
                    "nodeName": "gke-cluster-1-default-pool-7f5e6673-kz41",
                    "phase": "Running",
                    "state": "Initialized",
                    "cpuUsage": 0.027117170000000003,
                    "memUsage": 40521728.0
                },
                {
                    "id": "bf37dfa5-60ab-456d-a2a0-47207c40a12d",
                    "name": "stackdriver-metadata-agent-cluster-level-6dc494dbcf-z98lt.kube-system",
                    "nodeName": "gke-cluster-1-default-pool-7f5e6673-kz41",
                    "phase": "Running",
                    "state": "Initialized",
                    "cpuUsage": 0.038918311000000004,
                    "memUsage": 24064000.0
                }
                ],
                "podsNotRunning": [
                
                ]
            }
        })
})