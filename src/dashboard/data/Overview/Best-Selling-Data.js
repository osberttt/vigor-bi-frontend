import { renderSparklineCell } from '../../utils/utils';

export const columns = [
  {
    field: 'rank',
    headerName: 'Rank',
    headerAlign: 'right',
    align: 'right',
    flex: 0.3,
    minWidth: 60,
  },
  {
    field: 'sku',
    headerName: 'SKU',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'itemName',
    headerName: 'Item',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'quantitySold',
    headerName: 'Quantity Sold',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 80,
  },
  {
    field: 'salesAmount',
    headerName: 'Sales Amount',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'conversions',
    headerName: 'Daily Conversions',
    flex: 1,
    minWidth: 150,
    renderCell: renderSparklineCell,
  },
];

export const rows = [
    {
      id: 1,
      rank: 1,
      sku: "CK005",
      itemName: "Cupcakes (Dozen)",
      quantitySold: 50,
      salesAmount: "$500",
      conversions: [10, 15, 18, 14, 20],
    },
    {
      id: 2,
      rank: 2,
      sku: "CK003",
      itemName: "Strawberry Cake",
      quantitySold: 45,
      salesAmount: "$450",
      conversions: [8, 12, 16, 10, 14],
    },
    {
      id: 3,
      rank: 3,
      sku: "CK001",
      itemName: "Chocolate Cake",
      quantitySold: 40,
      salesAmount: "$400",
      conversions: [7, 11, 14, 9, 13],
    },
    {
      id: 4,
      rank: 4,
      sku: "CK004",
      itemName: "Red Velvet Cake",
      quantitySold: 35,
      salesAmount: "$350",
      conversions: [6, 10, 13, 8, 12],
    },
    {
      id: 5,
      rank: 5,
      sku: "CK002",
      itemName: "Vanilla Cake",
      quantitySold: 30,
      salesAmount: "$300",
      conversions: [5, 9, 12, 7, 11],
    },
  ];
  