import { useEffect } from "react";
import { Footer, Header } from "../components/Sections";
import type { LegalDoc } from "../legal";

// Renders [placeholders] highlighted so unfilled gaps are easy to spot.
function WithPlaceholders({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((part, i) =>
        part.startsWith("[") ? (
          <mark key={i} className="bg-yellow-200/70 px-0.5 text-ink">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${doc.title} — Longevica Science`;
  }, [doc]);

  return (
    <>
      <Header />
      <main className="container-x pb-24 pt-40 md:pt-48">
        <article className="max-w-[760px]">
          <p className="label text-muted">
            Last updated: <WithPlaceholders text={doc.updated} />
          </p>
          <h1 className="h-section mt-6 text-[44px] md:text-[64px]">{doc.title}</h1>
          <p className="mt-6 text-[16px] leading-relaxed text-ink/80">
            <WithPlaceholders text={doc.intro} />
          </p>
          {doc.sections.map((s) => (
            <section key={s.heading} className="mt-12">
              <h2 className="label font-semibold">{s.heading}</h2>
              <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink/80">
                {s.body.map((p) => (
                  <p key={p}>
                    <WithPlaceholders text={p} />
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </>
  );
}
