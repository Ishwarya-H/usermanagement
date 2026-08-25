import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import '../styles/_shared.scss';
import './Register.scss';

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rolePreference: 'individual',
    },
  });

  const rolePreference = watch('rolePreference');
  const password = watch('password');

  useEffect(() => {
    if (rolePreference === 'individual') {
      resetField('groupName');
      resetField('department');
      resetField('justification');
      resetField('teamSize');
      resetField('managerName');
      resetField('managerEmail');
    }
  }, [rolePreference, resetField]);

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    navigate('/login');
  };

  return (
    <div className="page-card register-card">
      <div className="brand-mark">
        <span className="brand-dot"></span>
        <span>User Management System</span>
      </div>
      <h2>Create your account</h2>
      <p className="page-subtitle">Register as an individual user, or request group admin access.</p>

      <div className={`role-badge ${rolePreference === 'groupAdmin' ? 'is-groupadmin' : ''}`}>
        <span className="role-dot"></span>
        {rolePreference === 'groupAdmin' ? 'Requesting: Group Admin' : 'Role: Individual User'}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        <div className="input-group">
          <label>First Name <span className="required-mark">*</span></label>
          <input {...register('firstName', { required: 'First name is required' })} />
          {errors.firstName && <p className="field-error">{errors.firstName.message}</p>}
        </div>

        <div className="input-group">
          <label>Last Name <span className="required-mark">*</span></label>
          <input {...register('lastName', { required: 'Last name is required' })} />
          {errors.lastName && <p className="field-error">{errors.lastName.message}</p>}
        </div>

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

        <div className="input-group">
          <label>Password <span className="required-mark">*</span></label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>

        <div className="input-group">
          <label>Confirm Password <span className="required-mark">*</span></label>
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
              <label>Requested Group Name <span className="required-mark">*</span></label>
              <input {...register('groupName', { required: 'Group name is required' })} />
              {errors.groupName && <p className="field-error">{errors.groupName.message}</p>}
            </div>

            <div className="input-group">
              <label>Department <span className="required-mark">*</span></label>
              <input {...register('department', { required: 'Department is required' })} />
              {errors.department && <p className="field-error">{errors.department.message}</p>}
            </div>

            <div className="input-group">
              <label>Business Justification <span className="required-mark">*</span></label>
              <input {...register('justification', { required: 'Business justification is required' })} />
              {errors.justification && <p className="field-error">{errors.justification.message}</p>}
            </div>

            <div className="input-group">
              <label>Expected Team Size <span className="required-mark">*</span></label>
              <input {...register('teamSize', { required: 'Expected team size is required' })} />
              {errors.teamSize && <p className="field-error">{errors.teamSize.message}</p>}
            </div>

            <div className="input-group">
              <label>Manager Name <span className="required-mark">*</span></label>
              <input {...register('managerName', { required: 'Manager name is required' })} />
              {errors.managerName && <p className="field-error">{errors.managerName.message}</p>}
            </div>

            <div className="input-group">
              <label>Manager Email <span className="required-mark">*</span></label>
              <input
                type="email"
                {...register('managerEmail', { required: 'Manager email is required' })}
              />
              {errors.managerEmail && <p className="field-error">{errors.managerEmail.message}</p>}
            </div>
          </div>
        )}

        <p className="required-note">* indicates a required field</p>

        <div className="button-row">
          <Button label="Submit" onClick={handleSubmit(onSubmit)} variant="primary" />
          <Button label="Reset" onClick={() => reset()} variant="secondary" />
        </div>
      </form>
    </div>
  );
}

export default Register;