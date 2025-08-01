# Tuteur à Dom - Backend API

API REST pour la plateforme de tutorat à domicile développée avec Quarkus.

## Démarrage rapide

### Prérequis
- Java 17+
- Maven 3.8+

### Lancement de l'application

```bash
cd tuteur-adom-backend
mvn clean compile quarkus:dev
```

L'application sera accessible sur `http://localhost:8484`

## Documentation API

### Swagger UI
La documentation interactive de l'API est disponible sur : `http://localhost:8484/q/swagger-ui/`

### Endpoints principaux

#### Authentification (`/api/auth`)
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register/teacher` - Inscription professeur
- `POST /api/auth/register/parent` - Inscription parent

#### Professeurs (`/api/teachers`)
- `GET /api/teachers` - Liste des professeurs (avec filtres)
- `GET /api/teachers/{id}` - Détails d'un professeur
- `PUT /api/teachers/{id}` - Mise à jour profil professeur
- `PUT /api/teachers/{id}/status` - Mise à jour statut professeur

#### Cours (`/api`)
- `POST /api/teachers/{teacherId}/courses` - Créer un cours
- `GET /api/teachers/{teacherId}/courses` - Cours d'un professeur
- `PUT /api/courses/{courseId}` - Modifier un cours
- `DELETE /api/courses/{courseId}` - Supprimer un cours

#### Demandes (`/api/requests`)
- `POST /api/requests` - Créer une demande
- `GET /api/requests/parent/{parentId}` - Demandes d'un parent
- `GET /api/requests/teacher/{teacherId}` - Demandes pour un professeur
- `GET /api/requests/pending` - Demandes en attente
- `PUT /api/requests/{requestId}/status` - Mise à jour statut demande

#### Rendez-vous (`/api/appointments`)
- `POST /api/appointments` - Créer un rendez-vous
- `GET /api/appointments/parent/{parentId}` - Rendez-vous d'un parent
- `GET /api/appointments/teacher/{teacherId}` - Rendez-vous d'un professeur
- `PUT /api/appointments/{appointmentId}/status` - Mise à jour statut rendez-vous

## Configuration

### Base de données
L'application utilise MySQL. Assurez-vous d'avoir MySQL installé et en cours d'exécution.
- Base de données : `tuteur_adom` (créée automatiquement)
- Utilisateur : `root`
- Mot de passe : (vide par défaut)
- Port : `3306`

Les données de test sont chargées automatiquement au démarrage.

### CORS
Configuré pour accepter les requêtes depuis :
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server alternatif)

## Données de test

### Utilisateurs de test

**Admin :**
- Email: `admin@tuteur-adom.com`
- Mot de passe: `admin123`

**Professeurs :**
- Marie Dupont: `marie.dupont@email.com` / `password123`
- Jean Martin: `jean.martin@email.com` / `password123`
- Sophie Bernard: `sophie.bernard@email.com` / `password123`

**Parents :**
- Pierre Durand: `pierre.durand@email.com` / `password123`
- Anne Leclerc: `anne.leclerc@email.com` / `password123`

## Structure du projet

```
src/main/java/com/tuteurldom/
├── entity/          # Entités JPA
├── repository/      # Repositories Panache
├── resource/        # Endpoints REST
├── dto/            # Data Transfer Objects
└── service/        # Services métier
```

## Fonctionnalités

- ✅ Authentification utilisateur
- ✅ Gestion des professeurs
- ✅ Gestion des cours
- ✅ Système de demandes
- ✅ Gestion des rendez-vous
- ✅ Données de test pré-chargées
- ✅ Documentation API automatique
- ✅ Configuration CORS

## Technologies utilisées

- **Quarkus** - Framework Java natif
- **Hibernate ORM avec Panache** - ORM simplifié
- **RESTEasy Reactive** - API REST réactive
- **MySQL** - Base de données relationnelle
- **SmallRye OpenAPI** - Documentation API
- **Jackson** - Sérialisation JSON

## Connection avec le frontend

Le frontend React (sur le port 5173) peut maintenant se connecter au backend sur le port 8484. 

Pour tester la connexion, modifiez le fichier `tuteur-adom-ui/src/services/api.ts` et commentez la partie qui simule les erreurs réseau :

```javascript
// Commentez ces lignes pour utiliser le vrai backend
// if (process.env.NODE_ENV === 'development') {
//   await mockDelay();
//   throw new Error('Network Error - Le backend n\'est pas encore disponible. Utilisez les données mockées.');
// }
``` 