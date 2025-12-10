import { Users, UserPlus, UserCheck } from "lucide-react";

const UserStats = () => {
    const stats = [
        {
            label: "Total Users",
            value: "1,250",
            icon: <Users className="h-6 w-6" />,
        },
        {
            label: "New Users",
            value: "85",
            icon: <UserPlus className="h-6 w-6" />,
        },
        {
            label: "Active Users",
            value: "1,030",
            icon: <UserCheck className="h-6 w-6" />,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center gap-4 rounded-xl bg-white p-4 shadow"
                >
                    <div className="rounded-full bg-gray-100 p-3 text-gray-700">
                        {item.icon}
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <p className="text-xl font-semibold">{item.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserStats;
