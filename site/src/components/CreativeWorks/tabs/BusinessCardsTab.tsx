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
      <p className="font-mono text-xs tracking-widest text-white/30">FRONT</p>

      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl"
        style={{ width: "420px", height: "264px" }}
      >
        <img
          src={creativeWorkAssets.businessCardFront(company)}
          alt="Card Front"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent" />
        <div className="absolute bottom-5 left-5 text-white">
          <p className="text-lg font-bold" style={{ fontFamily: "Orbitron, sans-serif" }}>
            {company.name}
          </p>
          <p className="mt-0.5 font-mono text-xs text-white/60">contact@{company.id}.com</p>
        </div>
      </div>

      <p className="font-mono text-xs tracking-widest text-white/30">BACK</p>

      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl"
        style={{ width: "420px", height: "264px" }}
      >
        <img
          src={creativeWorkAssets.businessCardBack(company)}
          alt="Card Back"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur">
            <span className="text-2xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
              {company.name[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
