'use client';

import { PieChart } from '@mui/x-charts';

import { AgoraDetailType } from '@/types/agora';

export default function AgoraChart({ agora }: { agora: AgoraDetailType }) {
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
      margin={{ top: 30, bottom: 30, left: 30, right: 30 }}
      slotProps={{
        legend: {
          direction: 'row',
          position: { vertical: 'bottom', horizontal: 'middle' },
          padding: 0,
        },
      }}
      height={270}
    />
  );
}
