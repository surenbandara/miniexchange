import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems} from './listItems';
import Deposits from './submissions/Deposit';
import Orders from './Orders';
import Cookies from 'js-cookie';
import { useEffect ,useState } from 'react';
import axios from 'axios';
import { WebSocketProvider } from '../util/WebsocketProvider';
import Alerts from './alerts/Alerts';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

function connectWebSocket(url: string): WebSocket {
  return new WebSocket(url);
}


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();


export default function Dashboard() {
  const [wallet, setWallet] = useState({});
  const [ongoingorders, setOngoingOrders] = useState([]);

  const [open, setOpen] = useState(true);
  const [authJson, setAuthJson] = useState<any | null>(null);
  const [alerts ,setAlerts ]  =  useState([]);

  const walleturi = "http://localhost:3001/api/user/wallet";
  const ongoinordersuri = "http://localhost:3001/api/user/transactions/ongoing";
  const alerturi = "http://localhost:3001/api/user/alerts";
  const websocketuri = 'ws://localhost:3002';

  const handleRefresh = () => {
    fecthData();
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const authDetail = Cookies.get('authCookie');
    if (authDetail && !authJson ) {
      const authJson = JSON.parse(authDetail);
      setAuthJson(authJson); 
    }
    
    if(authJson){

      const ws = new WebSocket(websocketuri +'?token='+ authJson!.accessToken);



      ws.onopen = () => {
        console.log('Connected to WebSocket server');
      
      
      
        // Send a ping message
        ws.send(JSON.stringify({ type: 'ping' }));
      
        // Send a general message
        ws.send(JSON.stringify({ type: 'message', content: 'Hello, server!' }));
      };
      
      ws.onmessage = (event) => {
        const recived = JSON.parse(event.data);
        console.log(event.data);
        if(recived.onChanged){
          fecthData();
        }
      };
  
      ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
  
  
      fecthData();

    
    }
  }, [authJson]);

  useEffect(() => {}, [alerts]);




  const fecthData = async () => {
    try {
      console.log("Fetching started");
      const auth = 'Bearer ' + authJson!.accessToken;
      const walletresponse = await axios.get(walleturi, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth,
        },
      });

      const ongoingordersresponse = await axios.get(ongoinordersuri, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth,
        },
      });

      const alertsresponse = await axios.get(alerturi, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth,
        },
      });
     
      


      setWallet(walletresponse.data.data.wallet);
      setOngoingOrders(ongoingordersresponse.data.data.transaction.ongoing);
      setAlerts(alertsresponse.data.data.alerts);

      console.log("Alerrrssss" + alerts);
      
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
    
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
        
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Orders
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}

          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth={false} sx={{ width: '100%', mt: 4, mb: 4, ml: 2, mr: 2 }}>
  <Grid container spacing={3}>
    {/* Recent Orders */}
    <Grid item xs={12} md={8} lg={9}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
      { authJson && <Orders
        orders={ongoingorders} />}

<Alerts 
      alerts={alerts}/>
      </Paper>
    </Grid>
    {/* Recent Deposits */}
    <Grid item xs={12} md={4} lg={3}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        { authJson && <Deposits
        wallet={wallet} 
        token={authJson.accessToken}
        onRefresh={handleRefresh}
        />   }
     
      </Paper>
    </Grid>
  </Grid>
  <Copyright sx={{ pt: 4 }} />
</Container>

        </Box>
      </Box>
    </ThemeProvider>
  );
}

