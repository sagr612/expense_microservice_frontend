export const DUMMY_TRANSACTIONS = [
    {
        id: '1',
        category: 'Food',
        amount: 45.00,
        date: new Date().toISOString(),
        type: 'expense' as const,
    },
    {
        id: '2',
        category: 'Shopping',
        amount: 280.00,
        date: new Date().toISOString(),
        type: 'expense' as const,
    },
    {
        id: '3',
        category: 'Entertainment',
        amount: 60.00,
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        type: 'expense' as const,
    },
    {
        id: '4',
        category: 'Travel',
        amount: 250.00,
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        type: 'expense' as const,
    },
    {
        id: '5',
        category: 'Home Rent',
        amount: 350.00,
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        type: 'expense' as const,
    },
    {
        id: '6',
        category: 'Pet Groom',
        amount: 50.00,
        date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        type: 'expense' as const,
    },
    {
        id: '7',
        category: 'Recharge',
        amount: 100.00,
        date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        type: 'expense' as const,
    },
    {
        id: '8',
        category: 'Salary',
        amount: 2500.00,
        date: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
        type: 'income' as const,
    },
];