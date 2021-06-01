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
        marginTop: '5px'
    },
    error: {
        color: '#cd5c5c'
    },
}))

type UploadState = { kind: 'pending' } | { kind: 'progress'; progress: number } | { kind: 'done' } | { kind: 'error'; message: string }

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
                .then(_ => {
                    setUploadState({ kind: 'done' })
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
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum
                        inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem
                        quibusdam.
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
                                Successfully uploaded!
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
