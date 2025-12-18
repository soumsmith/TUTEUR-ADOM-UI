const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// URL de base du site
const BASE_URL = 'https://jthemes.net/themes/html/pintex/files/';

// Liste des fichiers CSS à télécharger
const cssFiles = [
  'css/bootstrap.min.css',
  'css/flaticon.css',
  'css/menu.css',
  'css/dropdown-effects/fade-down.css',
  'css/magnific-popup.css',
  'css/owl.carousel.min.css',
  'css/owl.theme.default.min.css',
  'css/lunar.css',
  'css/animate.css',
  'css/purple-theme.css',
  'css/blue-theme.css',
  'css/indigo-theme.css',
  'css/orchid-theme.css',
  'css/pink-theme.css',
  'css/skyblue-theme.css',
  'css/violet-red-theme.css',
  'css/responsive.css'
];

// Liste des fichiers JS à télécharger
const jsFiles = [
  'js/jquery-3.7.1.min.js',
  'js/bootstrap.min.js',
  'js/modernizr.custom.js',
  'js/jquery.easing.min.js',
  'js/jquery.appear.js',
  'js/menu.js',
  'js/owl.carousel.min.js',
  'js/imagesloaded.pkgd.min.js',
  'js/isotope.pkgd.min.js',
  'js/jquery.magnific-popup.min.js',
  'js/jquery.validate.min.js',
  'js/jquery.ajaxchimp.min.js',
  'js/popper.min.js',
  'js/lunar.js',
  'js/wow.js',
  'js/cookies-message.js',
  'js/custom.js',
  'js/changer.js',
  'js/styleswitch.js'
];

// Liste des images à télécharger
const imageFiles = [
  'images/app-logo-2.png',
  'images/app-logo-3.png',
  'images/app-logo-5.png',
  'images/app-logo-6.png',
  'images/app-logo-7.png',
  'images/logo.png',
  'images/logo-white.png',
  'images/img-22.jpg',
  'images/review-author-1.jpg',
  'images/review-author-2.jpg',
  'images/review-author-3.jpg',
  'images/review-author-4.jpg',
  'images/review-author-5.jpg',
  'images/review-author-6.jpg',
  'images/review-author-7.jpg',
  'images/review-author-8.jpg',
  'images/capterra.png',
  'images/capterra-dark.png',
  'images/trustpilot.png',
  'images/trustpilot-dark.png',
  'images/growd.png',
  'images/growd-dark.png',
  'images/favicon.ico',
  'images/apple-touch-icon-152x152.png',
  'images/apple-touch-icon-120x120.png',
  'images/apple-touch-icon-76x76.png',
  'images/apple-touch-icon.png',
  'images/color-scheme/blue.jpg',
  'images/color-scheme/pink.jpg',
  'images/color-scheme/orchid.jpg',
  'images/color-scheme/skyblue.jpg',
  'images/color-scheme/violet-red.jpg',
  'images/color-scheme/indigo.jpg'
];

// Liste des fonts à télécharger
const fontFiles = [
  'fonts/flaticon.woff2'
];

// Fonction pour télécharger un fichier
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    // Créer le dossier si il n'existe pas
    const dir = path.dirname(destination);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(destination);
    
    protocol.get(url, (response) => {
      // Suivre les redirections
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, destination)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✓ Téléchargé: ${path.basename(destination)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {}); // Supprimer le fichier en cas d'erreur
      reject(err);
    });
  });
}

// Fonction principale
async function downloadAll() {
  console.log('🚀 Début du téléchargement...\n');
  
  // Créer les dossiers principaux
  ['css', 'js', 'images', 'fonts', 'css/dropdown-effects', 'images/color-scheme'].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Télécharger tous les CSS
  console.log('📄 Téléchargement des fichiers CSS...');
  for (const file of cssFiles) {
    try {
      await downloadFile(BASE_URL + file, file);
    } catch (error) {
      console.error(`✗ Erreur pour ${file}:`, error.message);
    }
  }

  console.log('\n📜 Téléchargement des fichiers JS...');
  // Télécharger tous les JS
  for (const file of jsFiles) {
    try {
      await downloadFile(BASE_URL + file, file);
    } catch (error) {
      console.error(`✗ Erreur pour ${file}:`, error.message);
    }
  }

  console.log('\n🖼️  Téléchargement des images...');
  // Télécharger toutes les images
  for (const file of imageFiles) {
    try {
      await downloadFile(BASE_URL + file, file);
    } catch (error) {
      console.error(`✗ Erreur pour ${file}:`, error.message);
    }
  }

  console.log('\n🔤 Téléchargement des fonts...');
  // Télécharger toutes les fonts
  for (const file of fontFiles) {
    try {
      await downloadFile(BASE_URL + file, file);
    } catch (error) {
      console.error(`✗ Erreur pour ${file}:`, error.message);
    }
  }

  console.log('\n✅ Téléchargement terminé!');
  console.log('\nStructure créée:');
  console.log('├── css/');
  console.log('│   ├── dropdown-effects/');
  console.log('│   └── [fichiers CSS]');
  console.log('├── js/');
  console.log('│   └── [fichiers JS]');
  console.log('├── images/');
  console.log('│   ├── color-scheme/');
  console.log('│   └── [fichiers images]');
  console.log('└── fonts/');
  console.log('    └── [fichiers fonts]');
}

// Lancer le téléchargement
downloadAll().catch(console.error);