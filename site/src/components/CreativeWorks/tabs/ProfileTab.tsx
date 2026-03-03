import { creativeWorkAssets, type Company } from "../data";

type Props = {
  company: Company;
};

export default function ProfileTab({ company }: Props) {
  return (
    <div className="flex justify-center">
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ width: "360px", height: "509px" }}
      >
        <img
          src={creativeWorkAssets.profile(company)}
          alt="Company Profile"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        <div className="absolute inset-0 flex flex-col justify-between p-8">
          <div>
            <div className="mb-3 h-14 w-14 rounded-xl bg-white/20 backdrop-blur" />
            <h4
              className="text-xl font-bold text-white"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              {company.name}
            </h4>
            <p className="font-mono text-sm text-white/60">{company.industry}</p>
          </div>

          <div className="space-y-1 font-mono text-xs text-white/50">
            <div>contact@{company.id}.com</div>
            <div>www.{company.id}.com</div>
            <div>Dubai, UAE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
