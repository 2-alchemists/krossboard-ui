/*
Copyright (c) 2020 2Alchemists SAS.

This file is part of Krossboard.

Krossboard is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3
of the License, or (at your option) any later version.

Krossboard is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Krossboard.
If not, see <https://www.gnu.org/licenses/>.
*/

import clsx from 'clsx'
import { useObserver } from 'mobx-react-lite'
import * as React from 'react'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { uploadKubeconfig } from '../client/kubeconfig'
import { useStore } from '../store/storeProvider'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    paragraph: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3)
    },
    divider: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    right: {
        float: 'right'
    },
    label: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1)
    },
    input: {
        display: 'none'
    },
    filename: {
        marginLeft: theme.spacing(3)
    },
    progress: {
        float: 'right',
        marginRight: theme.spacing(2),
        marginTop: '10px'
    },
    message: {
        float: 'left',
        marginTop: '5px',
        width: '80%'
    },
    error: {
        color: '#cd5c5c'
    },
}))

type UploadState = { kind: 'pending' } | { kind: 'progress'; progress: number } | { kind: 'done'; message: string } | { kind: 'error'; message: string }

export const SettingsView = () => {
    const classes = useStyles()
    const store = useStore()
    const [selectedKubeconfig, setSelectedKubeconfig] = React.useState<File | null>(null)
    const [uploadState, setUploadState] = React.useState<UploadState>({ kind: 'pending' })

    const onSelectedKubeconfigFile = (event: any) => {
        setSelectedKubeconfig(event.target.files[0])
        setUploadState({ kind: 'pending' })
    }

    const handleUpload = (event: any) => {
        event.preventDefault()

        if (selectedKubeconfig) {
            setUploadState({ kind: 'progress', progress: 0 })
            uploadKubeconfig(store.discoveryURL, selectedKubeconfig, (e: any) => {
                setUploadState({
                    kind: 'progress',
                    progress: Math.round((100 * e.loaded) / e.total)
                })
            })
                .then(m => {
                    setUploadState({ kind: 'done', message: m })
                })
                .catch((e: Error) => {
                    setUploadState({ kind: 'error', message: e.message })
                })
        }
    }

    return useObserver(() => (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={1} sm={2} md={3} />
                <Grid item xs={10} sm={8} md={6}>
                    <Typography variant="h6" noWrap className={classes.paragraph}>
                        Upload Kubernetes configuration
                    </Typography>
                    <Typography variant="body2" className={classes.paragraph}>
                        Select a Kubernetes configuration file (i.e. KUBECONFIG file) and trigger an upload request. Once success, the different clusters defined inside the uploaded file will be discovered and handled by Krossboard within the next 5 minutes. If you have several KUBECONFIG files, repeat the process for each file.
                    </Typography>

                    <form onSubmit={handleUpload}>
                        <InputLabel id="kubeconfig-label" className={classes.label}>
                            Kubeconfig file
                        </InputLabel>
                        <input
                            accept="*/*"
                            id="id-kubeconfig-file"
                            type="file"
                            className={classes.input}
                            onChange={onSelectedKubeconfigFile}
                        />
                        <label htmlFor="id-kubeconfig-file">
                            <Button variant="outlined" color="primary" component="span">
                                Choose File
                            </Button>
                            {selectedKubeconfig && (
                                <Typography variant="body2" component="span" className={classes.filename}>
                                    {selectedKubeconfig.name}
                                </Typography>
                            )}
                        </label>
                        <Divider className={classes.divider} color="primary" />
                        {uploadState.kind === 'done' && (
                            <Typography variant="subtitle2" className={clsx(classes.message)}>
                                {uploadState.message}
                            </Typography>
                        )}
                        {uploadState.kind === 'error' && (
                            <Typography variant="subtitle2" className={clsx(classes.message, classes.error)}>
                                {uploadState.message}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            className={classes.right}
                            disabled={selectedKubeconfig === null || uploadState.kind === 'progress'}
                        >
                            Upload
                        </Button>
                        {uploadState.kind === 'progress' && <CircularProgress className={classes.progress} size={20} />}
                    </form>
                </Grid>
                <Grid item xs={1} sm={2} md={3} />
            </Grid>
        </div>
    ))
}
