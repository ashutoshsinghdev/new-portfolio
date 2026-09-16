import "./skills.css";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Skills() {
  const skillsRef = useRef(null);
  const titleWordsRef = useRef([]);
  const trackRef = useRef(null);
  const titleAnimRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Heading Initial State & Entrance Animation
      gsap.set(titleWordsRef.current, {
        opacity: 0,
        y: 40,
      });

      titleAnimRef.current = gsap.timeline({ paused: true });
      titleAnimRef.current.to(titleWordsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.18,
        ease: "power2.out",
      });

      // Heading plays on enter, stays visible when scrolling down, unloads on scroll up
      ScrollTrigger.create({
        trigger: skillsRef.current,
        start: "top 45%",
        end: "top 20%",
        toggleActions: "play none none reverse",
        animation: titleAnimRef.current,
      });

      // 2. Horizontal Cards Stream (Pinned Scroll)
      const track = trackRef.current;
      const totalScrollWidth = track.scrollWidth;

      // Initial position: start right outside the viewport edge
      gsap.set(track, { x: () => window.innerWidth });

      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top top",
          end: () => `+=${totalScrollWidth + window.innerWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Animate the entire row from beyond the right edge to fully past the left edge
      pinTl.fromTo(
        track,
        { x: () => window.innerWidth },
        {
          x: () => -totalScrollWidth,
          ease: "none",
        }
      );

      ScrollTrigger.refresh();
    }, skillsRef);

    return () => ctx.revert();
  }, []);

  // Navbar click trigger (#skills)
  useEffect(() => {
    const handleNavTrigger = () => {
      if (window.location.hash !== "#skills") return;

      setTimeout(() => {
        if (titleAnimRef.current) {
          titleAnimRef.current.play();
        }
      }, 200);
    };

    window.addEventListener("hashchange", handleNavTrigger);

    if (window.location.hash === "#skills") {
      requestAnimationFrame(handleNavTrigger);
    }

    return () => {
      window.removeEventListener("hashchange", handleNavTrigger);
    };
  }, []);

  return (
    <section ref={skillsRef} className="skills" id="skills">
      {/* Background Title */}
      <div className="skills-title">
        <span ref={(el) => (titleWordsRef.current[0] = el)}>WHAT</span>
        <span
          ref={(el) => (titleWordsRef.current[1] = el)}
          className="skills-i"
        >
          I
        </span>
        <span ref={(el) => (titleWordsRef.current[2] = el)}>HAVE</span>
      </div>

      {/* Horizontal Carousel Track */}
      <div className="skills-track-wrapper">
        <div ref={trackRef} className="skills-track">
          <div className="skill-box">
            <h3>01</h3>
            <p>C++</p>
          </div>

          <div className="skill-box">
            <h3>02</h3>
            <p>JavaScript</p>
          </div>

          <div className="skill-box">
            <h3>03</h3>
            <p>React</p>
          </div>

          <div className="skill-box">
            <h3>04</h3>
            <p>HTML</p>
          </div>

          <div className="skill-box">
            <h3>05</h3>
            <p>CSS</p>
          </div>

          <div className="skill-box">
            <h3>06</h3>
            <p>GSAP</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;