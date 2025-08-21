"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Copy({
  children,
  animateOnScroll = true,
  delay = 0,
  variant = "lines", // 'lines' | 'fadeUp'
  className = "",
  style,
  ...rest
}) {
  const containerRef = useRef(null);
  const splitRef = useRef([]);
  const lines = useRef([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      if (variant === "fadeUp") {
        const tweenProps = {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power4.out",
          delay,
        };
        const fromProps = { y: 24, autoAlpha: 0 };
        if (animateOnScroll) {
          gsap.fromTo(containerRef.current, fromProps, {
            ...tweenProps,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              once: true,
            },
          });
        } else {
          gsap.fromTo(containerRef.current, fromProps, tweenProps);
        }
        return;
      }

      // SplitText flow
      splitRef.current = [];
      lines.current = [];

      const elements = containerRef.current.hasAttribute("data-copy-wrapper")
        ? Array.from(containerRef.current.children)
        : [containerRef.current];

      elements.forEach((element) => {
        const split = new SplitText(element, {
          type: "lines",
          mask: "lines",
          linesClass: "line++",
        });
        splitRef.current.push(split);

        // Preserve text-indent on first line if present
        const textIndent = window.getComputedStyle(element).textIndent;
        if (textIndent && textIndent !== "0px" && split.lines.length > 0) {
          split.lines[0].style.paddingLeft = textIndent;
          element.style.textIndent = "0px";
        }
        lines.current.push(...split.lines);
      });

      gsap.set(lines.current, { y: "100%" });

      const animationProps = {
        y: "0%",
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay,
      };

      if (animateOnScroll) {
        gsap.to(lines.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true,
          },
        });
      } else {
        gsap.to(lines.current, animationProps);
      }

      return () => {
        splitRef.current.forEach((s) => s?.revert());
      };
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay, variant] }
  );

  // If there's exactly one child: merge className/style into that child and attach ref
  if (React.Children.count(children) === 1 && React.isValidElement(children)) {
    const only = React.Children.only(children);
    const mergedClassName = [only.props.className, className]
      .filter(Boolean)
      .join(" ");
    const mergedStyle = { ...(only.props.style || {}), ...(style || {}) };

    return React.cloneElement(only, {
      ref: containerRef,
      className: mergedClassName,
      style: mergedStyle,
      ...rest,
    });
  }

  // Multiple children: use a wrapper that receives className/style
  return (
    <div
      ref={containerRef}
      data-copy-wrapper="true"
      className={className}
      style={style}
      {...rest}>
      {children}
    </div>
  );
}
