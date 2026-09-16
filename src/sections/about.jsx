import "./about.css";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import myFace from "../assets/videos/myFace.mp4";

gsap.registerPlugin(ScrollTrigger);

function About() {
  const aboutRef = useRef(null);
  const titleWordsRef = useRef([]);
  const imageRef = useRef(null);
  const stripRef = useRef(null);
  const boxRef = useRef(null);
  const videoRef = useRef(null);

  const pinTriggerRef = useRef(null);
  const entranceTlRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Custom video loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const start = 1.5;
    const end = 7;

    const handleTimeUpdate = () => {
      if (video.currentTime >= end) {
        video.pause();
        video.currentTime = start;
        video.play().catch(() => {});
      }
    };

    video.currentTime = start;
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State: Hidden and offset
      gsap.set(titleWordsRef.current, { opacity: 0, y: 35 });
      gsap.set(imageRef.current, { opacity: 0, y: 40 });
      gsap.set(stripRef.current, { opacity: 0, y: 120 });
      gsap.set(boxRef.current, { opacity: 0, y: 60, pointerEvents: "none" });

      // 2. Coordinated Entrance & Reverse Timeline
      // Down: WHO -> AM -> I -> Video -> Strip
      // Up: Strip -> Video -> I -> AM -> WHO
      entranceTlRef.current = gsap.timeline({ paused: true });

      entranceTlRef.current
        .to(titleWordsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.12,
          ease: "power2.out",
        })
        .to(
          imageRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.1"
        )
        .to(
          stripRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.2"
        );

      // Trigger entrance on scroll down (top 45%)
      // Reverse/unload when scrolling up 20% past top (top 70%)
      ScrollTrigger.create({
        trigger: aboutRef.current,
        start: "top 45%",
        end: "top 70%",
        toggleActions: "play none none reverse",
        animation: entranceTlRef.current,
      });

      // 3. Scroll Pinning: Freezes screen and expands the strip into the box on further scroll
      const pinTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top top",
          end: "+=1000",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      pinTriggerRef.current = pinTimeline.scrollTrigger;

      pinTimeline
        .to({}, { duration: 0.2 })
        .to(stripRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.35,
          pointerEvents: "none",
          ease: "power1.out",
        })
        .to(
          boxRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            pointerEvents: "auto",
            ease: "power2.out",
          },
          "<+=0.1"
        )
        .to({}, { duration: 0.4 });

      ScrollTrigger.refresh();
    }, aboutRef);

    return () => ctx.revert();
  }, []);

  // Navbar Click Navigation Handler (#about)
  useEffect(() => {
    const handleNavClick = () => {
      if (window.location.hash !== "#about" || !aboutRef.current) return;

      const trigger = pinTriggerRef.current;
      if (trigger) {
        window.scrollTo({
          top: trigger.start,
          behavior: "smooth",
        });
      }

      setTimeout(() => {
        entranceTlRef.current?.play();
      }, 200);
    };

    window.addEventListener("hashchange", handleNavClick);

    if (window.location.hash === "#about") {
      requestAnimationFrame(handleNavClick);
    }

    return () => {
      window.removeEventListener("hashchange", handleNavClick);
    };
  }, []);

  // Manual click toggles for the strip/box
  const handleStripClick = (e) => {
    e.stopPropagation();
    setIsOpen(true);
    gsap.to(stripRef.current, { opacity: 0, y: -20, duration: 0.3, pointerEvents: "none" });
    gsap.to(boxRef.current, { opacity: 1, y: 0, duration: 0.4, pointerEvents: "auto" });
  };

  const handleBoxClose = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    gsap.to(boxRef.current, { opacity: 0, y: 60, duration: 0.3, pointerEvents: "none" });
    gsap.to(stripRef.current, { opacity: 1, y: 0, duration: 0.4, pointerEvents: "auto" });
  };

  return (
    <section ref={aboutRef} className="about" id="about">
      <div className="about-content">
        <h2 className="about-title">
          <span ref={(el) => (titleWordsRef.current[0] = el)}>WHO</span>
          <span ref={(el) => (titleWordsRef.current[1] = el)}>AM</span>
          <span ref={(el) => (titleWordsRef.current[2] = el)}>I</span>
        </h2>

        <div ref={imageRef} className="about-image">
          <video
            ref={videoRef}
            src={myFace}
            autoPlay
            muted
            playsInline
          />
        </div>
      </div>

      <button
        ref={stripRef}
        className="about-strip"
        onClick={handleStripClick}
        aria-expanded={isOpen}
      >
        <span>ABOUT ME</span>
      </button>

      <div
        ref={boxRef}
        className="about-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="about-box-header">
          <h3>ABOUT ME</h3>
          <button className="about-close-btn" onClick={handleBoxClose}>
            CLOSE
          </button>
        </div>

        <p>
          I am Ashutosh Singh, a software developer interested in building
          creative, useful, and interactive digital experiences.
        </p>

        <p>
          I enjoy working with React, JavaScript, C++, and creative frontend
          animations. I also like exploring automation, AI, and software
          projects that solve practical problems.
        </p>
      </div>
    </section>
  );
}

export default About;