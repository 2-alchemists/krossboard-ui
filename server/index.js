// Quick & dirty implementation of the server which mimics backend, for testing purposes.
const express = require('express')
const cors = require('cors')
const app = express()
const port = 1519

app.use(cors())

app.listen(1519, () => console.log(`Listening on port ${port}!`))

app.get('/', (req, res) => res.send('Im running!'))

app.get('/api/discovery', (req, res) => {
    res.json({
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
    res.json({
        status: 'ok',
        clusterUsage: [
            {
                clusterName: 'gke_kubernetes-opex-analytics_us-central1-a_koa-dev',
                cpuUsed: randomUsage(),
                memUsed: randomUsage(),
                cpuNonAllocatable: 15.4356,
                memNonAllocatable: 9.0909,
                outToDate: false
            },
            {
                clusterName: 'gke_kubernetes-opex-analytics_us-central1-a_koamc-test-1',
                cpuUsed: randomUsage(),
                memUsed: randomUsage(),
                cpuNonAllocatable: 6,
                memNonAllocatable: 28.656786999999998,
                outToDate: false
            },
            {
                clusterName: 'gke_kubernetes-opex-analytics_us-central1-a_koamc-test-2',
                cpuUsed: 0,
                memUsed: 0,
                cpuNonAllocatable: 0,
                memNonAllocatable: 0,
                outToDate: true
            }
        ]
    })
})

app.get('/api/usagehistory', (req, res) => {
    const startDate = req.query.startDateUTC ? new Date(req.query.startDateUTC + 'Z') : new Date(Date.now() - 86400000)
    const endDate = req.query.endDateUTC ? new Date(req.query.endDateUTC + 'Z') : new Date()
    const period = req.query.period ? req.query.period : 'hourly'

    if (period !== 'hourly' && period !== 'monthly') {
        res.send(401)
    }

    const series = () => {
        const values = []
        switch (period) {
            case 'hourly':
                for (t = startDate.getTime(); t < endDate.getTime(); t += 3600000) {
                    values.push({
                        dateUTC: new Date(t).toISOString(),
                        value: Math.floor(Math.random() * 100)
                    })
                }
            case 'monthly':
                var year = startDate.getFullYear()
                var month = startDate.getMonth()

                for (t = new Date(year, month); t.getTime() < endDate.getTime(); ) {
                    values.push({
                        dateUTC: t.toISOString(),
                        value: Math.floor(Math.random() * 100)
                    })

                    if (month < 11) {
                        month++
                    } else {
                        month = 0
                        year++
                    }

                    t = new Date(year, month)
                }
        }
        return values
    }

    res.json({
        status: 'ok',
        usageHistory: {
            'gke_kubernetes-opex-analytics_us-central1-a_koa-dev': {
                cpuUsage: series(),
                memUsage: series()
            },
            'gke_kubernetes-opex-analytics_us-central1-a_koamc-test-1': {
                cpuUsage: series(),
                memUsage: series()
            },
            'gke_kubernetes-opex-analytics_us-central1-a_koamc-test-2': {
                cpuUsage: null,
                memUsage: null
            }
        }
    })
})

app.get('/api/dataset/:type', (req, res) => {
    switch (req.params.type) {
        case 'cpu_usage_trends.json':
            res.json([
                { name: 'kube-system', dateUTC: '2019-11-24T18:00:00Z', usage: Math.random() },
                { name: 'kube-system', dateUTC: '2019-11-24T19:00:00Z', usage: Math.random() },
                { name: 'kube-system', dateUTC: '2019-11-24T20:00:00Z', usage: Math.random() },
                { name: 'non-allocatable', dateUTC: '2019-11-24T18:00:00Z', usage: Math.random() * 50 },
                { name: 'non-allocatable', dateUTC: '2019-11-24T19:00:00Z', usage: Math.random() * 50 },
                { name: 'non-allocatable', dateUTC: '2019-11-24T20:00:00Z', usage: Math.random() * 50 },
                { name: 'default', dateUTC: '2019-11-24T18:00:00Z', usage: Math.random() * 25 },
                { name: 'default', dateUTC: '2019-11-24T19:00:00Z', usage: Math.random() * 25 },
                { name: 'default', dateUTC: '2019-11-24T20:00:00Z', usage: Math.random() * 25 },
                { name: 'linkerd', dateUTC: '2019-11-24T18:00:00Z', usage: Math.random() * 25 },
                { name: 'linkerd', dateUTC: '2019-11-24T19:00:00Z', usage: Math.random() * 25 },
                { name: 'linkerd', dateUTC: '2019-11-24T20:00:00Z', usage: Math.random() * 25 },
                { name: 'argo', dateUTC: '2019-11-24T18:00:00Z', usage: Math.random() },
                { name: 'argo', dateUTC: '2019-11-24T19:00:00Z', usage: Math.random() },
                { name: 'argo', dateUTC: '2019-11-24T20:00:00Z', usage: Math.random() },
                { name: 'monitoring', dateUTC: '2019-11-24T18:00:00Z', usage: Math.random() },
                { name: 'monitoring', dateUTC: '2019-11-24T19:00:00Z', usage: Math.random() },
                { name: 'monitoring', dateUTC: '2019-11-24T20:00:00Z', usage: Math.random() },
                { name: 'kubeless', dateUTC: '2019-11-24T18:00:00Z', usage: Math.random() },
                { name: 'kubeless', dateUTC: '2019-11-24T19:00:00Z', usage: Math.random() },
                { name: 'kubeless', dateUTC: '2019-11-24T20:00:00Z', usage: Math.random() }
            ])
            break
        case 'memory_usage_trends.json':
            res.json([
                { name: 'kube-system', dateUTC: '2019-11-24T18:00:00Z', usage: Math.random() },
                { name: 'kube-system', dateUTC: '2019-11-24T19:00:00Z', usage: Math.random() },
                { name: 'kube-system', dateUTC: '2019-11-24T20:00:00Z', usage: Math.random() },
                { name: 'non-allocatable', dateUTC: '2019-11-24T18:00:00Z', usage: Math.random() * 50 },
                { name: 'non-allocatable', dateUTC: '2019-11-24T19:00:00Z', usage: Math.random() * 50 },
                { name: 'non-allocatable', dateUTC: '2019-11-24T20:00:00Z', usage: Math.random() * 50 },
                { name: 'default', dateUTC: '2019-11-24T18:00:00Z', usage: Math.random() * 25 },
                { name: 'default', dateUTC: '2019-11-24T19:00:00Z', usage: Math.random() * 25 },
                { name: 'default', dateUTC: '2019-11-24T20:00:00Z', usage: Math.random() * 25 },
                { name: 'linkerd', dateUTC: '2019-11-24T18:00:00Z', usage: Math.random() * 25 },
                { name: 'linkerd', dateUTC: '2019-11-24T19:00:00Z', usage: Math.random() * 25 },
                { name: 'linkerd', dateUTC: '2019-11-24T20:00:00Z', usage: Math.random() * 25 },
                { name: 'argo', dateUTC: '2019-11-24T18:00:00Z', usage: Math.random() },
                { name: 'argo', dateUTC: '2019-11-24T19:00:00Z', usage: Math.random() },
                { name: 'argo', dateUTC: '2019-11-24T20:00:00Z', usage: Math.random() },
                { name: 'monitoring', dateUTC: '2019-11-24T18:00:00Z', usage: Math.random() },
                { name: 'monitoring', dateUTC: '2019-11-24T19:00:00Z', usage: Math.random() },
                { name: 'monitoring', dateUTC: '2019-11-24T20:00:00Z', usage: Math.random() },
                { name: 'kubeless', dateUTC: '2019-11-24T18:00:00Z', usage: Math.random() },
                { name: 'kubeless', dateUTC: '2019-11-24T19:00:00Z', usage: Math.random() },
                { name: 'kubeless', dateUTC: '2019-11-24T20:00:00Z', usage: Math.random() }
            ])
            break
        case 'memory_usage_period_1209600.json':
            res.json([
                { stack: 'non-allocatable', usage: 200.653026, date: '22 Jan' },
                { stack: '.usagehistory', usage: 501.790922, date: '22 Jan' },
                { stack: 'kube-system', usage: 59.101217, date: '22 Jan' }
            ])
            break
        case 'cpu_usage_period_1209600.json':
            res.json([
                { stack: 'non-allocatable', usage: 42.0, date: '22 Jan' },
                { stack: '.usagehistory', usage: 110.169476, date: '22 Jan' },
                { stack: 'kube-system', usage: 10.402329, date: '22 Jan' }
            ])
            break
        case 'memory_usage_period_31968000.json':
            res.json([
                { stack: 'non-allocatable', usage: 200.653026, date: 'Jan 2020' },
                { stack: '.usagehistory', usage: 501.790922, date: 'Jan 2020' },
                { stack: 'kube-system', usage: 59.101217, date: 'Jan 2020' }
            ])
            break
        case 'cpu_usage_period_31968000.json':
            res.json([
                { stack: 'non-allocatable', usage: 42.0, date: 'Jan 2020' },
                { stack: '.usagehistory', usage: 110.169476, date: 'Jan 2020' },
                { stack: 'kube-system', usage: 10.402329, date: 'Jan 2020' }
            ])
            break
        case 'nodes.json':
            res.json({
                'gke-cluster-1-default-pool-7f5e6673-5g5l': {
                    id: '75f84607-c70e-406f-94af-6454e233fbe1',
                    name: 'gke-cluster-1-default-pool-7f5e6673-5g5l',
                    state: 'Ready',
                    message: 'kubelet is posting ready status. AppArmor enabled',
                    cpuCapacity: 2,
                    cpuAllocatable: 0.9400000000000001,
                    cpuUsage: 0.06399671800000001,
                    memCapacity: 4130848768,
                    memAllocatable: 2957492224,
                    memUsage: 446394368,
                    containerRuntime: 'docker://19.3.14',
                    podsRunning: [
                        {
                            id: '29aefa22-ecfe-42a6-8a69-ffbb9cd453de',
                            name: 'fluentbit-gke-zcwwf.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-5g5l',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.002755782,
                            memUsage: 20021248
                        },
                        {
                            id: 'edb70ba3-0745-4657-896e-1eceef2f437f',
                            name: 'gke-metrics-agent-mz64c.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-5g5l',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.0032173690000000003,
                            memUsage: 25276416
                        },
                        {
                            id: '0a2a411c-2824-4b8b-94c3-f47781bb1108',
                            name: 'kube-proxy-gke-cluster-1-default-pool-7f5e6673-5g5l.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-5g5l',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.0007884190000000001,
                            memUsage: 14209024
                        }
                    ],
                    podsNotRunning: []
                },
                'gke-cluster-1-default-pool-7f5e6673-j6cj': {
                    id: '1524a116-a614-4aa7-8829-0173fbe7056b',
                    name: 'gke-cluster-1-default-pool-7f5e6673-j6cj',
                    state: 'Ready',
                    message: 'kubelet is posting ready status. AppArmor enabled',
                    cpuCapacity: 2,
                    cpuAllocatable: 0.9400000000000001,
                    cpuUsage: 0.060142311000000004,
                    memCapacity: 4130848768,
                    memAllocatable: 2957492224,
                    memUsage: 445112320,
                    containerRuntime: 'docker://19.3.14',
                    podsRunning: [
                        {
                            id: '5e197a40-f4dd-4b20-a1b8-622de568a91f',
                            name: 'fluentbit-gke-zjzsg.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-j6cj',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.0025404950000000003,
                            memUsage: 20549632
                        },
                        {
                            id: '3edbaee5-7955-47ff-a3bf-3f9279ab38f7',
                            name: 'gke-metrics-agent-bw429.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-j6cj',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.003735154,
                            memUsage: 25944064
                        },
                        {
                            id: '30161cc6-01f8-40ff-98d3-edb94f6ba813',
                            name: 'kube-proxy-gke-cluster-1-default-pool-7f5e6673-j6cj.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-j6cj',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.001000741,
                            memUsage: 13963264
                        }
                    ],
                    podsNotRunning: []
                },
                'gke-cluster-1-default-pool-7f5e6673-m6so': {
                    id: '19cbb3ea-adc8-4358-96ae-d9c08048ae2b',
                    name: 'gke-cluster-1-default-pool-7f5e6673-m6so',
                    state: 'Ready',
                    message: 'kubelet is posting ready status. AppArmor enabled',
                    cpuCapacity: 2,
                    cpuAllocatable: 0.9400000000000001,
                    cpuUsage: 0.130397707,
                    memCapacity: 4130848768,
                    memAllocatable: 2957492224,
                    memUsage: 707743744,
                    containerRuntime: 'docker://19.3.14',
                    podsRunning: [
                        {
                            id: '08e9e0c8-f3a1-485f-a472-fd45fbffde0e',
                            name: 'event-exporter-gke-666b7ffbf7-wxkz8.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-m6so',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.000107239,
                            memUsage: 13561856
                        },
                        {
                            id: '15714cf1-ad2a-4485-8b62-f939d408d899',
                            name: 'fluentbit-gke-9p94f.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-m6so',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.002376685,
                            memUsage: 21118976
                        },
                        {
                            id: 'da2dd92d-443f-4465-a3aa-d0c5b92e031a',
                            name: 'gke-metrics-agent-x9c44.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-m6so',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.006065638000000001,
                            memUsage: 27361280
                        },
                        {
                            id: '52c724c2-d38b-4771-aa89-34b6679406de',
                            name: 'kube-dns-6465f78586-jnclq.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-m6so',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.0019646200000000003,
                            memUsage: 34164736
                        },
                        {
                            id: '0d1a88cc-7442-44eb-833b-47f1697929bf',
                            name: 'kube-dns-autoscaler-7f89fb6b79-9vrpc.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-m6so',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.000239945,
                            memUsage: 9519104
                        },
                        {
                            id: '05115090-d773-41ee-8e92-0121b754b183',
                            name: 'kube-proxy-gke-cluster-1-default-pool-7f5e6673-m6so.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-m6so',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.001054543,
                            memUsage: 22937600
                        },
                        {
                            id: 'cdd021fe-5188-47af-8fb2-62821cc1f941',
                            name: 'l7-default-backend-5b76b455d-qslmt.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-m6so',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.000077082,
                            memUsage: 2707456
                        },
                        {
                            id: '5d48a24d-9be7-4a53-a8c1-47a930591507',
                            name: 'metrics-server-v0.3.6-7b5cdbcbb8-hhx79.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-m6so',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.025380024000000004,
                            memUsage: 37289984
                        },
                        {
                            id: '93d34c80-1cc6-43e0-99a2-f212f4ec7eda',
                            name: 'stackdriver-metadata-agent-cluster-level-647ddb674b-v9d9j.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-m6so',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.036729373,
                            memUsage: 26660864
                        }
                    ],
                    podsNotRunning: []
                },
                'gke-cluster-1-default-pool-7f5e6673-n8d8': {
                    id: '666bcdc8-a96c-44ee-bd31-a3415decb608',
                    name: 'gke-cluster-1-default-pool-7f5e6673-n8d8',
                    state: 'Ready',
                    message: 'kubelet is posting ready status. AppArmor enabled',
                    cpuCapacity: 2,
                    cpuAllocatable: 0.9400000000000001,
                    cpuUsage: 0.067977511,
                    memCapacity: 4130848768,
                    memAllocatable: 2957492224,
                    memUsage: 484065280,
                    containerRuntime: 'docker://19.3.14',
                    podsRunning: [
                        {
                            id: '13d6f08c-7189-4b3c-b5d1-ede137c46944',
                            name: 'fluentbit-gke-469bx.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-n8d8',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.0026052280000000002,
                            memUsage: 20443136
                        },
                        {
                            id: '3ccb9137-523c-48c2-978c-7b8eeb39153e',
                            name: 'gke-metrics-agent-4f5n7.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-n8d8',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.0021083580000000003,
                            memUsage: 26255360
                        },
                        {
                            id: 'f3e31835-a8f8-49cc-bf82-f6e582907e27',
                            name: 'kube-dns-6465f78586-bsf94.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-n8d8',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.0033669980000000004,
                            memUsage: 33345536
                        },
                        {
                            id: '7d5cc1a9-0441-43f5-a6d5-29f4d1307cfd',
                            name: 'kube-proxy-gke-cluster-1-default-pool-7f5e6673-n8d8.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-n8d8',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.002043289,
                            memUsage: 14036992
                        }
                    ],
                    podsNotRunning: []
                },
                'gke-cluster-1-default-pool-7f5e6673-qxp1': {
                    id: 'aff82910-5ef7-4be2-93ac-c0618aa835fb',
                    name: 'gke-cluster-1-default-pool-7f5e6673-qxp1',
                    state: 'Ready',
                    message: 'kubelet is posting ready status. AppArmor enabled',
                    cpuCapacity: 2,
                    cpuAllocatable: 0.9400000000000001,
                    cpuUsage: 0.06209291200000001,
                    memCapacity: 4130848768,
                    memAllocatable: 2957492224,
                    memUsage: 442015744,
                    containerRuntime: 'docker://19.3.14',
                    podsRunning: [
                        {
                            id: 'b16c87de-69b2-404f-b2d6-cc0ad4621596',
                            name: 'fluentbit-gke-c82lw.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-qxp1',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.002685083,
                            memUsage: 19849216
                        },
                        {
                            id: '7a2ce988-7e30-4433-ab10-83047bdae976',
                            name: 'gke-metrics-agent-2cbrc.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-qxp1',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.001707539,
                            memUsage: 22757376
                        },
                        {
                            id: 'a2ac6728-8548-423c-8a9c-7d5b98672f28',
                            name: 'kube-proxy-gke-cluster-1-default-pool-7f5e6673-qxp1.kube-system',
                            nodeName: 'gke-cluster-1-default-pool-7f5e6673-qxp1',
                            phase: 'Running',
                            state: 'Initialized',
                            cpuUsage: 0.000893028,
                            memUsage: 13795328
                        }
                    ],
                    podsNotRunning: []
                }
            })
            break
        default:
            res.send(404)
    }
})

app.get('/api/nodesusage/:clustername', (req, res) => {
    res.json([
        {
            dateUTC: '2021-04-17T22:48:14',
            name: 'gke-cluster-1-default-pool-7f5e6673-m6so',
            cpuCapacity: 2,
            cpuAllocatable: 0.9400000000000001,
            cpuUsageByPods: 0.057068408,
            memCapacity: 4130848768,
            memAllocatable: 2957492224,
            memUsageByPods: 199458816
        },
        {
            dateUTC: '2021-04-17T22:48:14',
            name: 'gke-cluster-1-default-pool-7f5e6673-n8d8',
            cpuCapacity: 2,
            cpuAllocatable: 0.9400000000000001,
            cpuUsageByPods: 0.006896725,
            memCapacity: 4130848768,
            memAllocatable: 2957492224,
            memUsageByPods: 96665600
        },
        {
            dateUTC: '2021-04-17T22:48:14',
            name: 'gke-cluster-1-default-pool-7f5e6673-qxp1',
            cpuCapacity: 2,
            cpuAllocatable: 0.9400000000000001,
            cpuUsageByPods: 0.004305296,
            memCapacity: 4130848768,
            memAllocatable: 2957492224,
            memUsageByPods: 57884672
        },
        {
            dateUTC: '2021-04-17T22:48:14',
            name: 'gke-cluster-1-default-pool-7f5e6673-5g5l',
            cpuCapacity: 2,
            cpuAllocatable: 0.9400000000000001,
            cpuUsageByPods: 0.005580291,
            memCapacity: 4130848768,
            memAllocatable: 2957492224,
            memUsageByPods: 60694528
        },
        {
            dateUTC: '2021-04-17T22:48:14',
            name: 'gke-cluster-1-default-pool-7f5e6673-j6cj',
            cpuCapacity: 2,
            cpuAllocatable: 0.9400000000000001,
            cpuUsageByPods: 0.005956893,
            memCapacity: 4130848768,
            memAllocatable: 2957492224,
            memUsageByPods: 61485056
        }
    ])
})
