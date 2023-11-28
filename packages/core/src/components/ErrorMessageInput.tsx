import { FC, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

const ErrorMessageInput: FC<Props> = ({ children }) => (
  <p className='my-0.5 ml-1 h-2.5 text-sm text-red-400'>{children}</p>
);

export default ErrorMessageInput;
