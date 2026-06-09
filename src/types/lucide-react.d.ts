declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
  }
  export type LucideIcon = FC<LucideProps>;

  export const BookOpen: LucideIcon;
  export const Microscope: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Dna: LucideIcon;
  export const Brain: LucideIcon;
  export const FlaskConical: LucideIcon;
  export const Layers: LucideIcon;
  export const Box: LucideIcon;
  export const Cpu: LucideIcon;
  export const Calculator: LucideIcon;
  export const Code: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Search: LucideIcon;
  export const Filter: LucideIcon;
  export const Copy: LucideIcon;
  export const Check: LucideIcon;
  export const Terminal: LucideIcon;
  export const Menu: LucideIcon;
  export const X: LucideIcon;
  export const Library: LucideIcon;
  export const Wrench: LucideIcon;
  export const Sigma: LucideIcon;
}
