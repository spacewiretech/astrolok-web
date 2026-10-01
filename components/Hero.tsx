import Image from "next/image";
import HeroChatPhone from "@/components/HeroChatPhone";
import StoreButtons from "@/components/StoreButtons";
import { TRIAL_LINE } from "@/lib/constants";
import heroScreens from "@/public/images/hero-app-screens.png";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="overflow-hidden bg-[linear-gradient(180deg,#fff8ec_0%,#fffcf6_45%,#fbe9c6_100%)]"
    >
      <div className="container-page grid items-center gap-10 pt-12 pb-14 sm:pt-16 lg:grid-cols-[1fr_1.15fr] lg:gap-8 lg:py-20">
        <div>
          <p className="inline-flex rounded-full border border-line bg-white/70 px-3.5 py-1 text-xs font-semibold tracking-[0.12em] text-gold-dark uppercase">
            Made in India
          </p>

          <h1
            id="hero-title"
            className="mt-6 max-w-[20ch] font-display text-[2.25rem] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-navy-950 sm:text-5xl lg:text-[3.25rem] xl:text-[3.6rem]"
          >
            Apni kismat, apne haath mein.
            <span className="sr-only"> AstroLok: palm reading, face reading and astrology app</span>
          </h1>

          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-navy-950/70">
            Haath ya chehra scan kijiye, aur jaaniye Love, Marriage aur Career ke sanket.
          </p>

          <StoreButtons className="mt-9" />
          <p className="mt-5 text-[0.9375rem] text-muted">{TRIAL_LINE}</p>
        </div>

        {/*
          The product itself is the hero visual: real screens from the app.
          Positions are in the 1382×960 space of the composition: the palm and face screens
          (930×960 image) plus the Chat with Astro phone, sized and spaced to mirror the palm
          phone. On wide screens it runs a little into the right margin.
        */}
        <div className="relative mx-auto aspect-[1382/960] w-full max-w-[40rem] lg:mx-0 lg:w-[calc(100%+max(0px,(100vw-78rem)/2)+1rem)] lg:max-w-none">
          <Image
            src={heroScreens}
            alt="AstroLok app screens for palm reading and face reading"
            priority
            sizes="(min-width: 1024px) 520px, 67vw"
            className="absolute top-0 left-0 h-full w-[67.29%] [mask-image:radial-gradient(ellipse_72%_72%_at_50%_50%,#000_68%,transparent_100%)]"
          />
          <HeroChatPhone className="absolute top-[9.125%] left-[66.69%] h-[88.96%]! w-[31.69%]!" />
        </div>
      </div>
    </section>
  );
}
