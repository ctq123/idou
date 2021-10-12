declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

/// <reference types="@welldone-software/why-did-you-render" />

declare module 'uuid';

declare function prettierFormat(str: string | null, type: string): any;
