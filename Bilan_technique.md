# 📊 BILAN TECHNIQUE — VACHÉBO
*Application bilingue Français ↔ Espagnol — Juin 2026*
*Métriques revérifiées le 30/08/2026 (voir § 8 Historique)*

---

## 1. Vue d'ensemble

| Critère | Valeur |
|---|---|
| Architecture | SPA (Single Page App) — Vanilla JS ES2020, zéro dépendance |
| Hébergement | GitHub Pages (statique, HTTPS, gratuit) |
| CI/CD | GitHub Actions — déploiement automatique sur push `main` |
| Poids total source | ~899,4 Ko (17 205 lignes de code, hors manifest/deploy) |
| Chargement initial | ~633,5 Ko (app.js + style.css + index.html), les données chargées à la demande |

---

## 2. Métriques de code

| Fichier | Lignes | Taille | Rôle |
|---|---|---|---|
| `app.js` | 6 326 | 301,9 Ko | Moteur applicatif — 188 fonctions nommées de premier niveau, 21 sections |
| `style.css` | 5 714 | 209,4 Ko | Thèmes, composants, animations — 51 variables CSS uniques (179 déclarations, redéfinies par thème/variante) |
| `data-fr.js` | 1 663 | 119,2 Ko | Données mode Français (37 thèmes + 16 dialogues) |
| `data-es.js` | 1 038 | 115,2 Ko | Données mode Espagnol (37 thèmes + 16 dialogues) |
| `index.html` | 1 882 | 122,2 Ko | Structure HTML (4 écrans + 2 modales) |
| `sw.js` | 582 | 31,5 Ko | Service Worker (cache hybride + 4 fallbacks SVG) |
| `manifest.json` | — | — | PWA (11 icônes, portrait, standalone) |
| `deploy.yml` | — | — | CI/CD GitHub Actions |

---

## 3. Architecture applicative

### Navigation (4 écrans)
```
[0] app-launcher   → Choix de langue + sélecteur de variante régionale
[1] home           → Guide utilisateur bilingue (FR/ES, 8 sections accordéon)
[2] sections-L1    → Grille des 37 thèmes de vocabulaire
    sections-L2    → Grille des 16 dialogues
[3] lesson         → Leçon ouverte — onglets Flash / Vocab / Quiz / Répète / Dialogue
```
**Ajouté le 11/07/2026** : la barre de navigation basse (Langue / Guide / Modules / Infos) reste masquée au tout premier chargement de l'app tant qu'aucun parcours n'a jamais été commencé (`_isBrandNewUser()` — aucune progression ni guide vu, dans aucun des deux modes). Elle apparaît dès la première interaction (choix d'une langue) et reste ensuite affichée normalement à chaque lancement suivant.

**Ajouté le 11/07/2026 (suite)** : une carte « 🚀 L'essentiel en 30 secondes » (`.hg-tldr`) a été insérée dans l'écran Guide (`#home`), entre l'en-tête coloré (`.home-guide-header`) et la barre sticky Commencer/PDF (`.home-start-sticky`) — donc au-dessus des 8 rubriques en accordéon, visible d'emblée sans rien déplier. Deux versions statiques (FR/ES) dans `index.html`, basculées par le même mécanisme générique que les rubriques (`.home-lang-block[data-lang]` + `_buildHomeGuide()` dans `app.js`) — aucun JS supplémentaire nécessaire. Contenu : 2 niveaux/tabs, spécificité audio propre à chaque sens d'apprentissage (repli de voix régionale espagnole côté FR, repli de voix système côté ES), limite hors-ligne de 🎤 Répète, et recommandation navigateur condensée (détail complet renvoyé vers les rubriques existantes en dessous).

### Chargement conditionnel des données
`loadDataForMode()` injecte dynamiquement `data-fr.js` **ou** `data-es.js` uniquement au moment du choix de langue — réduction de ~50 % du JS parsé au démarrage. Guard contre les doubles appels (`_loadDataInProgress`).

### Système de thèmes CSS
- `html.theme-french` → palette bleu/blanc/rouge (🇫🇷)
- `html.theme-spain` → palette rouge/or (🇪🇸)
- 7 variantes régionales via classes additionnelles (`region-MX`, `region-AR`, `region-CO`, `region-PE`, `region-VE`, `region-EC`, `region-ES`)

---

