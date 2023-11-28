declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.mov' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default value;
}

declare module 'lodash';
declare module 'react-session-api';
declare module 'react-responsive-masonry';
declare module 'opengraph-react';
declare module 'react-datepicker';
declare module 'lodash';
declare module 'react-html-renderer';

export {};
