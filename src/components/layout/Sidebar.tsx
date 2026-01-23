import React from 'react';
import { Calendar, TrendingUp, ExternalLink, Code, X, Building2, Award, Briefcase } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const upcomingDrives = [
  { id: 1, company: 'Google', role: 'SDE', date: '25 Jan', icon: Building2, color: 'text-red-600 bg-red-100' },
  { id: 2, company: 'Microsoft', role: 'Cloud Consultant', date: '28 Jan', icon: Building2, color: 'text-blue-600 bg-blue-100' },
  { id: 3, company: 'Amazon', role: 'Data Analyst', date: '02 Feb', icon: Building2, color: 'text-orange-600 bg-orange-100' },
];

const stats = [
  { label: 'Highest Package', value: '₹64 LPA', icon: TrendingUp, color: 'text-green-600 bg-green-100' },
  { label: 'Avg Package', value: '₹12.5 LPA', icon: Award, color: 'text-purple-600 bg-purple-100' },
];

const quickLinks = [
  { title: 'UMS', href: 'https://ums.lpu.in/lpuums/' },
  { title: 'LPU Placements', href: 'https://www.lpu.in/placements.php' },
  { title: 'School of CSE', href: 'https://www.lpu.in/schools/computer-science-engineering/' },
  { title: 'Alumni Connect', href: 'https://alumni.lpu.in/' },
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
          flex flex-col h-full shadow-xl md:shadow-none
        `}
      >
        {/* Header Section */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-orange-500" />
            Placement Hub
          </h2>
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Upcoming Drives */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" /> Upcoming Drives
              </h3>
              <span className="text-xs text-orange-600 font-medium cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-3">
              {upcomingDrives.map((drive) => (
                <div key={drive.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${drive.color} group-hover:scale-105 transition-transform`}>
                    <drive.icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{drive.company}</h4>
                    <p className="text-xs text-gray-500 font-medium">{drive.role}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded-full">
                      {drive.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gray-500" /> Quick Links
            </h3>
            <div className="space-y-1">
              {quickLinks.map((link, i) => (
                <a key={i} href={link.href} className="flex items-center justify-between px-3 py-2.5 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors group">
                  {link.title}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Developed By</p>
              <p className="text-sm font-bold text-gray-900">Pathak Aayush LPU @2026</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400 font-medium">
            <span>v1.0.0</span>
            <span>Former SDE Intern 2025 <p className='text-orange-400'>Amazon</p> </span>
          </div>
        </div>
      </aside>
    </>
  );
};