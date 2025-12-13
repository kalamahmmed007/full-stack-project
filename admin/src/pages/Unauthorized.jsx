const Unauthorized = () => {
    return (
        <div className="flex items-center justify-center h-screen text-center">
            <div>
                <h1 className="text-3xl font-bold text-red-600">
                    Access Denied 🚫
                </h1>
                <p className="mt-2 text-gray-500">
                    You don’t have permission to view this page.
                </p>
            </div>
        </div>
    );
};

export default Unauthorized;
