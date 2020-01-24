import '../scheduler/currentusage'
import '../scheduler/discovery'
import '../scheduler/resources'
import '../scheduler/usagehistory'

import { useObserver } from 'mobx-react-lite'
import * as React from 'react'
import { BrowserRouter as Router, NavLink, Redirect, Route, Switch } from 'react-router-dom'

import { LinearProgress } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import { ClusterView } from '../pages/ClusterView'
import { CurrentLoadView } from '../pages/CurrentLoadView'
import { MultiClusterView } from '../pages/MultiClusterView'
import { useStore } from '../store/storeProvider'
import { theme as mytheme } from '../theme'

const useStyles = makeStyles(theme => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
    },
    li: {
      listStyle: 'none',
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
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
  progress: {
    height: '5px'
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}))

export const App = () => {
  return (
    <ThemeProvider theme={mytheme}>
      <CssBaseline />
      <Router>
        <Header />
        <ProgressBar />
        <Content />
      </Router>
      <Footer />
    </ThemeProvider>
  )
}

const Header = () => {
  const classes = useStyles()

  return <AppBar position="static" elevation={0} className={classes.appBar}>
    <Toolbar className={classes.toolbar}>
      <Typography variant="h6" noWrap className={classes.toolbarTitle}>Company name</Typography>
      <nav>
        <Link to="/" exact color="textSecondary" className={classes.link} component={NavLink} activeClassName={classes.selected}>Current usage</Link>
        <Link to="/multicluster-view" color="textSecondary" className={classes.link} component={NavLink} activeClassName={classes.selected}>Consolidated usage & History</Link>
        <Link to="/cluster-view" color="textSecondary" className={classes.link} component={NavLink} activeClassName={classes.selected}>Usage trends & Accounting</Link>
      </nav>
      <Button href="#" variant="outlined" className={classes.link}>
        Login
      </Button>
    </Toolbar>
  </AppBar>
}

const ProgressBar = () => {
  const classes = useStyles()
  const store = useStore()

  return useObserver(() => (
    <div className={classes.progress}>
      {store.state.loading && <LinearProgress color="secondary" className={classes.progress} variant={"indeterminate"} />}
    </div>
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
      title: 'Company',
      description: ['Team', 'History', 'Contact us', 'Locations'],
    },
    {
      title: 'Features',
      description: ['Cool stuff', 'Random feature', 'Team feature', 'Developer stuff', 'Another one'],
    },
    {
      title: 'Resources',
      description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
    },
    {
      title: 'Legal',
      description: ['Privacy policy', 'Terms of use'],
    },
  ]

  return <Container maxWidth="md" component="footer" className={classes.footer}>
    <Grid container spacing={4} justify="space-evenly">
      {footers.map(footer => (
        <Grid item xs={6} sm={3} key={footer.title}>
          <Typography variant="h6" color="textPrimary" gutterBottom>
            {footer.title}
          </Typography>
          <ul>
            {footer.description.map(item => (
              <li key={item}>
                <Link href="#" variant="subtitle1" color="textSecondary">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </Grid>
      ))}
    </Grid>
    <Box mt={5}>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          Your Website
      </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Box>
  </Container>
}