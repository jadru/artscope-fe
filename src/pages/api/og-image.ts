import { withOGImage } from 'next-api-og-image';

interface QueryParams {
  stage: string;
  name: string;
}

export default withOGImage<'query', QueryParams>({
  template: {
    // include HTML template here
    html: ({ name }) => `<h1>${name}</h1>`,
  },
  cacheControl: 'public, max-age=604800, immutable',
  dev: {
    inspectHtml: false,
  },
});
