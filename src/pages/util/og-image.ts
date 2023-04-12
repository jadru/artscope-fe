import { withOGImage } from 'next-api-og-image';

interface QueryParams {
  name: string;
}

export default withOGImage<'query', QueryParams>({
  template: {
    // include HTML template here
    html: async ({ name }) =>
      `<html>
        <head>
         <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div class="flex flex-col justify-center items-center w-full h-full bg-gradient-to-r from-[#1c2275] to-[#269f88]">
          <span class='text-7xl'>🚀</span>
            <h1 class="text-6xl font-light text-white truncate w-full text-center p-6">${name}</h1>
            <p class="text-4xl font-bold text-black absolute bottom-8 bg-white">Artscope</p>
          </div>
        </body>
      </html>`,
  },
  cacheControl: 'public, max-age=604800, immutable',
  dev: {
    inspectHtml: false,
  },
});
