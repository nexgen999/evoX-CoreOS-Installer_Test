# nexgen — GitHub Portfolio

Portfolio personnel **100 % statique**, pensé pour GitHub Pages et piloté par plusieurs fichiers JSON.

## ✨ Fonctionnalités

- 🧑 Avatar GitHub configurable
- 🔗 Réseaux sociaux dans `config/socials.json`
- 🗂️ Catégories dans `config/categories.json`
- 📦 Projets dans `config/projects.json`
- 🎨 Couleurs + Google Fonts dans `config/theme.json`
- 🧩 Vues `cards`, `compact`, `list`, `masonry`
- ↔️ Défilement horizontal des projets dans chaque catégorie
- ✨ Animations et effets dans `config/effects.json`
- 🖼️ Une ou plusieurs images par projet
- 🔗 Dépôt GitHub + site GitHub Pages ou autre URL
- 📱 Responsive desktop / tablette / mobile
- 🚫 Aucune colonne de droite : toute la largeur est disponible pour les projets

## 🚀 Installation

Déposez le contenu du dossier à la racine d'un dépôt GitHub Pages.

La page d'entrée est :

```text
index.html
```

Les fichiers sont volontairement séparés :

```text
config/
  site.json
  profile.json
  socials.json
  categories.json
  projects.json
  theme.json
  views.json
  effects.json

web/
  css/style.css
  js/app.js

assets/
  nexgen-logo.png
```

## 📝 Ajouter un projet

Ouvrez `config/projects.json` et copiez un bloc :

```json
{
  "id": "mon-projet",
  "name": "Mon projet",
  "categories": ["web-store"],
  "description": "Description courte du projet.",
  "images": [
    "https://mon-site/image-1.jpg",
    "https://mon-site/image-2.jpg"
  ],
  "tags": ["Web", "Open Source"],
  "github": "https://github.com/nexgen999/mon-projet",
  "website": "https://nexgen999.github.io/mon-projet/",
  "featured": true
}
```

### Plusieurs catégories

Un même projet peut appartenir à plusieurs catégories :

```json
"categories": ["systems", "web-store", "utilities"]
```

Il apparaîtra alors dans chacune d'elles.

## 🖼️ Images

`images` accepte une ou plusieurs URL :

```json
"images": [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg"
]
```

Pour une utilisation hors ligne, vous pouvez aussi mettre vos fichiers dans `assets/` :

```json
"images": ["assets/projects/mon-projet.jpg"]
```

La première image est utilisée comme miniature. Le système est déjà prévu pour faire évoluer les cartes vers une galerie.

## 🎨 Icônes

Les icônes sont configurables sans modifier le JavaScript.

### Font Awesome

```json
"icon": {
  "type": "fa",
  "value": "fa-solid fa-globe"
}
```

### Image / URL

```json
"icon": {
  "type": "image",
  "value": "https://cdn.simpleicons.org/github"
}
```

Cela permet d'utiliser Icons8, Simple Icons, Dashboard Icons ou n'importe quel hébergement d'image autorisant l'affichage distant.

### Emoji

```json
"icon": {
  "type": "emoji",
  "value": "🎮"
}
```

## 🔤 Polices

Modifiez `config/theme.json` :

```json
"google": {
  "enabled": true,
  "families": [
    "Inter:wght@400;500;600;700;800",
    "Orbitron:wght@500;600;700"
  ]
}
```

Vous pouvez changer les familles Google Fonts et les deux familles CSS utilisées par le site.

## 🌐 Réseaux sociaux

Dans `config/socials.json` :

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

Pour Icons8 / Dashboard Icons / une autre source :

```json
"icon": {
  "type": "image",
  "value": "https://..."
}
```

## ⚙️ Effets

Tout est regroupé dans `config/effects.json` :

- apparition au scroll
- glow
- déplacement des cartes au survol
- zoom des images
- halo autour du curseur
- scroll horizontal
- respect de `prefers-reduced-motion`

## 🔧 Prochaine évolution facile

Le moteur peut être étendu sans casser les configurations actuelles pour ajouter :

- page détaillée d'un projet
- vraie galerie multi-images
- recherche
- filtres par tags
- groupes de projets liés
- badges GitHub
- import automatique de dépôts via l'API GitHub
- pages de catégories dédiées
- fichiers Markdown comme documentation
- système de thèmes supplémentaires
