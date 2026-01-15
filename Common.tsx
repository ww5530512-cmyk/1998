
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; title?: string; className?: string }> = ({ children, title, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
    {title && (
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

export const Button: React.FC<{ 
  onClick?: () => void; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; 
  className?: string;
  type?: 'button' | 'submit'
}> = ({ onClick, children, variant = 'primary', className = "", type = "button" }) => {
  const styles = {
    primary: 'bg-green-600 hover:bg-green-700 text-white shadow-sm',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'bg-transparent text-gray-500 hover:text-green-600'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-sm font-semibold text-gray-700 mb-1">{children}</label>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { options: { label: string; value: string }[] }> = ({ options, ...props }) => (
  <select
    {...props}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
  >
    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select>
);
