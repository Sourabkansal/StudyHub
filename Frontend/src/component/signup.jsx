import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const signup = () => {
  const navigate = useNavigate();

  const Button = ({ children, className, ...props }) => (
    <button className={`px-4 py-2 rounded-lg ${className}`} {...props}>
      {children}
    </button>
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data)
    let response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.error("Signup failed:", response.status);
      const notify = () =>
        toast(
          response.status == 402
            ? "Username already registered"
            : "" || response.status == 403
            ? "email already registered"
            : "" || response.status == 401
            ? "Otp incorrect " :""
        );
      notify();
    } else {
      const dataa = await response.json();
      console.log(dataa);
      const notify = () => toast("Signup successful!");
      notify();
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };
  

  const password = watch("password");
   const [sendotp , setsendotp ]= useState(false);
   const [IssendingOtp,setIssendingOtp] =useState(false);

  async function sendotpp() {
    setIssendingOtp(true)
    let response = await fetch(`${import.meta.env.VITE_API_URL}/auth/getotp`,{
         method:"POST",
         headers:{
          "Content-type": "application/json",
         },
         body: JSON.stringify({email: email.value })
    });
    console.log(response)
    let data = await response.json()
    if(response.ok){
         toast.success(data.message)
         setsendotp(true)
         
        }else {
          toast.error(data.message)
        }
        setIssendingOtp(false)
  
  }

   async function  sendOtp(){
    sendotpp();
   }

  return (
  <div className="min-h-screen bg-[rgba(59,130,246,0.1)] flex items-center justify-center px-4 py-10">
  <ToastContainer />
  <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row md:space-x-8">
    
    {/* Left Section */}
    <div className="flex-1">
      <h1 className="text-3xl font-bold text-blue-800">Sign-Up</h1>
      <p className="text-sm text-blue-600 mt-2">
        Join StudyHub and kickstart your learning journey. Create your account now.
      </p>

      {/* Form */}
      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-blue-700">Username</label>
          <input
            placeholder="Xyz123"
            className="mt-1 w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("username", {
              required: { value: true, message: "Please enter username" },
              minLength: { value: 4, message: "Min length is 4" },
              maxLength: { value: 12, message: "Max length is 12" },
              pattern: {
                value: /^[a-zA-Z0-9_]{3,16}$/,
                message: "Use alphabets and numbers",
              },
            })}
          />
          {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-blue-700">Email</label>
          <input
            placeholder="example@email.com"
            className="mt-1 w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            id="email"
            {...register("email", {
              required: { value: true, message: "Please enter email" },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-blue-700">Password</label>
          <input
            type="password"
            placeholder="At least 8 characters"
            className="mt-1 w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("password", {
              required: { value: true, message: "Enter password" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                message: "Must contain upper/lowercase, number & symbol",
              },
            })}
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-blue-700">Confirm Password</label>
          <input
            type="password"
            placeholder="Enter password again"
            className="mt-1 w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("confirmpassword", {
              required: { message: "Enter confirmation password" },
              validate: (value) => value === password || "Passwords do not match",
            })}
          />
          {errors.confirmpassword && (
            <p className="text-red-600 text-sm mt-1">{errors.confirmpassword.message}</p>
          )}
        </div>

        {/* OTP Section */}
        {!sendotp && (
          <button
            type="button"
            onClick={sendOtp}
            disabled={IssendingOtp}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-all"
          >
            {IssendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {sendotp && (
          <>
            <div>
              <label className="block text-sm font-medium text-blue-700">Enter OTP</label>
              <input
                placeholder="Example: 1234"
                className="mt-1 w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("otp", {
                  required: { message: "Enter OTP" },
                })}
              />
            </div>
            <input
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all"
              value="Sign Up"
            />
          </>
        )}
      </form>

      {/* OR Divider */}
      <div className="my-6 text-center text-blue-300">OR</div>

      {/* Social Sign-in */}
      <Button className="w-full bg-white border border-blue-300 text-blue-700 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-sm">
        <img
          src="your-google-icon.png"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </Button>
    <p className="mt-6 text-sm text-center text-blue-600">
              Already have an account?{" "}
              <NavLink to="/login" className="font-semibold text-blue-800 underline">
                Sign in
              </NavLink>
            </p>
    </div>
  </div>
</div>


  );
};

export default signup;
