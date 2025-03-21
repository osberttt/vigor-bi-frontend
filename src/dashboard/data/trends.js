//export const quantityMOM = {"data":{"stock_quantities_mom":[2800,3150,3200,2750,3100,3050,2990,3300,2900,3100,2800,3250],"menu_quantities_mom":[8200,7500,8100,7600,8000,7800,8500,7900,8100,7500,7900,8300]}}
//export const costMOM = {"data":[560000.5,490000.2,550000.4,530000.1,540000.8,520000.5,530500.3,540500.2,520000.7,550500.8,530000.3,560500.1]}
//export const revenueMOM = {"data":{"menu_revenues_mom":[500000,480000,495000,510000,485000,520000,490000,530000,500000,510000,495000,505000],"stock_revenues_mom":[350000,330000,370000,340000,375000,330000,350000,360000,355000,340000,350000,345000]}}

import { getMonthNames, humanizeNumber } from "../utils/utils";

//export const quantityYOY = {"data":{"stock_quantities_yoy":[35000,37500,34000,38000,36500],"menu_quantities_yoy":[95000,92000,96000,90000,98000]}}
//export const costYOY = {"data":[6350000.8,6300000.7,6200000.3,6305000.2,6400000.5]}
//export const revenueYOY = {"data":{"stock_revenues_yoy":[4300000,4400000,4200000,4300000,4250000],"menu_revenues_yoy":[6000000,5900000,5800000,5700000,6100000]}}

function generateRandomArray(length, min, max) {
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return result;
}

function generateRandomFloatArray(length, min, max) {
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push(parseFloat((Math.random() * (max - min) + min).toFixed(2)));
    }
    return result;
}

function generateMockTrendsData() {
    const quantityMOM = {
        data: {
            stock_quantities_mom: generateRandomArray(12, 2000, 3500),  // Random stock quantities for MOM with fluctuation
            menu_quantities_mom: generateRandomArray(12, 7000, 9000)  // Random menu quantities for MOM with fluctuation
        }
    };

    const costMOM = {
        data: generateRandomFloatArray(12, 450000, 600000)  // Random cost for MOM with fluctuation
    };

    const revenueMOM = {
        data: {
            menu_revenues_mom: generateRandomArray(12, 400000, 550000),  // Random menu revenue for MOM
            stock_revenues_mom: generateRandomArray(12, 300000, 400000)  // Random stock revenue for MOM
        }
    };

    const quantityYOY = {
        data: {
            stock_quantities_yoy: generateRandomArray(5, 30000, 40000),  // Random stock quantities for YOY
            menu_quantities_yoy: generateRandomArray(5, 80000, 100000)  // Random menu quantities for YOY
        }
    };

    const costYOY = {
        data: generateRandomFloatArray(5, 6000000, 7000000)  // Random cost for YOY with fluctuation
    };

    const revenueYOY = {
        data: {
            stock_revenues_yoy: generateRandomArray(5, 4000000, 5000000),  // Random stock revenue for YOY
            menu_revenues_yoy: generateRandomArray(5, 5000000, 6000000)  // Random menu revenue for YOY
        }
    };

    return { quantityMOM, costMOM, revenueMOM, quantityYOY, costYOY, revenueYOY };
}

const mockData = generateMockTrendsData();
const { quantityMOM, costMOM, revenueMOM, quantityYOY, costYOY, revenueYOY } = mockData;
export { quantityMOM, costMOM, revenueMOM, quantityYOY, costYOY, revenueYOY };

function findMinMax(arr) {
    if (arr.length === 0) return null; // Handle empty array case

    let minValue = Math.min(...arr);
    let minIndex = arr.indexOf(minValue);

    let maxValue = Math.max(...arr);
    let maxIndex = arr.indexOf(maxValue);

    return { min: { value: minValue, index: minIndex }, max: { value: maxValue, index: maxIndex } };
}

