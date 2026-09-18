# nexgen — GitHub Portfolio 🚀

Portfolio personnel **statique, modulaire et configurable par JSON**, conçu pour GitHub Pages.

L'objectif est de pouvoir ajouter des dépôts, images, catégories, réseaux sociaux, thèmes, animations et documentation **sans modifier le HTML ni le JavaScript** dans les cas courants.

---

## ✨ Fonctionnalités

### 🧑 Profil
- Avatar GitHub configurable
- Nom, bio et statistiques
- Logo `nexgen`
- Réseaux sociaux configurables
- Icônes Font Awesome, image distante, URL, emoji

### 📦 Projets
- Dépôt GitHub
- Site web / GitHub Pages
- Une ou plusieurs images
- Galerie multi-images
- Description courte
- Description longue
- Tags
- Technologies
- Statut
- Année
- Projet mis en avant
- Projets liés
- Documentation associée
- Favoris

### 🔎 Recherche
Recherche globale sur :
- nom
- description
- description longue
- tags
- technologies

### 🏷️ Filtres
Les tags sont automatiquement détectés depuis `projects.json`.

Cliquer sur un tag filtre instantanément les projets.

### 🗂️ Catégories
Un projet peut appartenir à plusieurs catégories :

```json
"categories": ["systems", "web-store", "utilities"]
```

Il apparaît alors dans chacune d'elles.

Chaque catégorie peut avoir :
- nom
- description
- icône
- couleur
- ordre
- affichage sur l'accueil

### 📐 Vues

Quatre modes sont disponibles :

- `cards`
- `compact`
- `list`
- `masonry`

Le comportement est configurable dans :

```text
config/views.json
```

### ↔️ Défilement horizontal

Sur l'accueil, chaque catégorie possède sa propre rangée horizontale.

Les boutons :

```text
← →
```

permettent de parcourir les projets.

### 🖼️ Galerie

Un projet peut avoir autant d'images que nécessaire :

```json
"images": [
  "assets/projects/project-1.jpg",
  "assets/projects/project-2.jpg",
  "assets/projects/project-3.jpg"
]
```

La première image devient la miniature.

Toutes les autres sont disponibles dans la galerie.

### 🔗 Projets liés

```json
"related": [
  "evox-coreos",
  "evox-universal-store"
]
```

Les projets liés apparaissent automatiquement dans la fiche du projet.

Cela permet de représenter un véritable écosystème.

---

# 📁 Organisation

