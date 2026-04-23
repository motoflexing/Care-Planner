const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function validateLoginForm(formData) {
  const errors = {};

  if (!EMAIL_PATTERN.test(formData.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!formData.password || formData.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return errors;
}

export function validateSignUpForm(formData) {
  const errors = validateLoginForm(formData);

  if (!formData.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords must match.";
  }

  return errors;
}
