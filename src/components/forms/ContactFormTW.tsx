"use client";

import { useRef, useState } from "react";

type Status = "idle" | "sending" | "ok" | "err";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

export default function ContactFormTW({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const message = (data.get("message") as string)?.trim();

    const next: Errors = {};
    if (!name || name.length < 2) next.name = "Please enter your full name.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email address.";
    if (!message || message.length < 10)
      next.message = "Please add a few more details (10+ characters).";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    if (!validate(formRef.current)) return;

    try {
      setStatus("sending");
      const emailjs = (await import("@emailjs/browser")).default;

      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      );

      setStatus("ok");
      formRef.current.reset();
      onSuccess?.(); // optional: close modal, etc.
    } catch (err) {
      console.error(err);
      setStatus("err");
      // fall back to idle after a bit
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  return (
    <form onSubmit={onSubmit} ref={formRef} className="space-y-4">
      <p className="text-sm text-neutral-600">
        Fill out the form and we’ll get back to you shortly.
      </p>

      {/* When sent successfully, swap inputs for success panel */}
      {status === "ok" ? (
        <div className="rounded-xl border border-emerald-200 p-4 text-emerald-800 animate-[pop-success_220ms_ease-out_both]">
          <div className="flex items-start gap-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="mt-0.5 flex-none"
              fill="none">
              <circle cx="12" cy="12" r="10" className="fill-emerald-200" />
              <path
                d="M8.5 12.5l2.5 2.5 4.5-5"
                stroke="#065f46"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="font-medium">Your message was sent. Thank you!</p>
              <p className="mt-1 text-sm text-emerald-700">
                We’ll be in touch soon.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-neutral-300">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                placeholder="Your name"
                autoComplete="name"
                className={[
                  "block w-full rounded-lg border px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none transition",
                  errors.name
                    ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-neutral-300 focus:border-neutral-400 focus:ring-2 focus:ring-black/10",
                ].join(" ")}
                type="text"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-neutral-300">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                placeholder="you@company.com"
                autoComplete="email"
                className={[
                  "block w-full rounded-lg border px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none transition",
                  errors.email
                    ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-neutral-300 focus:border-neutral-400 focus:ring-2 focus:ring-black/10",
                ].join(" ")}
                type="email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="company"
                className="mb-1 block text-sm font-medium text-neutral-300">
                Company
              </label>
              <input
                id="company"
                name="company"
                placeholder="Optional"
                autoComplete="organization"
                className="block w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-black/10"
                type="text"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-sm font-medium text-neutral-300">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="How can we help?"
                className={[
                  "block w-full resize-y rounded-lg border  px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none transition",
                  errors.message
                    ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-neutral-300 focus:border-neutral-400 focus:ring-2 focus:ring-black/10",
                ].join(" ")}
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-600">{errors.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center pt-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className=" glowing-button-2 inline-flex items-center justify-center rounded-full bg-black px-8 py-4 font-medium text-white shadow-sm ring-1 ring-black/10 transition hover:bg-black/90 disabled:opacity-60 mt-4">
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>
          </div>

          <div className="min-h-5 text-sm">
            {status === "err" && (
              <p className="text-red-600">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </>
      )}
    </form>
  );
}
