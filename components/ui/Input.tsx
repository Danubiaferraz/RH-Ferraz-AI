import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${className}`}
        {...props}
      />
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <textarea
        className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${className}`}
        {...props}
      />
    </div>
  );
};
