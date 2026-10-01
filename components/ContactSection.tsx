import { SITE } from "@/lib/constants";

/** The /contact page. On the home page, contact is the line under the FAQ. */
export default function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-white py-20 sm:py-28">
      <div className="container-narrow">
        <h1 id="contact-title" className="font-display text-4xl leading-tight font-semibold tracking-[-0.03em] text-navy-950 sm:text-5xl">
          Contact
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-navy-950/70">
          Questions about your reading, your plan or your account? Email us and include the phone number you signed up
          with if it is about your account.
        </p>
        <a
          href={`mailto:${SITE.email}`}
          className="mt-8 inline-block font-display text-2xl font-semibold text-navy-950 underline decoration-gold decoration-2 underline-offset-8 transition-colors hover:text-gold-dark sm:text-3xl"
        >
          {SITE.email}
        </a>
      </div>
    </section>
  );
}
