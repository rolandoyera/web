"use client";

import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import styles from "./ContactForm.module.css";

type Status = "idle" | "sending" | "ok" | "err";
type Field = "name" | "email" | "company" | "message";

type Errors = Partial<Record<Field, string>>;
type Touched = Partial<Record<Field, boolean>>;

const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(name: Field, value: string): string {
  const v = (value ?? "").trim();
  switch (name) {
    case "name":
      if (!v) return "Please enter your name.";
      if (v.length < 2) return "Name should be at least 2 characters.";
      return "";
    case "email":
      if (!v) return "Please enter your email.";
      if (!emailRE.test(v)) return "Please enter a valid email address.";
      return "";
    case "message":
      if (!v) return "Please write a short message.";
      if (v.length < 10) return "Message should be at least 10 characters.";
      return "";
    case "company":
      if (v && v.length < 2) return "Company should be at least 2 characters.";
      return "";
    default:
      return "";
  }
}

function validateForm(values: Record<Field, string>): Errors {
  const out: Errors = {};
  (Object.keys(values) as Field[]).forEach((k) => {
    const msg = validateField(k, values[k]);
    if (msg) out[k] = msg;
  });
  return out;
}

export default function ContactForm({
  className = "",
}: {
  className?: string;
}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  // EmailJS keys from .env.local (NEXT_PUBLIC_…)
  const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  function getValues(): Record<Field, string> {
    const el = formRef.current!;
    const fd = new FormData(el);
    return {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
  }

  function markTouchedAll() {
    setTouched({ name: true, email: true, company: true, message: true });
  }

  function focusFirstError(errs: Errors) {
    const key = (["name", "email", "company", "message"] as Field[]).find(
      (k) => errs[k]
    );
    if (!key) return;
    const input = formRef.current?.querySelector<
      HTMLInputElement | HTMLTextAreaElement
    >(`[name="${key}"]`);
    input?.focus();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current || !SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error("EmailJS env vars missing or form ref not ready.");
      setStatus("err");
      return;
    }

    const values = getValues();
    const errs = validateForm(values);
    markTouchedAll();
    setErrors(errs);

    if (Object.values(errs).some(Boolean)) {
      // Block submit if any errors
      focusFirstError(errs);
      return;
    }

    try {
      setStatus("sending");
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      );
      setStatus("ok");
      formRef.current.reset();
      setErrors({});
      setTouched({});
    } catch (err) {
      console.error(err);
      setStatus("err");
    } finally {
      // Auto-clear banners after a few seconds
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const name = e.target.name as Field;
    const value = e.target.value;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const name = e.target.name as Field;
    const value = e.target.value;
    // Live-validate only if already touched
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  }

  const err = (f: Field) => Boolean(touched[f] && errors[f]);
  const describe = (f: Field) => (err(f) ? `${f}-error` : undefined);

  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.ring} aria-hidden />

      <div className={styles.header}>
        <h3 className={styles.title}>Get in Touch</h3>
      </div>

      {status === "sending" && <div className={styles.progress} aria-hidden />}

      {/* noValidate disables native UI; we handle validation ourselves */}
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className={styles.form}
        noValidate>
        <div className={styles.row}>
          <div className={styles.field}>
            <input
              id="name"
              name="name"
              className={`${styles.input} ${
                err("name") ? styles.inputError : ""
              }`}
              type="text"
              placeholder=" "
              required
              autoComplete="name"
              onBlur={handleBlur}
              onChange={handleChange}
              aria-invalid={err("name")}
              aria-describedby={describe("name")}
            />
            <label htmlFor="name" className={styles.label}>
              Your name *
            </label>
            <span className={styles.focusHalo} aria-hidden />
            {err("name") && (
              <div id="name-error" className={styles.errorText} role="alert">
                {errors.name}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <input
              id="email"
              name="email"
              className={`${styles.input} ${
                err("email") ? styles.inputError : ""
              }`}
              type="email"
              placeholder=" "
              required
              autoComplete="email"
              onBlur={handleBlur}
              onChange={handleChange}
              aria-invalid={err("email")}
              aria-describedby={describe("email")}
            />
            <label htmlFor="email" className={styles.label}>
              Your e-mail *
            </label>
            <span className={styles.focusHalo} aria-hidden />
            {err("email") && (
              <div id="email-error" className={styles.errorText} role="alert">
                {errors.email}
              </div>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <input
            id="company"
            name="company"
            className={`${styles.input} ${
              err("company") ? styles.inputError : ""
            }`}
            type="text"
            placeholder=" "
            autoComplete="organization"
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={err("company")}
            aria-describedby={describe("company")}
          />
          <label htmlFor="company" className={styles.label}>
            Company (optional)
          </label>
          <span className={styles.focusHalo} aria-hidden />
          {err("company") && (
            <div id="company-error" className={styles.errorText} role="alert">
              {errors.company}
            </div>
          )}
        </div>

        <div className={styles.field}>
          <textarea
            id="message"
            name="message"
            className={`${styles.input} ${styles.textarea} ${
              err("message") ? styles.inputError : ""
            }`}
            placeholder=" "
            rows={5}
            required
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={err("message")}
            aria-describedby={describe("message")}
          />
          <label htmlFor="message" className={styles.label}>
            What’s up? *
          </label>
          <span className={styles.focusHalo} aria-hidden />
          {err("message") && (
            <div id="message-error" className={styles.errorText} role="alert">
              {errors.message}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.button}
            disabled={status === "sending"}>
            <span className={styles.buttonInner}>
              {status === "sending" ? (
                <>
                  <span className={styles.spinner} aria-hidden />
                  Sending…
                </>
              ) : (
                "Send Message"
              )}
            </span>
          </button>
        </div>

        <div className={styles.status} aria-live="polite" role="status">
          {status === "ok" && (
            <div className={`${styles.banner} ${styles.ok}`}>
              Your message has been sent. We’ll contact you soon.
            </div>
          )}
          {status === "err" && (
            <div className={`${styles.banner} ${styles.err}`}>
              Something went wrong. Please try again.
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
