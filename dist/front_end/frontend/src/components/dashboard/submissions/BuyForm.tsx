import * as React from 'react';
import { useState } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from '../Title';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

interface BuyFormsProps {
  wallet : any,
  orderRequest : ( type :string,amount : number , item :string , price : number ,quantity : number ) => {}
}

export default function BuyForm(props : BuyFormsProps) {
  const [item, setItem] = useState('');
  const [price, setPrice] = useState(0);
  const [usdValue, setUsdValue] = useState(0);
  const [itemAmount, setItemAmount] = useState(0);
  const [usdAvailable, setUsdAvailable] = useState(props.wallet['usd']); // Example USD you have


  const handleItemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItem(event.target.value);
  };


  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = event.target.value;
    setPrice((parseFloat(newPrice)|| 0));
    setUsdValue((itemAmount || 0) * (parseFloat(newPrice) || 0));
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value;
    setItemAmount(parseFloat(amount) || 0);
    setUsdValue((parseFloat(amount) || 0) * (price || 0));
  };

  const handleUsdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsdAvailable(event.target.value);
  };

  const handleSubmit = () => {
    props.orderRequest( 'buy',itemAmount , item , price , itemAmount)
  
  };

  const handleCancel = () => {
    // Handle cancel logic here
    console.log('Cancelled');
  };

  return (
    

        <React.Fragment>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="USD Available"
              value={usdAvailable}
              onChange={handleUsdChange}
              fullWidth
              disabled
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              label="Item"
              value={item}
              onChange={handleItemChange}
              fullWidth
            >
              <MenuItem value="usd">USD</MenuItem>
              <MenuItem value="btc">BTC</MenuItem>
              
            </TextField>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Amount"
              value={itemAmount}
              onChange={handleAmountChange}
              fullWidth
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Price"
              value={price}
              onChange={handlePriceChange}
              fullWidth
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography component="p">
              USD Value: ${usdValue.toFixed(2)}
            </Typography>
          </Box>
        
     
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
      </React.Fragment>

  );
}
