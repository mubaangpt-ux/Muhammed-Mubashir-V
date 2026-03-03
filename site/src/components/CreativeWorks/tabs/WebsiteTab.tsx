import { creativeWorkAssets, type Company } from "../data";

type Props = {
  company: Company;
};

export default function WebsiteTab({ company }: Props) {
  const screenshots = Array.from(
    { length: 3 },
    (_, index) => creativeWorkAssets.website(company, index)
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="flex items-center gap-3 bg-[#1a1f2e] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/70" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <div className="h-3 w-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 rounded-md bg-white/5 px-3 py-1 font-mono text-xs text-white/30">
          {company.id}.com
        </div>
      </div>

      <div className="space-y-1 bg-[#0a0d14]">
        {screenshots.map((src, index) => (
          <img key={src} src={src} alt={`Screenshot ${index + 1}`} className="w-full" loading="lazy" />
        ))}
      </div>
    </div>
  );
}
