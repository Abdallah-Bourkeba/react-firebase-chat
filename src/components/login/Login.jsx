import "./login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const { username, password, email } = Object.fromEntries(formData);

      if (!username || !password || !email) {
        throw new Error("Please fill in all fields");
      }

      const imgUrl = await upload(avatar.file);

      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", res.user.uid), {
        username: username.toLowerCase().replace(/\s/g, ""),
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Accound Created You Can Login Now");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const { password, email } = Object.fromEntries(formData);

      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      await signInWithEmailAndPassword(auth, email, password);

      toast.success("Login successful");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form action="" onSubmit={handleLogin}>
          <input type="email" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button className="loginButton" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
      <div className="seperator"></div>
      <div className="item">
        <h2>Don&apos;t have an account?</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file" className="fileLabel">
            <img src={avatar.url || "/avatar.png"} alt="" />
            <span>Upload an image</span>
          </label>
          <input
            onChange={(e) =>
              e.target.files[0] &&
              setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
              })
            }
            type="file"
            id="file"
            accept="image/*"
            style={{ display: "none" }}
          />
          <input type="text" placeholder="Username" name="username" />
          <input type="email" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button className="registerButton" disabled={loading}>
            {loading ? "Loading..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
