import React from 'react';
export interface NameProps {
  name: string;
}
export const Button = (props: NameProps) => {
  return <>the button is {props.name}</>;
};
