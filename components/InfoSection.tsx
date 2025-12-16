import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: 'default' | 'alert' | 'success';
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, icon: Icon, children, variant = 'default' }) => {
  const getColors = () => {
    switch(variant) {
      case 'alert': return 'border-rose-500/30 bg-rose-500/5 text-rose-100';
      case 'success': return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-100';
      default: return 'border-slate-700 bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className={`rounded-xl border p-6 ${getColors()} backdrop-blur-sm`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-6 h-6 ${variant === 'alert' ? 'text-rose-400' : variant === 'success' ? 'text-emerald-400' : 'text-blue-400'}`} />
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  );
};

export default InfoSection;
