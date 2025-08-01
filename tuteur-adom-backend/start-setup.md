# Configuration et Démarrage - Tuteur à Dom Backend

## Prérequis

### 1. Installation de MySQL
Assurez-vous d'avoir MySQL installé et configuré :

#### Windows
- Téléchargez MySQL Community Server depuis : https://dev.mysql.com/downloads/mysql/
- Installez avec les paramètres par défaut
- Assurez-vous que le service MySQL démarre automatiquement

#### macOS
```bash
brew install mysql
brew services start mysql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Configuration MySQL
Connectez-vous à MySQL et créez la base de données (optionnel, elle sera créée automatiquement) :

```sql
mysql -u root -p
CREATE DATABASE IF NOT EXISTS tuteur_adom;
EXIT;
```

## Démarrage de l'application

### 1. Se placer dans le bon répertoire
```bash
cd tuteur-adom-backend
```

### 2. Lancer l'application
```bash
mvn clean compile quarkus:dev
```

L'application sera accessible sur `http://localhost:8484`

## Vérification

### Test des endpoints
```bash
# Tester la liste des professeurs
curl http://localhost:8484/api/teachers

# Tester la documentation API
# Ouvrir http://localhost:8484/q/swagger-ui/ dans votre navigateur
```

### Test de connexion frontend
Assurez-vous que le frontend React (port 5173) peut maintenant se connecter au backend (port 8484).

## Dépannage

### Erreur de connexion MySQL
Si vous obtenez une erreur de connexion à MySQL :

1. Vérifiez que MySQL est démarré :
   ```bash
   # Windows
   net start mysql
   
   # macOS/Linux
   sudo systemctl status mysql
   ```

2. Vérifiez les paramètres de connexion dans `application.properties`
3. Testez la connexion manuellement :
   ```bash
   mysql -u root -p -h localhost
   ```

### Port 8484 déjà utilisé
Si le port 8484 est occupé, modifiez `quarkus.http.port` dans `application.properties`

### Erreur de compilation
Assurez-vous d'avoir Java 17+ et Maven 3.8+ installés :
```bash
java -version
mvn -version
``` 