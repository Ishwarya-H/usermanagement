import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Button from '../components/Button/Button';
import '../styles/_shared.scss';
import './Login/Login.scss';

function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } = useForm();

  const onSubmit = (data) => {
    // Day 8+ will replace this with a real "send reset email" API call
    console.log('Forgot password request:', data);
  };

  if (isSubmitSuccessful) {
    return (
      <div className="page-card login-card">
        <div className="brand-mark">
          <span className="brand-dot"></span>
          <span>User Management System</span>
        </div>
        <h2>Check your email</h2>
        <p className="page-subtitle">
          If an account exists for that email, a password reset link has been sent.
        </p>
        <Link to="/login">Back to Login</Link>
      </div>
    );
  }

  return (
    <div className="page-card login-card">
      <div className="brand-mark">
        <span className="brand-dot"></span>
        <span>User Management System</span>
      </div>
      <h2>Forgot Password</h2>
      <p className="page-subtitle">Enter your email and we'll send you a reset link.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-group">
          <label>Email <span className="required-mark">*</span></label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <Button label="Send Reset Link" onClick={handleSubmit(onSubmit)} variant="primary" />

        <p className="register-link">
          Remembered your password? <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;