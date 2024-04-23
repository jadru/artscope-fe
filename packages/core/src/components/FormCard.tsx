import { ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};
export default function FormCard(props: Props) {
  return (
    <Card>
      <CardHeader>{props.title}</CardHeader>
      {props.description && (
        <CardDescription>{props.description}</CardDescription>
      )}
      <CardContent>{props.children}</CardContent>
    </Card>
  );
}
