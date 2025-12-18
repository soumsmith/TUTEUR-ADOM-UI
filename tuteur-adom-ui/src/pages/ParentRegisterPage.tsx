import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import ParentRegistrationForm from '../components/auth/ParentRegistrationForm';
import type { RootState } from '../redux/store';
import {
  Users,
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  MapPin,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Target,
  Star,
  Heart,
  Home,
  Shield,
  Calendar,
  MessageCircle,
  Search,
  Filter,
  BookMarked,
  Zap,
  // Child
} from 'lucide-react';

const ParentRegisterPage = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else if (user.role === 'parent') {
        navigate('/parent/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Déjà inscrit ?</span>
            <Link 
              to="/login" 
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* En-tête principal */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Inscrivez-vous en tant que<span className="block text-emerald-600 dark:text-emerald-400">Parent Tuteur-Adom</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Trouvez les meilleurs enseignants pour accompagner la réussite scolaire de vos enfants
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Statistiques et avantages */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  <Heart className="inline-block w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                  Pour les parents comme vous
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                      <Search className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">500+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Professeurs vérifiés</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                      <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">30+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Matières disponibles</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                      <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">4.8/5</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Note moyenne</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                      {/* <Child className="w-6 h-6 text-purple-600 dark:text-purple-400" /> */}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">2K+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Élèves accompagnés</div>
                    </div>
                  </div>
                </div>

                {/* Témoignage */}
                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">T</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                          "Grâce à Tuteur-Adom, mes deux enfants ont retrouvé confiance en eux. Leurs résultats se sont nettement améliorés !"
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Thomas, Père de deux enfants</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire principal */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* En-tête formulaire */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Créez votre compte parent</h2>
                      <p className="text-emerald-100">Trouvez le professeur idéal en quelques minutes</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">Rapide et simple</span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <ParentRegistrationForm />
                </div>
              </div>
            </div>
          </div>

          {/* Avantages pour les parents */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Les avantages pour votre famille
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Donnez à vos enfants les meilleures chances de réussite
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="inline-flex p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg mb-4">
                  <Filter className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sélection rigoureuse</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Tous nos enseignants sont vérifiés, diplômés et expérimentés
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-4">
                  <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Suivi personnalisé</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Recevez des rapports réguliers sur les progrès de votre enfant
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="inline-flex p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg mb-4">
                  <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Flexibilité totale</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Choisissez les horaires qui conviennent à votre emploi du temps
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="inline-flex p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg mb-4">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Paiement sécurisé</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Payez uniquement après chaque cours avec satisfaction garantie
                </p>
              </div>
            </div>
          </div>

          {/* Processus de recherche */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Trouvez le professeur idéal en 3 étapes
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Un processus simple et efficace pour votre tranquillité d'esprit
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">1</span>
                  </div>
                  <div className="absolute -right-4 top-6 hidden md:block">
                    <div className="w-8 h-0.5 bg-emerald-300 dark:bg-emerald-700"></div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Créez votre profil</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Inscrivez-vous et décrivez les besoins scolaires de vos enfants
                </p>
              </div>

              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">2</span>
                  </div>
                  <div className="absolute -right-4 top-6 hidden md:block">
                    <div className="w-8 h-0.5 bg-blue-300 dark:bg-blue-700"></div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Trouvez des professeurs</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Parcourez notre catalogue et comparez les profils
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Commencer les cours</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Réservez un cours d'essai et suivez les progrès
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-sm">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Première heure offerte</span> pour tout nouveau parent inscrit
                </span>
              </div>
            </div>
          </div>

          {/* FAQ Rapide */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                  Questions fréquentes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Combien coûte une heure de cours ?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Les tarifs varient selon les professeurs (entre 10 000 et 25 000 FCFA/h). Vous pouvez filtrer par budget.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Comment se déroule un cours ?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      En ligne via notre plateforme ou en présentiel selon votre préférence et celle du professeur.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Puis-je changer de professeur ?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Oui, à tout moment si le professeur ne correspond pas à vos attentes.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Y a-t-il un engagement ?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Aucun engagement à long terme. Vous payez uniquement les cours effectués.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Besoin d'aide pour choisir ? <a href="/contact" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Nos conseillers vous accompagnent</a>
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <a href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">Confidentialité</a>
                  <span>•</span>
                  <a href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">Conditions</a>
                  <span>•</span>
                  <a href="/help" className="hover:text-gray-700 dark:hover:text-gray-300">Aide</a>
                  <span>•</span>
                  <a href="/faq" className="hover:text-gray-700 dark:hover:text-gray-300">FAQ</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default ParentRegisterPage;