import React from 'react';

interface QuickActionsProps {
  onSelectAction: (message: string) => void;
  disabled?: boolean;
}

const quickActions = [
  {
    label: 'CGPA Rule?',
    message: 'What is the minimum CGPA requirement for placement eligibility?',
  },
  {
    label: 'Deadline?',
    message: 'What is the registration deadline for the placement process?',
  },
  {
    label: 'Multiple offers?',
    message: 'Can I accept multiple job offers from the placement process?',
  },
];

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  onSelectAction, 
  disabled 
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      {quickActions.map((action, index) => (
        <button
          key={index}
          onClick={() => onSelectAction(action.message)}
          disabled={disabled}
          className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-primary-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};