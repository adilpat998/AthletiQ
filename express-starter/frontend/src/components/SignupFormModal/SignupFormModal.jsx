import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeModal } = useModal();

  // Clear specific errors when input changes
  useEffect(() => {
    if (email && errors.email) {
      setErrors(prev => ({ ...prev, email: null }));
    }
  }, [email]);

  useEffect(() => {
    if (username && errors.username) {
      setErrors(prev => ({ ...prev, username: null }));
    }
  }, [username]);

  useEffect(() => {
    if (password && errors.password) {
      setErrors(prev => ({ ...prev, password: null }));
    }
    
    // Clear confirmPassword error if either password field changes
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: null }));
    }
  }, [password, confirmPassword]);

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please provide a valid email address";
    }
    
    // Username validation
    if (!username) {
      newErrors.username = "Username is required";
    } else if (username.length < 4) {
      newErrors.username = "Username must be at least 4 characters long";
    } else if (/@/.test(username)) {
      newErrors.username = "Username cannot be an email";
    }
    
    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Confirm Password field must be the same as the Password field";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // First run client-side validation
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const serverResponse = await dispatch(
        thunkSignup({
          email,
          username,
          password,
        })
      );

      if (serverResponse) {
        setErrors(serverResponse);
      } else {
        closeModal();
        // Force a page reload to ensure the session state is refreshed
        window.location.reload();
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrors({ 
        server: "An unexpected error occurred. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-form-container">
      <h1 className="signup-form-title">Sign Up</h1>
      {errors.server && <div className="server-error">{errors.server}</div>}
      
      <form onSubmit={handleSubmit} className="signup-form">
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
            Username
          </label>
          <input
            className={`form-input ${errors.username ? 'input-error' : ''}`}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
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
        
        <div className="form-group">
          <label className="form-label">
            Confirm Password
          </label>
          <input
            className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        </div>
        
        <button 
          type="submit" 
          className="signup-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;