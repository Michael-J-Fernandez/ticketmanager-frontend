import { useState } from "react";
import "./UserSignup.css";
import axios from "axios";

const TOKEN_KEY = process.env.REACT_APP_TOKEN_HEADER_KEY;

const UserSignup = () => {
  const valuesReset = {
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  };

  const [newUser, setNewUser] = useState(valuesReset);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(valuesReset);

  if (error) console.log(error);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    setMessage(valuesReset);
    setError("");
  };

  const postNewUser = async () => {
    const { data } = await axios.post("http://localhost:8000/users/register", {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    });

    if ("error" in data) {
      setError(data.error);
    } else {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newUser.password !== newUser.repeatPassword) {
      setMessage((prev) => ({
        ...message,
        password: "No match!",
        repeatPassword: "No match!",
      }));
      return;
    }
    postNewUser();
    setNewUser(valuesReset);
  };

  return (
    <div className="sign-up-card">
      <form
        className="sign-up-form"
        onSubmit={(e) => handleSubmit(e)}
        autoComplete="off"
      >
        <div className="title">TICKET MANAGER</div>
        <p className="sign-up-title">Sign up</p>
        <label htmlFor="name">
          Name<span className="name message"></span>
        </label>

        <input
          type="text"
          name="name"
          id="name"
          value={newUser.name}
          onChange={handleChange}
        />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          value={newUser.email}
          onChange={handleChange}
        />
        <label htmlFor="password">
          Password
          <span className="password-message">{message.password}</span>
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={newUser.password}
          onChange={handleChange}
        />
        <label htmlFor="repeatPassword">
          Repeat password
          <span className="password-message">{message.repeatPassword}</span>
        </label>
        <input
          type="password"
          name="repeatPassword"
          id="repeatPassword"
          value={newUser.repeatPassword}
          onChange={handleChange}
        />
        <div className="error-message">{error}</div>
        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserSignup;
