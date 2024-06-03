import { Order } from "../../model/order.js";

export function matchingAlgo(processing: Order, existing: Order): { processing: Order, existing: Order } | null {
  // Check if userid and type are the same
  if (processing.userid === existing.userid || processing.type === existing.type) {
    return null;
  }
  
  // Check if item is the same
  if (processing.item !== existing.item) {
    return null;
  }

  // Process the order
  if ((processing.type === "sell" && processing.price <= existing.price)||
  (processing.type === "buy" && processing.price >= existing.price)) {
    if (processing.quantity*(1-processing.percentage/100) == existing.quantity*(1-existing.percentage/100)) {
      existing.percentage = 100;
      existing.filled = true ;
      processing.filled = true; // Assume the processing order is fully filled
      processing.percentage = 100;
      return { processing, existing };
    } else if (processing.quantity*(1-processing.percentage/100) > existing.quantity*(1-existing.percentage/100)) {
  
      const filledPercentage = Math.floor(existing.quantity*(1-existing.percentage/100) / processing.quantity * 100);
      processing.percentage = filledPercentage + processing.percentage;
      existing.percentage = 100;
      existing.filled = true ;
      return { processing, existing };
    }

    else{
      const filledPercentage = Math.floor(processing.quantity*(1-processing.percentage/100) / existing.quantity * 100);
      existing.percentage = filledPercentage + existing.percentage;
      processing.percentage = 100;
      processing.filled = true ;
      return { processing, existing };
    }
  }


  // If conditions are not met
  return null;
}