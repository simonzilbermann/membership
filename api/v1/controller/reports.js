const orders = require('../models/order');

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

module.exports = {
    get_orders_reports: async (req, res) => {
        const ordersData = await orders.find({});
        const jsonData = [];

        // Group orders by year
        const ordersByYear = {};
        ordersData.forEach(order => {
            const createdAt = new Date(order.createdAt);
            const year = createdAt.getFullYear();
            if (!ordersByYear[year]) {
                ordersByYear[year] = [];
            }
            ordersByYear[year].push(order);
        });

        const years = Object.keys(ordersByYear).sort((a, b) => parseInt(a) - parseInt(b)); // Fix sorting issue
        

        // Generate datasets
        const datasets = years.map((year, index) => {
            const backgroundColor = getRandomColor();
            const borderColor = getRandomColor();
            const monthlyOrderCount = new Array(12).fill(0);

            ordersByYear[year].forEach(order => {
                const createdAt = new Date(order.createdAt);
                const month = createdAt.getMonth();
                monthlyOrderCount[month]++;
            });

            return {
                label: year,
                backgroundColor,
                borderColor,
                data: monthlyOrderCount
            };
        });

        
        res.status(200).json(datasets);
    }
};
