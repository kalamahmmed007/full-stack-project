import React from "react";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
    const { token } = useParams();

    return (
        <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold">Reset Password Page</h1>
            <p>Token: {token}</p>
        </div>
    );
};

export default ResetPassword;
