import { colorOptions } from "./colorUtils";

export const textColorMap = {
  red: {
    400: "text-red-400",
    500: "text-red-500",
    600: "text-red-600",
    700: "text-red-700",
    800: "text-red-800",
    900: "text-red-900",
  },
  orange: {
    400: "text-orange-400",
    500: "text-orange-500",
    600: "text-orange-600",
    700: "text-orange-700",
    800: "text-orange-800",
    900: "text-orange-900",
  },
  amber: {
    400: "text-amber-400",
    500: "text-amber-500",
    600: "text-amber-600",
    700: "text-amber-700",
    800: "text-amber-800",
    900: "text-amber-900",
  },
  yellow: {
    400: "text-yellow-400",
    500: "text-yellow-500",
    600: "text-yellow-600",
    700: "text-yellow-700",
    800: "text-yellow-800",
    900: "text-yellow-900",
  },
  lime: {
    400: "text-lime-400",
    500: "text-lime-500",
    600: "text-lime-600",
    700: "text-lime-700",
    800: "text-lime-800",
    900: "text-lime-900",
  },
  green: {
    400: "text-green-400",
    500: "text-green-500",
    600: "text-green-600",
    700: "text-green-700",
    800: "text-green-800",
    900: "text-green-900",
  },
  emerald: {
    400: "text-emerald-400",
    500: "text-emerald-500",
    600: "text-emerald-600",
    700: "text-emerald-700",
    800: "text-emerald-800",
    900: "text-emerald-900",
  },
  teal: {
    400: "text-teal-400",
    500: "text-teal-500",
    600: "text-teal-600",
    700: "text-teal-700",
    800: "text-teal-800",
    900: "text-teal-900",
  },
  cyan: {
    400: "text-cyan-400",
    500: "text-cyan-500",
    600: "text-cyan-600",
    700: "text-cyan-700",
    800: "text-cyan-800",
    900: "text-cyan-900",
  },
  sky: {
    400: "text-sky-400",
    500: "text-sky-500",
    600: "text-sky-600",
    700: "text-sky-700",
    800: "text-sky-800",
    900: "text-sky-900",
  },
  blue: {
    400: "text-blue-400",
    500: "text-blue-500",
    600: "text-blue-600",
    700: "text-blue-700",
    800: "text-blue-800",
    900: "text-blue-900",
  },
  indigo: {
    400: "text-indigo-400",
    500: "text-indigo-500",
    600: "text-indigo-600",
    700: "text-indigo-700",
    800: "text-indigo-800",
    900: "text-indigo-900",
  },
  violet: {
    400: "text-violet-400",
    500: "text-violet-500",
    600: "text-violet-600",
    700: "text-violet-700",
    800: "text-violet-800",
    900: "text-violet-900",
  },
  purple: {
    400: "text-purple-400",
    500: "text-purple-500",
    600: "text-purple-600",
    700: "text-purple-700",
    800: "text-purple-800",
    900: "text-purple-900",
  },
  fuchsia: {
    400: "text-fuchsia-400",
    500: "text-fuchsia-500",
    600: "text-fuchsia-600",
    700: "text-fuchsia-700",
    800: "text-fuchsia-800",
    900: "text-fuchsia-900",
  },
  pink: {
    400: "text-pink-400",
    500: "text-pink-500",
    600: "text-pink-600",
    700: "text-pink-700",
    800: "text-pink-800",
    900: "text-pink-900",
  },
  rose: {
    400: "text-rose-400",
    500: "text-rose-500",
    600: "text-rose-600",
    700: "text-rose-700",
    800: "text-rose-800",
    900: "text-rose-900",
  },
  slate: {
    400: "text-slate-400",
    500: "text-slate-500",
    600: "text-slate-600",
    700: "text-slate-700",
    800: "text-slate-800",
    900: "text-slate-900",
  },
  gray: {
    400: "text-gray-400",
    500: "text-gray-500",
    600: "text-gray-600",
    700: "text-gray-700",
    800: "text-gray-800",
    900: "text-gray-900",
  },
  zinc: {
    400: "text-zinc-400",
    500: "text-zinc-500",
    600: "text-zinc-600",
    700: "text-zinc-700",
    800: "text-zinc-800",
    900: "text-zinc-900",
  },
  neutral: {
    400: "text-neutral-400",
    500: "text-neutral-500",
    600: "text-neutral-600",
    700: "text-neutral-700",
    800: "text-neutral-800",
    900: "text-neutral-900",
  },
  stone: {
    400: "text-stone-400",
    500: "text-stone-500",
    600: "text-stone-600",
    700: "text-stone-700",
    800: "text-stone-800",
    900: "text-stone-900",
  },
} as const;

type ColorOption = (typeof colorOptions)[number];
type ColorShade = 400 | 500 | 600 | 700 | 800 | 900;

export const getTextColorClass = (
  color: ColorOption,
  shade: ColorShade = 600
): string => {
  return textColorMap[color][shade];
};
