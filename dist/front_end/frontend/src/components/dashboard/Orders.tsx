import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { useEffect, useState } from 'react';

interface OrdersProp {
  orders: any[];
}

export default function Orders(props: OrdersProp) {
  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price in USD (per item)</TableCell>
            <TableCell align="right">Precentage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.orders.map((row) => (
            <TableRow key={row.id} style={{ backgroundColor: row.type === 'buy' ? 'rgba(0, 128, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)'}}>

              <TableCell>{row.time}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.item}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{`${row.price}$`}</TableCell>
              <TableCell align="right">{`${row.percentage}%`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={() => console.log("clicked")} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
