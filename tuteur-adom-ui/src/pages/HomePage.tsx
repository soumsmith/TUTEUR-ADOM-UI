import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Trouvez l'enseignant idéal pour votre réussite",
      description: "Des cours particuliers de qualité, à domicile ou en ligne, pour progresser rapidement dans toutes les matières.",
      image: "vite.svg",
      primaryButton: {
        text: "Trouver un enseignant",
        link: "/teachers"
      },
      secondaryButton: {
        text: "Devenir enseignant",
        link: "/register/teacher"
      },
      bgFrom: "from-blue-900",
      bgTo: "to-blue-700",
      darkFrom: "dark:from-blue-950",
      darkTo: "dark:to-blue-900",
      buttonTextColor: "text-blue-900",
      buttonHoverBg: "hover:bg-blue-50"
    },
    {
      title: "Apprenez à votre rythme avec des experts",
      description: "Profitez d'un accompagnement personnalisé adapté à vos besoins et objectifs d'apprentissage.",
      image: "react.svg",
      primaryButton: {
        text: "Découvrir nos enseignants",
        link: "/teachers"
      },
      secondaryButton: {
        text: "S'inscrire gratuitement",
        link: "/register"
      },
      bgFrom: "from-purple-900",
      bgTo: "to-purple-700",
      darkFrom: "dark:from-purple-950",
      darkTo: "dark:to-purple-900",
      buttonTextColor: "text-purple-900",
      buttonHoverBg: "hover:bg-purple-50"
    },
    {
      title: "Des résultats garantis pour tous les niveaux",
      description: "Plus de 1000 élèves satisfaits. Rejoignez notre communauté et atteignez vos objectifs académiques.",
      image: "react.svg",
      primaryButton: {
        text: "Voir les témoignages",
        link: "/teachers"
      },
      secondaryButton: {
        text: "Commencer maintenant",
        link: "/register"
      },
      bgFrom: "from-teal-900",
      bgTo: "to-teal-700",
      darkFrom: "dark:from-teal-950",
      darkTo: "dark:to-teal-900",
      buttonTextColor: "text-teal-900",
      buttonHoverBg: "hover:bg-teal-50"
    }
  ];


  const subjects = [
    {
      name: 'Mathématiques',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-50'
    },
    {
      name: 'Français',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
      hoverColor: 'hover:bg-purple-50'
    },
    {
      name: 'Anglais',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      color: 'bg-red-100',
      textColor: 'text-red-600',
      hoverColor: 'hover:bg-red-50'
    },
    {
      name: 'Histoire',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-amber-100',
      textColor: 'text-amber-600',
      hoverColor: 'hover:bg-amber-50'
    },
    {
      name: 'Géographie',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-100',
      textColor: 'text-green-600',
      hoverColor: 'hover:bg-green-50'
    },
    {
      name: 'Physique',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      hoverColor: 'hover:bg-yellow-50'
    },
    {
      name: 'Chimie',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: 'bg-teal-100',
      textColor: 'text-teal-600',
      hoverColor: 'hover:bg-teal-50'
    },
    {
      name: 'SVT',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      color: 'bg-lime-100',
      textColor: 'text-lime-600',
      hoverColor: 'hover:bg-lime-50'
    },
    {
      name: 'Philosophie',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      hoverColor: 'hover:bg-indigo-50'
    },
    {
      name: 'Économie',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-emerald-100',
      textColor: 'text-emerald-600',
      hoverColor: 'hover:bg-emerald-50'
    },
    {
      name: 'Informatique',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      color: 'bg-cyan-100',
      textColor: 'text-cyan-600',
      hoverColor: 'hover:bg-cyan-50'
    },
    {
      name: 'Musique',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      color: 'bg-pink-100',
      textColor: 'text-pink-600',
      hoverColor: 'hover:bg-pink-50'
    }
  ];

  // Tableau d'objets pour la section "Comment ça marche ?"
  const steps = [
    {
      number: "1",
      title: "Trouvez votre enseignant",
      description: "Parcourez les profils des enseignants, filtrez par matière, tarif et lieu d'enseignement.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      number: "2",
      title: "Demandez un cours",
      description: "Envoyez une demande à l'enseignant en précisant vos besoins et disponibilités.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      number: "3",
      title: "Commencez à apprendre",
      description: "Un administrateur organise votre premier cours. Progressez à votre rythme !",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    }
  ];

  const advantages = [
    {
      title: "Enseignants vérifiés",
      description: "Tous nos enseignants sont sélectionnés rigoureusement pour garantir des cours de qualité.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverEffect: "hover:bg-blue-100"
    },
    {
      title: "Flexibilité",
      description: "Choisissez entre des cours à domicile, chez l'enseignant ou en ligne selon vos préférences.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverEffect: "hover:bg-green-100"
    },
    {
      title: "Support personnalisé",
      description: "Notre équipe d'administrateurs organise vos rendez-vous et assure un suivi de qualité.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverEffect: "hover:bg-purple-100"
    },
    {
      title: "Prix compétitifs",
      description: "Des tarifs transparents sans frais cachés et des options de paiement flexibles.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      hoverEffect: "hover:bg-amber-100"
    },
    {
      title: "Suivi des progrès",
      description: "Bilans réguliers et ajustements du programme en fonction de votre évolution.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      hoverEffect: "hover:bg-teal-100"
    },
    {
      title: "Satisfaction garantie",
      description: "Premier cours d'essai gratuit et possibilité de changer d'enseignant si besoin.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      hoverEffect: "hover:bg-pink-100"
    }
  ];

  // Auto-play du slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change toutes les 5 secondes

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };


  return (
    <div className='max-w-7xl mx-auto px-4'>
      {/* Section Hero */}
      <div className="rounded-3xl mb-5 relative overflow-hidden min-h-[500px]">
    {/* Slides */}
    {heroSlides.map((slide, index) => (
      <section
        key={index}
        className={`text-white rounded-3xl transition-opacity duration-500 absolute inset-0 ${
          index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 z-0'
        } ${
          index === 0 
            ? 'bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-950 dark:to-blue-900' 
            : index === 1 
            ? 'bg-gradient-to-r from-purple-800 to-purple-600 dark:from-purple-900 dark:to-purple-700'
            : 'bg-gradient-to-r from-teal-800 to-teal-600 dark:from-teal-900 dark:to-teal-700'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-xl">
                {slide.title}
              </h1>
              <p className="text-xl mb-8 text-white/90 drop-shadow">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to={slide.primaryButton.link}
                  className={`inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-xl transition-colors ${
                    index === 0
                      ? 'text-blue-900 bg-white hover:bg-blue-50'
                      : index === 1
                      ? 'text-purple-900 bg-white hover:bg-purple-50'
                      : 'text-teal-900 bg-white hover:bg-teal-50'
                  }`}
                >
                  {slide.primaryButton.text}
                </Link>
                <Link
                  to={slide.secondaryButton.link}
                  className="inline-flex justify-center items-center px-6 py-3 border border-white/80 text-base font-medium rounded-md text-white hover:bg-white/10 shadow-xl transition-colors"
                >
                  {slide.secondaryButton.text}
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src={slide.image}
                width={300}
                alt="Enseignement personnalisé"
                className="w-2xl max-w-md mx-auto drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    ))}

    {/* Boutons de navigation */}
    <button
      onClick={prevSlide}
      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all z-10"
      aria-label="Slide précédent"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      onClick={nextSlide}
      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all z-10"
      aria-label="Slide suivant"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>

    {/* Indicateurs de slides */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
      {heroSlides.map((_, index) => (
        <button
          key={index}
          onClick={() => goToSlide(index)}
          className={`w-3 h-3 rounded-full transition-all ${
            index === currentSlide
              ? 'bg-white w-8'
              : 'bg-white/50 hover:bg-white/75'
          }`}
          aria-label={`Aller au slide ${index + 1}`}
        />
      ))}
    </div>
  </div>

      {/* Section Comment ça marche */}
      <section className="py-16 bg-white dark:bg-gray-800 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Comment ça marche ?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Un processus simple pour trouver le parfait enseignant adapté à vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-3xl text-center group ">
                <div className={`w-16 h-16 ${step.bgColor} ${step.textColor} rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/teachers"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-300"
            >
              Explorer les enseignants
            </Link>
          </div>
        </div>
      </section>

      {/* Section Matières */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 rounded-3xl my-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Nos matières</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Des enseignants qualifiés dans toutes les matières pour tous les niveaux
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {subjects.map((subject) => (
              <Link
                key={subject.name}
                to={`/teachers?subject=${subject.name}`}
                className={`bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xs hover:shadow-lg transition-all duration-300 text-center group ${subject.hoverColor}`}
              >
                <div className={`${subject.color} ${subject.textColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {subject.icon}
                </div>
                <h3 className="text-gray-900 dark:text-white font-medium text-sm">{subject.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="py-16 bg-white dark:bg-gray-800 rounded-3xl my-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pourquoi choisir Tuteur-Adom ?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Une plateforme pensée pour la réussite et la facilité d'utilisation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg transition-all duration-300 rounded-3xl ${advantage.bgColor} ${advantage.hoverEffect}`}
              >
                <div className={`${advantage.color} mb-4`}>
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{advantage.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Appel à l'action */}
      <section className="bg-blue-600 dark:bg-blue-800 text-white py-16 rounded-3xl my-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 dark:text-blue-200">Prêt à améliorer vos compétences ?</h2>
          <p className="text-xl mb-8 text-blue-100 dark:text-blue-200 max-w-3xl mx-auto">
            Rejoignez notre communauté et commencez à progresser dès aujourd'hui avec nos enseignants qualifiés.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/teachers"
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 dark:text-blue-900 bg-white hover:bg-blue-50 transition-colors"
            >
              Trouver un enseignant
            </Link>
            <Link
              to="/register/parent"
              className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors"
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