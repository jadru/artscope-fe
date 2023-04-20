import { render, screen } from '@testing-library/react';

import NotFoundPage from '@/pages/_error';

describe('404 페이지', () => {
  it('404페이지의 텍스트 확인', () => {
    render(<NotFoundPage />);

    const heading = screen.getByText(/페이지를 찾을 수 없습니다/i);

    expect(heading).toBeInTheDocument();
  });
});
