import React from 'react';
import { FileText, Calendar, BookOpen, AlertCircle, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const policies = [
  {
    id: 1,
    category: 'ELIGIBILITY',
    title: 'General Eligibility Criteria',
    date: '2024-01-15',
    icon: FileText,
    color: 'text-blue-600 bg-blue-100',
  },
  {
    id: 2,
    category: 'REGISTRATION',
    title: 'Registration Protocol',
    date: '2024-02-10',
    icon: Calendar,
    color: 'text-green-600 bg-green-100',
  },
  {
    id: 3,
    category: 'RULES',
    title: 'One-Student-One-Job Policy',
    date: '2024-03-05',
    icon: AlertCircle,
    color: 'text-orange-600 bg-orange-100',
  },
  {
    id: 4,
    category: 'RULES',
    title: 'Interview & Code of Conduct',
    date: '2024-04-01',
    icon: BookOpen,
    color: 'text-purple-600 bg-purple-100',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30 w-80 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          overflow-y-auto
        `}
      >
        <div className="p-4">
          {/* Mobile close button */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h2 className="text-lg font-semibold text-gray-900">
              Placement Policies
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Desktop title */}
          <h2 className="hidden md:block text-lg font-semibold text-gray-900 mb-4">
            Placement Policies
          </h2>

          <p className="text-sm text-gray-600 mb-4">
            Quick reference for official guidelines
          </p>

          {/* Policies List */}
          <div className="space-y-3">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${policy.color} flex-shrink-0`}>
                    <policy.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-primary-600">
                        {policy.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {policy.date}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {policy.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Need Help?
                </h4>
                <p className="text-xs text-blue-700">
                  For complex queries, contact the TPC Coordinator. Response time: ~24hrs
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};