export function generateMockMOMCostInsights(value, series){
    const minMax = findMinMax(series[0].data);
    const minValue = humanizeNumber(minMax.min.value);
    const maxValue = humanizeNumber(minMax.max.value);
    const minMonth = getMonthNames()[minMax.min.index];
    const maxMonth = getMonthNames()[minMax.max.index];
    const avg = value / 12;

    return `Over the past year, total costs fluctuated, reaching a peak of $${maxValue} in ${maxMonth}, likely due to increased demand or higher operational expenses. Conversely, the lowest recorded cost was $${minValue} in ${minMonth}, suggesting a period of reduced spending or improved efficiency. Overall, the total cost for the year amounted to $${humanizeNumber(value)}, with an average monthly expenditure of $${avg}, reflecting a consistent spending pattern with seasonal variations.`
}

export function generateMockMOMProfitInsights(value, series){
    const minMax = findMinMax(series[0].data);
    const minValue = humanizeNumber(minMax.min.value);
    const maxValue = humanizeNumber(minMax.max.value);
    const minMonth = getMonthNames()[minMax.min.index];
    const maxMonth = getMonthNames()[minMax.max.index];
    const avg = value / 12;

    return `Over the past year, total profit fluctuated, reaching a peak of $${maxValue} in ${maxMonth}, likely due to increased sales or optimized costs. Conversely, the lowest recorded cost was $${minValue} in ${minMonth} possibly due to higher expenses or decreased revenue. Overall, the total profit for the year amounted to $${humanizeNumber(value)}, with an average monthly profit of $${avg}, indicating a stable yet seasonally influenced profitability trend.`
}

export function generateMockMOMRevenueInsights(value, series){
    const stockMinMax = findMinMax(series[0].data);
    const menuMinMax = findMinMax(series[1].data);

    const totalRevenue = humanizeNumber(value);

    const highestStockRevenue = humanizeNumber(stockMinMax.max.value);
    const highestStockMonth = getMonthNames()[stockMinMax.max.index];
    const lowestStockRevenue = humanizeNumber(stockMinMax.min.value);
    const lowestStockMonth = getMonthNames()[stockMinMax.min.index];

    const highestMenuRevenue = humanizeNumber(menuMinMax.max.value);
    const highestMenuMonth = getMonthNames()[menuMinMax.max.index];
    const lowestMenuRevenue = humanizeNumber(menuMinMax.min.value);
    const lowestMenuMonth = getMonthNames()[menuMinMax.min.index];

    return `Total revenue for the year amounted to $${totalRevenue}, reflecting steady sales performance. Stock item revenue peaked in ${highestStockMonth} at $${highestStockRevenue}, while its lowest point was in ${lowestStockMonth} at $${lowestStockRevenue}. Menu item revenue saw its highest in ${highestMenuMonth} at $${highestMenuRevenue}, while the lowest was in ${lowestMenuMonth} at $${lowestMenuRevenue}. Notably, menu items consistently generated over double the revenue of stock items, emphasizing their stronger sales performance.`;
}

export function generateMockMOMQuantityInsights(value, series) {
    const stockMinMax = findMinMax(series[0].data);
    const menuMinMax = findMinMax(series[1].data);

    const totalQuantity = humanizeNumber(value);

    const highestStockQuantity = humanizeNumber(stockMinMax.max.value);
    const highestStockMonth = getMonthNames()[stockMinMax.max.index];
    const lowestStockQuantity = humanizeNumber(stockMinMax.min.value);
    const lowestStockMonth = getMonthNames()[stockMinMax.min.index];

    const highestMenuQuantity = humanizeNumber(menuMinMax.max.value);
    const highestMenuMonth = getMonthNames()[menuMinMax.max.index];
    const lowestMenuQuantity = humanizeNumber(menuMinMax.min.value);
    const lowestMenuMonth = getMonthNames()[menuMinMax.min.index];

    return `Total quantity sold for the year reached ${totalQuantity} units, indicating a stable demand. Stock item sales peaked in ${highestStockMonth} with ${highestStockQuantity} units, while the lowest sales occurred in ${lowestStockMonth} with ${lowestStockQuantity} units. Menu item sales reached their highest in ${highestMenuMonth} with ${highestMenuQuantity} units, and the lowest in ${lowestMenuMonth} with ${lowestMenuQuantity} units. Remarkably, menu items consistently sold over twice as much as stock items, highlighting their dominant contribution to overall sales.`;
}

const years = ['2020','2021','2022','2023','2024'];

