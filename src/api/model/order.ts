// Order.ts
export interface Order {
    id: string;
    time:string;
    username:string;
    userid :string;
    type:string;
    item: string;
    quantity: number;
    price:number;
    filled: boolean;
    percentage : number;
  }
  