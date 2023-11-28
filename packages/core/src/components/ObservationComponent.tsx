import React, { ReactElement, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const FeedObservationComponent = ({
  hasNext,
  hasData,
  fetchNextPage,
}: {
  hasNext: boolean;
  hasData: boolean;
  fetchNextPage: () => void;
}): ReactElement => {
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!hasData) return;

    if (hasNext && inView) fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return <div ref={ref} className='mb-1 h-1' />;
};

export default FeedObservationComponent;
