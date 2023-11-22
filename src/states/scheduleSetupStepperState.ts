import { create } from 'zustand';

import { CreateScheduleTempType } from '@/types/event';

export type scheduleSetupStep1Type = {
  isDone: boolean | undefined;
  isDayRotate: boolean | undefined;
  isSeparate: boolean | undefined;
};

export type scheduleSetupStep2Type = {
  isDone: boolean | undefined;
  startDate: Date;
  endDate: Date;
  holidays: [];
};

export type scheduleSetupStep3Type = {
  isDone: boolean | undefined;
  isEveryEventTimeSame: boolean;
  usualStartTime: Date;
  usualEndTime: Date;
  someEventsTimes: {
    id: number;
    startTime: Date;
    endTime: Date;
  }[];
};

export type scheduleSetupStep4Type = {
  isDone: boolean | undefined;
  isSpecialSchedule: boolean;
  specialSchedule: CreateScheduleTempType[];
};

type scheduleSetupType = {
  step1: scheduleSetupStep1Type;
  step2: scheduleSetupStep2Type;
  step3: scheduleSetupStep3Type;
  step4: scheduleSetupStep4Type;
  setStep1: (step1: scheduleSetupStep1Type) => void;
  setStep2: (step2: scheduleSetupStep2Type) => void;
  setStep3: (step3: scheduleSetupStep3Type) => void;
  setStep4: (step4: scheduleSetupStep4Type) => void;
  resetSteps: () => void;
};

export const useScheduleSetupStepperStore = create<scheduleSetupType>(
  (set) => ({
    step1: {
      isDone: undefined,
      isDayRotate: undefined,
      isSeparate: undefined,
    },
    step2: {
      isDone: undefined,
      startDate: new Date(),
      endDate: new Date(),
      holidays: [],
    },
    step3: {
      isDone: undefined,
      isEveryEventTimeSame: false,
      usualStartTime: new Date('2023-12-31T10:00:00.000Z'),
      usualEndTime: new Date('2023-12-31T12:00:00.000Z'),
      someEventsTimes: [],
    },
    step4: {
      isDone: undefined,
      isSpecialSchedule: false,
      specialSchedule: [],
    },
    setStep1: (step1) => set({ step1 }),
    setStep2: (step2) => set({ step2 }),
    setStep3: (step3) => set({ step3 }),
    setStep4: (step4) => set({ step4 }),
    resetSteps: () => {
      set({
        step1: {
          isDone: false,
          isDayRotate: undefined,
          isSeparate: undefined,
        },
        step2: {
          isDone: false,
          startDate: new Date(),
          endDate: new Date(),
          holidays: [],
        },
        step3: {
          isDone: false,
          isEveryEventTimeSame: false,
          usualStartTime: new Date('2023-12-31T10:00:00.000Z'),
          usualEndTime: new Date('2023-12-31T12:00:00.000Z'),
          someEventsTimes: [],
        },
        step4: {
          isDone: false,
          isSpecialSchedule: false,
          specialSchedule: [],
        },
      });
    },
  })
);
