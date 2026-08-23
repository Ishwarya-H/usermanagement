import { useForm } from 'react-hook-form';
import Button from '../components/Button';
import '../styles/shared.scss';
import './Register.scss';

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rolePreference: 'individual',
    },
  });

  const rolePreference = watch('rolePreference');
  const password = watch('password');

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    alert('Registration form is valid! (API integration comes later)');
  };

  return (
    <div className="page-card register-card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        <div className="input-group">
          <label>Username</label>
          <input {...register('username', { required: 'Username is required' })} />
          {errors.username && <p className="field-error">{errors.username.message}</p>}
        </div>

        <div className="input-group">
          <label>First Name</label>
          <input {...register('firstName', { required: 'First name is required' })} />
          {errors.firstName && <p className="field-error">{errors.firstName.message}</p>}
        </div>

        <div className="input-group">
          <label>Last Name</label>
          <input {...register('lastName', { required: 'Last name is required' })} />
          {errors.lastName && <p className="field-error">{errors.lastName.message}</p>}
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
        </div>

        <div className="input-group">
          <label>Role Preference</label>
          <select {...register('rolePreference')}>
            <option value="individual">Individual User</option>
            <option value="groupAdmin">Request Group Admin Access</option>
          </select>
        </div>

        {rolePreference === 'groupAdmin' && (
          <div className="group-admin-section">
            <h3>Group Admin Request Details</h3>

            <div className="input-group">
              <label>Requested Group Name</label>
              <input {...register('groupName', { required: 'Group name is required' })} />
              {errors.groupName && <p className="field-error">{errors.groupName.message}</p>}
            </div>

            <div className="input-group">
              <label>Department</label>
              <input {...register('department', { required: 'Department is required' })} />
              {errors.department && <p className="field-error">{errors.department.message}</p>}
            </div>

            <div className="input-group">
              <label>Business Justification</label>
              <input {...register('justification', { required: 'Business justification is required' })} />
              {errors.justification && <p className="field-error">{errors.justification.message}</p>}
            </div>

            <div className="input-group">
              <label>Expected Team Size</label>
              <input {...register('teamSize', { required: 'Expected team size is required' })} />
              {errors.teamSize && <p className="field-error">{errors.teamSize.message}</p>}
            </div>

            <div className="input-group">
              <label>Manager Name</label>
              <input {...register('managerName', { required: 'Manager name is required' })} />
              {errors.managerName && <p className="field-error">{errors.managerName.message}</p>}
            </div>

            <div className="input-group">
              <label>Manager Email</label>
              <input
                type="email"
                {...register('managerEmail', { required: 'Manager email is required' })}
              />
              {errors.managerEmail && <p className="field-error">{errors.managerEmail.message}</p>}
            </div>
          </div>
        )}

        <div className="button-row">
          <Button label="Submit" onClick={handleSubmit(onSubmit)} variant="primary" />
          <Button label="Reset" onClick={() => reset()} variant="secondary" />
        </div>
      </form>
    </div>
  );
}

export default Register;