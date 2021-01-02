interface INr1GridItemProps {
  columnSpan: number;
}

interface INr1TextFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface INr1ButtonProps {
  onClick: () => void;
  children: string;
}

declare module 'nr1' {
  export const Spinner: React.FC;
  export const Grid: React.FC;
  export const GridItem: React.FC<INr1GridItemProps>;
  export const TextField: React.FC<INr1TextFieldProps>;
  export const Button: React.FC<INr1ButtonProps>;
}