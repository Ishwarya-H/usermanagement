import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { registerUser } from "../../api/authApi";
import "../../styles/_shared.scss";
import "./Register.scss";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await registerUser(data);

      alert("Registration successful");

      navigate("/login");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="page-card register-card">
      <div className="brand-mark">
        <span className="brand-dot"></span>
        <span>User Management System</span>
      </div>

      <h2>Create your account</h2>

      <p className="page-subtitle">
        Register as an Individual User.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="input-group">
          <label>
            First Name{" "}
            <span className="required-mark">
              *
            </span>
          </label>

          <input
            {...register("firstName", {
              required:
                "First name is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message:
                  "First name can only contain letters",
              },
            })}
          />

          {errors.firstName && (
            <p className="field-error">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="input-group">
          <label>
            Last Name{" "}
            <span className="required-mark">
              *
            </span>
          </label>

          <input
            {...register("lastName", {
              required:
                "Last name is required",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message:
                  "Last name can only contain letters",
              },
            })}
          />

          {errors.lastName && (
            <p className="field-error">
              {errors.lastName.message}
            </p>
          )}
        </div>

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

        <div className="input-group">
          <label>
            Confirm Password{" "}
            <span className="required-mark">
              *
            </span>
          </label>

          <input
            type="password"
            {...register(
              "confirmPassword",
              {
                required:
                  "Confirm password is required",
                validate: (value) =>
                  value === password ||
                  "Passwords do not match",
              }
            )}
          />

          {errors.confirmPassword && (
            <p className="field-error">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <p className="required-note">
          * indicates a required field
        </p>

        <div className="button-row">
          <Button
            label="Submit"
            variant="primary"
          />

          <Button
            label="Reset"
            onClick={() => reset()}
            variant="secondary"
          />
        </div>
      </form>
    </div>
  );
}

export default Register;