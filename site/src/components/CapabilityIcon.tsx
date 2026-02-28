import { motion } from "framer-motion";
import {
  BarChart3,
  Clapperboard,
  Code2,
  Globe,
  TrendingUp,
  Workflow,
  type LucideIcon,
} from "lucide-react";

type CapabilityIconName =
  | "growth"
  | "analytics"
  | "web"
  | "content"
  | "ops"
  | "dev";

type Props = {
  name: CapabilityIconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

const icons: Record<CapabilityIconName, LucideIcon> = {
  growth: TrendingUp,
  analytics: BarChart3,
  web: Globe,
  content: Clapperboard,
  ops: Workflow,
  dev: Code2,
};

const motionMap: Record<
  CapabilityIconName,
  {
    animate: { y?: number[]; rotate?: number[]; scale?: number[]; x?: number[] };
    transition: { duration: number; repeat: number; ease: "easeInOut" };
    hover: { scale?: number; rotate?: number; x?: number; y?: number };
  }
> = {
  growth: {
    animate: { y: [0, -2, 0], rotate: [0, -5, 0, 4, 0], scale: [1, 1.04, 1] },
    transition: { duration: 4.6, repeat: Infinity, ease: "easeInOut" },
    hover: { scale: 1.14, rotate: 8, y: -2 },
  },
  analytics: {
    animate: { scale: [1, 1.06, 1], rotate: [0, 3, 0, -3, 0] },
    transition: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
    hover: { scale: 1.16, rotate: -8, y: -1 },
  },
  web: {
    animate: { rotate: [0, 6, 0, -6, 0], scale: [1, 1.03, 1] },
    transition: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
    hover: { scale: 1.13, rotate: 10, y: -2 },
  },
  content: {
    animate: { y: [0, -1, 0, 1, 0], x: [0, 1, 0, -1, 0], scale: [1, 1.04, 1] },
    transition: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
    hover: { scale: 1.15, rotate: 6, y: -2 },
  },
  ops: {
    animate: { rotate: [0, 8, 0, -8, 0], y: [0, -1, 0], scale: [1, 1.03, 1] },
    transition: { duration: 5.4, repeat: Infinity, ease: "easeInOut" },
    hover: { scale: 1.12, rotate: 10, y: -1 },
  },
  dev: {
    animate: { y: [0, -2, 0], rotate: [0, -4, 0, 4, 0] },
    transition: { duration: 4.4, repeat: Infinity, ease: "easeInOut" },
    hover: { scale: 1.14, rotate: -8, y: -2 },
  },
};

export default function CapabilityIcon({
  name,
  size = 18,
  strokeWidth = 1.9,
  className = "",
}: Props) {
  const Icon = icons[name];
  const motionSpec = motionMap[name];

  return (
    <span className={`cap-icon-shell inline-flex items-center justify-center ${className}`}>
      <motion.span
        className="cap-icon-motion inline-flex items-center justify-center"
        animate={motionSpec.animate}
        transition={motionSpec.transition}
        whileHover={motionSpec.hover}
      >
        <Icon size={size} strokeWidth={strokeWidth} className="lucide inline-block shrink-0" />
      </motion.span>
    </span>
  );
}
