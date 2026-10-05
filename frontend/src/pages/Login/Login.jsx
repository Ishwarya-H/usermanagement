import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/authApi";
import "../../styles/_shared.scss";
import "./Login.scss";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);

      login(response.data.user);

      const role = response.data.user.role;

      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <div className="page-card login-card">
      <div className="brand-mark">
        <span className="brand-dot"></span>
        <span>User Management System</span>
      </div>

      <h2>Welcome back</h2>

      <p className="page-subtitle">
        Sign in with your email and password.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="input-group">
          <label>
            Email{" "}
            <span className="required-mark">
              *
            </span>
          </label>

          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^\S+@\S+\.\S+$/,
                message:
                  "Enter a valid email",
              },
            })}
          />

          {errors.email && (
            <p className="field-error">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="input-group">
          <label>
            Password{" "}
            <span className="required-mark">
              *
            </span>
          </label>

          <input
            type="password"
            {...register("password", {
              required:
                "Password is required",
              pattern: {
                value: /^\S+$/,
                message:
                  "Password cannot contain spaces",
              },
            })}
          />

          {errors.password && (
            <p className="field-error">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="forgot-password-row">
          <Link to="/forgot-password">
            Forgot Password?
          </Link>
        </div>

        <Button
          label="Login"
          onClick={handleSubmit(onSubmit)}
          variant="primary"
        />

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;