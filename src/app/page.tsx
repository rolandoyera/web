"use client";

import { useState } from "react";

import Modal from "@/components/ui/Modal";
import ContactFormTW from "@/components/forms/ContactFormTW";
import Image from "next/image";

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Navbar (90px tall, blur only, centered logo) */}
      <nav className="fixed inset-x-0 top-0 z-50 flex h-[90px] items-center justify-center backdrop-blur">
        <Image
          src="/logo-white.png"
          alt="Canbri"
          width={160}
          height={40}
          priority
        />
      </nav>

      {/* Hero */}
      <section className="relative min-h-[100svh] w-full overflow-hidden">
        {/* Background image */}
        <Image
          src="/ceiling-4.jpg"
          alt="Hero"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" aria-hidden />

        {/* Centered content */}
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl animate-[fade-up_0.8s_ease-out_0.1s_both]">
            Welcome to Canbri
          </h1>

          <p className="text-balance text-white/90 text-base sm:text-lg md:text-xl animate-[fade-up_0.8s_ease-out_0.25s_both]">
            We’re building our website, amongst other things!
          </p>

          <button
            onClick={() => setOpen(true)}
            className="glowing-button mt-8 rounded-full border border-white/15 bg-white/10 px-10 py-3 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 animate-[fade-up_0.8s_ease-out_0.4s_both] cursor-pointer text-lg">
            Let&apos;s Talk
          </button>
        </div>
      </section>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Get in touch with us">
        <ContactFormTW />
      </Modal>
    </>
  );
}
