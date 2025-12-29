const MIN_USERNAME = 5;
const MIN_PASSWORD = 8;

function Signupvalidation({ username, password, fullname, email }) {
  username = username?.trim();
  fullname = fullname?.trim();
  email = email?.trim();

  if (!username || !fullname || !email || !password) {
    return {
      success: false,
      message: "All fields are required",
      type: "all",
    };
  }

  if (username.length < MIN_USERNAME) {
    return {
      success: false,
      message: `Username must be at least ${MIN_USERNAME} characters`,
      type: "username",
    };
  }

  if (password.length < MIN_PASSWORD) {
    return {
      success: false,
      message: `Password must be at least ${MIN_PASSWORD} characters`,
      type: "password",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Invalid email address",
      type: "email",
    };
  }

  return {
    success: true,
    message: "",
    type: "valid",
  };
}

export default Signupvalidation;
