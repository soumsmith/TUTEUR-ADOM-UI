-- Insertion d'un admin (d'abord dans users, puis dans admins à cause de l'héritage JOINED)
INSERT INTO users (id, email, password, first_name, last_name, role) VALUES (1, 'admin@tuteur-adom.com', 'admin123', 'Admin', 'System', 'ADMIN');

INSERT INTO admins (id, position) VALUES (1, 'Administrateur principal');

-- Insertion de professeurs (d'abord dans users, puis dans teachers à cause de l'héritage JOINED)
-- Insertion des utilisateurs de base
INSERT INTO users (id, email, password, first_name, last_name, role) VALUES 
(2, 'marie.dupont@email.com', 'password123', 'Marie', 'Dupont', 'TEACHER'),
(3, 'jean.martin@email.com', 'password123', 'Jean', 'Martin', 'TEACHER'),
(4, 'sophie.bernard@email.com', 'password123', 'Sophie', 'Bernard', 'TEACHER'),
(7, 'lucas.moreau@email.com', 'password123', 'Lucas', 'Moreau', 'TEACHER'),
(8, 'elena.garcia@email.com', 'password123', 'Elena', 'Garcia', 'TEACHER'),
(9, 'thomas.dubois@email.com', 'password123', 'Thomas', 'Dubois', 'TEACHER'),
(10, 'camille.rousseau@email.com', 'password123', 'Camille', 'Rousseau', 'TEACHER'),
(11, 'antoine.lefevre@email.com', 'password123', 'Antoine', 'Lefèvre', 'TEACHER'),
(12, 'marie.claire@email.com', 'password123', 'Marie-Claire', 'Petit', 'TEACHER'),
(13, 'david.simon@email.com', 'password123', 'David', 'Simon', 'TEACHER'),
(14, 'laura.vincent@email.com', 'password123', 'Laura', 'Vincent', 'TEACHER'),
(15, 'nicolas.blanc@email.com', 'password123', 'Nicolas', 'Blanc', 'TEACHER'),
(16, 'soumsmith1@gmail.com', 'password123', 'Moustapha', 'SOUMAHORO', 'TEACHER'),
(17, 'labite@gmail.com', 'password123', 'Labité', 'Ismael', 'TEACHER');

-- Insertion des données spécifiques aux teachers (tarifs en Francs CFA)
INSERT INTO teachers (id, subject, hourly_rate, skills, bio, cv_url, status, rating) VALUES 
(2, 'Mathématiques - Niveau Collège', 16000.00, 'Algèbre, Géométrie, Trigonométrie', 'Professeure de mathématiques avec 10 ans d''expérience. Spécialisée dans l''aide aux élèves en difficulté.', NULL, 'ACTIVE', 4.5),
(3, 'Français - Niveau Lycée', 14000.00, 'Littérature, Grammaire, Rédaction', 'Enseignant certifié en lettres modernes. Aide à la préparation du bac de français.', NULL, 'ACTIVE', 4.2),
(4, 'Anglais - Tous niveaux', 18000.00, 'Conversation, TOEFL, IELTS', 'Professeure bilingue franco-anglaise. Préparation aux examens internationaux.', NULL, 'ACTIVE', 4.8),
(7, 'Sciences Physiques - Collège/Lycée', 20000.00, 'Mécanique, Électricité, Optique, Thermodynamique', 'Docteur en physique, 8 ans d''expérience en enseignement. Spécialiste de la préparation aux concours scientifiques.', NULL, 'ACTIVE', 4.7),
(8, 'Espagnol - Tous niveaux', 15000.00, 'Conversation, Grammaire, Culture hispanique, DELE', 'Professeure native d''Espagne. Certifiée pour l''enseignement du DELE et la préparation aux examens officiels.', NULL, 'ACTIVE', 4.6),
(9, 'Histoire-Géographie - Collège/Lycée', 15000.00, 'Histoire contemporaine, Géopolitique, Cartographie', 'Agrégé d''histoire-géographie. Spécialisé dans la préparation du brevet et du baccalauréat.', NULL, 'ACTIVE', 4.3),
(10, 'Informatique - Programmation', 23000.00, 'Python, Java, JavaScript, Base de données, Algorithmique', 'Ingénieure informatique reconvertie dans l''enseignement. Spécialisée dans l''initiation à la programmation.', NULL, 'ACTIVE', 4.9),
(11, 'Chimie - Lycée', 17500.00, 'Chimie organique, Chimie minérale, Analyses, Préparation concours', 'Professeur certifié en sciences physiques, section chimie. 12 ans d''expérience.', NULL, 'ACTIVE', 4.4),
(12, 'Allemand - Collège/Lycée', 17000.00, 'Conversation, Grammaire, Goethe-Zertifikat, Culture allemande', 'Diplômée de l''université de Munich. Bilingue français-allemand.', NULL, 'ACTIVE', 4.5),
(13, 'Économie-Gestion - Lycée', 19000.00, 'Économie, Comptabilité, Management, Préparation BTS', 'Expert-comptable reconverti dans l''enseignement. Spécialisé dans les filières économiques.', NULL, 'ACTIVE', 4.1),
(14, 'Arts Plastiques - Tous niveaux', 13000.00, 'Dessin, Peinture, Sculpture, Histoire de l''art', 'Artiste professionnelle et professeure d''arts plastiques. Portfolio en ligne disponible.', NULL, 'ACTIVE', 4.8),
(15, 'Philosophie - Terminale', 16000.00, 'Méthodologie dissertation, Grands auteurs, Éthique', 'Professeur agrégé de philosophie. Spécialisé dans la préparation du bac philo.', NULL, 'PENDING', 0.0),
(16, 'Développeur Java', 15000.00, 'Java, Spring Boot, React, MySQL, Docker, Git, REST API', 'Développeur informatique passionné, je conçois et développe des applications web et mobiles performantes, sécurisées et évolutives. Fort d''une expérience de plusieurs années dans le développement full-stack, je maîtrise aussi bien les technologies front-end (React, Angular) que back-end (Java/Spring Boot, Node.js).', 'https://example.com/cvs/moustapha-soumahoro-cv.pdf', 'ACTIVE', 0.0),
(17, 'Informatique Développeur', 20000.00, 'Python, JavaScript, React, Node.js, MongoDB, API REST', 'Développeur full-stack passionné avec expertise en technologies modernes. Spécialisé dans le développement d''applications web interactives et dans l''enseignement de la programmation aux débutants.', 'https://example.com/cvs/labite-ismael-cv.pdf', 'ACTIVE', 0.0);

