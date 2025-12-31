import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackNavigationProps {
  to?: string;
  text?: string;
  className?: string;
  showContainer?: boolean;
}

const BackNavigation = ({ 
  to = "/", 
  text = "Retour à l'accueil", 
  className = "",
  showContainer = true 
}: BackNavigationProps) => {
  const linkContent = (
    <Link 
      to={to}
      className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${className}`}
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">{text}</span>
    </Link>
  );

  if (showContainer) {
    return (
      <div className="bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {linkContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      {linkContent}
    </div>
  );
};

export default BackNavigation;
