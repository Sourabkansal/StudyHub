import React from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, NavLink } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        credentials : "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      
      if (!response.ok) {
        toast.error(resData.message || "Login failed");
      } else {
        toast.success("Login successful");
        console.log(resData)      
        localStorage.setItem("user",JSON.stringify(resData))
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Login</h1>
        <p className="text-sm text-blue-500 mb-6">
          Welcome back! Please login to your account.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-blue-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-blue-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <input
            type="submit"
            value="Login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all cursor-pointer"
          />
        </form>

        {/* OR Divider */}
        <div className="my-6 text-center text-blue-300">OR</div>

        {/* Google Login */}
        <button className="w-full bg-white border border-blue-300 text-blue-700 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-sm transition">
          <img src="your-google-icon.png" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        {/* Sign Up Link */}
        <p className="mt-6 text-sm text-center text-blue-600">
          Don't have an account?{" "}
          <NavLink to="/signup" className="font-semibold text-blue-800 underline">
            Sign up
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
