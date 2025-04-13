export const colorShades = [400, 500, 600, 700, 800, 900, 950] as const;

export type ColorShade = (typeof colorShades)[number];

export const colorOptions = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
] as const;

export type ColorOption = (typeof colorOptions)[number];

export const colorSelectOptions = [
  { value: "red", label: "Red", colorClass: "bg-red-500" },
  { value: "orange", label: "Orange", colorClass: "bg-orange-500" },
  { value: "amber", label: "Amber", colorClass: "bg-amber-500" },
  { value: "yellow", label: "Yellow", colorClass: "bg-yellow-500" },
  { value: "lime", label: "Lime", colorClass: "bg-lime-500" },
  { value: "green", label: "Green", colorClass: "bg-green-500" },
  { value: "emerald", label: "Emerald", colorClass: "bg-emerald-500" },
  { value: "teal", label: "Teal", colorClass: "bg-teal-500" },
  { value: "cyan", label: "Cyan", colorClass: "bg-cyan-500" },
  { value: "sky", label: "Sky", colorClass: "bg-sky-500" },
  { value: "blue", label: "Blue", colorClass: "bg-blue-500" },
  { value: "indigo", label: "Indigo", colorClass: "bg-indigo-500" },
  { value: "violet", label: "Violet", colorClass: "bg-violet-500" },
  { value: "purple", label: "Purple", colorClass: "bg-purple-500" },
  { value: "fuchsia", label: "Fuchsia", colorClass: "bg-fuchsia-500" },
  { value: "pink", label: "Pink", colorClass: "bg-pink-500" },
  { value: "rose", label: "Rose", colorClass: "bg-rose-500" },
  { value: "slate", label: "Slate", colorClass: "bg-slate-500" },
  { value: "gray", label: "Gray", colorClass: "bg-gray-500" },
  { value: "zinc", label: "Zinc", colorClass: "bg-zinc-500" },
  { value: "neutral", label: "Neutral", colorClass: "bg-neutral-500" },
  { value: "stone", label: "Stone", colorClass: "bg-stone-500" },
];

export type ColorSelectOption = (typeof colorSelectOptions)[number];

export const getTextColorClass = (
  color: ColorOption,
  shade: ColorShade = 500
) => {
  return `text-${color}-${shade}` as const;
};

export const getBgColorClass = (
  color: ColorOption,
  shade: ColorShade = 500
) => {
  return `bg-${color}-${shade}` as const;
};

export const getChartTheme = (color: ColorOption) => {
  return {
    colors: colorShades.map((shade) => `var(--${color}-${shade})`),
  };
};

export const getCssColorVariable = (
  color: ColorOption,
  shade: ColorShade
): string => {
  return `var(--${color}-${shade})`;
};
