import { useState, useEffect } from "react";
import "./App.css";
import Form from "./Components/Common/Form";
import Home from "./Components/Home";
import { Routes, Route, useNavigate, Redirect } from "react-router-dom";
import { app } from "./firebase-config";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  EmailAuthCredential,
} from "firebase/auth";
import { createUserData } from "./Components/Firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const REGISTER = "REGISTER";
  const LOGIN = "LOGIN";
  const REDIRECT_TO_LOGIN = "REDIRECT_TO_LOGIN";
  const REDIRECT_TO_REGISTER = "REDIRECT_TO_REGISTER";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const handleAction = (id) => {
    const authentication = getAuth();
    if (id === REGISTER) {
      createUserWithEmailAndPassword(authentication, email, password)
        .then((response) => {
          createUserData({
            uid: response.user.uid,
            email: JSON.stringify(email),
            firstName: "",
            lastName: "",
          });
          navigate("/home");
          sessionStorage.setItem(
            "Auth Token",
            response._tokenResponse.refreshToken
          );
          sessionStorage.setItem("User", JSON.stringify(email));
          sessionStorage.setItem("Uid", response.user.uid);
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            toast.error("Email Already in Use");
          }
        });
    } else if (id === LOGIN) {
      signInWithEmailAndPassword(authentication, email, password)
        .then((response) => {
          sessionStorage.setItem(
            "Auth Token",
            response._tokenResponse.refreshToken
          );
          sessionStorage.setItem("User", JSON.stringify(email));
          sessionStorage.setItem("Uid", response.user.uid);
          navigate("/home");
        })
        .catch((error) => {
          if (error.code === "auth/wrong-password") {
            toast.error("Please check the Password");
          }
          if (error.code === "auth/user-not-found") {
            toast.error("Please check the Email");
          }
        });
    } else if (id === REDIRECT_TO_LOGIN) {
      navigate("/Login");
    } else if (id === REDIRECT_TO_REGISTER) {
      navigate("/Register");
    }
  };
  useEffect(() => {
    let authToken = sessionStorage.getItem("Auth Token");

    if (authToken) {
      navigate("/home");
    }
  }, [navigate]);
  return (
    <div className="App">
      <>
        <Routes>
          <Route
            path="/"
            element={
              <Form
                title="Login"
                setEmail={setEmail}
                setPassword={setPassword}
                handleAction={() => handleAction(LOGIN)}
                redirect={() => handleAction(REDIRECT_TO_REGISTER)}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Form
                title="Login"
                setEmail={setEmail}
                setPassword={setPassword}
                handleAction={() => handleAction(LOGIN)}
                redirect={() => handleAction(REDIRECT_TO_REGISTER)}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Form
                title="Register"
                setEmail={setEmail}
                setPassword={setPassword}
                handleAction={() => handleAction(REGISTER)}
                redirect={() => handleAction(REDIRECT_TO_LOGIN)}
              />
            }
          />

          <Route path="/home" element={<Home />} />
        </Routes>
      </>
      <ToastContainer />
    </div>
  );
}

export default App;
