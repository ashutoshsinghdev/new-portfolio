import "./projects.css";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import beeImage from "../assets/images/bee.png";
import chessImage from "../assets/images/chess.png";
import lambdaImage from "../assets/images/lambda.png";

gsap.registerPlugin(ScrollTrigger);

function Projects() {
  const projectsRef = useRef(null);
  const headingWordsRef = useRef([]);
  const cardOneRef = useRef(null);
  const cardTwoRef = useRef(null);
  const cardThreeRef = useRef(null);
  const animTimelineRef = useRef(null);

  const [selectedProject, setSelectedProject] = useState(null);

  // Click outside to dismiss modal card
  useEffect(() => {
    const handleOutsideClick = () => {
      setSelectedProject(null);
    };

    if (selectedProject !== null) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [selectedProject]);

  const handleProjectClick = (event, projectNumber) => {
    event.stopPropagation();
    setSelectedProject((currentProject) =>
      currentProject === projectNumber ? null : projectNumber
    );
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State: Hidden and offset downward
      gsap.set(headingWordsRef.current, { opacity: 0, y: 30 });
      gsap.set([cardOneRef.current, cardTwoRef.current, cardThreeRef.current], {
        opacity: 0,
        y: 40,
      });

      // 2. Coordinated Timeline
      // Entrance: Words -> Card 1 -> Card 2 -> Card 3
      // Reversal: Card 3 -> Card 2 -> Card 1 -> Words
      const tl = gsap.timeline({ paused: true });

      tl.to(headingWordsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.12,
        ease: "power2.out",
      })
        .to(
          cardOneRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out",
          },
          "-=0.1"
        )
        .to(cardTwoRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        })
        .to(cardThreeRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        });

      animTimelineRef.current = tl;

      ScrollTrigger.refresh();

      // Scroll Down (start): Triggers entrance once top reaches 45% of viewport
      // Scroll Up (end): Once you scroll up 20% past the section's active area (top 70%),
      // it immediately reverses and fades out Card 3 -> Card 2 -> Card 1 -> Words
      ScrollTrigger.create({
        trigger: projectsRef.current,
        start: "top 45%",
        end: "top 70%",
        toggleActions: "play none none reverse",
        animation: tl,
      });
    }, projectsRef);

    return () => ctx.revert();
  }, []);

  // Navbar click trigger (#projects)
  useEffect(() => {
    const handleNavTrigger = () => {
      if (window.location.hash !== "#projects") return;

      setTimeout(() => {
        animTimelineRef.current?.play();
      }, 200);
    };

    window.addEventListener("hashchange", handleNavTrigger);

    if (window.location.hash === "#projects") {
      requestAnimationFrame(handleNavTrigger);
    }

    return () => {
      window.removeEventListener("hashchange", handleNavTrigger);
    };
  }, []);

  return (
    <section
      ref={projectsRef}
      className={`projects ${
        selectedProject !== null ? "project-selected" : ""
      }`}
      id="projects"
    >
      {/* Projects Heading */}
      <div className="projects-heading">
        <h2>
          <span ref={(el) => (headingWordsRef.current[0] = el)}>THINGS</span>
          <span ref={(el) => (headingWordsRef.current[1] = el)}>I</span>
          <span
            ref={(el) => (headingWordsRef.current[2] = el)}
            className="made"
          >
            MADE
          </span>
        </h2>
      </div>

      {/* Project 01 */}
      <button
        ref={cardOneRef}
        className={`project-card project-one ${
          selectedProject === 1 ? "selected" : ""
        }`}
        onClick={(event) => handleProjectClick(event, 1)}
      >
        <div className="project-image">
          <img src={beeImage} alt="B.E.E. project" />
        </div>

        <div className="project-info">
          <h3>
            B.E.E. — Personal
            <br />
            Automation
          </h3>

          <p>Python, PySide6, Playwright, JSON</p>

          {selectedProject === 1 && (
            <span className="project-description">
              A personal desktop automation assistant designed to observe,
              reason, suggest, and perform useful tasks.
            </span>
          )}
        </div>
      </button>

      {/* Project 02 */}
      <button
        ref={cardTwoRef}
        className={`project-card project-two ${
          selectedProject === 2 ? "selected" : ""
        }`}
        onClick={(event) => handleProjectClick(event, 2)}
      >
        <div className="project-info">
          <h3>
            Chess — Voice
            <br />
            Controlled
          </h3>

          <p>JavaScript, chess.js, Chessboard.js</p>

          {selectedProject === 2 && (
            <span className="project-description">
              A voice-controlled chess project with board interaction, move
              handling, and an optional AI opponent.
            </span>
          )}
        </div>

        <div className="project-image">
          <img src={chessImage} alt="Chess project" />
        </div>
      </button>

      {/* Project 03 */}
      <button
        ref={cardThreeRef}
        className={`project-card project-three ${
          selectedProject === 3 ? "selected" : ""
        }`}
        onClick={(event) => handleProjectClick(event, 3)}
      >
        <div className="project-image">
          <img src={lambdaImage} alt="Lambda project" />
        </div>

        <div className="project-info">
          <h3>
            Lambda — Offline AI
            <br />
            for ECE
          </h3>

          <p>Python, LLMs, PyTorch, RAG</p>

          {selectedProject === 3 && (
            <span className="project-description">
              An offline AI assistant concept for ECE students using local
              documents, models, and retrieval-augmented generation.
            </span>
          )}
        </div>
      </button>
    </section>
  );
}

export default Projects;