export function generateMockYOYCostInsights(value, series){
    const minMax = findMinMax(series[0].data);
    const minValue = humanizeNumber(minMax.min.value);
    const maxValue = humanizeNumber(minMax.max.value);
    const minYear = years[minMax.min.index];
    const maxYear = years[minMax.max.index];
    const avg = value / 12;

    return `Over the last 5 years, total costs fluctuated, reaching a peak of $${maxValue} in ${maxYear}, likely due to increased demand or higher operational expenses. Conversely, the lowest recorded cost was $${minValue} in ${minYear}, suggesting a period of reduced spending or improved efficiency. Overall, the total cost for the last 5 years amounted to $${humanizeNumber(value)}, with an average yearly expenditure of $${avg}, reflecting a consistent spending pattern with seasonal variations.`
}

export function generateMockYOYProfitInsights(value, series){
    const minMax = findMinMax(series[0].data);
    const minValue = humanizeNumber(minMax.min.value);
    const maxValue = humanizeNumber(minMax.max.value);
    const minYear = years[minMax.min.index];
    const maxYear = years[minMax.max.index];
    const avg = value / 12;

    return `Over the last 5 years, total profit fluctuated, reaching a peak of $${maxValue} in ${maxYear}, likely due to increased sales or optimized costs. Conversely, the lowest recorded cost was $${minValue} in ${minYear} possibly due to higher expenses or decreased revenue. Overall, the total profit for the last 5 years amounted to $${humanizeNumber(value)}, with an average yearly profit of $${avg}, indicating a stable yet seasonally influenced profitability trend.`
}

export function generateMockYOYRevenueInsights(value, series){
    const stockMinMax = findMinMax(series[0].data);
    const menuMinMax = findMinMax(series[1].data);

    const totalRevenue = humanizeNumber(value);

    const highestStockRevenue = humanizeNumber(stockMinMax.max.value);
    const highestStockYear = years[stockMinMax.max.index];
    const lowestStockRevenue = humanizeNumber(stockMinMax.min.value);
    const lowestStockYear = years[stockMinMax.min.index];

    const highestMenuRevenue = humanizeNumber(menuMinMax.max.value);
    const highestMenuYear = years[menuMinMax.max.index];
    const lowestMenuRevenue = humanizeNumber(menuMinMax.min.value);
    const lowestMenuYear = years[menuMinMax.min.index];

    return `Total revenue for the last 5 years amounted to $${totalRevenue}, reflecting steady sales performance. Stock item revenue peaked in ${highestStockYear} at $${highestStockRevenue}, while its lowest point was in ${lowestStockYear} at $${lowestStockRevenue}. Menu item revenue saw its highest in ${highestMenuYear} at $${highestMenuRevenue}, while the lowest was in ${lowestMenuYear} at $${lowestMenuRevenue}. Notably, menu items consistently generated over double the revenue of stock items, emphasizing their stronger sales performance.`;
}

export function generateMockYOYQuantityInsights(value, series) {
    const stockMinMax = findMinMax(series[0].data);
    const menuMinMax = findMinMax(series[1].data);

    const totalQuantity = humanizeNumber(value);

    const highestStockQuantity = humanizeNumber(stockMinMax.max.value);
    const highestStockYear = years[stockMinMax.max.index];
    const lowestStockQuantity = humanizeNumber(stockMinMax.min.value);
    const lowestStockYear = years[stockMinMax.min.index];

    const highestMenuQuantity = humanizeNumber(menuMinMax.max.value);
    const highestMenuYear = years[menuMinMax.max.index];
    const lowestMenuQuantity = humanizeNumber(menuMinMax.min.value);
    const lowestMenuYear = years[menuMinMax.min.index];

    return `Total quantity sold for the last 5 years reached ${totalQuantity} units, indicating a stable demand. Stock item sales peaked in ${highestStockYear} with ${highestStockQuantity} units, while the lowest sales occurred in ${lowestStockYear} with ${lowestStockQuantity} units. Menu item sales reached their highest in ${highestMenuYear} with ${highestMenuQuantity} units, and the lowest in ${lowestMenuYear} with ${lowestMenuQuantity} units. Remarkably, menu items consistently sold over twice as much as stock items, highlighting their dominant contribution to overall sales.`;
}
