import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Section Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
                Trouvez l'enseignant idéal pour votre réussite
              </h1>
              <p className="text-xl mb-8 text-white drop-shadow">
                Des cours particuliers de qualité, à domicile ou en ligne, pour progresser rapidement dans toutes les matières.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/teachers"
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-blue-50 shadow-lg"
                >
                  Trouver un enseignant
                </Link>
                <Link
                  to="/register/teacher"
                  className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-800 shadow-lg"
                >
                  Devenir enseignant
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/img/hero-teacher.svg"
                alt="Enseignement personnalisé"
                className="w-full max-w-md mx-auto drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Un processus simple pour trouver le parfait enseignant adapté à vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trouvez votre enseignant</h3>
              <p className="text-gray-600">
                Parcourez les profils des enseignants, filtrez par matière, tarif et lieu d'enseignement.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Demandez un cours</h3>
              <p className="text-gray-600">
                Envoyez une demande à l'enseignant en précisant vos besoins et disponibilités.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Commencez à apprendre</h3>
              <p className="text-gray-600">
                Un administrateur organise votre premier cours. Progressez à votre rythme !
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/teachers"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Explorer les enseignants
            </Link>
          </div>
        </div>
      </section>

      {/* Section Matières */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos matières</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Des enseignants qualifiés dans toutes les matières pour tous les niveaux
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Mathématiques', 'Français', 'Anglais', 'Histoire', 'Géographie', 'Physique', 
              'Chimie', 'SVT', 'Philosophie', 'Économie', 'Informatique', 'Musique'].map((subject) => (
              <Link 
                key={subject}
                to={`/teachers?subject=${subject}`} 
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <h3 className="text-gray-900 font-medium">{subject}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi choisir Tuteur-Adom ?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une plateforme pensée pour la réussite et la facilité d'utilisation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enseignants vérifiés</h3>
              <p className="text-gray-600">
                Tous nos enseignants sont sélectionnés rigoureusement pour garantir des cours de qualité.
              </p>
            </div>

            <div className="p-6">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexibilité</h3>
              <p className="text-gray-600">
                Choisissez entre des cours à domicile, chez l'enseignant ou en ligne selon vos préférences.
              </p>
            </div>

            <div className="p-6">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Support personnalisé</h3>
              <p className="text-gray-600">
                Notre équipe d'administrateurs organise vos rendez-vous et assure un suivi de qualité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Appel à l'action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à améliorer vos compétences ?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Rejoignez notre communauté et commencez à progresser dès aujourd'hui avec nos enseignants qualifiés.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/teachers"
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
            >
              Trouver un enseignant
            </Link>
            <Link
              to="/register/parent"
              className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-800"
            >
              S'inscrire comme parent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;