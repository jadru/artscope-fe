import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import FeedRootPage from '@/app/(main)/(list)/(feed)/page';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: () => jest.fn(),
      replace: () => jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
}));
describe('Feed Page Screen', () => {
  it('renders the feed home page widget and main navigation', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <FeedRootPage />
      </QueryClientProvider>
    );
  });
});
