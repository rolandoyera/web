"use client";

import Image from "next/image";
import React, { useState } from "react";
import Copy from "@/components/Copy";
import { ReactLenis } from "lenis/react";
import CssModal from "@/components/ui/CssModal";
import ContactForm from "@/components/forms/ContactForm";

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <ReactLenis root>
      {/* Top nav */}
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-center !px-6 !py-4 text-sm text-neutral-100 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Image
            src="/logo-white.png"
            alt="Hero Image"
            priority
            width={160}
            height={40}
          />
        </div>
      </nav>
      {/* Hero */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        {/* Background image */}
        <Image
          src="/ceiling-4.jpg"
          alt="Hero Image"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" aria-hidden />

        {/* Centered content */}
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center gap-3 px-6 text-center">
          <Copy delay={0.5}>
            <h1 className="text-balance text-5xl font-semibold leading-tight text-white ">
              Welcome to Canbri
            </h1>
          </Copy>

          <Copy delay={0.6}>
            <p className="text-balance text-white/90 text-lg sm:text-xl md:text-2xl">
              We’re building our website, amongst other things!
            </p>
          </Copy>
          <Copy delay={0.7} variant="fadeUp">
            <button
              onClick={() => setOpen(true)}
              className="mt-5 rounded-full border border-white/10 bg-white/10 !px-6 !py-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 !cursor-pointer">
              Let&apos;s Talk
            </button>
          </Copy>
        </div>
      </section>
      <CssModal open={open} onClose={() => setOpen(false)} title="Contact us">
        <ContactForm />
      </CssModal>
    </ReactLenis>
  );
}
