import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Loginvalidter from "../validers/Loginvalidter";
import Loginapi from "../service/auth/Loginapi";

const initialFormData = {
  username: "",
  password: "",
};

const initialError = {
  success: true,
  message: "",
  type: "",
};

function useLoginHook() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(initialError);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ✅ Clear error only for the edited field
    setError((prev) =>
      !prev.success && prev.type === name ? initialError : prev
    );
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const validationResult = Loginvalidter(formData);
      setError(validationResult);

      if (!validationResult.success) {
        setIsSubmitting(false);
        return;
      }

      try {
        const loginresponse = await Loginapi(formData);
        setError(loginresponse);

        if (loginresponse.success) {
          navigate("/", { replace: true });
        }
      } catch (err) {
        setError({
          success: false,
          message: err?.message || "Login failed. Try again.",
          type: "api",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, navigate]
  );

  const togglePassword = () => setShowPassword((prev) => !prev);

  const isDisabled = useMemo(() => {
    return (
      !formData.username.trim() ||
      !formData.password.trim() ||
      isSubmitting
    );
  }, [formData, isSubmitting]);

  return {
    error,
    formData,
    handleChange,
    handleSubmit,
    showPassword,
    togglePassword,
    isSubmitting,
    isDisabled,
  };
}

export default useLoginHook;
