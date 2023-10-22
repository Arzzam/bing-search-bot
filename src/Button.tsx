import React from 'react';

interface ButtonProps {
  onClick: () => void;
  text?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  text,
  disabled = false,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className='bg-orange-300 text-[#242424] border-none rounded-md px-5 py-2 text-lg cursor-pointer transition-all hover:bg-[#ff982a] hover:border-2 hover:border-black] '
    >
      {children ? children : text}
    </button>
  );
};

export default Button;
