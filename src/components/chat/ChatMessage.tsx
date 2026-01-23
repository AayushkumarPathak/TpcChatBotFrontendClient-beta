import React from 'react';
import { Bot, User, AlertCircle } from 'lucide-react';
import type { Message } from '../../types/index';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: Message;
  requiresHumanIntervention?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  requiresHumanIntervention 
}) => {
  // Use the flag from message if not explicitly passed
  const showHumanIntervention = typeof requiresHumanIntervention !== 'undefined'
    ? requiresHumanIntervention
    : message.requiresHumanIntervention;
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      {isAI && (
        <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} max-w-[80%] md:max-w-[70%]`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isAI
              ? 'bg-gray-100 text-gray-900 rounded-tl-none'
              : 'bg-primary-600 text-white rounded-tr-none'
          }`}
        >
          <p className="text-sm md:text-base whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        
        {showHumanIntervention && isAI && (
          <div className="mt-2 flex items-center gap-2 text-orange-600 text-xs bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>This query may require TPC coordinator assistance</span>
          </div>
        )}

        <span className="text-xs text-gray-500 mt-1 px-1">
          {format(message.timestamp, 'HH:mm')}
        </span>
      </div>

      {!isAI && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </div>
  );
};