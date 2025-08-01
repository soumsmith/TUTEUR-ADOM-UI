-- Insertion d'un admin
INSERT INTO users (id, email, password, first_name, last_name, role, user_type, position) VALUES (1, 'admin@tuteur-adom.com', 'admin123', 'Admin', 'System', 'ADMIN', 'ADMIN', 'Administrateur principal');

-- Insertion de professeurs
INSERT INTO users (id, email, password, first_name, last_name, role, user_type, subject, hourly_rate, skills, bio, status, rating) VALUES 
(2, 'marie.dupont@email.com', 'password123', 'Marie', 'Dupont', 'TEACHER', 'TEACHER', 'Mathématiques - Niveau Collège', 25.00, 'Algèbre, Géométrie, Trigonométrie', 'Professeure de mathématiques avec 10 ans d''expérience. Spécialisée dans l''aide aux élèves en difficulté.', 'ACTIVE', 4.5),
(3, 'jean.martin@email.com', 'password123', 'Jean', 'Martin', 'TEACHER', 'TEACHER', 'Français - Niveau Lycée', 22.00, 'Littérature, Grammaire, Rédaction', 'Enseignant certifié en lettres modernes. Aide à la préparation du bac de français.', 'ACTIVE', 4.2),
(4, 'sophie.bernard@email.com', 'password123', 'Sophie', 'Bernard', 'TEACHER', 'TEACHER', 'Anglais - Tous niveaux', 28.00, 'Conversation, TOEFL, IELTS', 'Professeure bilingue franco-anglaise. Préparation aux examens internationaux.', 'ACTIVE', 4.8);

-- Insertion de lieux d'enseignement pour les professeurs
INSERT INTO teacher_locations (teacher_id, location) VALUES 
(2, 'ONLINE'), (2, 'HOME'),
(3, 'ONLINE'), (3, 'TEACHER_PLACE'),
(4, 'ONLINE'), (4, 'HOME'), (4, 'TEACHER_PLACE');

-- Insertion de parents
INSERT INTO users (id, email, password, first_name, last_name, role, user_type) VALUES 
(5, 'pierre.durand@email.com', 'password123', 'Pierre', 'Durand', 'PARENT', 'PARENT'),
(6, 'anne.leclerc@email.com', 'password123', 'Anne', 'Leclerc', 'PARENT', 'PARENT');

-- Insertion d'enfants
INSERT INTO children (id, name, age, grade, parent_id) VALUES 
(1, 'Lucas Durand', 14, '3ème', 5),
(2, 'Emma Durand', 16, '1ère', 5),
(3, 'Léa Leclerc', 15, '2nde', 6);

-- Insertion de cours
INSERT INTO courses (id, subject, description, hourly_rate, teacher_id, created_at) VALUES 
(1, 'Mathématiques - Niveau Collège', 'Soutien scolaire en mathématiques pour les élèves de collège. Aide aux devoirs et préparation aux contrôles.', 25.00, 2, CURRENT_TIMESTAMP),
(2, 'Français - Niveau Lycée', 'Cours de français pour lycéens. Préparation au bac, aide à la rédaction et analyse littéraire.', 22.00, 3, CURRENT_TIMESTAMP),
(3, 'Anglais - Conversation', 'Cours de conversation anglaise pour améliorer l''expression orale et la confiance.', 28.00, 4, CURRENT_TIMESTAMP);

-- Insertion de lieux pour les cours
INSERT INTO course_locations (course_id, location) VALUES 
(1, 'ONLINE'), (1, 'HOME'),
(2, 'ONLINE'), (2, 'TEACHER_PLACE'),
(3, 'ONLINE'), (3, 'HOME'), (3, 'TEACHER_PLACE');

-- Insertion de demandes
INSERT INTO requests (id, parent_id, teacher_id, course_id, status, message, created_at) VALUES 
(1, 5, 2, 1, 'PENDING', 'Bonjour, mon fils Lucas a des difficultés en mathématiques. Pourriez-vous l''aider à se remettre à niveau ?', CURRENT_TIMESTAMP),
(2, 6, 4, 3, 'APPROVED', 'Ma fille aimerait améliorer son anglais oral avant un voyage à l''étranger.', CURRENT_TIMESTAMP);

-- Insertion de rendez-vous
INSERT INTO appointments (id, request_id, parent_id, teacher_id, date, start_time, end_time, location, status) VALUES 
(1, 2, 6, 4, '2025-02-01', '14:00:00', '15:00:00', 'ONLINE', 'SCHEDULED');

-- Insertion d'avis
INSERT INTO reviews (id, parent_id, teacher_id, rating, comment, created_at) VALUES 
(1, 6, 4, 5, 'Excellente professeure ! Ma fille a fait énormément de progrès en anglais.', CURRENT_TIMESTAMP),
(2, 5, 2, 4, 'Très patient et pédagogue. Mon fils comprend mieux les mathématiques maintenant.', CURRENT_TIMESTAMP); 