import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import TeacherRegistrationForm from '../components/auth/TeacherRegistrationForm';
import PageHeader from '../components/common/PageHeader';
import BackNavigation from '../components/common/BackNavigation';
import type { RootState } from '../redux/store';
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Clock,
  MapPin,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Target,
  Star,
  Globe,
  Home,
  FileText,
  Video,
  Calendar,
  Shield,
  DollarSign
} from 'lucide-react';

const TeacherRegisterPage = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
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
    <div className="max-w-7xl mx-auto px-4 min-h-screen ">
      <BackNavigation />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <PageHeader 
            title="Devenez enseignant"
            subtitle="Rejoignez notre communauté d'enseignants passionnés et partagez votre savoir avec des étudiants motivés"
            brandName=""
            // brandColor="blue"
            // iconColor="blue"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Statistiques */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8  dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
                  Rejoignez une communauté dynamique
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">2,500+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Étudiants actifs</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-3 bg-emerald-100 dark:bg-emerald-900 rounded-xl">
                      <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">15K+ FCFA</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Gains mensuels moyens</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-3 bg-amber-100 dark:bg-amber-900 rounded-xl">
                      <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">4.8/5</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Note moyenne des profs</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                      <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Taux de satisfaction</div>
                    </div>
                  </div>
                </div>

                {/* Témoignage */}
                <div className="mt-8 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
                  <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">S</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                          "Depuis que je donne des cours sur Tuteur-Adom, j'ai pu augmenter mes revenus de 40% tout en choisissant mes horaires."
                        </p>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">Sophie</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Professeur de Mathématiques</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire principal */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl  dark:border-gray-700 overflow-hidden">
                {/* En-tête formulaire */}
                <div className="bg-emerald-600 px-8 py-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Créez votre profil enseignant</h2>
                      <p className="text-blue-100">Complétez le formulaire pour commencer</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-600">Étape 1/2</span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <TeacherRegistrationForm />
                </div>
              </div>
            </div>
          </div>

          {/* Avantages pour les enseignants */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Pourquoi enseigner avec nous ?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Découvrez les avantages exclusifs réservés à nos enseignants
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8  dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all">
                <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900 rounded-xl mb-5">
                  <DollarSign className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Rémunération attractive</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Fixez vos propres tarifs et recevez des paiements sécurisés chaque semaine
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-8  dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all">
                <div className="inline-flex p-4 bg-emerald-100 dark:bg-emerald-900 rounded-xl mb-5">
                  <Calendar className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Flexibilité totale</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Choisissez vos horaires, vos matières et le nombre d'élèves que vous souhaitez accompagner
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-8  dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 transition-all">
                <div className="inline-flex p-4 bg-amber-100 dark:bg-amber-900 rounded-xl mb-5">
                  <Shield className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Support dédié</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Bénéficiez d'un accompagnement personnalisé et d'un support technique 7j/7
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-8  dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all">
                <div className="inline-flex p-4 bg-purple-100 dark:bg-purple-900 rounded-xl mb-5">
                  <Target className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Croissance garantie</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Développez votre réputation grâce à notre système d'avis et augmentez votre visibilité
                </p>
              </div>
            </div>
          </div>

          {/* Processus d'inscription */}
          <div className="bg-blue-50 dark:bg-blue-950 rounded-2xl p-10 mb-12 border-2 border-blue-200 dark:border-blue-800">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Comment ça marche ?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                En 3 étapes simples, commencez à donner des cours
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-white text-3xl font-bold">1</span>
                  </div>
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">Créez votre profil</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Remplissez votre profil avec vos compétences, expériences et diplômes
                </p>
              </div>

              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-white text-3xl font-bold">2</span>
                  </div>
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">Validez votre compte</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Notre équipe valide votre profil sous 48h maximum
                </p>
              </div>

              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-white text-3xl font-bold">3</span>
                  </div>
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">Commencez à enseigner</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Recevez vos premières demandes et commencez à donner des cours
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Vous avez des questions ? <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-semibold">Contactez notre équipe</a>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <a href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-200">Confidentialité</a>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <a href="/terms" className="hover:text-gray-900 dark:hover:text-gray-200">Conditions d'utilisation</a>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <a href="/help" className="hover:text-gray-900 dark:hover:text-gray-200">Centre d'aide</a>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <a href="/about" className="hover:text-gray-900 dark:hover:text-gray-200">À propos</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegisterPage;