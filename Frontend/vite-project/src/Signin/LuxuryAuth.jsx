import { useState } from "react"
import "./LuxuryAuth.css"

const LuxuryAuth = () => {
  const [isSignUp, setIsSignUp] = useState(true)

  const toggleForm = () => {
    setIsSignUp(!isSignUp)
  }

  return (
    <div className="auth-container">
      <div className="form-container">
        <h1>{isSignUp ? "Sign Up" : "Sign In"}</h1>
        <form>
          {isSignUp && <input type="text" placeholder="Full Name" className="input-field" />}
          <input type="email" placeholder="Email" className="input-field" />
          <input type="password" placeholder="Password" className="input-field" />
          {isSignUp && <input type="password" placeholder="Confirm Password" className="input-field" />}
          <button type="submit" className="submit-btn">
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>
        <p className="toggle-text">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <span className="toggle-link" onClick={toggleForm}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  )
}

export default LuxuryAuth

