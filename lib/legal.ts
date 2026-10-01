/* ------------------------------------------------------------------
   Legal page content.

   These are structured placeholders. Replace each `body` with the final,
   reviewed policy text and set `draft: false` to remove the notice banner.
   Nothing here states retention periods, legal entity details, refund
   guarantees or security measures — add those only once confirmed.
   ------------------------------------------------------------------ */

import { SITE } from "@/lib/constants";

export type LegalDocument = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  draft: boolean;
  sections: { heading: string; body: string[] }[];
};

const contact = `For questions, write to ${SITE.email}.`;

export const LEGAL_DOCS = {
  privacy: {
    slug: "privacy",
    eyebrow: "Policies",
    title: "Privacy Policy",
    description: "How AstroLok handles the information you share when you use the app.",
    intro: "This policy explains what information AstroLok collects, why it is needed and the choices you have.",
    draft: true,
    sections: [
      {
        heading: "Information you provide",
        body: [
          "To use AstroLok you provide your phone number (to sign in with a one-time code), your date of birth, and a photo of your palm or face for the reading you choose.",
          "[Final text to describe any other information collected, such as payment status or device information.]",
        ],
      },
      {
        heading: "How your information is used",
        body: [
          "Your information is used to sign you in, create your readings and manage your subscription.",
          "[Final text to list each purpose in detail.]",
        ],
      },
      {
        heading: "Photos",
        body: ["[Final text to describe how palm and face photos are processed and stored, and for how long.]"],
      },
      {
        heading: "Sharing with third parties",
        body: ["[Final text to list service providers involved, for example SMS delivery and payment processing, and what they receive.]"],
      },
      {
        heading: "Your choices",
        body: [
          "You can request deletion of your account at any time. See the Delete Account page for how.",
          "[Final text to describe access and correction requests.]",
        ],
      },
      { heading: "Contact", body: [contact] },
    ],
  },
  terms: {
    slug: "terms",
    eyebrow: "Policies",
    title: "Terms & Conditions",
    description: "The terms that apply when you use AstroLok.",
    intro: "These terms describe how AstroLok may be used and what you can expect from it.",
    draft: true,
    sections: [
      {
        heading: "About the service",
        body: [
          "AstroLok provides palm, face and astrology readings for guidance and reflection. Readings should not be treated as professional medical, financial or legal advice.",
        ],
      },
      {
        heading: "Your account",
        body: ["You sign in with your phone number and a one-time code. [Final text on eligibility and account responsibilities.]"],
      },
      {
        heading: "Subscription and payments",
        body: [
          "AstroLok offers a 1-day trial for ₹3. Unless cancelled before the trial ends, the plan continues at ₹249/month, paid by UPI Autopay.",
          "[Final text on billing cycles and changes to pricing.]",
        ],
      },
      { heading: "Acceptable use", body: ["[Final text describing acceptable use of the app.]"] },
      { heading: "Changes to these terms", body: ["[Final text on how updates to these terms are communicated.]"] },
      { heading: "Contact", body: [contact] },
    ],
  },
  "cancellation-refund": {
    slug: "cancellation-refund",
    eyebrow: "Policies",
    title: "Cancellation & Refund",
    description: "How to cancel your AstroLok plan and how refunds are handled.",
    intro: "You can cancel your AstroLok plan at any time. This page explains how cancellation and refunds work.",
    draft: true,
    sections: [
      {
        heading: "Cancelling during the trial",
        body: ["Your plan starts with a 1-day trial for ₹3. Cancel any time before it ends and nothing further is charged."],
      },
      {
        heading: "Cancelling after the trial",
        body: ["After the trial, the plan renews at ₹249/month by UPI Autopay until cancelled. [Final text on when a cancellation takes effect.]"],
      },
      { heading: "How to cancel", body: ["[Final text with step-by-step cancellation instructions.]"] },
      { heading: "Refunds", body: ["[Final text describing refund eligibility and timelines.]"] },
      { heading: "Contact", body: [contact] },
    ],
  },
  "shipping-delivery": {
    slug: "shipping-delivery",
    eyebrow: "Policies",
    title: "Shipping & Delivery",
    description: "How AstroLok readings are delivered.",
    intro: "AstroLok is a digital service. There are no physical products and nothing is shipped.",
    draft: true,
    sections: [
      {
        heading: "Digital delivery",
        body: ["Readings are delivered inside the AstroLok app. A reading usually comes back in about a minute after you submit your photo."],
      },
      { heading: "Access to your plan", body: ["[Final text on when plan access begins after payment.]"] },
      { heading: "Contact", body: [contact] },
    ],
  },
  "delete-account": {
    slug: "delete-account",
    eyebrow: "Your account",
    title: "Delete Account",
    description: "How to request deletion of your AstroLok account.",
    intro: "You can ask for your AstroLok account to be deleted at any time.",
    draft: true,
    sections: [
      {
        heading: "How to request deletion",
        body: [
          `Write to ${SITE.email} from any email address and include the phone number registered to your AstroLok account, with the subject "Delete my account".`,
          "[Final text if deletion is also available from inside the app.]",
        ],
      },
      {
        heading: "Before you delete",
        body: ["If you have an active plan, cancel it first so no further UPI Autopay charges are made. See the Cancellation & Refund page."],
      },
      { heading: "What is deleted", body: ["[Final text describing which data is deleted and any information that must be kept.]"] },
    ],
  },
} satisfies Record<string, LegalDocument>;
