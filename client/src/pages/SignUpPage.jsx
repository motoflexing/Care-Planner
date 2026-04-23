import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout.jsx";
import { AuthForm } from "../components/auth/AuthForm.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { validateSignUpForm } from "../lib/authValidation.js";

const fields = [
  {
    name: "fullName",
    label: "Full name",
    type: "text",
    placeholder: "Dr. Jane Smith",
    autoComplete: "name"
  },
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
    placeholder: "Create a password",
    autoComplete: "new-password"
  },
  {
    name: "confirmPassword",
    label: "Confirm password",
    type: "password",
    placeholder: "Repeat your password",
    autoComplete: "new-password"
  }
];

export function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("neutral");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Care Planner | Sign Up";
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
    const nextErrors = validateSignUpForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage("Please correct the highlighted fields.");
      setMessageTone("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await signUp(formData);
      navigate("/", {
        replace: true,
        state: {
          authMessage: "Account created successfully. Welcome to Care Planner."
        }
      });
    } catch (error) {
      setMessage(error.message || "Unable to create account.");
      setMessageTone("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up access for Care Planner with a polished, session-persistent demo auth flow."
      alternateText="Already have an account?"
      alternateAction={{ to: "/login", label: "Log in" }}
    >
      <AuthForm
        fields={fields}
        formData={formData}
        errors={errors}
        message={message}
        messageTone={messageTone}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Sign Up"
        loading={loading}
      />
    </AuthLayout>
  );
}
