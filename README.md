# 🚀 evoX-CoreOS Installer

Bienvenue dans l'installateur automatique **evoX-CoreOS & WebUI** ! 

Ce projet a été conçu pour vous permettre de déployer votre propre environnement complet, votre boutique et votre interface web en quelques clics, **sans aucune connaissance technique requise**.

---

## 💡 Que va faire cet installateur ?

Lorsque vous lancerez l'installation, le robot d'automatisation (GitHub Action) va :
1. **Télécharger** la dernière version d'evoX-CoreOS et de sa WebUI.
2. **Créer** l'arborescence des dossiers et générer les fichiers nécessaires.
3. **Configurer** automatiquement le fichier `web/data/config.json` avec les liens et URL de **votre** dépôt.
4. **Nettoyer** le dépôt en effaçant les scripts d'installation pour vous laisser un projet 100 % propre.

---

## 📋 Prérequis importants avant de commencer

Avant de démarrer l'installation, il faut accorder les permissions d'écriture au robot GitHub Actions sur votre dépôt.

### 🔑 Étape 1 : Autoriser les droits d'écriture pour les Actions
1. Dans votre dépôt GitHub, cliquez sur l'onglet **⚙️ Settings** (Paramètres) tout en haut.
2. Dans le menu de gauche, allez dans **Actions** ➔ **General**.
3. Déroulez la page jusqu'à la section **Workflow permissions**.
4. Sélectionnez **Read and write permissions**.
5. Cliquez sur le bouton **Save** (Enregistrer).

> ⚠️ **Pourquoi cette étape ?** Cela permet au script d'installation de créer les fichiers et de supprimer l'installateur une fois le travail fini.

---

## ⚡ Étape 2 : Lancer l'installation (En 1 clic !)

1. En haut de votre dépôt, cliquez sur l'onglet **▶️ Actions**.
2. Dans le menu de gauche, sous *All workflows*, cliquez sur **evoX Auto Installer**.
3. À droite de l'écran, cliquez sur le bouton bleu **Run workflow**.
4. Cliquez sur le bouton vert **Run workflow** qui apparaît pour confirmer.

⏱️ **Patientez environ 1 à 2 minutes.**
Une encoche verte `✔` apparaîtra lorsque l'installation sera terminée. Si vous rafraîchissez la page d'accueil de votre dépôt, vous verrez que tous les fichiers du projet sont maintenant en place !

---

## 🌐 Étape 3 : Activer l'hébergement de votre WebUI (GitHub Pages)

Pour que votre interface web soit accessible en ligne gratuitement :

1. Retournez dans l'onglet **⚙️ Settings** de votre dépôt.
2. Dans le menu de gauche, cliquez sur **Pages** (dans la section *Code and automation*).
3. Dans la section **Build and deployment** :
   * **Source** : Laissez sur *Deploy from a branch*.
   * **Branch** : Choisissez `main` et laissez le dossier sur `/ (root)`.
4. Cliquez sur **Save**.

🌐 **Votre URL personnelle :**
Après 2 à 3 minutes, votre site web sera en ligne à l'adresse suivante :
`https://<votre-pseudo-github>.github.io/<nom-de-votre-depot>/`

---

## 🛠️ Utilisation quotidienne & Prochaines étapes

Une fois l'installation terminée, voici comment alimenter et mettre à jour votre environnement :

* **Ajouter des flux OPML** : Déposez vos fichiers de catégories `.opml` dans les sous-dossiers du répertoire `feed/` (`feed/apps`, `feed/payloads`, `feed/pkg`, etc.).
* **Ajouter des icônes/métadonnées** : Déposez vos images ou votre `pegasus_metadata.json` dans le dossier `assets/icon/`.
* **Mettre à jour la boutique** : Allez dans l'onglet **Actions** et lancez le workflow **Update Store** (`update.yml`). Le script régénèrera automatiquement les fichiers JSON et le site web.

---

> 💡 **Remarque :** Lors de l'installation, une copie de ce guide de démarrage reste sauvegardée dans le fichier `post_install_instruction.md` présent sur votre dépôt.