-- Insertion de lieux d'enseignement pour les professeurs
INSERT INTO teacher_locations (teacher_id, location) VALUES 
(2, 'ONLINE'), (2, 'HOME'),
(3, 'ONLINE'), (3, 'TEACHER_PLACE'),
(4, 'ONLINE'), (4, 'HOME'), (4, 'TEACHER_PLACE'),
(7, 'ONLINE'), (7, 'HOME'), (7, 'TEACHER_PLACE'),
(8, 'ONLINE'), (8, 'HOME'),
(9, 'ONLINE'), (9, 'TEACHER_PLACE'),
(10, 'ONLINE'), (10, 'TEACHER_PLACE'),
(11, 'ONLINE'), (11, 'HOME'),
(12, 'ONLINE'), (12, 'HOME'), (12, 'TEACHER_PLACE'),
(13, 'ONLINE'), (13, 'TEACHER_PLACE'),
(14, 'HOME'), (14, 'TEACHER_PLACE'),
(15, 'ONLINE'),
(16, 'ONLINE'), (16, 'HOME'), (16, 'TEACHER_PLACE'),
(17, 'ONLINE'), (17, 'HOME');

-- Insertion de parents (d'abord dans users, puis dans parents à cause de l'héritage JOINED)
INSERT INTO users (id, email, password, first_name, last_name, role) VALUES 
(5, 'pierre.durand@email.com', 'password123', 'Pierre', 'Durand', 'PARENT'),
(6, 'anne.leclerc@email.com', 'password123', 'Anne', 'Leclerc', 'PARENT'),
(18, 'roxane@gmail.com', 'password123', 'Roxane', 'Dico', 'PARENT');

INSERT INTO parents (id) VALUES (5), (6), (18);

-- Insertion d'enfants
INSERT INTO children (id, name, age, grade, parent_id) VALUES 
(1, 'Lucas Durand', 14, '3ème', 5),
(2, 'Emma Durand', 16, '1ère', 5),
(3, 'Léa Leclerc', 15, '2nde', 6);

