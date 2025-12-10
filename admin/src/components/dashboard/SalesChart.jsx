import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const SalesChart = () => {
    const data = [
        { name: "Mon", sales: 120 },
        { name: "Tue", sales: 200 },
        { name: "Wed", sales: 150 },
        { name: "Thu", sales: 280 },
        { name: "Fri", sales: 320 },
        { name: "Sat", sales: 400 },
        { name: "Sun", sales: 260 },
    ];

    return (
        <div className="h-[300px] rounded-xl bg-white p-4 shadow">
            <h3 className="mb-4 text-lg font-semibold">Weekly Sales</h3>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;
