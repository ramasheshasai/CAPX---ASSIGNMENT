import React from "react";

const LoginForm = ({ loginForm, setLoginForm, handleLogin }) => (
  <div className="auth-container container my-5">
    <header className="text-center mb-4">
      <h1 className="display-4">Login</h1>
      <p className="lead">Please enter your credentials to access your portfolio.</p>
    </header>
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-lg p-4 rounded-3">
          <div className="card-body">
            <form>
              <div className="mb-4">
                <label htmlFor="username" className="form-label">
                  <i className="bi bi-person-fill"></i> Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, username: e.target.value })
                  }
                  placeholder="Enter your username"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="form-label">
                  <i className="bi bi-envelope-fill"></i> Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  <i className="bi bi-lock-fill"></i> Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  placeholder="Enter your password"
                />
              </div>

              <div className="d-grid gap-2">
                <button className="btn btn-primary btn-lg" onClick={handleLogin}>
                  <i className="bi bi-box-arrow-in-right"></i> Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LoginForm;
