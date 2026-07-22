import React, { useState } from "react";
import logo from "../assets/logo2.png";
import logo1 from "../assets/logo.png";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");

    const { userName, password } = formData;

    // ✅ Required validation
    if (!userName.trim() || !password.trim()) {
      setErr("Username and Password are required!");
      return;
    }

    try {
      setLoading(true);

      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { userName: userName.trim(), password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      navigate("/"); // redirect after login
    } catch (error) {
      setErr(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex justify-center items-center">
      <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex overflow-hidden border-2 border-[#1a1f23]">

        {/* LEFT SIDE */}
        <div className="w-full lg:w-[50%] flex flex-col items-center justify-center p-6 gap-5">

          <div className="flex gap-2 items-center text-xl font-semibold">
            <span>Sign In to</span>
            <img src={logo} alt="logo" className="w-[70px]" />
          </div>

          <form
            onSubmit={handleSignIn}
            className="w-full flex flex-col items-center gap-4 mt-6"
          >

            {/* Username */}
            <InputField
              label="Enter Username"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              error={err && !formData.userName}
            />

            {/* Password */}
            <PasswordField
              label="Enter Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              error={err && !formData.password}
            />

            <div
              className="w-[90%] text-sm cursor-pointer text-gray-600 hover:text-black"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </div>

            {err && (
              <p className="text-red-500 text-sm text-center">{err}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-[70%] h-[50px] bg-black text-white rounded-2xl font-semibold mt-4 disabled:opacity-70"
            >
              {loading ? <ClipLoader size={25} color="white" /> : "Sign In"}
            </button>
          </form>

          <p
            className="cursor-pointer text-gray-800 mt-2"
            onClick={() => navigate("/signup")}
          >
            Want To Create A New Account?{" "}
            <span className="border-b-2 border-black pb-1 text-black">
              Sign Up
            </span>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex w-[50%] bg-black text-white flex-col justify-center items-center gap-3">
          <img src={logo1} alt="logo" className="w-[40%]" />
          <p>Not Just A Platform, It's A VYBE</p>
        </div>

      </div>
    </div>
  );
}

export default SignIn;


/* 🔥 Reusable Input Component */
function InputField({ label, name, value, onChange, type = "text", error }) {
  return (
    <div className={`w-[90%] h-[50px] rounded-2xl border-2 flex items-center px-4 ${error ? "border-red-500" : "border-black"}`}>
      <input
        type={type}
        name={name}
        placeholder={label}
        value={value}
        onChange={onChange}
        className="w-full outline-none"
      />
    </div>
  );
}

/* 🔥 Reusable Password Component */
function PasswordField({ label, name, value, onChange, show, toggle, error }) {
  return (
    <div className={`w-[90%] h-[50px] rounded-2xl border-2 flex items-center px-4 relative ${error ? "border-red-500" : "border-black"}`}>
      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder={label}
        value={value}
        onChange={onChange}
        className="w-full outline-none"
      />
      {show ? (
        <IoIosEyeOff
          className="absolute right-4 cursor-pointer"
          onClick={toggle}
        />
      ) : (
        <IoIosEye
          className="absolute right-4 cursor-pointer"
          onClick={toggle}
        />
      )}
    </div>
  );
}