```text
/
├── index.html
├── README.md
├── .nojekyll
│
├── assets/
│   ├── nexgen-logo.png
│   └── projects/
│
├── config/
│   ├── site.json
│   ├── profile.json
│   ├── socials.json
│   ├── categories.json
│   ├── projects.json
│   ├── github-import.json
│   ├── theme.json
│   ├── views.json
│   ├── effects.json
│   ├── navigation.json
│   └── docs.json
│
├── docs/
│   ├── evox-coreos.md
│   └── xbox-infinity.md
│
└── web/
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

---

# 🧩 Configuration modulaire

## `config/site.json`

Réglages généraux :

```json
{
  "site_name": "nexgen",
  "title": "nexgen — Projects & Open Source",
  "language": "fr",
  "github_profile_url": "https://github.com/nexgen999",
  "default_view": "cards"
}
```

La section `features` permet d'activer ou désactiver les fonctionnalités.

---

# 🧑 `config/profile.json`

Tout ce qui concerne le profil :

```json
{
  "github_username": "nexgen999",
  "avatar_url": "https://github.com/nexgen999.png?size=256",
  "display_name": "nexgen",
  "bio": "Ma description",
  "profile_link": "https://github.com/nexgen999"
}
```

L'avatar peut être remplacé par n'importe quelle image :

```json
"avatar_url": "assets/avatar.png"
```

---

# 🌐 `config/socials.json`

Ajouter un réseau :

```json
{
  "id": "youtube",
  "label": "YouTube",
  "icon": {
    "type": "fa",
    "value": "fa-brands fa-youtube"
  },
  "url": "https://youtube.com/@moncompte",
  "enabled": true
}
```

## Font Awesome

```json
"icon": {
  "type": "fa",
  "value": "fa-brands fa-github"
}
```

## Image distante

Compatible avec :
- Icons8
- Dashboard Icons
- Simple Icons
- CDN personnel
- n'importe quelle URL d'image accessible

```json
"icon": {
  "type": "image",
  "value": "https://example.com/icon.png"
}
```

## Emoji

```json
"icon": {
  "type": "emoji",
  "value": "🎮"
}
```

---

# 🗂️ `config/categories.json`

Exemple :

```json
{
  "id": "homebrew",
  "name": "Homebrew",
  "description": "Mes projets homebrew.",
  "icon": {
    "type": "fa",
    "value": "fa-solid fa-gamepad"
  },
  "accent": "#25a9ff",
  "show_on_home": true,
  "order": 1
}
```

Les catégories sont entièrement indépendantes des projets.

---

# 📦 `config/projects.json`

C'est le fichier principal pour ajouter les dépôts.

Exemple complet :

```json
{
  "id": "mon-projet",
  "name": "Mon Projet",
  "categories": ["web-store", "utilities"],
  "description": "Description courte.",
  "long_description": "Description détaillée affichée dans la page du projet.",
  "images": [
    "assets/projects/project-1.jpg",
    "assets/projects/project-2.jpg"
  ],
  "tags": [
    "Web",
    "Open Source"
  ],
  "github": "https://github.com/nexgen999/mon-projet",
  "website": "https://nexgen999.github.io/mon-projet/",
  "featured": true,
  "status": "Active",
  "year": "2026",
  "related": [
    "evox-coreos"
  ],
  "technologies": [
    "HTML",
    "CSS",
    "JavaScript"
  ],
  "docs": [
    "docs/mon-projet.md"
  ]
}
```

---

# 🖼️ Images locales

Créer :

```text
assets/projects/
```

Puis :

```json
"images": [
  "assets/projects/mon-projet-1.jpg",
  "assets/projects/mon-projet-2.jpg"
]
```

C'est préférable si vous souhaitez que le portfolio reste indépendant de services externes.

---

# 📝 Documentation Markdown

La documentation est déclarée dans :

```text
config/docs.json
```

Exemple :

```json
{
  "id": "guide",
  "title": "Guide",
  "path": "docs/guide.md",
  "category": "Guides"
}
```

Les fichiers Markdown peuvent ensuite être ouverts directement depuis le site.

Les fiches projet peuvent également référencer leur propre documentation :

```json
"docs": [
  "docs/mon-projet.md"
]
```

Le moteur utilise Markdown pour afficher les documents.

---

# 🔗 README GitHub

La structure est également prête à être étendue pour récupérer automatiquement le README d'un dépôt GitHub via son API.

Cela permettrait d'afficher dans la fiche :

```text
Présentation
Installation
Utilisation
Documentation
```

sans recopier le contenu dans `projects.json`.

---

# 🏷️ Badges GitHub

Les fiches projet affichent automatiquement plusieurs informations lorsque le dépôt est renseigné :

- ⭐ stars
- dernier commit
- licence

Le système utilise des images de badges générées à partir du chemin du dépôt.

---

# 🤖 Import automatique GitHub

Le fichier :

```text
config/github-import.json
```

configure l'import.

```json
{
  "enabled": true,
  "username": "nexgen999",
  "include_forks": false,
  "include_archived": true,
  "auto_category": "other"
}
```

Depuis le bouton **Importer GitHub**, le portfolio interroge l'API publique GitHub.

Les dépôts peuvent être sélectionnés.

Ensuite :

```text
Exporter projects.json
```

génère :

```text
projects-imported.json
```

### Important

GitHub Pages est un hébergement statique.

Le navigateur ne peut donc pas modifier directement `config/projects.json` dans votre dépôt GitHub.

L'import fonctionne ainsi :

```text
GitHub API
    ↓
Portfolio
    ↓
Sélection
    ↓
Export JSON
    ↓
