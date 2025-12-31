import { Sparkles, Shield, Star, CheckCircle } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  brandName?: string;
  brandColor?: 'blue' | 'emerald' | 'orange' | 'purple';
  iconColor?: 'blue' | 'emerald' | 'orange' | 'purple';
  showIcon?: boolean;
  showBadges?: boolean;
}

const PageHeader = ({ 
  title, 
  subtitle, 
  brandName = "Tutoria", 
  brandColor = 'blue',
  iconColor = 'orange',
  showIcon = true,
  showBadges = false 
}: PageHeaderProps) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500 dark:bg-blue-600',
      text: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500 dark:bg-blue-600',
      iconText: 'text-blue-500 dark:text-blue-400'
    },
    emerald: {
      bg: 'bg-emerald-500 dark:bg-emerald-600',
      text: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500 dark:bg-emerald-600',
      iconText: 'text-emerald-500 dark:text-emerald-400'
    },
    orange: {
      bg: 'bg-orange-500 dark:bg-orange-600',
      text: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-500 dark:bg-orange-600',
      iconText: 'text-orange-500 dark:text-orange-400'
    },
    purple: {
      bg: 'bg-purple-500 dark:bg-purple-600',
      text: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-500 dark:bg-purple-600',
      iconText: 'text-purple-500 dark:text-purple-400'
    }
  };

  const brandColorClass = colorClasses[brandColor];
  const iconColorClass = colorClasses[iconColor];

  return (
    <div className="text-center mb-12">
      {showIcon && (
        <div className={`inline-flex items-center justify-center w-14 h-14 ${iconColorClass.iconBg} rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6`}>
          <Sparkles className={`w-6 h-6 ${iconColorClass.iconText}`} />
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {title} <span className={brandColorClass.text}>{brandName}</span>
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
        {subtitle}
      </p>
      
      {showBadges && (
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Shield className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-gray-600 dark:text-gray-300">Sécurisé</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Star className="w-3 h-3 text-amber-400" />
            <span className="text-xs text-gray-600 dark:text-gray-300">4.9/5</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-gray-600 dark:text-gray-300">Gratuit</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
