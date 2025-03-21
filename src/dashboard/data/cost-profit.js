import { humanizeNumber } from "../utils/utils";

export const mockRevenuePeriod = {"data":[{"date":"2025-02-14","totalRevenue":29551},{"date":"2025-02-15","totalRevenue":25230},{"date":"2025-02-16","totalRevenue":26945},{"date":"2025-02-17","totalRevenue":30895},{"date":"2025-02-18","totalRevenue":24918},{"date":"2025-02-19","totalRevenue":26558},{"date":"2025-02-20","totalRevenue":29645},{"date":"2025-02-21","totalRevenue":33479},{"date":"2025-02-22","totalRevenue":29700},{"date":"2025-02-23","totalRevenue":28006},{"date":"2025-02-24","totalRevenue":28769},{"date":"2025-02-25","totalRevenue":24645},{"date":"2025-02-26","totalRevenue":31651},{"date":"2025-02-27","totalRevenue":29353},{"date":"2025-02-28","totalRevenue":26749},{"date":"2025-03-01","totalRevenue":29122},{"date":"2025-03-02","totalRevenue":29319},{"date":"2025-03-03","totalRevenue":31235},{"date":"2025-03-04","totalRevenue":27368},{"date":"2025-03-05","totalRevenue":29696},{"date":"2025-03-06","totalRevenue":25806},{"date":"2025-03-07","totalRevenue":26691},{"date":"2025-03-08","totalRevenue":26615},{"date":"2025-03-09","totalRevenue":25057},{"date":"2025-03-10","totalRevenue":25781},{"date":"2025-03-11","totalRevenue":24554},{"date":"2025-03-12","totalRevenue":30715},{"date":"2025-03-13","totalRevenue":26745}]}
export const mockCostPeriod = {"data":[{"date":"2025-02-14","totalCost":18497.1},{"date":"2025-02-15","totalCost":14943.9},{"date":"2025-02-16","totalCost":20897.1},{"date":"2025-02-17","totalCost":15502.2},{"date":"2025-02-18","totalCost":22009.8},{"date":"2025-02-19","totalCost":16556.1},{"date":"2025-02-20","totalCost":15486.3},{"date":"2025-02-21","totalCost":16276.2},{"date":"2025-02-22","totalCost":15624.9},{"date":"2025-02-23","totalCost":17736.9},{"date":"2025-02-24","totalCost":15205.5},{"date":"2025-02-25","totalCost":15177.6},{"date":"2025-02-26","totalCost":15396.6},{"date":"2025-02-27","totalCost":16107},{"date":"2025-02-28","totalCost":18431.7},{"date":"2025-03-01","totalCost":17078.1},{"date":"2025-03-02","totalCost":18775.2},{"date":"2025-03-03","totalCost":15543.6},{"date":"2025-03-04","totalCost":18831},{"date":"2025-03-05","totalCost":15306},{"date":"2025-03-06","totalCost":23556.6},{"date":"2025-03-07","totalCost":18843.9},{"date":"2025-03-08","totalCost":16270.8},{"date":"2025-03-09","totalCost":16799.1},{"date":"2025-03-10","totalCost":18020.4},{"date":"2025-03-11","totalCost":18452.7},{"date":"2025-03-12","totalCost":19211.4},{"date":"2025-03-13","totalCost":18092.1}]}


export function generateMockRevenuePeriod(startDate, endDate) {
    const result = [];
    
    // Convert startDate and endDate to Date objects if they aren't already
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate the number of days between startDate and endDate
    const daysDifference = Math.ceil((end - start) / (1000 * 3600 * 24)) + 2; // Adding 2 to include the end date
    
    // Iterate through each day between startDate and endDate
    for (let i = 1; i < daysDifference; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        
        result.push({
            date: currentDate.toISOString().split('T')[0], // Format YYYY-MM-DD
            totalRevenue: Math.floor(Math.random() * (35000 - 25000 + 1)) + 25000 // Random revenue between 25000 and 35000
        });
    }
    
    return result;
}

export function generateMockCostPeriod(startDate, endDate) {
    const result = [];
    
    // Convert startDate and endDate to Date objects if they aren't already
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate the number of days between startDate and endDate
    const daysDifference = Math.ceil((end - start) / (1000 * 3600 * 24)) + 1; // Adding 1 to include the end date
    
    // Iterate through each day between startDate and endDate
    for (let i = 0; i < daysDifference; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        
        result.push({
            date: currentDate.toISOString().split('T')[0], // Format YYYY-MM-DD
            totalCost: Math.floor(Math.random() * (25000 - 15000 + 1)) + 15000 // Random cost between 15000 and 25000
        });
    }
    
    return result;
}

function findMinMax(arr) {
    if (arr.length === 0) return null; // Handle empty array case

    let minValue = Math.min(...arr);
    let minIndex = arr.indexOf(minValue);

    let maxValue = Math.max(...arr);
    let maxIndex = arr.indexOf(maxValue);

    return { min: { value: minValue, index: minIndex }, max: { value: maxValue, index: maxIndex } };
}

export function generateMockCostProfitInsights(value, interval, series) {
    const totalProfit = humanizeNumber(value);

    const costMinMax = findMinMax(series[0].data);
    const revenueMinMax = findMinMax(series[1].data);
    const profitMinMax = findMinMax(series[2].data);


    const highestCost = humanizeNumber(costMinMax.max.value);
    const lowestCost = humanizeNumber(costMinMax.min.value);
    const highestRevenue = humanizeNumber(revenueMinMax.max.value);
    const lowestRevenue = humanizeNumber(revenueMinMax.min.value);
    const highestProfit = humanizeNumber(profitMinMax.max.value);
    const lowestProfit = humanizeNumber(profitMinMax.min.value);

    const highestCostDate = interval[costMinMax.max.index];
    const lowestCostDate = interval[costMinMax.min.index];
    const highestRevenueDate = interval[revenueMinMax.max.index];
    const lowestRevenueDate = interval[revenueMinMax.min.index];
    const highestProfitDate = interval[profitMinMax.max.index];
    const lowestProfitDate = interval[profitMinMax.min.index];

    return `During the selected period, total profit reached $${totalProfit}, reflecting overall financial performance. The highest cost was recorded on ${highestCostDate} at $${highestCost}, likely due to increased expenses, while the lowest cost occurred on ${lowestCostDate} at $${lowestCost}, indicating improved cost efficiency. 

    Revenue peaked on ${highestRevenueDate} at $${highestRevenue}, highlighting a strong sales period, while the lowest revenue was on ${lowestRevenueDate} at $${lowestRevenue}, potentially due to seasonal or demand-related factors. 
    
    Profit saw its highest on ${highestProfitDate} at $${highestProfit}, driven by a combination of strong sales and cost control, while the lowest profit was recorded on ${lowestProfitDate} at $${lowestProfit}, possibly due to increased costs or lower sales. 

    Overall, the financial trends indicate periods of strong performance balanced by fluctuations influenced by demand, expenses, and operational factors.`;
}