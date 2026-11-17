"use client";

import { useRef, useState } from "react";
import styles from "./faq.module.css";

const questions = [
  {
    id: "designs",
    question: "Are all the designs yours?",
    answer: "Yes. Every design starts with one of my own drawings, made by hand. Whether you choose an original, a print or something to wear, it all begins on paper.",
  },
  {
    id: "originals",
    question: "What’s the difference between an original and a print?",
    answer: "An original is the drawing I made by hand: a single piece on paper. A print is a reproduction of one of my drawings, so you can bring a little of my world into yours in another way.",
  },
  {
    id: "framing",
    question: "Does my artwork come framed?",
    // Confirm framing options with Charlotte before making a blanket promise.
    answer: "Please check the description of the piece you’re choosing. If you’re unsure about framing, get in touch with me before ordering.",
  },
  {
    id: "shipping",
    question: "Where do you ship, and how long does it take?",
    // The current shipping policy does not list destinations or lead times.
    answer: "Delivery options and shipping costs are shown at checkout for your address. If you need your order by a particular date, please get in touch with me before ordering.",
  },
  {
    id: "sizing",
    question: "How do I choose my size?",
    answer: "Check the size guide on the product page and compare the measurements with a piece you already own.",
  },
  {
    id: "returns",
    question: "Can I return or exchange my order?",
    // Source: https://cremedelapeche.shop/policies/refund-policy
    answer: "You can request a return within 30 days of receiving your order. Items need to be unworn or unused, with their tags and original packaging. Custom pieces, sale items and gift cards are excluded. Contact me before sending anything back; for an exchange, arrange a return before placing a new order.",
  },
];

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});

  function closeAnswer(id: string) {
    setOpenId(null);
    triggers.current[id]?.focus({ preventScroll: true });
  }

  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-title">
      <header className={styles.intro}>
        <h2 id="faq-title" className={styles.title}>
          <span>A few things</span>
          <span>to know.</span>
        </h2>
      </header>

      <div className={styles.questions}>
        {questions.map(({ id, question, answer }) => {
          const open = openId === id;

          return (
            <article key={id} className={styles.item} data-open={open}>
              <h3 className={styles.question}>
                <button
                  ref={(element) => { triggers.current[id] = element; }}
                  id={`faq-question-${id}`}
                  className={styles.trigger}
                  type="button"
                  aria-expanded={open}
                  aria-controls={`faq-answer-${id}`}
                  onClick={() => setOpenId((current) => current === id ? null : id)}
                >
                  <span>{question}</span>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path className={styles.verticalStroke} d="M12 5v14" />
                  </svg>
                </button>
              </h3>
              <div
                id={`faq-answer-${id}`}
                role="region"
                aria-labelledby={`faq-question-${id}`}
                hidden={!open}
              >
                <button className={styles.answer} type="button" onClick={() => closeAnswer(id)}>
                  <span className={styles.answerText}>{answer}</span>
                  <span className={styles.srOnly}> Close this answer.</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
