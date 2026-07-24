"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { generateContactFormLink } from "@/lib/whatsapp";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type FormStatus = "idle" | "submitting" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_VALUES: FormValues = { name: "", email: "", message: "" };

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please share your name.";
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Tell us a little more — at least 10 characters.";
  }

  return errors;
}

function SendIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

type FieldProps = {
  id: keyof FormValues;
  label: string;
  value: string;
  error?: string;
  autoComplete?: string;
  type?: string;
  textarea?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
};

function FloatingField({
  id,
  label,
  value,
  error,
  autoComplete,
  type = "text",
  textarea = false,
  onChange,
  onBlur,
}: FieldProps) {
  const fieldClasses = [
    "peer w-full rounded-2xl border bg-white/80 px-4 pt-6 pb-2.5 text-base text-stone-900",
    "placeholder-transparent shadow-[0_1px_2px_rgba(51,40,33,0.04)] outline-none transition-colors duration-300",
    error
      ? "border-[#b3423a]/60 focus:border-[#b3423a]"
      : "border-stone-200/90 hover:border-stone-300 focus:border-stone-900",
    "focus-visible:ring-2 focus-visible:ring-stone-900/10",
  ].join(" ");

  const labelClasses = [
    "pointer-events-none absolute left-4 top-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-stone-500",
    "transition-all duration-200",
    "peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal",
    "peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-stone-400",
    "peer-focus:top-2 peer-focus:text-[0.66rem] peer-focus:font-semibold peer-focus:uppercase",
    "peer-focus:tracking-[0.18em] peer-focus:text-stone-600",
  ].join(" ");

  return (
    <div className="relative">
      {textarea ? (
        <textarea
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? true : undefined}
          className={`${fieldClasses} min-h-36 resize-y leading-7`}
          id={id}
          name={id}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          placeholder=" "
          rows={5}
          value={value}
        />
      ) : (
        <input
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? true : undefined}
          autoComplete={autoComplete}
          className={fieldClasses}
          id={id}
          name={id}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          placeholder=" "
          type={type}
          value={value}
        />
      )}

      <label className={labelClasses} htmlFor={id}>
        {label}
      </label>

      {error ? (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#b3423a]" id={`${id}-error`} role="alert">
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fallbackLink, setFallbackLink] = useState("");

  const handleChange = (field: keyof FormValues) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));

    if (touched[field]) {
      setErrors(validate({ ...values, [field]: value }));
    }
  };

  const handleBlur = (field: keyof FormValues) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setTouched({ name: true, email: true, message: true });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = Object.keys(nextErrors)[0];
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setStatus("submitting");

    const link = generateContactFormLink({
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    });

    // window.open must run inside the user gesture to avoid popup blockers
    const openedWindow = window.open(link, "_blank", "noopener,noreferrer");

    window.setTimeout(() => {
      if (openedWindow) {
        setStatus("success");
      } else {
        setFallbackLink(link);
        setStatus("error");
      }
    }, 900);
  };

  const resetForm = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setTouched({});
    setFallbackLink("");
    setStatus("idle");
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[rgba(255,253,252,0.86)] p-6 shadow-[0_18px_60px_rgba(51,40,33,0.08)] backdrop-blur sm:p-8 lg:p-10"
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-champagne)] to-transparent"
      />

      <div aria-live="polite">
        {status === "success" ? (
          <div className="flex min-h-96 flex-col items-center justify-center py-8 text-center">
            <motion.span
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(122,130,114,0.16)] text-[var(--color-sage-ash)]"
              initial={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <CheckIcon />
            </motion.span>

            <h3 className="mt-6 text-3xl leading-tight text-stone-900">
              Your message is on its way
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-7 text-stone-600">
              WhatsApp should have opened with your note pre-filled — just press
              send and we&apos;ll take it from there.
            </p>

            <button
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300/80 bg-white/80 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-stone-900 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/30"
              onClick={resetForm}
              type="button"
            >
              Write another message
            </button>
          </div>
        ) : (
          <>
            <p className="text-[0.68rem] uppercase tracking-[0.32em] text-stone-500">
              Send a message
            </p>
            <h2 className="mt-3 text-3xl leading-tight text-stone-900 sm:text-4xl">
              Tell us about the gift
              <span className="block text-[var(--color-rose-clay)]">
                you have in mind.
              </span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              Your note opens in WhatsApp, pre-filled and ready to send — the
              same place we plan every order, so nothing gets lost.
            </p>

            <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
              <FloatingField
                autoComplete="name"
                error={touched.name ? errors.name : undefined}
                id="name"
                label="Your name"
                onBlur={handleBlur("name")}
                onChange={handleChange("name")}
                value={values.name}
              />

              <FloatingField
                autoComplete="email"
                error={touched.email ? errors.email : undefined}
                id="email"
                label="Email address"
                onBlur={handleBlur("email")}
                onChange={handleChange("email")}
                type="email"
                value={values.email}
              />

              <FloatingField
                error={touched.message ? errors.message : undefined}
                id="message"
                label="Your message"
                onBlur={handleBlur("message")}
                onChange={handleChange("message")}
                textarea
                value={values.message}
              />

              {status === "error" ? (
                <div
                  className="rounded-2xl border border-[#b3423a]/25 bg-[#b3423a]/5 px-4 py-3 text-sm leading-6 text-[#8c3630]"
                  role="alert"
                >
                  Your browser blocked the WhatsApp window.{" "}
                  <a
                    className="font-semibold underline underline-offset-2 hover:text-[#b3423a]"
                    href={fallbackLink}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Open WhatsApp manually
                  </a>{" "}
                  to send your message.
                </div>
              ) : null}

              <button
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-stone-900 px-7 py-3 text-sm font-medium uppercase tracking-[0.18em] text-stone-50 shadow-[0_16px_40px_rgba(51,40,33,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
                disabled={status === "submitting"}
                type="submit"
              >
                {status === "submitting" ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border-2 border-stone-50/30 border-t-stone-50"
                    />
                    Opening WhatsApp…
                  </>
                ) : (
                  <>
                    Send message
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      <SendIcon />
                    </span>
                  </>
                )}
              </button>

              <p className="flex items-center gap-2 pt-1 text-xs leading-6 text-stone-500">
                <span className="text-[var(--color-champagne)]">
                  <ClockIcon />
                </span>
                Usually responds within 24 hours.
              </p>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
}
