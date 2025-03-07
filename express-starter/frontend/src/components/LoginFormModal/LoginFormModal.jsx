// Enhanced LoginFormModal with better validation
import { useState, useEffect } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeModal } = useModal();

  // Clear errors when input changes
  useEffect(() => {
    if (email && errors.email) {
      setErrors(prev => ({ ...prev, email: null }));
    }
    if (password && errors.password) {
      setErrors(prev => ({ ...prev, password: null }));
    }
  }, [email, password]);

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please provide a valid email address";
    }
    
    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation first
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
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
    } catch (err) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const response = await dispatch(
        thunkLogin({
          email: "demo@user.io",
          password: "password"
        })
      );
      
      if (!response) {
        closeModal();
        window.location.reload();
      } else {
        setErrors(response);
      }
    } catch (err) {
      setErrors({ general: "Failed to log in as demo user" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <h1 className="login-form-title">Log In</h1>
      
      {errors.general && (
        <div className="error-banner">{errors.general}</div>
      )}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label className="form-label">
            Email
          </label>
          <input
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Password
          </label>
          <input
            className={`form-input ${errors.password ? 'input-error' : ''}`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        
        <button 
          type="submit" 
          className="login-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
        
        <a 
          href="#" 
          onClick={handleDemoLogin} 
          className="demo-link"
          disabled={isSubmitting}
        >
          Log in as Demo User
        </a>
      </form>
    </div>
  );
}

export default LoginFormModal;