import { creativeWorkAssets, type Company } from "../data";

const bgVariants = ["#0d1a3e", "#1a0d3e", "#0d3e1a", "#3e2a0d"];

type Props = {
  company: Company;
};

export default function LogoTab({ company }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {bgVariants.map((background, index) => (
        <div
          key={background}
          className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl"
          style={{ background }}
        >
          <img
            src={creativeWorkAssets.logo(company, index)}
            alt={`Logo variant ${index + 1}`}
            className="h-3/4 w-3/4 object-contain"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