## 4. Fonctionnalités techniques

### 4.1 Synthèse vocale (Web Speech API — SpeechSynthesis)
- Cascade de sélection de voix espagnole par correspondance régionale (voix exacte de la région → voix espagnole générique disponible en secours → voix système par défaut en dernier recours) — `_resolveSpanishVoice()`. Note : il n'existe pas de distinction voix distante/locale dans le code ; `speechSynthesis.getVoices()` ne renseigne pas cette information de façon fiable inter-navigateurs, la cascade réelle porte uniquement sur la correspondance de langue/région.
- 3 vitesses de lecture paramétrables
- Keep-alive timer pour iOS/Android (évite la coupure silencieuse)
- Badge visuel de qualité de voix (`_updateVoiceBadge()`) — ✅ exacte / ⚠️ secours / ❓ défaut
- Toast et écran d'avertissement si audio indisponible
- **Ajouté le 10/07/2026** : bannière hors-ligne proactive et persistante (`_updateOfflineAudioBanner()`), affichée dès la détection du mode hors ligne (sans attendre un clic) — prévient que la lecture peut basculer sur la langue système par défaut si aucune voix locale correspondante n'est installée
- **Corrigé le 11/07/2026** : la rubrique statique « Hors ligne » du Guide utilisateur (`index.html`) affirmait sans nuance que l'écoute 🔊 fonctionnait hors ligne « entièrement » — désormais alignée sur la nuance déjà présente dans la bannière proactive ci-dessus et dans `_micOfflineHtml()` (repli possible sur la langue système par défaut)


### 4.2 Reconnaissance vocale (Web Speech API — SpeechRecognition)
- Algorithme de Levenshtein pour tolérance aux fautes de prononciation (`_levenshtein()` + `_speechMatch()`)
- Normalisation multilingue des textes reconnus (`_normalizeSpeech()`)
- Feedback visuel vert/orange selon le score de similarité
- Gestion des erreurs microphone bloqué
- Détection hors ligne (`_isOffline()`) : service cloud, indisponible sans connexion sur tous les moteurs (Chrome/Edge/Safari) — signalé au clic (`_micOfflineHtml()`) **et** de façon proactive via la bannière hors-ligne commune décrite en 4.1

