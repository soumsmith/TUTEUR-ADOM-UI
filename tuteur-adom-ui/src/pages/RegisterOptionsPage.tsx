import { Link } from 'react-router-dom';
import { 
  Users,
  GraduationCap,
  CheckCircle,
  Calendar,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  ChevronRight,
  Shield,
  Star,
  Clock,
  ArrowRight
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const RegisterOptionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <PageHeader 
          title="Rejoignez"
          subtitle="Choisissez votre profil pour commencer"
          iconColor="orange"
          showBadges={true}
        />
        </div>

        {/* Cartes de choix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          
          {/* Carte Parent */}
          <div className="group h-full">

            <div className="bg-white dark:bg-gray-800 rounded-2xl border-none overflow-hidden transition-all duration-200 group-hover:shadow-md h-full flex flex-col">
              
              {/* En-tête simplifiée */}
              <div className="bg-blue-100 dark:bg-blue-900/30 p-6 ">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Je suis parent</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Trouvez le professeur idéal pour votre enfant</p>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 flex-grow flex flex-col">
                {/* Avantages */}
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Enseignants vérifiés</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Profils certifiés et diplômes validés</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Horaires flexibles</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Cours à domicile ou en ligne</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Suivi des progrès</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rapports détaillés réguliers</p>
                    </div>
                  </li>
                </ul>

                {/* Statistiques */}
                <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">500+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Profs</div>
                  </div>
                  <div className="text-center border-x border-gray-200 dark:border-gray-700">
                    <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">2K+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Familles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">98%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Satisfait</div>
                  </div>
                </div>

                {/* Bouton CTA */}
                <div className="mt-auto">
                <Link
                  to="/register/parent"
                  className="block w-full text-center py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
                >
                  <div className="flex items-center justify-center gap-2">
                    Créer mon compte parent
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Carte Enseignant */}
          <div className="group h-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-none overflow-hidden transition-all duration-200 group-hover:shadow-md h-full flex flex-col">
              
              {/* En-tête simplifiée */}
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 ">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Je suis enseignant</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Partagez votre passion et gagnez un revenu</p>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 flex-grow flex flex-col">
                {/* Avantages */}
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Profil professionnel</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Mettez en valeur vos compétences</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Tarifs personnalisés</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Définissez vos propres prix</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Demandes qualifiées</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Recevez des offres ciblées</p>
                    </div>
                  </li>
                </ul>

                {/* Témoignage */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">P</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        "En 3 mois, j'ai déjà 12 élèves réguliers. La plateforme est intuitive !"
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pierre L., Prof de maths</p>
                    </div>
                  </div>
                </div>

                {/* Bouton CTA */}
                <div className="mt-auto">
                <Link
                  to="/register/teacher"
                  className="block w-full text-center py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors duration-200"
                >
                  <div className="flex items-center justify-center gap-2">
                    Créer mon compte enseignant
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section bas de page */}
        <div className="text-center space-y-6">
          {/* Déjà inscrit */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 max-w-md mx-auto">
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Vous avez déjà un compte ?
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg font-medium transition-all duration-200"
            >
              Se connecter
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Garanties */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Inscription gratuite</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-blue-500" />
              <span>En 2 minutes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-purple-500" />
              <span>Données sécurisées</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default RegisterOptionsPage;