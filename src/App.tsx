import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Approach, Contact, Expertise, Footer, Founder, Header, Hero, Network, Process } from "./components/Sections";
import { legalDocs } from "./legal";
import LegalPage from "./pages/LegalPage";

function Home() {
  // Arriving from another page via /#contact: scroll once the section has rendered.
  useEffect(() => {
    document.title = "Longevica Science";
    const { hash } = window.location;
    if (!hash) return;
    // wait a frame so layout (and the browser's own scroll restoration) has settled
    const t = window.setTimeout(() => document.querySelector(hash)?.scrollIntoView(), 50);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <Header />
      <main>
        {/* wrapper ends the hero's sticky range once the approach block has covered it */}
        <div className="relative">
          <Hero />
          {/* mobile: 60px of scroll before the approach block starts sliding over the hero */}
          <div aria-hidden className="h-[60px] md:hidden" />
          <Approach />
        </div>
        <div className="relative">
          <Process />
          {/* short pause: process stays put for a moment before expertise slides over */}
          <div aria-hidden className="h-[60px] md:h-[40vh]" />
          <Expertise />
        </div>
        <Founder />
        <Network />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        {legalDocs.map((d) => (
          <Route key={d.slug} path={`/${d.slug}`} element={<LegalPage doc={d} />} />
        ))}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
