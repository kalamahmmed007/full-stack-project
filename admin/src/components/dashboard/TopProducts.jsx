const TopProducts = () => {
    const products = [
        {
            id: 1,
            name: "Wireless Headphones",
            sales: 120,
            revenue: "৳48,000",
        },
        {
            id: 2,
            name: "Smart Watch",
            sales: 95,
            revenue: "৳38,000",
        },
        {
            id: 3,
            name: "Bluetooth Speaker",
            sales: 80,
            revenue: "৳32,000",
        },
        {
            id: 4,
            name: "Gaming Mouse",
            sales: 60,
            revenue: "৳18,000",
        },
    ];

    return (
        <div className="rounded-xl bg-white p-4 shadow">
            <h3 className="mb-4 text-lg font-semibold">Top Products</h3>

            <ul className="space-y-3">
                {products.map((product) => (
                    <li
                        key={product.id}
                        className="flex items-center justify-between text-sm"
                    >
                        <span className="font-medium">{product.name}</span>

                        <div className="text-right">
                            <p className="font-semibold">{product.revenue}</p>
                            <p className="text-gray-500">{product.sales} sales</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopProducts;