### 4.3 Système de progression
- `localStorage` avec clé unique par mode (`STORAGE_KEY`)
- Étoiles 1★ (≥50%) / 2★★ (≥75%) / 3★★★ (100%) — jamais régressives
- Reprise de quiz interrompus via `sessionStorage` (`_saveQuizSession` / `_restoreQuizSession`)
- Barre de progression globale + cercle SVG animé sur la home
- **Ajouté le 12/07/2026** : suivi persistant des modules déjà ouverts au moins une fois
  (`OPENED_STORAGE_KEY`, clé `localStorage` distincte par mode, tableau d'ids), posé au tout
  premier `openTheme()` via `markThemeOpened()`. Distinct du système d'étoiles : un module à
  0 étoile peut avoir été ouvert et raté, ou n'avoir jamais été ouvert — seule cette nouvelle
  clé permet de distinguer les deux cas. `isThemeOpened()` couvre aussi, sans migration
  explicite, les modules déjà étoilés avant l'introduction de ce suivi (avoir des étoiles
  implique forcément d'avoir déjà ouvert le module).
- **Ajouté le 12/07/2026 (suite)** : chaque carte de module affiche désormais l'un des 3 états
  visuels calculés par `getModuleState()` — `state-new` (fond neutre, badge « 🆕 Nouveau »),
  `state-progress` (fond ambre léger, module ouvert mais pas encore à 100 %) ou
  `state-complete` (fond teinté + bordure + coche ✓, réservé aux 3 étoiles — remplace l'ancienne
  classe `.done` qui s'appliquait dès 1 étoile). Étoiles pleines/vides distinguées par classes
  CSS dédiées (`.star-filled` opacité 1, `.star-empty` opacité réduite) plutôt qu'un simple ☆
  non stylé. Le header de la grille affiche en plus une pastille « ✅ X / 48 terminés »
  (modules à 3 étoiles) à côté du compteur d'étoiles existant, distincte du `%` global qui
  compte lui tout module ne serait-ce qu'entamé (≥ 50 %, donc ≥ 1 étoile). Un `resetTheme()`
  individuel ne retire pas le module de `openedThemes` (l'utilisateur le connaît déjà, il n'est
  pas « nouveau ») ; un reset complet (`confirmReset()`) l'efface en revanche intégralement.

### 4.4 Service Worker (stratégie hybride)
- **Cache-First** pour les ressources locales (HTML, CSS, JS, PNG, icônes)
- **Network-First** pour les ressources externes (GitHub Raw, Twemoji CDN)
- 4 fallbacks SVG inline en cas d'échec total (image locale, icône PWA, image externe, page offline)
- Versionnage automatique via `__BUILD_NUMBER__` injecté par GitHub Actions

### 4.5 Export PDF
- Génération en mémoire via `window.print()` dans une fenêtre popup stylée
- 3 types exportables : guide utilisateur, module vocabulaire, dialogue situationnel
- Styles dédiés (`_pdfTheme()`, `_pdfBaseStyles()`, `_pdfHeader()`, `_pdfFooter()`)

### 4.6 Quiz dynamique
- Génération aléatoire à chaque partie — jamais le même quiz (`_generateLevel1Quiz()`)
- QCM 10 questions avec distracteurs intelligents
- Anti double-clic (flags `q10Answered`, `dqAnswered`)
- Confettis animés GPU à 3★★★ (`_launchConfetti()`)

---

## 5. Accessibilité & sécurité

| Aspect | Implémentation |
|---|---|
| **WCAG 1.4.4** | `maximum-scale=5.0` — zoom utilisateur autorisé |
| **Navigation clavier** | `role="button"`, `aria-label` sur tous les éléments interactifs |
| **CSP** | `Content-Security-Policy` via meta tag (GitHub Pages sans headers HTTP) |
| **Clickjacking** | `X-Frame-Options: SAMEORIGIN` |
| **MIME sniffing** | `X-Content-Type-Options: nosniff` |
| **Anti-spam email** | Adresse encodée en reverse dans le HTML |
| **Retour haptique** | `navigator.vibrate()` — feedback discret sur mobile |

---

## 6. Points forts techniques

- ✅ **Zéro dépendance** — pas de npm, pas de bundler, pas de framework
- ✅ **PWA complète** — installable, hors-ligne, 11 icônes, manifest valide
- ✅ **Thèmes CSS par variables** — basculement instantané sans rechargement
- ✅ **Comments de code exhaustifs** — chaque section, fonction, et décision architecturale est documentée
- ✅ **Guard patterns** robustes — double-clic, chargement en cours, voix non disponibles
- ✅ **CI/CD automatisé** — aucune action manuelle au déploiement

## 7. Points d'amélioration potentiels

- ⚠️ `unsafe-inline` en CSP (nécessaire pour le style inline dynamique, mais réduit la protection XSS)
- ⚠️ Variables globales JS nombreuses — une refonte module ES6 améliorerait l'encapsulation
- ⚠️ Pas de tests automatisés (unitaires ou E2E)
- ⚠️ `data-fr.js` et `data-es.js` en JS global (`ALL_THEMES_FR`) — un format JSON + `fetch()` serait plus propre
- ⚠️ Firefox mobile ne supporte pas `SpeechRecognition` (documenté dans le guide, non bloquant)

---

## 8. Historique

*Historique commun aux 2 applications — VACHÉBO (français-espagnol) et Taphad'Meuh (français-oromo).*

| Période | Étape |
|---|---|
| 07/06/2026 → 29/06/2026 | Versions Bêta créées avec IA Claude Sonnet 4.6 et Gemini 3.5 Flash |
| 29/06/2026 → 08/07/2026 | Recettages et correctifs avec IA Claude Sonnet 5 et Gemini 3.5 Flash |
| 08/07/2026 → 12/07/2026 | Retours d'expériences utilisateurs (Christophe, Maman, Moi) avec des correctifs réalisés avec IA Claude Sonnet 5 |
| 18/07/2026 → 25/07/2026 | Retours d'expérience utilisatrice Sandrine avec des correctifs réalisés avec IA Claude Sonnet 5 |
| 27/08/2026 → 31/08/2026 | Retours d'expérience utilisateur Mussa et Moi avec des correctifs réalisés avec IA Claude Sonnet 5 |
| 05/09/2026 | Mise à jour Qui suis-je + Historique avec IA Claude Sonnet 5 |
