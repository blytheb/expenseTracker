import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import {Link, useNavigate } from "react-router";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";

const SignupPage = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  //handle signup form submit
  const handleSignup = async (e) => {
    e.preventDefault();
    
    let profileImageUrl = "";
    if (!fullName){
      setError("Please enter your full name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (!password) {
      setError("Please enter your password");
      return;
    } 

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError(null);

    //Signup API Call here
    if (profilePic) {
      const imgUploadRes = await uploadImage(profilePic);
      profileImageUrl = imgUploadRes.imageUrl || "";
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else{
        setError("Something went wrong. Please try again");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-1-0 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black"> Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          {" "}
          Please enter your details to sign up
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              required
            />

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              required
            />

            <div className="col-span-2">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                label="Password"
                placeholder="Min 8 characters"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline " to="/login">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
