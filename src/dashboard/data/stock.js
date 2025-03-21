import { stockItems } from "./overview";

export let topStockItems, bottomStockItems;

export function generateMockStockData(){
    const result = [];
    for (let i = 0; i < stockItems.length; i++) {
        const quantityAvailable = Math.floor(Math.random() * (200 - 0 + 1)) + 0;
        const stockLevelThreshold = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        const item = stockItems[i];
        result.push({
            id: i + 1,
            sku: item.sku,
            itemName: item.name,
            category: item.category,
            quantityAvailable: quantityAvailable,
            stockLevelThreshold: stockLevelThreshold,
            quantityDeficit: quantityAvailable - stockLevelThreshold,
        });
    }

    // Sort the result array based on quantityDeficit
    result.sort((a, b) => a.quantityDeficit - b.quantityDeficit);
    const topBottomData = getTopAndBottomItems(result);
    topStockItems = topBottomData.topItems;
    bottomStockItems = topBottomData.bottomItems;
    return {data:result};
}

function getTopAndBottomItems(items) {
    // Get the top 5 items (lowest quantityDeficit)
    const topItems = items.slice(0, 5);

    // Get the bottom 5 items (highest quantityDeficit)
    const bottomItems = items.slice(-5);

    return { topItems, bottomItems };
}

export function generateStockInsights() {
    console.log(topStockItems);
    const topItemsNames = topStockItems.map(item => `${item.itemName} with quantity deficit of ${Math.abs(item.quantityDeficit)}`).join(', ');
    const bottomItemsNames = bottomStockItems.map(item => `${item.itemName} with surplus of ${Math.abs(item.quantityDeficit)}`).join(', ');

    return `As of now, several stock items exhibited notable differences in inventory levels. Five items have stock levels significantly below the desired threshold, indicating potential supply chain issues or unanticipated demand. These items include ${topItemsNames}. Restocking these items promptly is crucial to avoid stockouts and missed sales opportunities. On the other hand, five items have stock levels that exceed the threshold by a large margin, suggesting overstocking or slower-than-expected sales. These items are ${bottomItemsNames}. It may be worth analyzing their sales trends to adjust future stock orders and avoid unnecessary holding costs. Balancing stock levels by addressing both shortages and excesses will help optimize inventory management.`;
}

export const mockStockData = generateMockStockData();

