// Legal pages copy. Anything in [square brackets] is a placeholder to fill in —
// it is highlighted on the page so nothing gets published unfilled by accident.

export type LegalSection = { heading: string; body: string[] };
export type LegalDoc = { slug: string; title: string; updated: string; intro: string; sections: LegalSection[] };

const company = "Longevica Science OÜ";
const registryCode = "17602507";
const address = "Tornimäe tn 5, Kesklinna linnaosa, Tallinn, Harju maakond, Estonia";
const contactEmail = "Longevicas@gmail.com";
// "Last updated" on all three pages — set to the launch date on launch day.
const lastUpdated = "[launch date]";

export const legalNotice: LegalDoc = {
  slug: "legal-notice",
  title: "Legal Notice",
  updated: lastUpdated,
  intro: "Information about the operator of this website.",
  sections: [
    {
      heading: "Website operator",
      body: [
        company,
        `Registry code: ${registryCode}`,
        `Registered address: ${address}`,
        "Registered in the Commercial Register of the Republic of Estonia (Äriregister).",
      ],
    },
    {
      heading: "Management board",
      body: ["Victoria Malashenko"],
    },
    {
      heading: "Contact",
      body: [`Email: ${contactEmail}`],
    },
    {
      heading: "Content",
      body: [
        "The content of this website is provided for general information only. It does not constitute medical, nutritional, regulatory or legal advice. While we take care to keep the information accurate and up to date, we give no guarantee as to its completeness, accuracy or timeliness.",
      ],
    },
    {
      heading: "External links",
      body: [
        "This website may contain links to third-party websites. We have no control over their content and accept no responsibility for it. The respective provider or operator is always responsible for the content of linked pages.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        `All texts, images, graphics and other content on this website are the property of ${company} or are used with permission of the respective rights holders. Any reproduction or use without prior written consent is not permitted. Partner names and logos are trademarks of their respective owners.`,
      ],
    },
  ],
};

export const privacyPolicy: LegalDoc = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  updated: lastUpdated,
  intro: `This Privacy Policy explains how ${company} collects and uses personal data when you visit this website or contact us. We process personal data in accordance with the EU General Data Protection Regulation (GDPR) and the Estonian Personal Data Protection Act.`,
  sections: [
    {
      heading: "1. Data controller",
      body: [
        `${company}, registry code ${registryCode}, ${address}.`,
        `For any privacy-related questions, contact us at ${contactEmail}.`,
      ],
    },
    {
      heading: "2. Data we collect",
      body: [
        "Contact form: when you submit the contact form, we collect your name, company, email address, telephone number and the content of your message.",
        "Technical data: when you visit the website, our hosting provider automatically processes technical data such as your IP address, browser type, date and time of access. This is necessary to deliver the website and keep it secure.",
        "We do not knowingly collect special categories of personal data. Please do not include health information in your message.",
      ],
    },
    {
      heading: "3. Purposes and legal bases",
      body: [
        "Responding to your enquiry and preparing a possible collaboration — Art. 6(1)(b) GDPR (steps prior to entering into a contract).",
        "Operating, securing and improving the website — Art. 6(1)(f) GDPR (our legitimate interest in a functioning and secure website).",
        "Complying with legal obligations, for example accounting requirements once a contract is concluded — Art. 6(1)(c) GDPR.",
      ],
    },
    {
      heading: "4. Recipients and processors",
      body: [
        "We do not sell your personal data. We share it only with service providers who process it on our behalf under a data processing agreement:",
        "Lovable — website building and hosting; contact form submissions are stored in the database provided through Lovable Cloud (Supabase).",
        "Telegram — new contact form enquiries are forwarded to our team as notifications via a Telegram bot.",
        "Resend — email delivery of contact form notifications to our team.",
      ],
    },
    {
      heading: "5. International transfers",
      body: [
        "Some of our service providers may process data outside the European Economic Area. In such cases, transfers are based on an adequacy decision of the European Commission (including the EU–US Data Privacy Framework) or on Standard Contractual Clauses.",
      ],
    },
    {
      heading: "6. Retention",
      body: [
        "Contact form enquiries are kept for as long as necessary to handle your request and any follow-up, and deleted no later than 24 months after our last communication, unless a contract is concluded or a longer period is required by law.",
        "Technical log data is kept by our hosting provider for a short period, typically no longer than 30 days.",
      ],
    },
    {
      heading: "7. Your rights",
      body: [
        "You have the right to access your personal data, to have it corrected or erased, to restrict or object to its processing, and to data portability. Where processing is based on consent, you may withdraw it at any time.",
        `To exercise your rights, contact us at ${contactEmail}.`,
        "You also have the right to lodge a complaint with a supervisory authority. In Estonia, this is the Data Protection Inspectorate (Andmekaitse Inspektsioon), www.aki.ee.",
      ],
    },
    {
      heading: "8. Security",
      body: [
        "We use appropriate technical and organisational measures to protect your data, including encrypted (HTTPS) transmission and access restricted to authorised persons.",
      ],
    },
    {
      heading: "9. Changes",
      body: [
        "We may update this Privacy Policy from time to time. The current version is always available on this page, with the date of the last update shown above.",
      ],
    },
  ],
};

export const cookiePolicy: LegalDoc = {
  slug: "cookie-policy",
  title: "Cookie Policy",
  updated: lastUpdated,
  intro: "This Cookie Policy explains how this website uses cookies and similar technologies.",
  sections: [
    {
      heading: "What are cookies",
      body: [
        "Cookies are small text files stored on your device when you visit a website. Similar technologies include local storage in your browser.",
      ],
    },
    {
      heading: "Cookies we use",
      body: [
        "This website currently uses only strictly necessary cookies and similar technologies required for the website to function and remain secure. These do not require your consent.",
        "We do not use analytics, advertising or tracking cookies.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "If we introduce analytics or marketing cookies in the future, we will update this policy and ask for your consent before setting them.",
      ],
    },
    {
      heading: "Managing cookies",
      body: [
        "You can block or delete cookies in your browser settings at any time. Blocking strictly necessary cookies may affect how the website works.",
        `Questions? Contact us at ${contactEmail}.`,
      ],
    },
  ],
};

export const legalDocs = [privacyPolicy, cookiePolicy, legalNotice];
