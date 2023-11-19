'use client';

import { PieChart } from '@mui/x-charts';

import { AgoraDetailType } from '@/types/agora';

export default function AgoraChart({ agora }: { agora: AgoraDetailType }) {
  // TODO: 차트 디자인 재확인
  return (
    <PieChart
      series={[
        {
          data: [
            {
              id: 0,
              value: agora.agora.agreeCount,
              color: '#005BC4',
              label: agora.agora.agreeText,
            },
            {
              id: 1,
              value: agora.agora.naturalCount,
              color: '#F7B750',
              label: agora.agora.naturalText,
            },
            {
              id: 2,
              value: agora.agora.disagreeCount,
              color: '#C20E4D',
              label: agora.agora.disagreeText,
            },
          ],
        },
      ]}
      height={270}
    />
  );
}
