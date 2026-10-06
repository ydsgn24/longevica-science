// All site copy lives here — edit text in this file, layout stays untouched.

// Image paths respect the deploy base (e.g. /longevica-science/ on GitHub Pages).
const img = (path: string) => `${import.meta.env.BASE_URL}images/${path}`;

export const hero = {
  tags: ["Research", "Development", "Formulation", "Market entry"],
  title: ["We turn", "ideas into", "products."],
  text: "Independent research, formulation and product development for longevity, wellness, beauty and performance.",
  sideList: ["Longevity", "Wellness", "Beauty", "Performance", "Functional", "Nutrition"],
  image: img("hero.jpg"),
};

export const approach = {
  label: "Our approach",
  title: ["Science.", "Expertise.", "Execution."],
  text: "We combine scientific knowledge, ingredient intelligence and a global network to develop high-quality, effective and commercially successful products.",
  sideList: ["Independent", "Tailored", "Global", "Results"],
  image: img("approach.jpg"),
};

export const process = {
  label: "Our process",
  title: ["From concept to", "market-ready product."],
  text: "We guide you through every step — from product concept and ingredient selection to formulation, manufacturing, packaging and market launch.",
  steps: [
    { title: "Concept & Strategy", text: "Product definition, positioning and commercial strategy.", image: img("step-1.jpg") },
    { title: "Ingredients", text: "Selection of clinically relevant and innovative ingredients.", image: img("step-2.jpg") },
    { title: "R&D & Formulation", text: "Tailor-made formulations with specialised laboratories.", image: img("step-3.jpg") },
    { title: "CDMO Selection", text: "The right manufacturing partner for your product.", image: img("step-4.jpg") },
    { title: "Packaging", text: "Formats and materials aligned with your brand and concept.", image: img("step-5.jpg") },
    { title: "Production & Launch", text: "From prototype to market-ready product.", image: img("step-6.jpg") },
  ],
};

export const expertise = {
  label: "Our expertise",
  title: ["Longevity", "Wellness", "Performance", "Beauty", "Functional nutrition"],
  image: img("expertise.jpg"),
  columns: [
    [
      { title: "Longevity", items: ["Healthy ageing", "Cellular health", "Metabolic health"] },
      { title: "Wellness", items: ["Sleep", "Stress", "Gut health", "Daily health"] },
      { title: "Performance", items: ["Sport", "Recovery", "Endurance", "Muscle health"] },
    ],
    [
      { title: "Beauty from within", items: ["Skin", "Collagen", "Hair", "Healthy ageing"] },
      { title: "Functional nutrition", items: ["Powders", "Sticks", "Shots", "Capsules", "Functional beverages"] },
    ],
  ],
};

export const founder = {
  label: "Founder",
  name: ["Victoria", "Malashenko"],
  role: "Founder & Product Development Director",
  text: [
    "I am an entrepreneur and product development expert with more than 15 years of experience across aesthetic medicine, professional beauty, wellness, nutraceuticals and product development.",
    "As the founder and owner of an aesthetic medicine business, with a professional background in nutrition and health coaching, I have spent years working at the intersection of beauty, health, performance and longevity.",
    "My experience combines a deep understanding of consumer needs with extensive exposure to international industry exhibitions, ingredient suppliers, R&D laboratories and manufacturers. Over the years, I have built a broad professional network across the European and international nutraceutical and wellness industry.",
    "I continuously explore emerging ingredients, new technologies and scientific developments, translating them into distinctive product concepts with strong market potential.",
    "Through Longevica Science, I bring this experience together to help brands and entrepreneurs transform ideas into distinctive, commercially viable products.",
  ],
  link: "Instagram",
  instagram: "https://www.instagram.com/victoria_malashenko/",
  image: img("founder.jpg"),
  facts: [
    { title: "15+ years", text: "Industry experience" },
    { title: "Global network", text: "Ingredients · R&D · CDMOs · Manufacturing" },
    { title: "Product expertise", text: "Wellness · Beauty · Longevity · Performance" },
    { title: "Lifelong athlete", text: "Personal interest in performance, recovery and healthy ageing" },
  ],
};

export const network = {
  label: "Our network",
  title: ["A global network", "of trusted partners."],
  text: "We work with leading ingredient companies, specialised R&D laboratories, CDMOs, testing facilities and packaging partners across Europe and internationally.",
  image: img("network.jpg"),
  // height — визуальная высота логотипа в px (логотипы разных пропорций);
  // ratio — ширина/высота файла, чтобы место под логотип было известно ещё до загрузки
  partners: [
    { name: "GELITA", src: img("partners/gelita.png"), height: 28, ratio: 4.225 },
    { name: "Peptan", src: img("partners/peptan.png"), height: 40, ratio: 2.04 },
    { name: "Creapure", src: img("partners/creapure.png"), height: 24, ratio: 7.317 },
    { name: "Epax", src: img("partners/epax.png"), height: 30, ratio: 4.22 },
    { name: "KSM-66 Ashwagandha", src: img("partners/ksm66.png"), height: 34, ratio: 4.25 },
    { name: "AstaReal", src: img("partners/astareal.png"), height: 40, ratio: 3.243 },
  ],
};

export const contact = {
  label: "Contact",
  title: ["Have an idea?", "Let’s create it together."],
  text: "Tell us what you want to create. We’ll help you define it, formulate it, manufacture it and bring it to market.",
  fields: {
    name: "Your name*",
    company: "Company*",
    email: "Your email*",
    phone: "Telephone number*",
    message: "What would you like to create?",
  },
  errors: {
    name: "Please enter your name",
    company: "Please enter your company",
    email: "Please enter a valid email, e.g. name@company.com",
    phone: "Please enter a valid phone number",
  },
  submit: "Get in touch",
  // shown for 20 seconds after a successful submit
  thanks: {
    title: ["Thank you!", "We’ll be in touch soon."],
    text: "Your request has been received. We’ll review it and get back to you shortly.",
    note: "The form will be available again in",
  },
};

export const footer = {
  instagram: { label: "@victoria_malashenko", href: "https://www.instagram.com/victoria_malashenko/" },
  copyright: "© 2026 Longevica Science OÜ.",
  rights: "All rights reserved.",
};
