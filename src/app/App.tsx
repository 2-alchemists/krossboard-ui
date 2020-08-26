import '../scheduler/currentusage'
import '../scheduler/discovery'
import '../scheduler/resources'
import '../scheduler/usagehistory'

import { format } from 'date-fns'
import { useObserver } from 'mobx-react-lite'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter as Router, NavLink, Redirect, Route, Switch } from 'react-router-dom'

import { ClickAwayListener, Drawer, Hidden, IconButton, LinearProgress, List, ListItem, ListItemText, Tooltip } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import MenuIcon from '@material-ui/icons/Menu'

import Logo from '../../assets/krossboard-logo.png'
import * as pckg from '../../package.json'
import { ClusterView } from '../pages/ClusterView'
import { CurrentLoadView } from '../pages/CurrentLoadView'
import { MultiClusterView } from '../pages/MultiClusterView'
import { useStore } from '../store/storeProvider'
import { theme as mytheme } from '../theme'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0
        },
        li: {
            listStyle: 'none'
        }
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 1
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    },
    drawer: {},
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.primary.main
    },
    drawerModal: {},
    toolbar: {
        flexWrap: 'wrap'
    },
    toolbarTitle: {
        flexGrow: 1
    },
    link: {
        textTransform: 'uppercase',
        paddingBottom: '3px',
        margin: theme.spacing(1, 1.5),
        '&:hover': {
            textDecoration: 'none',
            borderBottom: `1px solid ${theme.palette.text.hint}`
        }
    },
    selected: {
        borderBottom: `1px solid ${theme.palette.text.primary}`
    },
    itemSelected: {
        borderLeftColor: theme.palette.primary.dark,
        borderLeftStyle: 'solid',
        borderLeftWidth: 'thick'
    },
    progress: {
        height: '5px'
    },
    errors: {
        position: 'fixed',
        top: '78px',
        right: '15px'
    },
    errorsIcon: {
        cursor: 'pointer'
    },
    errorsIconSeen: {
        color: theme.palette.text.primary
    },
    errorsIconUnseen: {
        color: '#cd5c5c'
    },
    errorsDescription: {
        lineHeight: 'normal'
    },
    footer: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(4),
        paddingTop: theme.spacing(1),
        paddingBottom: '0px',
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(2),
            paddingBottom: '0px'
        }
    }
}))

export const App = () => {
    return (
        <ThemeProvider theme={mytheme}>
            <CssBaseline />
            <Router>
                <Header />
                <Errors />
                <ProgressBar />
                <Content />
            </Router>
            <Footer />
        </ThemeProvider>
    )
}

const Header = () => {
    const classes = useStyles()
    const [drawerOpened, setDrawerOpened] = React.useState(false)

    const links = [
        {
            to: '/',
            exact: true,
            text: 'Current usage'
        },
        {
            to: '/cluster-view',
            text: 'Usage trends & Accounting'
        },
        {
            to: '/multicluster-view',
            text: 'Consolidated usage & History'
        }
    ]

    return (
        <AppBar position="static" elevation={0} className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    edge="start"
                    onClick={() => setDrawerOpened(true)}
                    className={classes.menuButton}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap className={classes.toolbarTitle}>
                    <img src={Logo} alt="Krossboard logo" />
                </Typography>
                <nav>
                    <Drawer
                        open={drawerOpened}
                        onClose={() => setDrawerOpened(false)}
                        classes={{
                            paper: classes.drawerPaper,
                            modal: classes.drawerModal
                        }}
                        ModalProps={{
                            keepMounted: true // Better open performance on mobile.
                        }}
                    >
                        <List>
                            {links.map(it => (
                                <ListItem
                                    key={it.to}
                                    button
                                    component={NavLink}
                                    to={it.to}
                                    color="textSecondary"
                                    activeClassName={classes.itemSelected}
                                    exact={it.exact}
                                    onClick={() => setDrawerOpened(false)}
                                >
                                    <ListItemText primary={it.text} />
                                </ListItem>
                            ))}
                        </List>
                    </Drawer>

                    <Hidden smDown>
                        {links.map(it => (
                            <Link
                                key={it.to}
                                to={it.to}
                                component={NavLink}
                                color="textSecondary"
                                className={classes.link}
                                exact={it.exact}
                                activeClassName={classes.selected}
                            >
                                {it.text}
                            </Link>
                        ))}
                    </Hidden>
                </nav>
            </Toolbar>
        </AppBar>
    )
}

