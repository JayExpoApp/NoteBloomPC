# 🌸 NoteBloom Desktop — Application Windows/Mac/Linux

Application de notes moderne pour bureau, construite avec **Electron + React**.  
Interface 3 panneaux : Sidebar / Liste / Éditeur — thème sombre élégant.

---

## ✨ Fonctionnalités

- 📝 **Éditeur riche** — titre, contenu, emoji, couleur
- ✅ **Listes de tâches** — checklist avec progression en temps réel
- 📂 **8 Catégories** — Projet, Courses, RDV, Processus, Personnel, Idées, Voyage, Santé
- 🎯 **Priorités** — Faible / Moyen / Élevé
- 🏷️ **Tags** — organisation par étiquettes
- 📌 **Épinglage & Favoris**
- 📦 **Archive**
- 🔍 **Recherche** instantanée
- 💾 **Sauvegarde automatique** — toutes les 600ms
- ⌨️ **Raccourcis clavier** — Ctrl+N (nouvelle note)
- 🖥️ **Fenêtre native** — titlebar personnalisée, controls Windows
- 📊 **Statistiques** dans les paramètres

---

## 🚀 Lancer en développement

### Prérequis
- **Node.js** 18+ — [nodejs.org](https://nodejs.org)
- **npm** 9+

### Installation
```bash
cd NoteBloom-Desktop
npm install
```

### Démarrer l'app
```bash
npm start
```
Cela lance React sur le port 3000 puis ouvre Electron automatiquement.

---

## 📦 Générer le fichier .exe Windows

### EXE installateur (recommandé)
```bash
npm run build:win
```
Génère dans `dist/` :
- `NoteBloom Setup 1.0.0.exe` — installateur NSIS avec wizard
- `NoteBloom 1.0.0.exe` — version portable (aucune installation)

### Toutes les plateformes
```bash
npm run build        # Windows + Mac + Linux (selon l'OS courant)
npm run build:mac    # .dmg pour macOS
npm run build:linux  # .AppImage pour Linux
```

---

## 🏗️ Structure du projet

```
NoteBloom-Desktop/
├── electron/
│   ├── main.js          # Processus principal Electron
│   └── preload.js       # Bridge sécurisé IPC
│
├── src/
│   ├── App.tsx           # Composant racine + modal paramètres
│   ├── App.css
│   ├── index.tsx         # Point d'entrée React
│   ├── index.css         # Variables CSS globales + reset
│   │
│   ├── components/
│   │   ├── TitleBar.tsx  # Barre de titre custom avec boutons fenêtre
│   │   ├── Sidebar.tsx   # Panel gauche : navigation & filtres
│   │   ├── NoteList.tsx  # Panel central : liste des notes
│   │   └── NoteEditor.tsx # Panel droit : éditeur complet
│   │
│   ├── context/
│   │   └── NotesContext.tsx  # State global + notes démo
│   │
│   └── utils/
│       ├── types.ts      # Types TypeScript + config catégories
│       └── storage.ts    # Service stockage (electron-store / localStorage)
│
├── assets/
│   ├── icon.ico          # Icône Windows (multi-tailles)
│   ├── icon.png          # Icône Linux/général
│   ├── license.txt       # Licence pour l'installateur
│   └── installer.nsh     # Script NSIS personnalisé
│
├── public/
│   └── index.html        # Template HTML React
│
├── package.json          # Config npm + electron-builder
└── tsconfig.json         # Config TypeScript
```

---

## 🛠️ Technologies

| Technologie | Version | Usage |
|---|---|---|
| Electron | 31 | Runtime desktop natif |
| React | 18 | Interface utilisateur |
| TypeScript | 5.3 | Typage statique |
| electron-store | 8 | Stockage persistant JSON |
| electron-builder | 24 | Packaging EXE/DMG/AppImage |
| framer-motion | 11 | Animations |
| date-fns | 3 | Formatage des dates |
| lucide-react | 0.400 | Icônes SVG |
| uuid | 9 | Identifiants uniques |

---

## 🔒 Sécurité

- `contextIsolation: true` — isolation du contexte renderer
- `nodeIntegration: false` — pas d'accès Node.js direct dans le renderer
- `preload.js` — seul pont autorisé entre main et renderer via IPC
- CSP dans `index.html` — Content Security Policy stricte

---

## 📋 Données utilisateur

Les notes sont stockées localement dans :
- **Windows** : `%APPDATA%\NoteBloom\config.json`
- **macOS** : `~/Library/Application Support/NoteBloom/config.json`
- **Linux** : `~/.config/NoteBloom/config.json`

Aucune donnée n'est envoyée sur internet. 100% local.

---

## 🎨 Personnalisation

Modifiez les variables CSS dans `src/index.css` pour changer le thème :
```css
:root {
  --primary: #7c3aed;    /* Couleur principale */
  --bg1: #0f0f1a;        /* Fond de l'app */
  --text: #f0efff;       /* Texte principal */
}
```
