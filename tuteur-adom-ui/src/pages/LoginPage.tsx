import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginForm from '../components/auth/LoginForm';
import type { RootState } from '../redux/store';
import {
  BookOpen,
  GraduationCap,
  Shield,
  Sparkles,
  Users,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Home,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Target,
  Star,
  Clock
} from 'lucide-react';

const LoginPage = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirection automatique après connexion
  useEffect(() => {
    if (isAuthenticated && user) {
      const state = location.state as { from?: string };
      const from = state?.from || getDashboardPathForRole(user.role);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);
  
  const getDashboardPathForRole = (role: string): string => {
    switch (role) {
      case 'teacher':
        return '/teacher/dashboard';
      case 'parent':
        return '/parent/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4">
        {/* Carte unique */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl  overflow-hidden">
          {/* En-tête */}
          

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Section gauche - Informations et avantages (cachée sur mobile, en bas sur desktop) */}
            <div className="p-8 lg:p-12 order-2 lg:order-1 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800">
              <div className="hidden lg:block">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Pourquoi rejoindre<span className="block text-blue-600 dark:text-blue-400">Tutoria ?</span>
                </h2>
              </div>

              {/* Avantages */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                    <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Large communauté</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Connectez-vous avec des milliers d'étudiants et professeurs
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Résultats garantis</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Améliorez vos résultats avec nos enseignants certifiés
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Flexibilité totale</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Cours en ligne ou à domicile, selon vos disponibilités
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">500+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Professeurs</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl">
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">2K+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Étudiants</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">98%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Satisfaction</div>
                </div>
              </div>

              {/* Témoignage */}
              <div className="bg-gray-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">M</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      "Tutoria a révolutionné l'apprentissage de mes enfants. Les résultats ont été visibles dès le premier mois !"
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Marie D., Parent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section droite - Formulaire de connexion (en premier sur mobile) */}
            <div className="p-8 lg:p-12 order-1 lg:order-2">
              {/* En-tête formulaire */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Connexion
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Accédez à votre espace personnel
                </p>
              </div>

              {/* Badges de rôle */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                  <GraduationCap className="w-3 h-3" />
                  <span className="text-xs font-medium">Enseignant</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full">
                  <Users className="w-3 h-3" />
                  <span className="text-xs font-medium">Parent</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full">
                  <Shield className="w-3 h-3" />
                  <span className="text-xs font-medium">Admin</span>
                </div>
              </div>

              {/* Titre mobile pour avantages */}
              <div className="lg:hidden mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Rejoignez notre communauté</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Plateforme sécurisée</span>
                  <span className="mx-2">•</span>
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Support 7j/7</span>
                </div>
              </div>

              {/* Formulaire */}
              <div className="mb-6">
                <LoginForm />
              </div>

              {/* Ligne de séparation */}
              <div className="flex items-center mb-6">
                <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                <div className="px-4 text-gray-500 dark:text-gray-400 text-sm">Pas encore inscrit ?</div>
                <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
              </div>

              {/* Bouton inscription */}
              <div className="text-center mb-8">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg font-medium transition-all duration-200 group"
                >
                  <UserPlus className="w-4 h-4" />
                  Créer un compte gratuitement
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Footer sécurisé */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                  <Lock className="w-3 h-3" />
                  <span>Connexion sécurisée</span>
                  <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <CheckCircle className="w-3 h-3 text-green-500 dark:text-green-400" />
                  <span>SSL 256-bit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer de la carte */}
          <div className="bg-gray-50 dark:bg-gray-900/50 px-8 py-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Besoin d'aide ? <a href="/help" className="text-blue-600 dark:text-blue-400 hover:underline">Contactez notre support</a>
              </p>
              <div className="flex items-center gap-4">
                <a href="/privacy" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Confidentialité
                </a>
                <a href="/terms" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Conditions
                </a>
                <a href="/help" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Aide
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;