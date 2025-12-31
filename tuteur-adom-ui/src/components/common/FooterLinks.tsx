import { Link } from 'react-router-dom';

interface FooterLinksProps {
  helpText?: string;
  helpLink?: string;
  linkColor?: 'blue' | 'emerald' | 'orange' | 'purple';
  showHelp?: boolean;
  className?: string;
}

const FooterLinks = ({ 
  helpText = "Besoin d'aide pour choisir ?",
  helpLink = "/contact",
  linkColor = 'emerald',
  showHelp = true,
  className = ""
}: FooterLinksProps) => {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
    emerald: 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300',
    orange: 'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300',
    purple: 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300'
  };

  const linkClass = colorClasses[linkColor];

  return (
    <div className={`text-center ${className}`}>
      {showHelp && (
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {helpText}{' '}
          <Link to={helpLink} className={`${linkClass} hover:underline font-medium`}>
            Nos conseillers vous accompagnent
          </Link>
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          Confidentialité
        </Link>
        <span>•</span>
        <Link to="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          Conditions
        </Link>
        <span>•</span>
        <Link to="/help" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          Aide
        </Link>
        <span>•</span>
        <Link to="/faq" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          FAQ
        </Link>
      </div>
    </div>
  );
};

export default FooterLinks;
