const OrderStatus = () => {
    return (
        <div className="rounded-xl bg-white p-4 shadow">
            <h3 className="mb-2 text-lg font-semibold">Order Status</h3>

            <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                    <span>Pending</span>
                    <span className="font-medium">12</span>
                </li>
                <li className="flex justify-between">
                    <span>Processing</span>
                    <span className="font-medium">8</span>
                </li>
                <li className="flex justify-between">
                    <span>Delivered</span>
                    <span className="font-medium">25</span>
                </li>
                <li className="flex justify-between">
                    <span>Cancelled</span>
                    <span className="font-medium">3</span>
                </li>
            </ul>
        </div>
    );
};

export default OrderStatus;
