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

interface SellFormsProps {
  wallet : any,
  orderRequest : ( type :string,amount : number , item :string , price : number ,quantity : number ) => {}
}

export default function SellForm(props : SellFormsProps) {

  const [item, setItem] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [price, setPrice] = useState(0);
  const [usdValue, setUsdValue] = useState(0);
  const [itemAmount, setItemAmount] = useState(0);


  const handleItemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItem(event.target.value);
  };

  const handlePercentageChange = (event: Event, newValue: number | number[]) => {
    
    const percentageValue = typeof newValue === 'number' ? newValue : newValue[0];
    setPercentage(percentageValue);
    calculateValues(price.toString(), percentageValue);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = event.target.value;
    setPrice(Number(newPrice));
    calculateValues(newPrice, percentage);
  };



  const calculateValues = (price: string, percentage: number) => {
    const priceValue = parseFloat(price) || 0;
    const amount =props.wallet[item]* (percentage / 100);
    setUsdValue(priceValue * amount);
    setItemAmount(amount);
  };


  const handleSubmit = () => {
   props.orderRequest( 'sell',itemAmount , item , price , props.wallet[item] * percentage/100)
  };

  const handleCancel = () => {
    // Handle cancel logic here
    console.log('Cancelled');
  };

  return (

     
        <React.Fragment>
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
            <Typography gutterBottom>Percentage: {percentage}%</Typography>
            <Slider
              value={percentage}
              onChange={handlePercentageChange}
              aria-labelledby="percentage-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={100}
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
            <Typography component="p">
              Item Amount: {itemAmount.toFixed(2)}
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
