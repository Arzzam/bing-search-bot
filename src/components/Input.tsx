import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...rest }) => {
  return (
    <div className='flex flex-col justify-center items-center gap-2'>
      <label htmlFor={rest.id}>{label}</label>
      <input
        {...rest}
        type='number'
        className='w-48 bg-[#242424] text-white p-2 text-base border border-[#fdba74] rounded-md focus:outline-none focus:ring-1 focus:ring-[#ffa13d]'
      />
    </div>
  );
};

export default Input;
