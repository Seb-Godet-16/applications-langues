# VACHÉBO 🐄 — Apprendre Français & Espagnol

> **¡Oh la vache, qué chévère, boludo!**  
> Application bilingue Français ↔ Espagnol — flashcards, quiz, dialogues, 7 variantes d'espagnol.

[![PWA](https://img.shields.io/badge/PWA-installable-blueviolet)](https://seb-godet-16.github.io/espagnol-fr-es-beta/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-f7df1e?logo=javascript)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![Licence](https://img.shields.io/badge/licence-MIT-green)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/déployé%20sur-GitHub%20Pages-222?logo=github)](https://seb-godet-16.github.io/espagnol-fr-es-beta/)

---

## 🌍 Démo

➡️ **[Ouvrir l'application](https://seb-godet-16.github.io/espagnol-fr-es-beta/)**

Aucune inscription, aucun téléchargement. Fonctionne dans le navigateur et s'installe sur écran d'accueil comme une vraie app.

---

## ✨ Fonctionnalités

| Fonctionnalité | Détail |
|---|---|
| 🃏 **Flashcards** | Cartes recto/verso avec conjugaisons complètes pour les verbes |
| ❓ **Quiz dynamiques** | Questions générées aléatoirement à chaque partie (jamais le même quiz) |
| 💬 **Dialogues réels** | Situations authentiques : pharmacie, taxi, hôtel, restaurant… |
| 🔊 **Audio intégré** | Prononciation via Web Speech API (synthèse vocale du système) |
| 🎤 **Répétition orale** | L'onglet *Répète* écoute la voix et donne un feedback immédiat vert/orange |
| 🌎 **7 variantes d'espagnol** | Espagne, Mexique, Argentine, Colombie, Venezuela, Pérou, Équateur |
| ⭐ **Système d'étoiles** | 1⭐ ≥ 50 %, 2⭐ ≥ 75 %, 3⭐ = 100 % — progression sauvegardée localement |
| 📲 **PWA installable** | Fonctionne hors-ligne après la première visite (Service Worker) |
| 📄 **Export PDF** | Vocabulaire, dialogues et guide utilisateur exportables en PDF |
| ♿ **Accessibilité** | Navigation clavier, `role="button"`, `aria-label`, zoom WCAG 1.4.4 |

---

## 🗂️ Contenu pédagogique

- **37 thèmes vocabulaire** (Niveau 1) — salutations, couleurs, chiffres, verbes, adjectifs, connecteurs, quantité/fréquence/temps, argent, alimentation…
- **16 dialogues de situation** (Niveau 2) — scénarios de la vie quotidienne
- **~900 paires de mots** par langue (Français ↔ Espagnol)
- **7 variantes régionales** avec vocabulaire et audio adaptés

---

## 🏗️ Architecture

```
espagnol-fr-es-beta/
├── index.html          # Structure HTML unique (SPA — Single Page App)
├── css/
│   └── style.css       # Thèmes couleur, composants, animations (51 variables CSS, 179 déclarations, 5 705 lignes au 30/08/2026)
├── js/
│   ├── app.js          # Moteur applicatif complet (188 fonctions nommées, 6 355 lignes au 30/08/2026)
│   ├── data-fr.js      # Contenu mode "Apprendre le Français" — chargé à la demande
│   └── data-es.js      # Contenu mode "Apprendre l'Espagnol" — chargé à la demande
├── img/
│   ├── Logo-appli-es-fr.png
│   └── icons/          # Icônes PWA (72px → 512px, maskable)
├── sw.js               # Service Worker — cache hybride Cache-First / Network-First
├── manifest.json       # Manifest PWA
└── .github/
    └── workflows/
        └── deploy.yml  # CI/CD GitHub Actions → GitHub Pages
```

### Principes de conception

- **Zéro dépendance** — Vanilla JS, pas de framework, pas de bundler, pas de transpileur
- **Cible ES2020** — plafond de compatibilité volontaire : tout le JS (déclarations `let`/`const`, optional chaining `?.`, arrow functions pour les callbacks) reste nativement supporté depuis Safari 13.4, ce qui couvre la cible minimale du projet (iOS Safari 14.5+) sans avoir besoin d'un bundler. Les fonctions nommées de premier niveau gardent volontairement la syntaxe `function` (hoisting requis par les attributs `onclick=""` générés dynamiquement et par certains callbacks qui dépendent de `this`). Base de code harmonisée en ce sens le 05/07/2026.
- **Chargement fractionné** — `data-fr.js` et `data-es.js` injectés dynamiquement au choix de langue (−50 % de JS parsé au démarrage)
- **CSS custom properties** — 51 variables uniques (179 déclarations au total, redéfinies par thème/variante) pour les thèmes (`theme-french` / `theme-spain`) et les 7 variantes régionales (`region-ES`, `region-MX`, etc.), plus une paire crème/brun partagée inspirée du logo (`--c-vache-cream` / `--c-vache-brown`) mixée dans chaque variante depuis le 19/07/2026
- **Service Worker hybride** — Cache-First pour les ressources locales, Network-First pour les CDN externes (Twemoji), avec fallbacks SVG inline pour le mode hors-ligne

---

## 🚀 Déploiement

Le projet utilise **GitHub Actions** pour déployer automatiquement sur GitHub Pages à chaque push sur `main`.

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
```

Le Service Worker est versionné à chaque déploiement via la variable `__BUILD_NUMBER__` injectée automatiquement par la CI :

```bash
sed -i "s/__BUILD_NUMBER__/${{ github.run_number }}/g" sw.js
```

### Installation locale

```bash
git clone https://github.com/Seb-Godet-16/espagnol-fr-es-beta.git
cd espagnol-fr-es-beta
# Servir avec n'importe quel serveur statique, ex :
npx serve .
# ou
python3 -m http.server 8080
```

> ⚠️ Le Service Worker nécessite HTTPS ou `localhost`. Ne pas ouvrir `index.html` directement depuis le système de fichiers.

---

## 🌐 Compatibilité

| Navigateur | Flashcards | Quiz | Audio 🔊 | Micro 🎤 |
|---|---|---|---|---|
| Chrome (Android / Desktop) | ✅ | ✅ | ✅ | ✅ |
| Safari (iOS 14.5+) | ✅ | ✅ | ✅ | ✅ |
| Firefox (Desktop) | ✅ | ✅ | ✅ | ⚠️ Partiel |
| Firefox (Mobile) | ✅ | ✅ | ✅ | ❌ Non supporté |
| Edge | ✅ | ✅ | ✅ | ✅ |

> La **reconnaissance vocale** (onglet 🎤 Répète) repose sur l'API `SpeechRecognition` — non disponible sur Firefox mobile.  
> La **synthèse vocale** dépend des voix installées sur l'appareil. Voir le Guide intégré à l'app pour la configuration.

---

## 🛠️ Technologies

- **HTML5** — structure SPA avec 4 écrans + modales
- **CSS3** — custom properties, animations CSS (`@keyframes`), Grid, Flexbox, `contain`
- **JavaScript ES2020** (plafond volontaire, sans transpileur) — `let`/`const`, optional chaining `?.`, arrow functions, template literals, `Promise` (`.then`/`.catch`)
- **Web Speech API** — synthèse vocale (`SpeechSynthesis`) + reconnaissance (`SpeechRecognition`)
- **Service Worker API** — cache offline, stratégie stale-while-revalidate
- **localStorage / sessionStorage** — persistance de la progression et reprise de quiz
- **Web Vibration API** — retour haptique discret sur mobile
- **Clipboard API** — copie anti-spam de l'adresse e-mail
- **GitHub Actions** — CI/CD automatisé
- **GitHub Pages** — hébergement statique gratuit

---

## 🕓 Historique

| Date | Étape |
|---|---|
| 07/06/2026 → 29/06/2026 | Version bêta créée avec IA Claude Sonnet 4.6 et Gemini 3.5 Flash |
| 29/06/2026 → 08/07/2026 | Tests : desktop (auto) et iPhone (manuel) par Fédérico ; Android (manuel) par Sébastien Godet, aidé par Gemini 3.5 Flash Extended. Correctifs par Sébastien Godet, aidé par Claude Sonnet 5 |
| 09/07/2026 → 10/07/2026 | Ajouts (Claude Sonnet 5, demandes utilisateur) : bouton d'installation PWA native dans le Guide, bannière hors-ligne proactive pour l'audio, et encadré comparatif des navigateurs dans le Guide utilisateur. Détail complet dans `Bilan_technique.md` (§ Historique) |
| 11/07/2026 | Ajouts (Claude Sonnet 5, demandes utilisateur) : barre de navigation basse masquée au tout premier lancement sans aucun parcours, rubriques du Guide utilisateur réordonnées (pratique/dépannage avant mise en avant/clôture), et nuance sur les limites de l'écoute hors ligne ajoutée dans la rubrique Hors ligne du Guide. Détail complet dans `Bilan_technique.md` (§ Historique) |
| 11/07/2026 (suite) | Ajout (Claude Sonnet 5, demande utilisateur) d'une carte résumé « 🚀 L'essentiel en 30 secondes » en tête de l'écran Guide, visible sans rien déplier, au-dessus des 8 rubriques en accordéon. Détail complet dans `Bilan_technique.md` (§ Historique) |
| 12/07/2026 | Ajout (Claude Sonnet 5, demande utilisateur, inspiré d'une capture d'écran de l'app Oromo du même auteur) de 4 améliorations visuelles sur les cartes de module : fond teinté selon l'état (neuf / en cours / terminé à 3 étoiles), badge « 🆕 Nouveau » sur les modules jamais ouverts (nouveau suivi persistant distinct des étoiles), étoiles pleines/vides mieux contrastées, et pastille « ✅ X / 48 terminés » à côté du compteur d'étoiles. Détail complet dans `Bilan_technique.md` (§ Historique) |
| 12/07/2026 (suite) | Ajouts (Claude Sonnet 5, demande utilisateur) : bouton natif d'installation PWA déplacé en tête de l'écran Guide (visible dès l'arrivée, retiré de la rubrique « Hors ligne » où il faisait doublon), et vérification proactive des mises à jour du Service Worker (au retour au premier plan et toutes les 60 min) pour ne plus dépendre du seul chargement de page. Détail complet dans `Bilan_technique.md` (§ Historique) |
| 13/07/2026 | Relecture complète (Claude Sonnet 5, demande utilisateur) des commentaires internes et des numéros de ligne de `app.js` et `style.css`, décalés par les ajouts du 12/07 non encore répercutés dans les « PLAN DU FICHIER ». Corrections de dates erronées (11/07 → 12/07) sur plusieurs commentaires liés aux états de carte / badge « Nouveau ». Aucune ligne de code fonctionnel modifiée — uniquement commentaires et documentation |
| 18/07/2026 → 23/07/2026 | Expériences utilisatrice (Sandrine, Moi) et correctifs avec Claude Sonnet 5 |
| 19/07/2026 | Mascotte régionale `REGION_MASCOTS` (symbole + exclamation par variante, ex. 🐂 ¡Mola! en Espagne) intégrée aux chips de l'écran d'accueil, à la grille du Lanceur et au bandeau du Guide. ⚠️ Non documenté au moment des faits — écart mesuré et signalé rétroactivement dans `Bilan_technique.md` (§ Historique, entrée du 19/07/2026) |
| 19/07/2026 (suite) | Extension (Claude Sonnet 5, demande utilisateur) : couleurs crème/brun du logo mixées dans le dégradé d'accueil de chaque variante et thème (nouvelles variables `--c-vache-cream`/`--c-vache-brown`, drapeaux inchangés) ; clin d'œil mascotte sur un sans-faute (3⭐) aux deux écrans de résultat de quiz ; signature mascotte ajoutée aux deux pieds de page. Détail complet dans `Bilan_technique.md` (§ Historique) |
| 21/07/2026 (2e passe) | Corrections (Claude Sonnet 5, demande utilisateur) : logo encore agrandi dans le bandeau des écrans Modules (`.sections-logo-img`), et bandeau variante régionale du Guide restructuré pour afficher le drapeau et l'élément culturel/mascotte bien plus grands et centrés sur leur propre ligne, au-dessus de la phrase descriptive, avant la rubrique « Cómo funciona / Comment ça marche ». ⚠️ Fait suite à un lot de changements du même jour resté non documenté au moment des faits — écart signalé dans `Bilan_technique.md` (§ Historique, entrée du 21/07/2026) |
| 21/07/2026 (3e passe) | Corrections (Claude Sonnet 5, demande utilisateur, capture d'écran à l'appui) : logo des écrans Modules encore agrandi (`max-width:260px / width:88%`, boutons icônes de cette ligne légèrement réduits pour lui faire de la place) ; bandeau variante régionale du Guide recoloré (fond clair teinté + texte foncé au lieu de blanc sur blanc, illisible sur le corps blanc de l'écran Guide) et ses marges resserrées pour supprimer l'espace vide ressenti avant « Cómo funciona ». Détail complet dans `Bilan_technique.md` (§ Historique) |
| 22/07/2026 | ⚠️ Reprise du projet sur des fichiers déjà plus longs que la dernière mesure du 21/07 (écart non documenté au moment des faits, signalé rétroactivement — cf. `Bilan_technique.md`, § Historique). Huit correctifs (Claude Sonnet 5, demande utilisateur, captures d'écran à l'appui pour la plupart) : alignement des pieds de carte de langue (« Sobre/Infos VACHÉBO », qui pouvaient se retrouver à des hauteurs différentes selon la langue) ; réorganisation de l'en-tête de l'écran Modules (titre + drapeau affichés avant les icônes et le logo) ; espace vide supprimé sous le bandeau régional du Guide ; libellé de bouton corrigé dans le Guide espagnol (« Reiniciar » → « Volver a empezar », pour correspondre au vrai bouton de la carte de module) ; aria-label du bouton 🔄 de réinitialisation globale rendu dépendant de la langue de l'apprenant plutôt que figé en français ; z-index des 3 modales de confirmation (dont « Remerciements ») relevé pour qu'elles ne puissent plus être recouvertes visuellement par une notification toast ; et un espacement ajouté à 2 endroits qui semblaient visuellement collés (Lanceur : icônes/« Choisis ta langue » avec les cartes de langue ; Guide : boutons Commencer/PDF avec la carte « L'essentiel en 30 secondes »). Détail complet dans `Bilan_technique.md` (§ Historique) |
| 23/07/2026 | Le même historique (« HISTORIQUE DE L'APPLICATION ») ajouté dans l'en-tête de `app.js`, à l'identique de la ligne ci-dessous, avec recalcul complet des numéros de ligne du « PLAN DU FICHIER » qui en découlaient (chaque ancre revérifiée une à une par grep). Détail complet dans `Bilan_technique.md` (§ Historique) |
| 26/08/2026 | Enrichissement du vocabulaire (Claude Sonnet 5, demande utilisateur, à partir d'une liste de manques identifiés pour les grands débutants) : 4 nouvelles rubriques Niveau 1 — Adjectifs de base, Mots de Liaison, Quantité/Fréquence/Temps, L'Argent — plus des ajouts ciblés dans Nombres (ordinaux), Famille, Objets du Quotidien et Santé (renommée « Santé et Sécurité »). 32 → 36 thèmes, en miroir strict dans `data-fr.js`/`data-es.js`. Détail complet dans `Bilan_technique.md` (§ Historique) |
| 26/08/2026 (suite) | Séparation (Claude Sonnet 5, demande utilisateur) de « Santé et Sécurité » en 2 rubriques distinctes : **La Santé** (21 mots, contenu médical d'origine, id `sante` inchangé) et **La Sécurité** (6 mots : socorro/ayuda, accidente, policía, bomberos, robo, ladrón), nouvelle rubrique insérée juste après. 36 → 37 thèmes. Détail complet dans `Bilan_technique.md` (§ Historique) |
| 26/08/2026 (suite 2) | Ergonomie (Claude Sonnet 5, demande utilisateur) : la grille à plat des 37 thèmes du Niveau 1 faisait « mur de cartes » et pouvait décourager un grand débutant. Regroupement en **5 catégories thématiques repliables** (🌱 Les Bases, 😊 Décrire & Ressentir, 🏡 Vie Quotidienne, 🚌 Sorties & Situations, 🌍 Le Monde — accordéon `<details>`/`<summary>` natif, seules la catégorie en cours et la suivante dépliées par défaut) et ajout d'une carte **« ▶ Continuer »** en tête de grille (Niveau 1 et 2) menant directement au prochain thème pertinent. Niveau 2 (16 dialogues) laissé en grille simple. Détail complet dans `Bilan_technique.md` (§ Historique) |
| 27/08/2026 | Correctif d'affichage (Claude Sonnet 5, demande utilisateur, capture d'écran à l'appui) sur l'écran Modules mis en place la veille : les catégories du Niveau 1 (et les cartes du Niveau 2) héritaient par erreur d'une grille à 2 colonnes pensée pour les cartes individuelles, ce qui les affichait 2 par ligne, deux fois trop étroites. Passage en **colonne unique pleine largeur** pour les 2 niveaux, et une seule catégorie ouverte par défaut au lieu de deux (jugé trop chargé une fois la catégorie en pleine largeur). Détail complet dans `Bilan_technique.md` (§ Historique) |
| 27/08/2026 (suite) | Extension (Claude Sonnet 5, demande utilisateur : « pour aider l'apprenant ») du même principe de catégories repliables au **Niveau 2** : les 16 dialogues, jusqu'ici en grille simple, sont désormais regroupés en **4 rubriques thématiques** (👋 Premiers Contacts, 🧭 Se Déplacer & Climat, 🍽️ Sorties & Consommation, 🏠 Vie Quotidienne & Santé), avec le même accordéon `<details>`/`<summary>` et la même catégorie « en cours » ouverte par défaut qu'au Niveau 1. Détail complet dans `Bilan_technique.md` (§ Historique) |
| 28/08/2026 | Trois correctifs visuels sur les flashcards (Claude Sonnet 5, demande utilisateur, captures d'écran à l'appui) : bandeau « Cliquez : Recto/Verso... » qui passait sur 2 lignes ramené sur une ligne dans le cas courant (retrait de l'uppercase/letter-spacing responsable du passage à la ligne + légère baisse de taille), tout en conservant le repli sur 2 lignes pour les noms de région trop longs (« Espagne (Castillan) ») ; espace vide sous les boutons audio/micro réduit de moitié ; et exemple bilingue entre parenthèses des définitions verbes (`Ser`, `Estar` et 13 autres — pas seulement ces 2-là comme identifié dans un premier temps) affiché en plus petit sur le verso espagnol des flashcards plutôt qu'à la taille du mot principal. Détail complet dans `Bilan_technique.md` (§ Historique) |
| 29/08/2026 | Correctif d'affichage **desktop uniquement** (Claude Sonnet 5, demande utilisateur, 2 captures d'écran Windows à l'appui ; mobile non concerné). Sur les écrans à contenu court (ex. Flashcards), la mise en page desktop (`@media (min-width:768px)`) forçait la carte `.app` à occuper toute la hauteur du viewport tout en l'alignant en haut, ce qui laissait un grand vide blanchâtre entre le pied de page et le bas de la carte, avant la barre de navigation — visuellement proche d'un écran cassé. Corrigé : la carte prend désormais sa hauteur naturelle et se centre verticalement, le fond quadrillé de la page restant visible au-dessus et en dessous sur les écrans courts. Au passage, le texte du bandeau vu sur les captures ne correspondait à aucune version connue du code : signe d'un site déployé ou d'un cache de Service Worker à rafraîchir plutôt que d'un nouveau bug de contenu — signalé sans correction silencieuse. Détail complet, y compris la méthode de vérification par rendu réel, dans `Bilan_technique.md` (§ Historique) |
| 30/08/2026 | Refonte du bouton retour du header de leçon (Claude Sonnet 5, demande utilisateur, 2 captures d'écran à l'appui — comparaison avec l'appli sœur Oromo ↔ Français). L'ancien bouton « ← Módulos / Modules » (flèche + texte bilingue sur 2 lignes, une seule destination) est remplacé par un groupe de 3 icônes — 🏠 Accueil, ❓ Guide, 📚 Modules — sur le modèle de l'appli Oromo, chacune menant à un écran différent plutôt qu'une seule destination. Réutilise les classes déjà en place sur l'écran Modules (même style, aucune nouvelle classe CSS). Vérifié que les 2 nouvelles destinations (Accueil, Guide) sont bien couvertes par le correctif audio/micro du 27-28/08/2026 : aucune fuite constatée. Première modification d'`index.html` de ce chantier — `app.js` et `style.css` seuls avaient été touchés jusqu'ici. Détail complet dans `Bilan_technique.md` (§ Historique) |
| 30/08/2026 (suite) | Nouveau remerciement à **Mussa Sembro** (Claude Sonnet 5, demande utilisateur, propositions de formulation soumises puis choisies avant implémentation) : miroir, dans l'autre sens, du remerciement déjà présent côté Oromo pour Christophe Elin et Sandrine Le Goff. Ses remarques sur l'appli sœur Taphad'Meuh (interface trop chargée pour de grands débutants) ont mené à une réorganisation en grandes rubriques et à de meilleures flashcards côté Oromo — reprise ici aussi. Ajouté dans le Guide (2 langues) et dans la modale Infos. **Au passage** : la modale Infos, jusqu'ici toujours affichée en français quel que soit le mode, est désormais bilingue comme le Guide (même mécanisme de bascule déjà existant, réutilisé tel quel — aucun code JS supplémentaire nécessaire). Détail complet dans `Bilan_technique.md` (§ Historique) |

---

## 👤 Auteur

**Sébastien Godet** — En reconversion · Gestion de projets Agile & Data

- 💼 [LinkedIn](https://www.linkedin.com/in/sébastien-godet-142ba6145)
- ✉️ sebastien.godet16 [at] gmail.com

Développé avec l'assistance de **Claude Sonnet 4.6** (Anthropic) et **Gemini 3.5 Flash** (Google).

---

## 🙏 Remerciements

- **Fédérico Calo** ([LinkedIn](https://www.linkedin.com/in/federicocalo/)) — aide technique précieuse tout au long du projet
- **Mes parents** — relecture, corrections des traductions et conseils ergonomiques
- **Twemoji** (Twitter / Jdecked) — icônes drapeaux SVG sous licence CC-BY 4.0

---

## 📄 Licence

Ce projet est distribué sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour les détails.
