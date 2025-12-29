import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Signupvalidation from "../validers/Signupvalidter";
import Signupapi from "../service/auth/Signupapi";

const initialFormData = {
  username: "",
  fullname: "",
  email: "",
  password: "",
};

const initialError = {
  success: true,
  message: "",
  type: "",
};

const useSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(initialError);
  const [isSignup, setIsSignup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear only related error
      if (!error.success && error.type === name) {
        setError(initialError);
      }
    },
    [error]
  );

  // Handle form submit
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Validate frontend
      const validationResult = Signupvalidation(formData);
      setError(validationResult);

      if (!validationResult.success) {
        setIsSubmitting(false);
        return;
      }

      try {
        const signupResponse = await Signupapi(formData);
        setError(signupResponse);

        if (signupResponse.success) {
          setIsSignup(true);
          navigate("/", { replace: true });
        }
      } catch (error) {
        setError({
          success: false,
          message: error.message || "Signup failed. Try again.",
          type: "api",
        });
      }

      setIsSubmitting(false);
    },
    [formData, navigate]
  );

  const isDisabled =
    !formData.username ||
    !formData.fullname ||
    !formData.email ||
    !formData.password ||
    isSubmitting;

  return {
    isSignup,
    formData,
    error,
    isSubmitting,
    isDisabled,
    handleChange,
    handleSubmit,
  };
};

export default useSignup;
