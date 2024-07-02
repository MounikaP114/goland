import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setDataError] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    console.log(formData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);
      console.log(res.message);
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setDataError(data.message);
        return;
      }
      setLoading(false);
      setDataError(null);
      navigate("/signin");
      // Handle successful response here
    } catch (error) {
      setLoading(false);
      setDataError(error.message);
    }
  };

  return (
    <div className="flex h-dvh">
      <div className="flex-[3_3_0%] flex flex-col justify-center items-center bg-white">
        <h1 className="text-3xl text-center font-semibold mb-6">Sign Up</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center space-y-6 w-3/4 "
        >
          <input
            className="p-4 bg-slate-100 border rounded-lg w-full   focus:outline-none"
            id="username"
            type="text"
            placeholder="Username"
            onChange={handleChange}
          />
          <input
            className="p-4 bg-slate-100 border rounded-lg w-full focus:outline-none"
            type="email"
            id="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            className="p-4 bg-slate-100 border rounded-lg w-full focus:outline-none"
            id="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          ></input>
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-2 rounded-lg w-full hover:opacity-95"
          >
            {loading ? "Loading...." : "SignUp"}
          </button>
          <Oauth />
        </form>
        <div className="flex mt-4">
          <p className="pr-5">Have an account? </p>
          <Link to={"/signin"}>
            <span className="text-blue-600">Sign in</span>
          </Link>
        </div>

        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="flex-[7_7_0%] hidden lg:block">
        <img
          className="h-full w-full "
          src="https://images.pexels.com/photos/7599735/pexels-photo-7599735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Login visual"
        />
      </div>
    </div>
  );
}
