import "./hero.css";
import { useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedinIn
} from "@fortawesome/free-brands-svg-icons";

import heroVideo from "../assets/videos/ashutosh.webm";

function Hero() {

  const videoRef = useRef(null);

  useEffect(() => {
  const video = videoRef.current;

  if (!video) return;

  const start = 2;
  const end = 7;

  const handleTimeUpdate = () => {
    if (video.currentTime >= end) {
      video.currentTime = start;
      video.play();
    }
  };

  video.currentTime = start;
  video.addEventListener("timeupdate", handleTimeUpdate);

  return () => {
    video.removeEventListener("timeupdate", handleTimeUpdate);
  };
}, []);
  return (
    <section className="hero" id="home">

      {/* Background */}
      <div className="hero-background"></div>


      {/* Navbar */}
      {/* Navbar stays as a separate component in App.jsx */}


      {/* Huge Name */}
      <h1 className="hero-name">
        ASHUTOSH
      </h1>


      {/* Software Engineer */}
      <div className="hero-role">
        <span>Software</span>
        <span>Engineer</span>
      </div>


      {/* Your Video */}
      <div className="hero-video">
        <video
          ref={videoRef}
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>


      {/* Social Icons */}
      <div className="hero-socials">

        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>

        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FontAwesomeIcon icon={faLinkedinIn} />
        </a>

      </div>

    </section>
  );
}

export default Hero;