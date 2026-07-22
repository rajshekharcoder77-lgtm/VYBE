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

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");

    const { name, userName, email, password, confirmPassword } = formData;

    // ✅ Required Validation
    if (!name || !userName || !email || !password || !confirmPassword) {
      setErr("All fields are required!");
      return;
    }

    // ✅ Gmail Only Validation
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailRegex.test(email)) {
      setErr("Email must be a valid @gmail.com address");
      return;
    }

    // ✅ Password Length
    if (password.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }

    // ✅ Confirm Password
    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, userName, email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex justify-center items-center">
      <div className="w-[90%] lg:max-w-[60%] h-[650px] bg-white rounded-2xl flex overflow-hidden border-2 border-[#1a1f23]">

        {/* LEFT SIDE */}
        <div className="w-full lg:w-[50%] flex flex-col items-center p-6 gap-5">

          <div className="flex gap-2 items-center text-xl font-semibold mt-6">
            <span>Sign Up to</span>
            <img src={logo} alt="logo" className="w-[70px]" />
          </div>

          <form
            onSubmit={handleSignUp}
            className="w-full flex flex-col items-center gap-4 mt-6"
          >

            <InputField
              label="Enter Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={err && !formData.name}
            />

            <InputField
              label="Enter Username"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              error={err && !formData.userName}
            />

            <InputField
              label="Enter Gmail Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={err && !formData.email}
            />

            <PasswordField
              label="Enter Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              error={err && !formData.password}
            />

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              show={showConfirmPassword}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              error={err && !formData.confirmPassword}
            />

            {err && (
              <p className="text-red-500 text-sm text-center">{err}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-[70%] h-[50px] bg-black text-white rounded-2xl font-semibold mt-4 disabled:opacity-70"
            >
              {loading ? <ClipLoader size={25} color="white" /> : "Sign Up"}
            </button>
          </form>

          <p
            className="cursor-pointer text-gray-800 mt-2"
            onClick={() => navigate("/signin")}
          >
            Already Have An Account?{" "}
            <span className="border-b-2 border-black pb-1 text-black">
              Sign In
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

export default SignUp;


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
