// lib/colorUtils.ts
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

export const colorSelectOptions = colorOptions.map((color) => ({
  value: color,
  label: color.charAt(0).toUpperCase() + color.slice(1),
  colorClass: `bg-${color}-500`,
}));

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
