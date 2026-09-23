import { cn } from "@/lib/cn";
import {
  landingEyebrowClass,
  landingH2CenterClass,
  landingLeadClass,
} from "./landing-styles";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("animate-rise mb-8 min-w-0 text-center sm:mb-11", className)}>
      <div className={cn(landingEyebrowClass, "sm:mb-3.5")}>{eyebrow}</div>
      <h2 className={cn(landingH2CenterClass, "mb-0")}>{title}</h2>
      {subtitle && (
        <p className={cn(landingLeadClass, "mx-auto mt-3 max-w-xl sm:mt-3.5 sm:text-[17px]")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
