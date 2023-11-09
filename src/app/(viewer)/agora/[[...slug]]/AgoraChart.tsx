'use client';

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { AgoraDetailType } from '@/types/agora';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AgoraChart({ agora }: { agora: AgoraDetailType }) {
  return (
    <Doughnut
      data={{
        labels: [
          agora.agora.agreeText,
          agora.agora.naturalText,
          agora.agora.disagreeText,
        ],
        datasets: [
          {
            label: '투표자',
            data: [
              agora.agora.agreeCount,
              agora.agora.naturalCount,
              agora.agora.disagreeCount,
            ],
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(255, 99, 132, 0.2)',
            ],
          },
        ],
      }}
    />
  );
}
