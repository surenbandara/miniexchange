import { matchingAlgo } from "../matching_engine/matchineengine.js";
import { postProcessor } from "../post_process/postprocessor.js";
export class QueueManager {
    constructor(initialOrders, liveConnections) {
        this.orderList = initialOrders;
        this.liveConnections = liveConnections;
    }
    addOrder(newOrder) {
        for (let i = 0; i < this.orderList.length; i++) {
            const existingOrder = this.orderList[i];
            const result = matchingAlgo(newOrder, existingOrder);
            if (result !== null) {
                this.orderList[i] = result.existing; // Update the existing order
                newOrder = result.processing; // Update the new order
                // If the new order is fully filled, break the loop
                postProcessor(result.existing, this.liveConnections);
                if (newOrder.filled) {
                    postProcessor(newOrder, this.liveConnections);
                    return;
                }
            }
        }
        // Add the new order to the list if it is not fully filled
        if (!newOrder.filled) {
            postProcessor(newOrder, this.liveConnections);
            this.orderList.push(newOrder);
        }
    }
}
//# sourceMappingURL=queuemanager.js.map