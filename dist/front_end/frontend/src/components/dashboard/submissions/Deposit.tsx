import * as React from 'react';
import { useState ,useEffect } from 'react';
import Title from '../Title';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import SellForm from './SellForm';
import BuyForm from './BuyForm';
import axios from 'axios';
import Cookies from 'js-cookie';
import { wait } from '@testing-library/user-event/dist/utils';
import { useWebSocket } from '../../util/WebsocketProvider';

interface DepositsProps {
  wallet : any,
  token : string,
  onRefresh: () => void
}


export default function Deposits ( props : DepositsProps) {
  const ws = useWebSocket();
  const [action, setAction] = useState('sell');
  const uri =  "http://localhost:3001/api/user/ordersubmission";




  const orderRequest = async ( type :string,amount : number , item :string , price : number ,quantity : number ) => {
    try {
      const auth = 'Bearer ' + props.token;

      const now = new Date();
      const date = now.toLocaleDateString(); // Format the date
      const time = now.toLocaleTimeString(); // Format the time


      const response = await axios.post(uri, 
        {
        
            time :`${date} ${time}` ,
            type : type ,
           item :item , 
           quantity :quantity ,
           price :price
       
        },
        {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth,
          // Add any other headers you need here
        },
      
      });
      
      console.log('Response:', response.data);
      props.onRefresh();
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };




  const handleActionChange = (event: React.MouseEvent<HTMLElement>, newAction: string) => {
    if (newAction !== null) {
      setAction(newAction);
    }
  };

  return (
    <React.Fragment>
      <Title>Submissions</Title>
      <Box sx={{ width: '100%', mt: 4, mb: 4, ml: 2, mr: 2 }}>
        <ToggleButtonGroup
          value={action}
          exclusive
          onChange={handleActionChange}
          aria-label="action"
        >
          <ToggleButton value="sell" aria-label="sell" color="error">
            Sell
          </ToggleButton>
          <ToggleButton value="buy" aria-label="buy" color="success">
            Buy
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {action === 'sell' ? (
        <SellForm 
         wallet={props.wallet}
         orderRequest={orderRequest}/>
      ) : (
        <BuyForm
        wallet={props.wallet}
        orderRequest={orderRequest} />
      )}
    </React.Fragment>
  );
}

