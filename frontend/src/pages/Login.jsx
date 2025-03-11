import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import React Icons
import { useNavigate } from "react-router-dom";
//import api from "../api";
//import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import logo from "../assets/images/TruckImage.avif";

function Login({ route }) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await api.post(`/api/token/`, {
                username: userName,
                password: password,
            });

            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                setError("Invalid credentials");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative h-screen w-full">
            {/*Background Image */}
            <img
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={logo}
                alt="Logo"
            />

            {/* Welcome Message*/}
            <div className="absolute top-1/2 left-10 transform -translate-y-1/2 text-white max-w-2xl opacity-85">
                <h1 className="text-5xl font-bold mb-4">Welcome to What The Truck!</h1>
                <p className="text-xl">
                    Sign in to access your supervisor dashboard.
                </p>
            </div>

            {/* Login Form */}
            <div className="absolute top-1/2 right-10 transform -translate-y-1/2 w-full max-w-md p-8 bg-white bg-opacity-90 shadow-2xl rounded-2xl">
                <h1 className="text-3xl font-semibold text-gray-700 text-center mb-6">
                    Login
                </h1>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-4">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 font-medium mb-2"
                            htmlFor="username"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            autoFocus
                        />
                    </div>


                    <div className="mb-6 relative">
                        <label
                            className="block text-gray-700 font-medium mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10" // Add padding-right for button
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button
                                type="button"
                                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus-visible:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;

