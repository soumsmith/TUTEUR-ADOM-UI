import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const themeMode = useSelector((state: any) => state.theme.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMenuOpen(false);
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };
  
  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-sm mb-5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">Tuteur-Adom</span>
              </Link>
              
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <Link 
                  to="/" 
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600"
                >
                  Accueil
                </Link>
                <Link 
                  to="/teachers" 
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600"
                >
                  Enseignants
                </Link>
                {isAuthenticated && user?.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-300 dark:hover:border-blue-700 bg-blue-50 dark:bg-blue-900/30 rounded-md px-3"
                  >
                    <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Administration
                  </Link>
                )}
              </nav>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {/* Bouton de basculement du thème */}
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={`Passer en mode ${themeMode === 'light' ? 'sombre' : 'clair'}`}
              >
                {themeMode === 'light' ? (
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              
              {isAuthenticated ? (
                <div className="relative ml-3">
                  <div>
                    <button
                      onClick={toggleMenu}
                      className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">Ouvrir le menu utilisateur</span>
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white">
                        {user?.firstName?.charAt(0) || 'U'}
                      </span>
                      <span className="ml-2 text-gray-700 dark:text-gray-200">{user?.firstName} {user?.lastName}</span>
                      <svg className="ml-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  {menuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-10">
                      {user?.role === 'teacher' && (
                        <Link
                          to="/teacher/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => setMenuOpen(false)}
                        >
                          Tableau de bord
                        </Link>
                      )}
                      
                      {user?.role === 'parent' && (
                        <Link
                          to="/parent/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => setMenuOpen(false)}
                        >
                          Tableau de bord
                        </Link>
                      )}
                      
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium border-l-4 border-blue-500"
                          onClick={() => setMenuOpen(false)}
                        >
                          <div className="flex items-center">
                            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Administration
                          </div>
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Connexion
                  </Link>
                  <Link 
                    to="/register" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
            
            <div className="-mr-2 flex items-center md:hidden">
              {/* Bouton de basculement du thème - version mobile */}
              <button
                onClick={handleThemeToggle}
                className="p-2 mr-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={`Passer en mode ${themeMode === 'light' ? 'sombre' : 'clair'}`}
              >
                {themeMode === 'light' ? (
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Ouvrir le menu principal</span>
                <svg 
                  className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg 
                  className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Menu mobile */}
        <div className={`${menuOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-800`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/teachers"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Enseignants
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center">
                  <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Administration
                </div>
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {isAuthenticated ? (
              <div>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white">
                      {user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">{user?.firstName} {user?.lastName}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {user?.role === 'teacher' && (
                    <Link
                      to="/teacher/dashboard"
                      className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setMenuOpen(false)}
                    >
                      Tableau de bord
                    </Link>
                  )}
                  
                  {user?.role === 'parent' && (
                    <Link
                      to="/parent/dashboard"
                      className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setMenuOpen(false)}
                    >
                      Tableau de bord
                    </Link>
                  )}
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-base font-medium text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Administration
                      </div>
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1 px-4">
                <Link
                  to="/login"
                  className="block text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block text-base font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-4 py-2 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;