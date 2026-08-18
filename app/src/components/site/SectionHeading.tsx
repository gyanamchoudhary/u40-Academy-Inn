import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
};

export function SectionHeading({ eyebrow, title, description, align = "left", dark = false }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className={cn("font-mono text-[11px] font-semibold uppercase tracking-[0.16em]", dark ? "text-[#d9f66f]" : "text-[#2046d8]")}>{eyebrow}</p>
      <h2 className={cn("mt-5 text-balance text-[2.65rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[3.5rem]", dark ? "text-white" : "text-[#111318]")}>{title}</h2>
      {description ? <p className={cn("mt-5 max-w-[64ch] text-base leading-7 sm:mt-6 sm:text-lg sm:leading-8", align === "center" && "mx-auto", dark ? "text-white/65" : "text-[#60646c]")}>{description}</p> : null}
    </div>
  );
}
