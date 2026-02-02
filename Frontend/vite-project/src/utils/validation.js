// // // Password rule
// // export const PASSWORD_MIN_LENGTH = 6;

// // // Name must start with capital letter
// // export const NAME_REGEX = /^[A-Z][a-zA-Z]*(\s[A-Za-z]*)*$/;

// // // Email format
// // export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// // // Validation messages
// // export const VALIDATION_MESSAGES = {
// //   nameRequired: "Full name is required",
// //   nameCapital: "First letter of name must be capital",
// //   emailRequired: "Email is required",
// //   emailInvalid: "Invalid email format",
// //   passwordRequired: "Password is required",
// //   passwordMin: "Password must be at least 6 characters",
// //   confirmPasswordRequired: "Confirm password is required",
// //   passwordMismatch: "Passwords do not match",
// // };



// // Minimum password length
// export const PASSWORD_MIN_LENGTH = 6;

// // Name must start with capital letter
// export const NAME_REGEX = /^[A-Z][a-zA-Z]*(\s[A-Za-z]*)*$/;

// // Email format (any valid email)
// export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// // Validation messages
// export const VALIDATION_MESSAGES = {
//   nameRequired: "Full name is required",
//   nameCapital: "First letter of name must be capital",
//   emailRequired: "Email is required",
//   emailInvalid: "Invalid email format",
//   passwordRequired: "Password is required",
//   passwordMin: "Password must be at least 6 characters",
// };



// Minimum password length
export const PASSWORD_MIN_LENGTH = 6;

// Name must start with capital letter
export const NAME_REGEX = /^[A-Z][a-zA-Z]*(\s[A-Za-z]*)*$/;

// Email format (any valid email)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation messages
export const VALIDATION_MESSAGES = {
  nameRequired: "Full name is required",
  nameCapital: "First letter of name must be capital",
  emailRequired: "Email is required",
  emailInvalid: "Invalid email format",
  passwordRequired: "Password is required",
  passwordMin: "Password must be at least 6 characters",
};

// ===============================
// Password validation (ANY chars)
// ===============================
export const validatePassword = (password) => {
  if (!password) {
    return VALIDATION_MESSAGES.passwordRequired;
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return VALIDATION_MESSAGES.passwordMin;
  }

  return null; // ✅ valid password
};
