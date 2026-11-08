/**
 * Counters in the "Why AM Group" band. `value` is animated from 0 on scroll.
 * `suffix`/`prefix` are rendered static beside the number.
 */

export interface Stat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  caption: string;
  /** Decimal places to show while counting. */
  decimals?: number;
}

export const stats: Stat[] = [
  {
    label: "Properties closed",
    value: 1240,
    suffix: "+",
    caption: "Across Greater Cairo since 2014",
  },
  {
    label: "Years in the market",
    value: 11,
    caption: "Founded in New Cairo, still based there",
  },
  {
    label: "Under management",
    value: 3.8,
    prefix: "EGP ",
    suffix: "B",
    decimals: 1,
    caption: "Portfolio value we look after daily",
  },
  {
    label: "Client satisfaction",
    value: 98,
    suffix: "%",
    caption: "Would recommend us to family",
  },
];

/** The "why us" differentiators sitting beside the counters. */
export const differentiators = [
  {
    title: "We turn down listings",
    body: "If a title is unclear or a price is fantasy, we say so and walk. It costs us commission and saves you a year.",
  },
  {
    title: "One agent, start to finish",
    body: "You are not handed between departments. The person who shows you the property is the person who closes it.",
  },
  {
    title: "We manage what we sell",
    body: "Our management book means we know how these buildings actually age — which is information you want before you buy.",
  },
];
