import { creativeWorkAssets, type Company } from "../data";

type Props = {
  company: Company;
};

export default function BusinessCardsTab({ company }: Props) {
  return (
    <div
      className="flex flex-col items-center gap-8 rounded-2xl py-6"
      style={{
        background: "radial-gradient(ellipse at center, #1a1f2e 0%, #07090f 100%)",
      }}
    >
      {[
        { label: "Front", src: creativeWorkAssets.businessCardFront(company), alt: `${company.name} business card front` },
        { label: "Back", src: creativeWorkAssets.businessCardBack(company), alt: `${company.name} business card back` },
      ].map((card) => (
        <div key={card.label} className="flex w-full flex-col items-center">
          <p className="mb-4 font-mono text-xs tracking-widest text-white/30">{card.label}</p>
          <div
            className="relative flex w-full max-w-[30rem] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl"
            style={{ minHeight: "18rem" }}
          >
            <img
              src={card.src}
              alt={card.alt}
              className="max-h-[70vh] w-auto max-w-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
