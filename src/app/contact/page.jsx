"use client";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import ContactHeader from "./contactheader";
import PersonalDetails from "./PersonalDetails";
import SuccessLog from "./SuccessLog";
import DataPrivacy from "./DataPrivacy";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formTouched, setFormTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (!formTouched[name]) {
      setFormTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setFormTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getFieldError = (fieldName) => {
    if (!formTouched[fieldName]) return null;

    switch (fieldName) {
      case "name":
        return formData.name.length < 2
          ? "Name must be at least 2 characters"
          : null;
      case "email":
        return !formData.email
          ? "Email is required"
          : !isEmailValid(formData.email)
          ? "Please enter a valid email address"
          : null;
      case "subject":
        return formData.subject.length < 3
          ? "Subject must be at least 3 characters"
          : null;
      case "message":
        return formData.message.length < 10
          ? "Message must be at least 10 characters long"
          : null;
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    const nameError = getFieldError("name");
    const emailError = getFieldError("email");
    const subjectError = getFieldError("subject");
    const messageError = getFieldError("message");

    if (nameError || emailError || subjectError || messageError) {
      return;
    }

    setIsSending(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setFormTouched({
          name: false,
          email: false,
          subject: false,
          message: false,
        });
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      } else {
        const error = await response.json();
        setErrorMessage(
          error.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <ContactHeader />
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <PersonalDetails />
          <div className="bg-emerald-50 dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-300 mb-6">
              Send Me a Message
            </h2>

            {isSuccess ? (
              <SuccessLog />
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full px-4 py-3 border ${
                        getFieldError("name")
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200`}
                      placeholder="Your name"
                    />
                    {getFieldError("name") && (
                      <p className="mt-1 text-sm text-red-600">
                        {getFieldError("name")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full px-4 py-3 border ${
                        getFieldError("email")
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200`}
                      placeholder="your@email.com"
                    />
                    {getFieldError("email") && (
                      <p className="mt-1 text-sm text-red-600">
                        {getFieldError("email")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full px-4 py-3 border ${
                        getFieldError("subject")
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200`}
                      placeholder="What is this regarding?"
                    />
                    {getFieldError("subject") && (
                      <p className="mt-1 text-sm text-red-600">
                        {getFieldError("subject")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      rows={6}
                      className={`w-full px-4 py-3 border ${
                        getFieldError("message")
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200`}
                      placeholder="Your message here..."
                    />
                    {getFieldError("message") && (
                      <p className="mt-1 text-sm text-red-600">
                        {getFieldError("message")}
                      </p>
                    )}
                  </div>

                  {errorMessage && (
                    <div className="text-red-500 text-sm bg-red-50 p-4 rounded-lg border border-red-100">
                      <p className="font-medium mb-1">Error</p>
                      <p>{errorMessage}</p>
                    </div>
                  )}

                <div>
                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full px-6 py-3 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSending ? (
                        <>
                          <Loader2 size={18} className="mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight size={18} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <DataPrivacy />
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}