config/projects.json
```

Il suffit ensuite de remplacer le fichier JSON dans le dépôt.

---

# 🎨 Thèmes

Les thèmes sont centralisés dans :

```text
config/theme.json
```

Plusieurs thèmes sont déjà fournis :

- Neon Blue
- Purple Night
- Cyber Teal
- Amber Tech

Le visiteur peut changer de thème avec le bouton **Thème**.

Le choix est mémorisé dans `localStorage`.

---

# 🔤 Google Fonts

Exemple :

```json
"google": {
  "enabled": true,
  "families": [
    "Inter:wght@400;500;600;700;800",
    "Orbitron:wght@500;600;700"
  ]
}
```

Vous pouvez utiliser n'importe quelle famille disponible sur Google Fonts.

---

# ✨ Animations

`config/effects.json` permet de contrôler :

```json
{
  "reveal_on_scroll": true,
  "hover_lift": true,
  "hover_glow": true,
  "cursor_glow": true,
  "smooth_scroll": true,
  "category_scroll_buttons": true,
  "card_image_zoom": true,
  "parallax_hero": true,
  "page_transition": true,
  "button_ripple": true,
  "reduced_motion_respect": true
}
```

Les effets peuvent être désactivés individuellement.

---

# ⭐ Favoris

Les favoris sont enregistrés localement dans le navigateur.

Ils ne nécessitent aucune base de données.

Le visiteur peut :

```text
☆ Ajouter aux favoris
★ Retirer des favoris
```

et retrouver ses projets dans :

```text
Favoris
```

---

# 🔗 Partage d'un projet

Chaque projet possède une URL interne :

```text
#project/mon-projet
```

Exemple :

```text
https://nexgen999.github.io/portfolio/#project/evox-coreos
```

Le bouton **Partager** utilise l'API de partage du navigateur lorsque celle-ci est disponible.

Sinon, le lien peut être copié.

---

# 🧭 Navigation

`config/navigation.json` permet d'ajouter ou supprimer des rubriques.

Exemple :

```json
{
  "id": "contact",
  "label": "Contact",
  "icon": {
    "type": "fa",
    "value": "fa-solid fa-envelope"
  }
}
```

---

# 📱 Responsive

L'interface s'adapte automatiquement :

- grand écran
- ordinateur portable
- tablette
- smartphone

Sur mobile, la sidebar devient un menu coulissant.

---

# 🚀 GitHub Pages

1. Créer un dépôt.

2. Copier tous les fichiers.

3. Activer GitHub Pages.

4. Choisir la branche contenant :

```text
index.html
```

5. Ouvrir l'adresse GitHub Pages.

Aucun serveur Node.js ou PHP n'est nécessaire.

---

# ⚠️ Limitations GitHub Pages

GitHub Pages étant statique :

- les fichiers JSON sont lus côté navigateur ;
- l'API GitHub est appelée côté navigateur ;
- l'import ne peut pas écrire automatiquement dans GitHub ;
- les fichiers locaux doivent être connus à l'avance ;
- les services externes doivent autoriser les requêtes ou être chargés comme ressources.

Pour un import totalement automatique avec écriture directe dans le dépôt, il faudrait une GitHub Action ou une petite API backend.

---

# 🔮 Extensions faciles à ajouter

L'architecture permet encore d'ajouter facilement :

- API GitHub avec statistiques live
- nombre de stars live
- forks live
- issues
- releases
- languages
- contribution graph
- timeline des commits
- changelog automatique
- dernières releases
- téléchargement des releases
- recherche GitHub
- filtres par langage
- filtres par année
- filtres par statut
- tri par stars
- tri par date
- tri alphabétique
- mode chronologique
- mode timeline
- projets épinglés
- projets privés avec authentification
- plusieurs pages d'accueil
- pages de catégories indépendantes
- pages de tags
- système de collections
- groupes d'écosystèmes
- liens entre projets
- documentation par projet
- README GitHub automatique
- galerie vidéo
- YouTube / Vimeo
- changelog Markdown
- RSS du portfolio
- sitemap
- SEO dynamique
- Open Graph
- Twitter/X Cards
- favicon configurable
- PWA
- mode offline
- service worker
- raccourcis clavier
- commandes clavier
- partage social
- QR code de projet
- compteur de visites externe
- statistiques GitHub
- système de traduction FR/EN
- thèmes personnalisés
- palettes par catégorie
- arrière-plans personnalisés
- animations configurables
- curseur personnalisé

---

## 💡 Philosophie du projet

L'idée est de conserver une séparation claire :

```text
CONTENU
config/projects.json
config/categories.json
config/socials.json

APPARENCE
config/theme.json
config/views.json
config/effects.json

NAVIGATION
config/navigation.json
config/docs.json

MOTEUR
web/js/app.js
web/css/style.css

STRUCTURE
index.html
```

Ainsi, modifier le contenu ne nécessite normalement **aucune modification du moteur**.

---

## 📄 Licence

À personnaliser selon votre projet.
