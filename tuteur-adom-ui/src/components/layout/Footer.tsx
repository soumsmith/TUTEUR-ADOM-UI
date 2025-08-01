import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Tuteur-Adom</h2>
            <p className="text-gray-300 text-sm">
              Trouvez le meilleur enseignant pour des cours à domicile ou en ligne.
            </p>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/teachers" className="text-gray-300 hover:text-white">
                  Enseignants
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">
                  Inscription
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-4">Matières</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link to="/teachers?subject=Mathématiques" className="text-gray-300 hover:text-white">
                Mathématiques
              </Link>
              <Link to="/teachers?subject=Français" className="text-gray-300 hover:text-white">
                Français
              </Link>
              <Link to="/teachers?subject=Anglais" className="text-gray-300 hover:text-white">
                Anglais
              </Link>
              <Link to="/teachers?subject=Histoire" className="text-gray-300 hover:text-white">
                Histoire
              </Link>
              <Link to="/teachers?subject=Physique" className="text-gray-300 hover:text-white">
                Physique
              </Link>
              <Link to="/teachers?subject=SVT" className="text-gray-300 hover:text-white">
                SVT
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-4">Contact</h3>
            <address className="text-sm text-gray-300 not-italic">
              <p>Email: contact@tuteur-adom.fr</p>
              <p>Téléphone: 01 23 45 67 89</p>
              <p>Adresse: 123 Rue de l'Éducation, 75000 Paris</p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {currentYear} Tuteur-Adom. Tous droits réservés.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/terms" className="hover:text-white">
              Conditions d'utilisation
            </Link>
            <Link to="/privacy" className="hover:text-white">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 