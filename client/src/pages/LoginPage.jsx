import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout.jsx";
import { AuthForm } from "../components/auth/AuthForm.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { validateLoginForm } from "../lib/authValidation.js";

const fields = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@hospital.org",
    autoComplete: "email"
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    autoComplete: "current-password"
  }
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(location.state?.message || "");
  const [messageTone, setMessageTone] = useState(location.state?.message ? "success" : "neutral");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Care Planner | Login";
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
    setErrors((previous) => ({
      ...previous,
      [name]: ""
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateLoginForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage("Please correct the highlighted fields.");
      setMessageTone("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await login(formData);
      const destination = location.state?.from?.pathname || "/";
      navigate(destination, {
        replace: true,
        state: {
          authMessage: "Signed in successfully."
        }
      });
    } catch (error) {
      setMessage(error.message || "Unable to sign in.");
      setMessageTone("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access Care Planner and continue your care-plan drafting workflow."
      alternateText="Need an account?"
      alternateAction={{ to: "/signup", label: "Create one" }}
    >
      <AuthForm
        fields={fields}
        formData={formData}
        errors={errors}
        message={message}
        messageTone={messageTone}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Log In"
        loading={loading}
      />
    </AuthLayout>
  );
}
