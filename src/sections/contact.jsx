import "./contact.css";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import emailjs from "@emailjs/browser";

gsap.registerPlugin(ScrollTrigger);

function Contact() {
  const contactRef = useRef(null);
  const titleWordsRef = useRef([]);
  const formBoxRef = useRef(null);
  const socialsLabelRef = useRef(null);
  const socialLinksRef = useRef([]);
  const animTimelineRef = useRef(null);

  const formRef = useRef(null);

  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Filter out any null entries in case of unmounting
      const validTitleWords = titleWordsRef.current.filter(Boolean);
      const validSocialLinks = socialLinksRef.current.filter(Boolean);

      gsap.set(validTitleWords, { opacity: 0, y: 35 });
      gsap.set(formBoxRef.current, { opacity: 0, y: 40 });
      gsap.set(socialsLabelRef.current, { opacity: 0, y: 20 });
      gsap.set(validSocialLinks, { opacity: 0, y: 20 });

      const tl = gsap.timeline({ paused: true });

      tl.to(validTitleWords, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.12,
        ease: "power2.out",
      })
        .to(
          formBoxRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.1"
        )
        .to(
          socialsLabelRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          "-=0.1"
        )
        .to(
          validSocialLinks,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.1"
        );

      animTimelineRef.current = tl;

      ScrollTrigger.refresh();

      ScrollTrigger.create({
        trigger: contactRef.current,
        start: "top 45%",
        end: "top 70%",
        toggleActions: "play none none reverse",
        animation: tl,
      });
    }, contactRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleNavTrigger = () => {
      if (window.location.hash !== "#contact") return;

      setTimeout(() => {
        animTimelineRef.current?.play();
      }, 200);
    };

    window.addEventListener("hashchange", handleNavTrigger);

    if (window.location.hash === "#contact") {
      requestAnimationFrame(handleNavTrigger);
    }

    return () => {
      window.removeEventListener("hashchange", handleNavTrigger);
    };
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSending(true);
    setStatusMessage("");

    const SERVICE_ID = "service_zbrfniu";
    const TEMPLATE_ID = "template_zyu4a3b";
    const PUBLIC_KEY = "tQRdlAb5aMX7x1V7q";

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
        publicKey: PUBLIC_KEY,
      })
      .then(
        () => {
          setIsSending(false);
          setStatusMessage("SENT SUCCESSFULLY!");
          formRef.current?.reset();
          setTimeout(() => setStatusMessage(""), 4000);
        },
        (error) => {
          setIsSending(false);
          setStatusMessage("FAILED TO SEND. TRY AGAIN.");
          console.error("EmailJS Error:", error);
          setTimeout(() => setStatusMessage(""), 4000);
        }
      );
  };

  return (
    <section ref={contactRef} className="contact" id="contact">
      <div className="contact-left">
        <h2 className="contact-title">
          <span
            ref={(el) => {
              titleWordsRef.current[0] = el;
            }}
          >
            MAKE
          </span>
          <span
            ref={(el) => {
              titleWordsRef.current[1] = el;
            }}
          >
            SOMETHING
          </span>
          <span
            ref={(el) => {
              titleWordsRef.current[2] = el;
            }}
          >
            TOGETHER
          </span>
        </h2>

        <div className="contact-socials">
          <p ref={socialsLabelRef}>FIND ME ELSEWHERE</p>

          <div className="social-links">
            <a
              ref={(el) => {
                socialLinksRef.current[0] = el;
              }}
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>

            <a
              ref={(el) => {
                socialLinksRef.current[1] = el;
              }}
              href="https://www.linkedin.com/in/yourusername/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>

            <a
              ref={(el) => {
                socialLinksRef.current[2] = el;
              }}
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-link"
            >
              Resume
            </a>
          </div>
        </div>
      </div>

      <div ref={formBoxRef} className="contact-form-box">
        <h3>EMAIL ME</h3>

        <form ref={formRef} onSubmit={sendEmail}>
          <input
            type="text"
            name="user_name"
            placeholder="YOUR NAME"
            required
          />
          <input
            type="email"
            name="user_email"
            placeholder="YOUR EMAIL"
            required
          />
          <textarea
            name="message"
            placeholder="ENTER MESSAGE"
            required
          ></textarea>

          <button type="submit" disabled={isSending}>
            {isSending ? "SENDING..." : "SEND"}
          </button>

          {statusMessage && (
            <p className="contact-status-msg">{statusMessage}</p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;