const ProgressBar = () => {
    const classes = useStyles()
    const store = useStore()

    return useObserver(() => (
        <div className={classes.progress}>
            {store.loading && <LinearProgress color="secondary" className={classes.progress} variant={'indeterminate'} />}
        </div>
    ))
}

const Errors = () => {
    const classes = useStyles()
    const store = useStore()
    const { t } = useTranslation()

    const [visible, setVisible] = React.useState(false)

    return useObserver(() => (
        <span className={classes.errors}>
            {store.hasErrors && (
                <ClickAwayListener onClickAway={() => setVisible(false)}>
                    <Tooltip
                        placement="bottom-end"
                        title={
                            <>
                                {store.errors.map((err, idx) => (
                                    <Typography
                                        className={classes.errorsDescription}
                                        key={idx}
                                        variant="caption"
                                        display="block"
                                        gutterBottom
                                    >
                                        {format(err.date, t('format.day-month-year-hour'))} - {err.message} ({err.resource})
                                    </Typography>
                                ))}
                            </>
                        }
                        open={visible}
                    >
                        <InfoOutlinedIcon
                            className={`${classes.errorsIcon} ${
                                store.hasErrorsNotSeen ? classes.errorsIconUnseen : classes.errorsIconSeen
                            } `}
                            onClick={() => {
                                setVisible(!visible)
                                store.markErrorsSeen()
                            }}
                        />
                    </Tooltip>
                </ClickAwayListener>
            )}
        </span>
    ))
}

const Content = () => {
    return (
        <Switch>
            <Route path="/multicluster-view">
                <MultiClusterView />
            </Route>
            <Route path="/cluster-view">
                <ClusterView />
            </Route>
            <Route exact path="/">
                <CurrentLoadView />
            </Route>
            <Route path="*">
                <Redirect to="/" />
            </Route>
        </Switch>
    )
}

const Footer = () => {
    const classes = useStyles()

    const footers = [
        {
            title: `Krossboard UI v${pckg['version']}`,
            link: 'https://krossboard.app/docs/releases/'
        },
        {
            title: 'Documentation',
            link: 'https://krossboard.app/docs/'
        },
        {
            title: 'Issues & support',
            link: 'https://github.com/2-alchemists/krossboard'
        }
    ]

    return (
        <Container maxWidth="md" component="footer" className={classes.footer}>
            <Grid container spacing={4} justify="space-evenly">
                {footers.map(footer => (
                    <Grid item xs={6} sm={3} key={footer.title}>
                        <Typography variant="h6" color="textPrimary" gutterBottom>
                            <Link href={footer.link} variant="subtitle1" color="textSecondary" target="_blank">
                                {footer.title}
                            </Link>
                        </Typography>
                    </Grid>
                ))}
            </Grid>
            <Box mt={5}>
                <Typography variant="body2" color="textSecondary" align="center">
                    {'Copyright © '} 
                    {new Date().getFullYear()}
                    {' - '}
                    <Link color="inherit" href="https://krossboard.app/aboutus/" target="_blank">
                        2Alchemists SAS
                    </Link>
                    {'. '}
                    <Link color="inherit" href="https://krossboard.app/legal/terms-of-use/" target="_blank">
                       Terms of use
                    </Link>
                    {'.'}
                </Typography>
            </Box>
        </Container>
    )
}
