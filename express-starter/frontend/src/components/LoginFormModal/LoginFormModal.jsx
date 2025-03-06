import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();

      window.location.reload();
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    
    const response = await dispatch(
      thunkLogin({
        email: "demo@user.io",
        password: "password"
      })
    );
    
    if (!response) {
      closeModal();
     
      window.location.reload();
    }
  };

  return (
    <div className="login-form-container">
      <h1 className="login-form-title">Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label className="form-label">
            Email
          </label>
          <input
            className="form-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Password
          </label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        
        <button type="submit" className="login-button">Log In</button>
        <a href="#" onClick={handleDemoLogin} className="demo-link">Log in as Demo User</a>
      </form>
    </div>
  );
}

export default LoginFormModal;