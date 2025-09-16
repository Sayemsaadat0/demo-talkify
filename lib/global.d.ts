// global.d.ts
declare namespace JSX {
    interface IntrinsicElements {
      'wc-datepicker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: Date;
        'start-date'?: Date;
        'max-date'?: Date;
        locale?: string;
        theme?: string;
        style?: React.CSSProperties;
      };
    }
  }
  