-- Insertion de cours (tarifs en Francs CFA)
INSERT INTO courses (id, subject, description, hourly_rate, teacher_id, created_at) VALUES 
(1, 'Mathématiques - Niveau Collège', 'Soutien scolaire en mathématiques pour les élèves de collège. Aide aux devoirs et préparation aux contrôles.', 16000.00, 2, CURRENT_TIMESTAMP),
(2, 'Français - Niveau Lycée', 'Cours de français pour lycéens. Préparation au bac, aide à la rédaction et analyse littéraire.', 14000.00, 3, CURRENT_TIMESTAMP),
(3, 'Anglais - Conversation', 'Cours de conversation anglaise pour améliorer l''expression orale et la confiance.', 18000.00, 4, CURRENT_TIMESTAMP),
(4, 'Sciences Physiques - Terminale S', 'Préparation intensive au baccalauréat scientifique. Révisions et exercices pratiques.', 20000.00, 7, CURRENT_TIMESTAMP),
(5, 'Espagnol - Initiation', 'Cours d''espagnol pour débutants. Apprentissage des bases de la langue et de la culture.', 15000.00, 8, CURRENT_TIMESTAMP),
(6, 'Programmation Python - Débutant', 'Introduction à la programmation avec Python. Parfait pour les lycéens et étudiants.', 23000.00, 10, CURRENT_TIMESTAMP),
(7, 'Histoire - Préparation Brevet', 'Révisions d''histoire pour le brevet des collèges. Méthodologie et sujets types.', 15000.00, 9, CURRENT_TIMESTAMP),
(8, 'Arts Plastiques - Expression créative', 'Cours d''arts plastiques pour développer la créativité et les techniques artistiques.', 13000.00, 14, CURRENT_TIMESTAMP),
(9, 'Développement Web - JavaScript', 'Cours de développement web moderne avec JavaScript, HTML5 et CSS3. Pour débutants et intermédiaires.', 25000.00, 16, CURRENT_TIMESTAMP);

-- Insertion de lieux pour les cours
INSERT INTO course_locations (course_id, location) VALUES 
(1, 'ONLINE'), (1, 'HOME'),
(2, 'ONLINE'), (2, 'TEACHER_PLACE'),
(3, 'ONLINE'), (3, 'HOME'), (3, 'TEACHER_PLACE'),
(4, 'ONLINE'), (4, 'HOME'), (4, 'TEACHER_PLACE'),
(5, 'ONLINE'), (5, 'HOME'),
(6, 'ONLINE'), (6, 'TEACHER_PLACE'),
(7, 'ONLINE'), (7, 'HOME'),
(8, 'ONLINE'), (8, 'TEACHER_PLACE'), (8, 'HOME'),
(9, 'ONLINE'), (9, 'TEACHER_PLACE');

-- Insertion de demandes
INSERT INTO requests (id, parent_id, teacher_id, course_id, status, message, created_at) VALUES 
(1, 5, 2, 1, 'PENDING', 'Bonjour, mon fils Lucas a des difficultés en mathématiques. Pourriez-vous l''aider à se remettre à niveau ?', CURRENT_TIMESTAMP),
(2, 6, 4, 3, 'APPROVED', 'Ma fille aimerait améliorer son anglais oral avant un voyage à l''étranger.', CURRENT_TIMESTAMP),
(3, 5, 7, 4, 'PENDING', 'Ma fille Emma prépare son bac S et a besoin d''aide en physique-chimie.', CURRENT_TIMESTAMP),
(4, 6, 10, 6, 'APPROVED', 'Ma fille souhaite apprendre la programmation pour ses études supérieures.', CURRENT_TIMESTAMP);

-- Insertion de rendez-vous
INSERT INTO appointments (id, request_id, parent_id, teacher_id, date, start_time, end_time, location, status) VALUES 
(1, 2, 6, 4, '2025-02-01', '14:00:00', '15:00:00', 'ONLINE', 'SCHEDULED'),
(2, 4, 6, 10, '2025-02-03', '16:00:00', '17:30:00', 'ONLINE', 'SCHEDULED');

-- Insertion d'avis
INSERT INTO reviews (id, parent_id, teacher_id, rating, comment, created_at) VALUES 
(1, 6, 4, 5, 'Excellente professeure ! Ma fille a fait énormément de progrès en anglais.', CURRENT_TIMESTAMP),
(2, 5, 2, 4, 'Très patient et pédagogue. Mon fils comprend mieux les mathématiques maintenant.', CURRENT_TIMESTAMP),
(3, 6, 10, 5, 'Professeure d''informatique exceptionnelle. Ma fille a adoré apprendre Python.', CURRENT_TIMESTAMP),
(4, 5, 7, 4, 'Bon professeur de physique, explications claires et méthodiques.', CURRENT_TIMESTAMP); 