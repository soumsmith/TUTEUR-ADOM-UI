import { Link } from 'react-router-dom';

const RegisterOptionsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Créer un compte</h1>
        <p className="text-lg text-gray-600">
          Choisissez le type de compte que vous souhaitez créer
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Je suis un parent</h2>
              <p>Je cherche un enseignant pour mon enfant</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Trouvez des enseignants qualifiés</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Demandez des cours à domicile ou en ligne</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Suivez les progrès de votre enfant</span>
                </li>
              </ul>
              <Link
                to="/register/parent"
                className="block w-full text-center py-3 px-4 rounded-md shadow bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                S'inscrire comme parent
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Je suis un enseignant</h2>
              <p>Je souhaite donner des cours particuliers</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Créez votre profil professionnel</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Définissez vos tarifs et disponibilités</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Recevez des demandes de cours</span>
                </li>
              </ul>
              <Link
                to="/register/teacher"
                className="block w-full text-center py-3 px-4 rounded-md shadow bg-green-600 text-white font-medium hover:bg-green-700"
              >
                S'inscrire comme enseignant
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterOptionsPage; 