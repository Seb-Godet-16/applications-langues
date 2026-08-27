/* ============================================================
   VACHÉBO 🐄🇫🇷🇪🇸  —  Moteur applicatif unifié
   Français ↔ Espagnol (bidirectionnel)
   © Juin 2026 – Sébastien Godet · IA Claude Sonnet 4.6 et Gemini 3.5 Flash
   ============================================================
   Cible : ES2020 maximum pour assurer la compatibilité native
   iOS Safari 14.5+ sans transpileur (pas de bundler dans ce projet).
   Modernisation appliquée le 05/07/2026 : var → let/const, optional
   chaining (?.) sur les chaînes de garde, arrow functions pour les
   callbacks anonymes sans dépendance à `this`. Les fonctions nommées
   de premier niveau restent en `function` (hoisting + compatibilité
   avec les attributs onclick="" générés dynamiquement).
   ============================================================
   HISTORIQUE DE L'APPLICATION :
     07/06/2026 → 29/06/2026  Version bêta créée avec IA Claude Sonnet 4.6
                               et Gemini 3.5 Flash.
     29/06/2026 → 08/07/2026  Tests :
                                 - Desktop (auto) et iPhone (manuel) par
                                   Fédérico
                                 - Android (manuel) par Sébastien Godet
                                   (aidé par Gemini 3.5 Flash Extended)
                               Correctifs par Sébastien Godet (aidé par
                               Claude Sonnet 5).
     08/07/2026 → 12/07/2026  Expériences utilisateurs (Christophe
                               Elin, Maman, Moi) et correctifs avec
                               Claude Sonnet 5.
     18/07/2026 → 23/07/2026  Expériences utilisatrice (Sandrine,
                               Moi) et correctifs avec Claude Sonnet 5.
     26/08/2026 (suite)       Regroupement du Niveau 1 (37 thèmes) en
                               5 catégories repliables + carte
                               "Continuer" (ergonomie, demande
                               utilisateur) avec Claude Sonnet 5.
     27/08/2026               Correctif d'affichage (capture d'écran à
                               l'appui, demande utilisateur) : #grid1/
                               #grid2 passés en colonne unique pleine
                               largeur (au lieu de la grille 2 colonnes
                               héritée par erreur de .themes-grid), et
                               une seule catégorie ouverte par défaut
                               au lieu de deux — avec Claude Sonnet 5.
   ============================================================
   ARCHITECTURE (5 fichiers) :
     ├─ index.html  → Structure HTML + launcher (5 écrans, 3 modales)
     ├─ style.css   → Thèmes couleur, composants visuels (51 variables CSS, 179 décl.)
     ├─ data-fr.js  → ALL_THEMES_FR (37 thèmes + 16 dialogues) — chargé à la demande
     ├─ data-es.js  → ALL_THEMES_ES (37 thèmes + 16 dialogues) — chargé à la demande
     └─ app.js      → Ce fichier : logique applicative complète (6 118 lignes)

   PLAN DU FICHIER (numéros recalculés le 27/08/2026 — correctif
   d'affichage §7 : isOpen n'ouvre plus que la catégorie courante
   (1 ligne modifiée, sans effet sur le nombre de lignes), commentaires
   de section §7 étoffés en conséquence, entrée HISTORIQUE du jour
   ajoutée en tête de fichier, et paragraphe explicatif ci-dessous
   étoffé à son tour pour documenter tout cela — d'où un décalage total
   de +25 lignes pour §0 à §7 (bannière incluse) et de +40 lignes pour
   §8 et toutes les ancres suivantes (25 + 15 lignes ajoutées dans le
   corps de §7 lui-même, plus loin dans le fichier, qui ne concernent
   donc que les ancres à partir de §8). Chaque ancre ci-dessous
   revérifiée une à une par grep après coup, comme lors des recalculs
   précédents — et non simplement déduite par calcul, pour éviter
   justement ce genre d'erreur en cascade. Au passage, un décalage
   pré-existant (non lié à la présente session, distinct de celui déjà
   rattrapé le 26/08/2026 suite 2) a été détecté et corrigé sur les 3
   sous-ancres §15b/§15c/§15d, qui n'ont pas de bannière numérotée dans
   le code (juste un commentaire au-dessus de la première fonction
   concernée, cf. remarque déjà présente sous §15b) : l'écart mesuré
   avant cette session était respectivement de 11, 18 et 56 lignes
   (valeurs affichées trop hautes par rapport à la position réelle) —
   origine non investiguée plus avant (hors périmètre de cette
   demande). Compteurs ARCHITECTURE ci-dessus inchangés pour style.css
   (51 variables CSS/179 décl., recompté par grep avant/après édition,
   aucune nouvelle variable — les 2 nouvelles règles #grid1/#grid2
   n'utilisent que des valeurs littérales, pas de var()) :
     §0    L.  196  Chargement conditionnel des données — loadDataForMode()
     §0b   L.  221  Helpers globaux — showResetConfirm(), _launchConfetti(), spinner
     §1    L.  383  Variables d'état globales
     §1b   L.  441  Utilitaires bilingues — L(), isFrench(), langKeys(), _themeTitle()
     §3    L.  524  Point d'entrée — showLauncherVariant(), initApp(), showLauncher()
     §3b   L.  860  Synthèse vocale — _resolveSpanishVoice(), speak(), speakSlow()
     §3a-bis L. 1077  Surlignage mot par mot pendant la lecture (TTS, best-effort)
     §3c   L. 1455  Interruption TTS à la mise en arrière-plan (visibilitychange)
     §3d   L. 1476  Keepalive watchdog Chrome/Android (pause/resume toutes les 8 s)
     §3e   L. 1506  Audio indisponible + toast _showToast() + _vibrateFeedback()
     §4    L. 1590  Persistance — loadDone(), suivi modules ouverts (12/07), étoiles, quiz
     §5    L. 1807  Navigation — showScreen(), _showScreenNoRender(), _updateBottomNav()
     §5b   L. 1935  Helpers niveaux — _updateLevelTabs(), lessonGoBack(), navGoModules()
     §6    L. 2149  Écran Home — renderHome(), _renderHomeRegionWidget()
     §7    L. 2339  Écran Sections — renderSections(), _buildThemeCard() (états + badge, 12/07).
                     THEME_CATEGORIES, _findNextThemeToContinue(),
                     _buildContinueCard() et _buildThemeGridHTML() ajoutées
                     le 26/08/2026 (suite, demande utilisateur, ergonomie) :
                     regroupent les 37 thèmes du Niveau 1 en 5 catégories
                     repliables (<details>/<summary> natifs). Ajusté le
                     27/08/2026 (demande utilisateur, capture d'écran à
                     l'appui) : seule la catégorie "en cours" est désormais
                     dépliée par défaut (plus la suivante en plus), et
                     #grid1/#grid2 passent en colonne unique pleine largeur
                     dans style.css (ne réutilisent plus .themes-grid en 2
                     colonnes, réservée depuis à .theme-subgrid, les cartes
                     à l'intérieur d'une catégorie). _buildContinueCard()
                     affiche par ailleurs une carte "▶ Continuer" en tête
                     de grille (Niveau 1 et 2) pointant vers le prochain
                     thème pertinent. renderSections() délègue désormais le
                     remplissage de grid1/grid2 à _buildThemeGridHTML() (au
                     lieu d'un .map() direct sur _buildThemeCard()) ; le
                     Niveau 2 (16 dialogues) reste toutefois en grille à
                     plat, jugé déjà assez court pour ne pas avoir besoin
                     de catégorisation.
                     Appelle aussi _markModulesVisited() (§15d, appel L.2489)
                     depuis le 18/07/2026. Pastille .sections-mascot-all
                     ajoutée le 20/07/2026 (demande utilisateur) : clin d'œil
                     mascotte quand tous les modules sont à 3 étoiles, via
                     REGION_MASCOTS/_mascotKeyForMode() (§15) — couvre aussi
                     le mode Français (🗼 France) depuis le 20/07/2026 (suite).
                     aria-label du bouton 🔄 global (_fillHeader(), appelée
                     par cette fonction) rendu dynamique selon la langue de
                     l'apprenant le 22/07/2026 (demande utilisateur).
     §8    L. 2658  Ouverture d'un thème — openTheme() (marque module ouvert), switchTab()
     §9    L. 2869  Cartes Flash — renderFlash(), pickAlpha(), buildAlphaDetail().
                     Symbole mascotte régional .fc-region-mascot (recto FR/verso
                     ES et recto ES/verso FR) ajouté le 20/07/2026 (demande
                     utilisateur), cohérent avec .hrw-chip-mascot (§6/§15) et
                     .launcher-region-mascot (§15).
     §9b   L. 3077  Reconnaissance vocale — _normalizeSpeech(), _levenshtein(), _speechMatch()
     §9c   L. 3490  Onglet Répète — renderRepeat(), _rpShowWord(), _rpStartMic(), _rpShowEnd().
                     Clin d'œil mascotte sur sans-faute ajouté à _rpShowEnd() le
                     20/07/2026 (demande utilisateur), via _mascotSansFauteLine() (§14).
     §10   L. 3851  Quiz 10 questions — _generateLevel1Quiz(), renderQuiz10(), checkQ10()
     §11   L. 4129  Dialogue — _adaptDialogueLine(), renderDialog(), pickSit()
     §12   L. 4250  Vocabulaire — renderVocab() (chips cliquables)
     §13   L. 4308  Quiz Dialogue — renderDialogQuiz(), checkDQ()
     §14   L. 4402  Utilitaires — _quizResultStrings(), _mascotSansFauteLine(),
                     esc(), _escAttr(). _mascotSansFauteLine() (L.4457) ajoutée le
                     20/07/2026 (demande utilisateur) : factorise le clin d'œil
                     mascotte sur sans-faute auparavant écrit en dur dans
                     _quizResultStrings() (19/07/2026), désormais partagé avec
                     _rpShowEnd() (§9c). Depuis le 20/07/2026 (suite), délègue le
                     choix de clé mascotte à _mascotKeyForMode() (§15) pour
                     couvrir aussi le mode Français (🗼 France).
     §15   L. 4487  Variantes régionales — renderRegionGrid(), pickRegion(), changeRegion().
                     REGION_MASCOTS complété le 20/07/2026 (demande utilisateur)
                     d'une entrée France (🗼, symétrie avec le logo — Tour
                     Eiffel), et nouvelle fonction _mascotKeyForMode() qui
                     résout la clé à utiliser ('FR' en mode Français, variante
                     hispanique active — currentRegion — en mode Espagnol) ;
                     utilisée par §7, §14 et _refreshFooterMascot() (juste en
                     dessous, même section), qui n'affichent donc plus un jeu
                     de mots sans symbole en mode Français.
     §15b  L. 4837  Accordéons — toggleAcc(), toggleLevelAcc(), _resizeOpenAccordions()
                     (aucune bannière numérotée dans le code à cet endroit, juste
                      un commentaire au-dessus de toggleAcc() — contrairement aux
                      autres sous-sections 5b/9b/9c qui en ont une ; ancre corrigée
                      le 27/08/2026, écart pré-existant de 11 lignes rattrapé)
     §15c  L. 4902  Nouvel utilisateur & barre de nav — _isBrandNewUser(), condition
                     dans le listener DOMContentLoaded (ajouté le 11/07/2026, demande
                     utilisateur : pas de barre de nav basse au tout premier lancement
                     sans aucun parcours ; réapparaît dès la première interaction via
                     showLauncherVariant()) — ancre corrigée le 27/08/2026, écart
                     pré-existant de 18 lignes rattrapé
     §15d  L. 4933  Cartes de langue fusionnées avec l'explicatif — _langBoxInitialOpen(),
                     _setLangBoxOpen(), _initLangBoxes(), toggleLangBox() ; ajouté le
                     18/07/2026 (demande utilisateur), fusionné le même jour avec les
                     anciennes cartes .lang-card (auparavant un encadré séparé à 2
                     colonnes, .launcher-info, sous les cartes) — chaque carte a
                     désormais sa propre liste à puces dépliable et son propre état
                     déplié/replié, mémorisés séparément par langue. Ancre corrigée
                     le 27/08/2026, écart pré-existant de 56 lignes rattrapé.
                     Contient aussi (ajout du même jour, 3e retour utilisateur)
                     _markModulesVisited()/_hasVisitedModules() (L.4980) : la
                     préférence explicite de l'apprenant prime toujours, puis les
                     cartes se replient dès la première visite des Modules (posé
                     depuis renderSections(), §7, L.2489) — remplace l'ancienne
                     dépendance à _isBrandNewUser() (§15c), trop grossière pour ce
                     cas précis (aucune bannière numérotée à cet endroit, comme
                     pour §15c)
     §16   L. 5077  Remerciements — showCredits()
     §17   L. 5092  Guide utilisateur — _buildHomeGuide(), showGuide(), navBackToHome(),
                     navBackToGuide(), _refreshGuideRegion(), _guideSeenKey()/
                     _hasSeenGuide()/_markGuideSeen() (flag par langue). Câble aussi,
                     depuis le 12/07/2026, le libellé bilingue du bouton #homeInstallBtn
                     (déplacé en tête d'écran — cf. §21c)
     §18   L. 5628  E-mail antispam — openAndCopyEmail()
     §19   L. 5661  Exports PDF — _pdfTheme(), _exportGuide(), _exportVocab(), _exportSituation()
                     (étiqueté "§21" dans le code même — incohérence de numérotation
                      préexistante, non corrigée ici pour ne pas renuméroter tout le fichier)
     §20   L. 5974  Accessibilité clavier (keydown → role="button")
     §21   L. 5989  Initialisation Launcher — addEventListener sur les cartes de langue
     §21b  L. 6015  Viewport height fix Android — --app-h via window.innerHeight
     §21c  L. 6056  Bouton d'installation PWA native — _initInstallButtons(),
                     _installPwa() ; bouton #homeInstallBtn (tête de l'écran Guide,
                     libellé mis à jour dans §17) ajouté le 12/07/2026, remplace celui
                     auparavant caché dans la rubrique "Hors ligne" du guide
   ============================================================ */


/* ═══════════════════════════════════════════════════════════
   0. CHARGEMENT CONDITIONNEL DES DONNÉES
   ─────────────────────────────────────────────────────────
   data.js a été séparé en data-fr.js (~106 Ko) et data-es.js
   (~96 Ko). Seul le fichier utile au mode choisi est injecté,
   ce qui réduit de ~50 % le volume de données parsé au démarrage.

   loadDataForMode(mode, callback) :
     • Vérifie si les variables du mode sont déjà présentes en
       mémoire (cas : l'utilisateur revient au Launcher et choisit
       la même langue → pas de rechargement inutile).
     • Sinon, crée une balise <script> pointant vers le bon fichier,
       l'injecte dans <head> et appelle callback() à son onload.
     • En cas d'erreur réseau, affiche un toast et bloque initApp.

   Appelée par showLauncherVariant() juste avant initApp().
═══════════════════════════════════════════════════════════ */

/**
 * Charge dynamiquement data-fr.js ou data-es.js selon le mode,
 * puis appelle callback() une fois les données disponibles.
 * Si les données sont déjà en mémoire, callback() est appelé immédiatement.
 *
 * @param {'learn_french'|'learn_spain'} mode
 * @param {Function} callback  — fonction à exécuter quand les données sont prêtes
 */
/* ── Note d'ordre : ces 3 fonctions sont déclarées en tête de fichier car elles sont
   attachées en onclick="" dans le footer HTML généré dynamiquement par renderSections().
   Elles appellent L(), renderSections() et _showToast() qui sont définies plus bas,
   ce qui est valide grâce au hoisting JS (function declarations). ── */
function showResetConfirm() {
  const msg = L('¿Seguro que quieres borrar toda tu progresión? Esta acción es irreversible.', 'Voulez-vous vraiment effacer toute votre progression ? Cette action est irréversible.');
  document.getElementById('confirmMsg').textContent = msg;
  document.getElementById('confirm-modal').style.display = 'flex';
}
function confirmReset() {
  done = [];
  openedThemes = [];
  try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
  try { localStorage.removeItem(OPENED_STORAGE_KEY); } catch(e) {}
  document.getElementById('confirm-modal').style.display = 'none';
  renderSections(_currentThemeLevel || 1);
  _showToast(L('✅ Progresión borrada.', '✅ Progression effacée.'));
}
function cancelReset() {
  document.getElementById('confirm-modal').style.display = 'none';
}

function _showSpinner() {
  let s = document.getElementById('app-spinner');
  if (!s) {
    s = document.createElement('div');
    s.id = 'app-spinner';
    document.body.appendChild(s);
  }
  s.style.display = 'flex';
}
function _hideSpinner() {
  const s = document.getElementById('app-spinner');
  if (s) s.style.display = 'none';
}

/* _launchConfetti(isThreeStars) — Animation de félicitations ⭐⭐⭐
   Portée depuis l'app Oromo, puis étendue (Bug 6.4) :
   - Répartition en zones (pas de regroupement aléatoire).
   - Couleurs cycliques (pas de random pur) pour une palette équilibrée.
   - CSS custom properties (--cx, --cr, --cs, --cd, --cdur) : transitions GPU.
   - BUG 6.4 (corrigé) : l'animation ne durait qu'~1-2 s au total car le CSS
     utilisait par erreur la variable de délai (--cd) comme durée d'animation,
     et une seule "rafale" de particules était générée.
     Corrigé en : (1) séparant clairement délai (--cd) et durée (--cdur)
     côté CSS, et (2) générant plusieurs rafales successives ci-dessous,
     pour obtenir une pluie de confettis continue d'environ 3 à 4 secondes.
   - Guard CSS custom properties pour très vieux navigateurs.
   - Nettoyage DOM programmé dynamiquement après la fin de la dernière
     particule de la dernière rafale.
   @param {boolean} [isThreeStars=true] – Intensité (réservé pour évolution) */
function _launchConfetti(isThreeStars) {
  /* Guard : s'assurer que les CSS custom properties sont disponibles */
  if (typeof document.documentElement.style.setProperty !== 'function') return;

  /* Palette selon le thème actif */
  const isFranceTheme = document.documentElement.classList.contains('theme-french');
  const colors = isFranceTheme
    ? ['#002395', '#ffffff', '#ED2939', '#FFD700', '#4A6FE3', '#FF6B7A']  /* FR */
    : ['#C60B1E', '#FFD700', '#F1BF00', '#ffffff', '#E05020', '#FFE566']; /* ES */

  /* Créer l'overlay */
  const overlay = document.createElement('div');
  overlay.className = 'confetti-overlay';
  document.body.appendChild(overlay);

  /* ── Paramètres ajustables ──────────────────────────────────────────
     WAVES          : nombre de rafales successives (effet "vagues")
     COUNT_PER_WAVE : nombre de particules par rafale
     WAVE_GAP       : écart (s) entre le départ de chaque rafale
     STAGGER        : échelonnement (s) entre particules d'une même rafale
     DUR_MIN/MAX    : durée de chute (s) — variable pour un effet naturel
     ──────────────────────────────────────────────────────────────── */
  const WAVES          = 3;
  const COUNT_PER_WAVE = 16;
  const WAVE_GAP       = 0.8;
  const STAGGER        = 0.025;
  const DUR_MIN        = 1.6;
  const DUR_MAX        = 2.0;

  let particleIndex = 0;
  for (let w = 0; w < WAVES; w++) {
    for (let i = 0; i < COUNT_PER_WAVE; i++) {
      const p = document.createElement('div');
      p.className = 'conf-p';

      /* Position X : répartie en zones pour éviter les regroupements */
      const zone   = (i / COUNT_PER_WAVE) * 100;
      const jitter = (Math.random() - 0.5) * 14;
      const cx     = Math.max(2, Math.min(98, zone + jitter));

      /* Couleur cyclique dans la palette (continue d'une rafale à l'autre) */
      const color = colors[particleIndex % colors.length];

      /* Scale aléatoire entre 0.7 et 1.5 */
      const scale = (0.7 + Math.random() * 0.8).toFixed(2);

      /* Délai = décalage de la rafale + échelonnement propre à la rafale */
      const delay = (w * WAVE_GAP + i * STAGGER).toFixed(3) + 's';

      /* Durée de chute variable (effet plus naturel qu'une durée fixe) */
      const dur = (DUR_MIN + Math.random() * (DUR_MAX - DUR_MIN)).toFixed(2) + 's';

      p.style.setProperty('--cx', cx + '%');
      p.style.setProperty('--cr', color);
      p.style.setProperty('--cs', scale);
      p.style.setProperty('--cd', delay);
      p.style.setProperty('--cdur', dur);

      overlay.appendChild(p);
      particleIndex++;
    }
  }

  /* Nettoyer après la fin de la dernière particule de la dernière rafale
     (délai max de départ + durée max de chute + marge de sécurité). */
  const lastStartDelay = (WAVES - 1) * WAVE_GAP + (COUNT_PER_WAVE - 1) * STAGGER;
  const cleanupDelay   = Math.ceil((lastStartDelay + DUR_MAX + 0.3) * 1000);
  setTimeout(() => {
    if (overlay?.parentNode) overlay.parentNode.removeChild(overlay);
  }, cleanupDelay);
}

/* Verrou contre les doubles appels simultanés (ex : double-clic rapide sur Continuer) */
let _loadDataInProgress = false;

function loadDataForMode(mode, callback) {
  const alreadyLoaded = (mode === 'learn_french')
    ? (typeof ALL_THEMES_FR !== 'undefined')
    : (typeof ALL_THEMES_ES !== 'undefined');

  if (alreadyLoaded) {
    callback();
    return;
  }

  /* Évite d'injecter deux balises <script> si l'utilisateur double-clique */
  if (_loadDataInProgress) return;
  _loadDataInProgress = true;

  const src = (mode === 'learn_french') ? 'js/data-fr.js' : 'js/data-es.js';
  const script = document.createElement('script');
  script.src = src;

  script.onload = function() {
    _loadDataInProgress = false;
    _hideSpinner();
    callback();
  };

  script.onerror = function() {
    _loadDataInProgress = false;
    _hideSpinner();
    _showToast('⚠️ Erreur de chargement des données (' + src + '). Vérifiez votre connexion.', 5000);
  };

  _showSpinner();
  document.head.appendChild(script);
}


/* ═══════════════════════════════════════════════════════════
   1. VARIABLES D'ÉTAT GLOBALES
   ─────────────────────────────────────────────────────────
   Ces variables sont partagées entre toutes les fonctions.
   Elles doivent être initialisées AVANT tout appel à initApp().
   Ne jamais les déclarer localement dans une fonction.
═══════════════════════════════════════════════════════════ */

// Mode courant : 'learn_french' (Espagnol → Français) ou 'learn_spain' (Français → Espagnol)
let currentMode = '';

// Variante hispanique sélectionnée (codes ISO pays) ; par défaut : Espagne castillane
// Valeurs possibles : 'ES' | 'MX' | 'CO' | 'PE' | 'VE' | 'AR' | 'EC'
let currentRegion = 'ES';

// Code BCP-47 utilisé par la Web Speech API pour la synthèse vocale.
// Initialisé à vide ; assigné par initApp() selon le mode sélectionné.
let voiceLang = '';

// Tableau de tous les thèmes actifs, rempli par initApp() depuis data.js
let ALL_THEMES = [];

// Clé localStorage distincte par mode, pour conserver deux progressions indépendantes
let STORAGE_KEY = '';

// Clé localStorage distincte par mode, pour suivre les modules déjà ouverts au
// moins une fois (badge "🆕 Nouveau" — Amélioration visuelle 12/07/2026, cf §4)
let OPENED_STORAGE_KEY = '';

// ─── Variables de session (réinitialisées à chaque ouverture de thème) ───
let CT          = null;   // Thème courant (Current Theme)
let fcIdx       = 0;       // Index de la carte flash active
let dqStep      = 0;       // Étape du quiz dialogue
let dqScore     = 0;       // Score du quiz dialogue
let dqAnswered  = false;   // Anti double-clic sur les options du quiz dialogue
let sitIdx      = 0;       // Index de la situation active dans un dialogue
let q10Step     = 0;       // Étape du quiz 10 questions
let q10Score    = 0;       // Score du quiz 10 questions
let q10Answered = false;   // Anti double-clic sur les options du quiz 10

// Cache des questions générées dynamiquement pour le quiz de Niveau 1
// Régénéré à chaque ouverture d'onglet Quiz pour garantir la variété
let _currentDynQuiz = [];

// Clé sessionStorage utilisée pour mémoriser la position dans un quiz en cours
// (perdue à la fermeture de l'onglet, conservée si on quitte/revient sur la leçon)
const QUIZ_SESSION_KEY = 'quiz_session';

// Progression persistante : tableau d'objets { id: string, stars: 1|2|3 }
let done = [];

// Modules déjà ouverts au moins une fois (tableau d'ids), persistant par mode.
// Sert uniquement à distinguer "jamais essayé" (badge Nouveau) de "essayé mais
// pas encore réussi" — les étoiles seules ne suffisent pas à faire cette
// distinction, puisqu'un module à 0 étoile peut avoir été ouvert et raté.
let openedThemes = [];


/* ═══════════════════════════════════════════════════════════
   1b. UTILITAIRES CENTRAUX DE SÉLECTION BILINGUE
   ─────────────────────────────────────────────────────────
   L(fr, es)   — retourne `fr` en mode learn_french, `es` sinon.
                 Remplace tous les blocs if/else de texte bilingue.
   isFrench()  — raccourci booléen pour les rares cas où une
                 branche entière dépend du mode.
   langKeys()  — retourne { src, tgt } pour indexer les objets
                 { fr, es } dans les cartes et les quiz.
═══════════════════════════════════════════════════════════ */

/**
 * Sélecteur bilingue central.
 * @param {string} fr  – Valeur en mode learn_french (interface ES, langue apprise FR)
 * @param {string} es  – Valeur en mode learn_spain  (interface FR, langue apprise ES)
 * @returns {string}
 */
function L(fr, es) {
  return currentMode === 'learn_french' ? fr : es;
}

/** @returns {boolean} true si le mode actif est learn_french */
function isFrench() {
  return currentMode === 'learn_french';
}

/**
 * Retourne les clés source/cible selon le mode.
 * src = langue affichée en premier (recto carte, question quiz)
 * tgt = langue de la traduction (verso carte, réponse)
 * @returns {{ src: 'fr'|'es', tgt: 'es'|'fr' }}
 */
function langKeys() {
  return isFrench()
    ? { src: 'fr', tgt: 'es' }
    : { src: 'es', tgt: 'fr' };
}

/**
 * Résout le titre d'un thème dans la langue source (nom principal)
 * et la langue cible (sous-titre), en gérant :
 *   - le cas particulier de l'alphabet (type:'alpha') dont les libellés
 *     sont inversés selon le mode actif ;
 *   - les sous-titres contenant un '/' en mode learn_spain (on ne garde
 *     que la partie française, à droite du slash) ;
 *   - la capitalisation de sécurité (première lettre en majuscule).
 * Fonction unique de référence — utilisée par _buildThemeCard et openTheme.
 * @param {Object} t – Objet thème issu de data.js
 * @returns {{ main: string, sub: string }}
 */
function _themeTitle(t) {
  const isAlpha = (t.id === 'alpha' || t.type === 'alpha');
  let main, sub;

  if (isAlpha) {
    main = L("L'Alphabet", 'El Alfabeto');
    sub  = L('El Alfabeto', "L'Alphabet");
  } else {
    main = t.name || '';
    const rawSub = t.sub || '';
    // En mode learn_spain, certains sous-titres contiennent "ES / FR" :
    // on ne conserve que la partie française (après le slash).
    sub = (!isFrench() && rawSub.includes('/'))
      ? rawSub.split('/')[1].trim()
      : rawSub;
  }

  // Capitalisation de sécurité (première lettre en majuscule)
  const _cap = s => s ? s.trim().charAt(0).toUpperCase() + s.trim().slice(1) : s;
  return { main: _cap(main), sub: _cap(sub) };
}

/**
 * Retourne le texte "parlé" d'une carte (le mot dans la langue source).
 * @param {Object} card – Objet mot { fr, es }
 * @returns {string}
 */
function _spokenKey(card) {
  return L(card.fr, card.es);
}



/* ═══════════════════════════════════════════════════════════
   3. POINT D'ENTRÉE : initApp(mode)
   ─────────────────────────────────────────────────────────
   Nouveau flux (3 étapes) :
     Launcher Vue A (cartes) → Launcher Vue B (variante) → Guide → Sections

   showLauncherVariant(mode) — appelée au clic sur une carte de langue.
     Bascule le Launcher vers la Vue B (sélecteur de variante).

   initApp(mode) — appelée par le bouton "Continuer" de la Vue B.
     Configure thème, données, progression, puis lance le Guide.

   showLauncher() — retour au Launcher Vue A depuis Sections.
═══════════════════════════════════════════════════════════ */

/**
 * Appelée au clic sur une carte de langue dans le Launcher.
 * Bascule le Launcher vers la Vue B : sélecteur de variante + bouton Continuer.
 * @param {'learn_french'|'learn_spain'} mode
 */
function showLauncherVariant(mode) {
  currentMode = mode;

  /* — Restauration de la région préférée depuis localStorage — */
  const _VALID_REGIONS = ['ES', 'MX', 'CO', 'PE', 'VE', 'AR', 'EC'];
  const savedRegion = localStorage.getItem('user_preferred_region');
  currentRegion   = (_VALID_REGIONS.includes(savedRegion)) ? savedRegion : 'ES';

  /* — Thème visuel provisoire (pour que les couleurs du sélecteur soient correctes) — */
  document.documentElement.className = (mode === 'learn_french') ? 'theme-french' : 'theme-spain';

  /* — Bascule Vue A → Vue B + fond dégradé pays — */
  document.getElementById('launcher-view-cards').style.display   = 'none';
  document.getElementById('launcher-view-variant').style.display = 'flex';
  document.getElementById('launcher-view-variant').style.flexDirection = 'column';
  document.getElementById('launcher-view-variant').style.alignItems = 'center';
  document.getElementById('app-launcher').classList.add('variant-active');

  /* — Drapeau et titre selon le mode — */
  const flagEmojis = { ES:'🇪🇸', MX:'🇲🇽', CO:'🇨🇴', PE:'🇵🇪', VE:'🇻🇪', AR:'🇦🇷', EC:'🇪🇨' };
  const flagRow   = document.getElementById('launcherFlagRow');
  const titleEl   = document.getElementById('launcherVariantTitle');
  if (mode === 'learn_french') {
    if (flagRow)  flagRow.textContent  = '🇫🇷';
    if (titleEl)  titleEl.textContent  = 'Apprendre le Français';
  } else {
    if (flagRow)  flagRow.textContent  = flagEmojis[currentRegion] || '🇪🇸';
    if (titleEl)  titleEl.textContent  = 'Aprender Español';
  }

  /* — Génération de la grille visuelle de drapeaux — */
  const selectorWrap = document.getElementById('region-selector-wrap');
  if (selectorWrap) {
    selectorWrap.style.display = 'block';
    renderRegionGrid(mode);
    pickRegion(currentRegion);
  }

  /* — Affichage conditionnel des groupes d'icônes 🏠/❓ (gauche) et 📚/🚪
       (droite) — Modifié le 21/07/2026 (2e demande utilisateur) : le logo
       central reste toujours visible et centré (cf. .launcher-variant-
       logo-wrap en flex:1) ; seules les icônes de navigation apparaissent
       uniquement à partir du 2e passage par l'app (!_isBrandNewUser()) —
       au tout premier passage (avant d'avoir jamais atteint le Guide),
       cet écran reste volontairement sans navigation annexe. */
  const showVariantIcons = !_isBrandNewUser();
  const iconsLeft  = document.getElementById('launcherVariantIconsLeft');
  const iconsRight = document.getElementById('launcherVariantIconsRight');
  if (iconsLeft)  iconsLeft.style.display  = showVariantIcons ? 'flex' : 'none';
  if (iconsRight) iconsRight.style.display = showVariantIcons ? 'flex' : 'none';

  /* — Texte et handler du bouton Continuer selon le mode —
     On attache un handler nommé pour pouvoir le retirer proprement
     si showLauncherVariant() est rappelée (changement de mode). */
  const continueBtn = document.getElementById('launcherContinueBtn');
  if (continueBtn) {
    continueBtn.innerHTML = (mode === 'learn_french')
      ? '▶ Commencer<br><span class="translation-sub">Empezar</span>'
      : '▶ Empezar<br><span class="translation-sub">Commencer</span>';
    // Supprime l'éventuel handler précédent avant d'en attacher un nouveau
    if (continueBtn._launcherHandler) {
      continueBtn.removeEventListener('click', continueBtn._launcherHandler);
    }
    continueBtn._launcherHandler = function() {
      /* — Chargement conditionnel : injecte data-fr.js ou data-es.js
           seulement si ce n'est pas déjà fait, puis lance initApp(). — */
      const btn = this;
      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '\u23f3 Chargement\u2026';
      loadDataForMode(mode, () => {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        initApp(mode);
      });
    };
    continueBtn.addEventListener('click', continueBtn._launcherHandler);
  }

  /* — Handler du bouton retour → Vue A —
     Même pattern : handler nommé stocké sur l'élément. */
  const backBtn = document.getElementById('launcherBackBtn');
  if (backBtn) {
    if (backBtn._launcherHandler) {
      backBtn.removeEventListener('click', backBtn._launcherHandler);
    }
    backBtn._launcherHandler = function() {
      /* S'assurer que tous les écrans sont masqués et que le launcher est bien actif */
      document.querySelectorAll('.screen').forEach((s) => {
        s.classList.remove('active');
      });
      document.getElementById('app-launcher').classList.add('active');
      document.getElementById('launcher-view-variant').style.display = 'none';
      document.getElementById('launcher-view-cards').style.display   = 'flex';
      document.getElementById('launcher-view-cards').style.flexDirection = 'column';
      document.getElementById('launcher-view-cards').style.alignItems = 'center';
      document.getElementById('app-launcher').classList.remove('variant-active');
      document.documentElement.className = '';
      currentMode = '';
      _setLauncherFooterLang(null);
      /* Retour à Vue A → Langue reste actif, currentMode réinitialisé */
      _updateBottomNav('app-launcher');
      /* Réaffiche le raccourci ❓ propre à la Vue A, masqué pendant la Vue B */
      _updateCardsNavIcons();
    };
    backBtn.addEventListener('click', backBtn._launcherHandler);
  }

  /* — Traduction du footer selon le mode (langue d'interface = langue opposée à celle apprise) — */
  _setLauncherFooterLang(mode);

  /* — Mettre à jour la barre de nav : Langue actif sur l'écran 0 — */
  _updateBottomNav('app-launcher');
}

/**
 * Adapte la langue du pied de page du Launcher.
 * mode === 'learn_french' (hispanophone) → footer en espagnol
 * mode === 'learn_spain'  (francophone)  → footer en français
 * mode === null (Vue A, aucune langue choisie) → bilingue mixte par défaut
 */
function _setLauncherFooterLang(mode) {
  const footer = document.getElementById('launcherFooter');
  if (!footer) return;

  if (mode === 'learn_french') {
    footer.innerHTML =
      '© Junio 2026 – Sébastien Godet<br>' +
      'Asistido por IA Claude Sonnet 4.6 y Gemini 3.5 Flash<br>' +
      '<button class="footer-antispam-btn" onclick="openAndCopyEmail()">✉️ <span class="antispam-email">moc.liamg@61tedog.neitsabes</span></button> · ' +
      '<a href="https://www.linkedin.com/in/s%C3%A9bastien-godet-142ba6145" target="_blank" rel="noopener noreferrer">LinkedIn</a>';
  } else if (mode === 'learn_spain') {
    footer.innerHTML =
      '© Juin 2026 – Sébastien Godet<br>' +
      'Assisté par IA Claude Sonnet 4.6 et Gemini 3.5 Flash<br>' +
      '<button class="footer-antispam-btn" onclick="openAndCopyEmail()">✉️ <span class="antispam-email">moc.liamg@61tedog.neitsabes</span></button> · ' +
      '<a href="https://www.linkedin.com/in/s%C3%A9bastien-godet-142ba6145" target="_blank" rel="noopener noreferrer">LinkedIn</a>';
  } else {
    footer.innerHTML =
      '© Juin 2026 – Sébastien Godet<br>' +
      'Assisté par IA Claude Sonnet 4.6 et Gemini 3.5 Flash<br>' +
      '<button class="footer-antispam-btn" onclick="openAndCopyEmail()">✉️ <span class="antispam-email">moc.liamg@61tedog.neitsabes</span></button> · ' +
      '<a href="https://www.linkedin.com/in/s%C3%A9bastien-godet-142ba6145" target="_blank" rel="noopener noreferrer">LinkedIn</a>';
  }
}

/**
 * Revient au Launcher (Vue A) depuis l'écran Sections.
 * Masque tous les écrans et réaffiche le Launcher avec la Vue A.
 */
function showLauncher() {
  /* Réinitialise le mode et le thème visuel UNIQUEMENT quand on revient au launcher */
  currentMode = '';
  document.querySelectorAll('.screen').forEach(s => { s.classList.remove('active'); });
  document.getElementById('launcher-view-variant').style.display = 'none';
  document.getElementById('launcher-view-cards').style.display   = 'flex';
  document.getElementById('launcher-view-cards').style.flexDirection = 'column';
  document.getElementById('launcher-view-cards').style.alignItems = 'center';
  document.getElementById('app-launcher').classList.add('active');
  document.getElementById('app-launcher').classList.remove('variant-active');
  document.documentElement.className = '';
  _setLauncherFooterLang(null);
  /* La barre de nav reste visible sur le launcher, avec Langue actif */
  _updateBottomNav('app-launcher');
  /* Raccourci ❓ Guide de la Vue A — visible dès le 2e lancement (demande utilisateur du 20/07/2026) */
  _updateCardsNavIcons();
  window.scrollTo(0, 0);
  document.documentElement.lang = 'fr';
}

/**
 * Initialise l'application pour un mode d'apprentissage donné.
 * Appelée par le bouton "Continuer" de la Vue B du Launcher.
 * Configure thème, données, progression, puis ouvre le Guide.
 * Nouveau flux : Launcher → Guide → Sections (sans écran Home).
 * @param {'learn_french'|'learn_spain'} mode
 */
function initApp(mode) {
  currentMode = mode;

  /* — Réinitialisation complète des tableaux de thèmes et des grilles HTML — */
  ALL_THEMES = [];
  const g1 = document.getElementById('grid1');
  const g2 = document.getElementById('grid2');
  if (g1) g1.innerHTML = '';
  if (g2) g2.innerHTML = '';

  /* — Réinitialisation de la voix espagnole (force une nouvelle détection) — */
  _spanishVoice     = undefined;
  _hasNotifiedVoice = false;

  /* — La région a déjà été choisie dans showLauncherVariant() — */
  const flagEmojis = { ES:'🇪🇸', MX:'🇲🇽', CO:'🇨🇴', PE:'🇵🇪', VE:'🇻🇪', AR:'🇦🇷', EC:'🇪🇨' };
  const activeFlag  = flagEmojis[currentRegion] || '🇪🇸';

  /* ─── MODE : Apprendre le Français (interface présentée en Espagnol) ─── */
  if (mode === 'learn_french') {
    document.documentElement.className = 'theme-french';
    document.documentElement.lang = 'es';
    voiceLang  = 'fr-FR';
    ALL_THEMES = ALL_THEMES_FR;
    STORAGE_KEY = 'pe_es_fr_done_v1';
    OPENED_STORAGE_KEY = 'pe_es_fr_opened_v1';

    _setUI({
      homeFlagRow    : '🇫🇷',
      homeTitle      : 'Apprendre le Français',
      homeStartBtn   : '▶ Commencer<br><span class="translation-sub">Empezar</span>',
      sectionsTitle  : '📚 Modules',
      sectionsFlag   : '🇫🇷',
      lessonBackBtn  : '← Modules<br><span class="translation-sub">Módulos</span>',
      level1Badge    : '1',
      level1Label    : '<span>Niveau 1 — Vocabulaire<br><span class="level-tab-sub">Nivel 1 — Vocabulario</span></span>',
      level2Badge    : '2',
      level2Label    : '<span>Niveau 2 — Phrases simples<br><span class="level-tab-sub">Nivel 2 — Frases sencillas</span></span>'
    });

  /* ─── MODE : Apprendre l'Espagnol (interface présentée en Français) ─── */
  } else if (mode === 'learn_spain') {
    document.documentElement.className = 'theme-spain region-' + currentRegion;
    document.documentElement.lang = 'fr';
    voiceLang  = 'es-ES';
    ALL_THEMES = ALL_THEMES_ES;
    STORAGE_KEY = 'pe_fr_es_done_v1';
    OPENED_STORAGE_KEY = 'pe_fr_es_opened_v1';

    _setUI({
      homeFlagRow    : activeFlag,           // Drapeau dynamique selon la région mémorisée
      homeTitle      : 'Aprender Español',
      homeStartBtn   : '▶ Empezar<br><span class="translation-sub">Commencer</span>',
      sectionsTitle  : '📚 Módulos',
      sectionsFlag   : activeFlag,           // Drapeau de la variante régionale apprise
      lessonBackBtn  : '← Módulos<br><span class="translation-sub">Modules</span>',
      level1Badge    : '1',
      level1Label    : '<span>Nivel 1 — Vocabulario<br><span class="level-tab-sub">Niveau 1 — Vocabulaire</span></span>',
      level2Badge    : '2',
      level2Label    : '<span>Nivel 2 — Frases sencillas<br><span class="level-tab-sub">Niveau 2 — Phrases simples</span></span>'
    });
  }

  /* — Préchargement de la voix en arrière-plan dès l'entrée dans le mode —
       Pour le mode espagnol : déclenche la résolution immédiatement (sans attendre
       l'ouverture d'une leçon) afin que la voix soit prête dès le 1er tap 🔊.
       Pour le mode français : la voix système est disponible sans délai. */
  if (mode === 'learn_spain') {
    /* Petit délai pour laisser le DOM se stabiliser avant la requête voix */
    setTimeout(() => {
      _resolveSpanishVoice(() => { /* voix en cache — rien à faire */ });
    }, 400);
  }

  /* — Chargement de la progression sauvegardée pour ce mode — */
  loadDone();
  loadOpened();

  /* — Construction du guide intégré dans l'écran #home (style Oromo) —
       _buildHomeGuide() active le bon bloc de langue et injecte les
       éléments dynamiques (drapeaux, titre, badges, boutons…). */
  _buildHomeGuide();

  /* — Masquer le launcher, puis afficher le guide (#home) UNE FOIS PAR LANGUE —
       L'apprenant voit le guide au premier lancement de CHAQUE mode (présentation
       de l'app, bouton "Commencer" pour accéder aux modules). Une fois quitté,
       le flag localStorage propre à ce mode (cf. _guideSeenKey()) est posé par
       showScreen() et le guide ne se relance plus tout seul aux lancements
       suivants DANS CETTE LANGUE — il va alors directement aux modules. S'il
       change de langue et que le guide n'a jamais été vu pour l'autre mode, il
       le reverra (utile en cas d'erreur de langue au premier lancement). Reste
       accessible à tout moment via le bouton ❓ Guide de la nav bar (cf.
       _maybeAutoShowGuide()).
       Note : renderSections() est volontairement PAS appelé ici — il est
       déclenché par showScreen() lui-même (vers 'home' ou 'sections-level1'
       selon le cas). L'appeler ici en plus créerait un chevauchement
       d'écrans pendant la transition d'animation (300 ms). */
  document.getElementById('app-launcher').classList.remove('active');
  _maybeAutoShowGuide();

  /* Signature mascotte des pieds de page dès le tout premier affichage
     (pickRegion() n'est pas systématiquement rappelé à ce stade) */
  _refreshFooterMascot();
}


/* ─────────────────────────────────────────────────────────
   _setUI(t) — Injecte les textes de l'interface dans le DOM
   Paramètre : objet t contenant les clés = IDs des éléments HTML
   Utilise innerHTML pour interpréter les balises HTML bilingues.
───────────────────────────────────────────────────────── */
function _setUI(t) {
  /* homeFlagRow et homeBackBtn n'existent plus dans le nouveau #home style Oromo —
     les drapeaux et le titre sont gérés par _buildHomeGuide(). */
  _setText('sectionsTitle',   t.sectionsTitle);
  _setText('sectionsTitle2',  t.sectionsTitle);     // Écran sections-level2
  _setText('sectionsFlag',    t.sectionsFlag);
  _setText('sectionsFlag2',   t.sectionsFlag);      // Écran sections-level2
  _setText('lessonBackBtn',   t.lessonBackBtn);
  _setText('level1Badge',     t.level1Badge);
  _setText('level1Label',     t.level1Label);
  _setText('level1LabelB',    t.level1Label);       // Onglet sur sections-level2
  _setText('level2Badge',     t.level2Badge);
  _setText('level2Label',     t.level2Label);
  _setText('level2LabelB',    t.level2Label);       // Onglet sur sections-level2
  /* homeStartBtn est câblé par _buildHomeGuide() — pas besoin ici */
}

/* _setText(id, val) — Remplace innerHTML d'un élément par val.
   ⚠️  SÉCURITÉ : utilise innerHTML (et non textContent) pour interpréter les
   balises HTML embarquées dans les libellés bilingues (<span>, <br>…).
   À n'appeler QU'avec des littéraux JS hardcodés provenant de _setUI().
   Ne jamais passer de données utilisateur ou d'entrées réseau non sanitisées. */
function _setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = val || '';
}


/* ═══════════════════════════════════════════════════════════
   3b. SYNTHÈSE VOCALE — Voix espagnole avec cascade locale
   ─────────────────────────────────────────────────────────
   La Web Speech API charge ses voix de façon asynchrone.
   Pour l'espagnol, on résout d'abord la meilleure voix disponible
   (voix exacte → voix secours espagnol → voix par défaut).

   Fonctions :
     _resolveSpanishVoice(callback) — résout la voix asynchronement
     speak(txt)                     — prononce un texte selon le mode
     _doSpeak(txt, voiceObj, rate)  — synthèse TTS bas niveau
═══════════════════════════════════════════════════════════ */

// Voix espagnole résolue (undefined = non encore cherchée, null = introuvable)
let _spanishVoice     = undefined;
// Empêche la répétition de l'alerte de configuration audio
let _hasNotifiedVoice = false;

// Qualité de la voix espagnole résolue : 'exact' | 'fallback' | 'default' | null
let _spanishVoiceQuality = null;
// Nom lisible de la voix résolue (pour le badge)
let _spanishVoiceLabel   = '';

// ─── Contrôle de vitesse TTS ───
// Valeurs : 0.55 (très lent) | 0.70 (lent) | 0.85 (confort apprenant) | 1.00 (débit natif du moteur) | 1.20 (très rapide)
// Corrigé le 09/07/2026 : le palier 0.85 était étiqueté "Normal", ce qui laissait
// croire à tort qu'il s'agissait du débit natif d'un locuteur. En réalité rate=1.00
// est le débit "natif" au sens de la Web Speech API ; 0.85 est un ralentissement
// volontaire pour le confort d'un apprenant. Retour testeur bêta (Firefox/Android)
// du 09/07/2026. Renommé en "Confort" pour lever l'ambiguïté.
// Persisté en sessionStorage pour la session courante
const SPEED_LEVELS = [
  { id:'xslow',  rate: 0.55, label:'0.55×', title: function() { return L('Muy lento',   'Très lent');    } },
  { id:'slow',   rate: 0.70, label:'0.70×', title: function() { return L('Lento',       'Lent');         } },
  { id:'normal', rate: 0.85, label:'0.85×', title: function() { return L('Cómodo',      'Confort');      } },
  { id:'fast',   rate: 1.00, label:'1×',    title: function() { return L('Nativo',      'Débit natif');  } },
  { id:'xfast',  rate: 1.20, label:'1.20×', title: function() { return L('Muy rápido',  'Très rapide');  } }
];
function _getTtsSpeed() {
  const saved = sessionStorage.getItem('vachebo_tts_speed');
  return saved || 'normal';
}
function _setTtsSpeed(id) {
  sessionStorage.setItem('vachebo_tts_speed', id);
  _updateSpeedBar();
}
function _getTtsRate() {
  const id = _getTtsSpeed();
  const s = SPEED_LEVELS.find((x) => { return x.id === id; });
  return s ? s.rate : 0.85;
}

// ─── Contrôle de répétition TTS (drill de prononciation) ───
// 3 paliers ×1 / ×2 / ×3, persistés en sessionStorage pour la session
// courante. Corrigé le 07/07/2026 : ×1 est la valeur par défaut (pas de
// répétition) — inutile d'afficher un bouton pour ce cas. Seuls ×2 et ×3
// sont affichés, en bascule : un clic active le palier, un second clic
// (sur le même bouton) revient à ×1. Voir _toggleTtsRepeat().
const REPEAT_MAX = 3;
function _getTtsRepeat() {
  const saved = parseInt(sessionStorage.getItem('vachebo_tts_repeat'), 10);
  return (saved >= 1 && saved <= REPEAT_MAX) ? saved : 1;
}
function _setTtsRepeat(n) {
  sessionStorage.setItem('vachebo_tts_repeat', String(n));
  _updateSpeedBar();
}
function _toggleTtsRepeat(n) {
  _setTtsRepeat(_getTtsRepeat() === n ? 1 : n);
}

/* Résout de façon asynchrone la meilleure voix espagnole disponible sur l'appareil.
   Cascade : voix exacte (ex: es-EC) → tout espagnol disponible → voix[0]
   Le résultat est mis en cache dans _spanishVoice pour les appels suivants. */
function _resolveSpanishVoice(callback) {
  // Si déjà résolue (même null), on retourne directement
  if (_spanishVoice !== undefined) {
    callback(_spanishVoice);
    return;
  }

  // Table de correspondance région → code BCP-47
  const langMap = {
    ES:'es-ES', MX:'es-MX', CO:'es-CO', AR:'es-AR', PE:'es-PE', VE:'es-VE', EC:'es-EC'
  };

  function search() {
    const voices = speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return false;

    const targetLang = langMap[currentRegion] || 'es-ES';

    /* Table de noms lisibles par code région (bilingue ES / FR) */
    const regionLabels = {
      ES: L('España (Castellano)', 'Espagne (Castillan)'),
      MX: L('México',              'Mexique'),
      CO: L('Colombia',            'Colombie'),
      AR: L('Argentina',           'Argentine'),
      PE: L('Perú',                'Pérou'),
      VE: L('Venezuela',           'Venezuela'),
      EC: L('Ecuador',             'Équateur')
    };
    const regionName = regionLabels[currentRegion] || currentRegion;

    let foundVoice = null;
    let foundLabel = regionName + ' ' + L('(Voz por defecto)', '(Voix par défaut)');
    let foundQuality = 'default';

    // Priorité 1 : voix exactement correspondant à la région (ex : es-MX pour le Mexique)
    foundVoice = voices.find((v) => {
      return v.lang.toLowerCase() === targetLang.toLowerCase();
    });
    if (foundVoice) {
      foundLabel   = regionName;
      foundQuality = 'exact';
    } else {
      // Priorité 2 : n'importe quel espagnol disponible (ex : es-ES si es-MX absent)
      foundVoice = voices.find((v) => {
        return v.lang.toLowerCase().indexOf('es') === 0;
      });
      if (foundVoice) {
        if (currentRegion === 'ES') {
          // Corrigé le 07/07/2026 : pour le Castillan, toute voix espagnole
          // disponible convient — c'est la variante de référence, il n'y a
          // pas de vrai "secours" régional à signaler ici (contrairement à
          // l'Argentine, au Venezuela, etc. dont l'accent diffère vraiment
          // d'une voix es-ES générique). On affiche donc directement en vert,
          // comme pour une correspondance exacte, sans "(secours : ...)".
          foundLabel   = regionName;
          foundQuality = 'exact';
        } else {
          /* Résoudre le nom lisible de la voix de secours */
          const fallbackCode = foundVoice.lang.toUpperCase().split('-')[1] || 'ES';
          const fallbackName = regionLabels[fallbackCode] || foundVoice.lang;
          foundLabel   = regionName + ' ' + L('(secours: ', '(secours : ') + fallbackName + ')';
          foundQuality = 'fallback';
        }
      } else {
        foundLabel   = L('Voz por defecto', 'Voix par défaut');
        foundQuality = 'default';
      }
    }
    // Priorité 3 : première voix disponible (ultime recours)
    if (!foundVoice) { foundVoice = voices[0]; foundQuality = 'default'; }

    _spanishVoice        = foundVoice;
    _spanishVoiceQuality = foundQuality;
    _spanishVoiceLabel   = foundLabel;

    // Mise à jour du badge de voix dans le header leçon
    _updateVoiceBadge();

    // Notification discrète (toast) informant l'utilisateur de la voix configurée
    if (!_hasNotifiedVoice) {
      _hasNotifiedVoice = true;
      const msg = L(
        '🎙️ Voz configurada: ' + foundLabel,
        '🎙️ Voix configurée : ' + foundLabel
      );
      _showToast(msg);
    }

    callback(_spanishVoice);
    return true;
  }

  // Si les voix ne sont pas encore chargées, on attend l'événement voiceschanged.
  // Sur iOS/Safari, cet événement peut ne jamais se déclencher.
  // Un timeout de 2 s force la résolution avec les voix disponibles à ce moment
  // (ou la voix par défaut du système si la liste est encore vide).
  if (!search()) {
    let _voicesTimeout = null;

    /* Corrigé le 09/07/2026 (retour testeur bêta Firefox/Android) :
       BUG — les deux repères ci-dessous prenaient auparavant
       speechSynthesis.getVoices()[0] à l'aveugle, sans filtrer par langue.
       Si la première voix système n'était pas espagnole (ex : voix française
       ou voix d'une autre langue installée sur le téléphone), l'app lisait
       l'espagnol avec une voix qui ne l'était pas du tout — badge "❓ Voix
       par défaut" et prononciation incohérente, y compris pour le "secours".
       Correctif : on relance search() (cascade exact → es-* générique →
       premier recours) maintenant que la liste de voix est chargée, au lieu
       de dupliquer une logique de sélection sans filtre. search() gère déjà
       elle-même le callback, le badge et le toast quand elle réussit — on ne
       retombe sur `getVoices()[0]` que si la liste est réellement vide. */
    function _onVoicesChanged() {
      speechSynthesis.removeEventListener('voiceschanged', _onVoicesChanged);
      clearTimeout(_voicesTimeout);
      if (_spanishVoice === undefined) {
        if (search()) return; // search() a déjà appelé callback()
        _spanishVoice = speechSynthesis.getVoices()[0] || null;
      }
      callback(_spanishVoice);
    }

    speechSynthesis.addEventListener('voiceschanged', _onVoicesChanged);

    /* Timeout de sécurité : 1,2 s max — évite un callback silencieux sur iOS */
    _voicesTimeout = setTimeout(() => {
      speechSynthesis.removeEventListener('voiceschanged', _onVoicesChanged);
      if (_spanishVoice === undefined) {
        if (search()) return; // search() a déjà appelé callback() + badge + toast
        const fallback = speechSynthesis.getVoices();
        _spanishVoice = fallback.length > 0 ? fallback[0] : null;
        _spanishVoiceQuality = 'default';
        _spanishVoiceLabel   = L('Voz por defecto', 'Voix par défaut');
        if (!_hasNotifiedVoice) {
          _hasNotifiedVoice = true;
          _showToast(L('🎙️ Voz configurada: Voz por defecto', '🎙️ Voix configurée : Voix par défaut'));
        }
      }
      _updateVoiceBadge();
      callback(_spanishVoice);
    }, 1200);
  }
}

/* ─────────────────────────────────────────────────────────
   §3a-bis — SURLIGNAGE MOT PAR MOT PENDANT LA LECTURE (best-effort)
   ─────────────────────────────────────────────────────────
   Repose sur l'événement 'onboundary' de SpeechSynthesisUtterance.
   Cet événement n'est PAS déclenché de façon fiable par tous les moteurs
   TTS (en particulier certaines voix système Android) : dans ce cas,
   l'audio se lit normalement, simplement sans surlignage — dégradation
   silencieuse, jamais d'erreur visible pour l'utilisateur.
───────────────────────────────────────────────────────── */

/* _wordOffsets(str) → [{start,end}, ...] pour chaque mot de str. */
function _wordOffsets(str) {
  const out = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(str)) !== null) out.push({ start: m.index, end: m.index + m[0].length });
  return out;
}

/* _findWordIndex(offsets, charIndex) → index du mot correspondant à charIndex
   (ou le mot suivant le plus proche si charIndex tombe sur un espace). */
function _findWordIndex(offsets, charIndex) {
  for (let i = 0; i < offsets.length; i++) {
    if (charIndex >= offsets[i].start && charIndex < offsets[i].end) return i;
  }
  for (let j = 0; j < offsets.length; j++) {
    if (charIndex < offsets[j].start) return j;
  }
  return offsets.length - 1;
}

/* _setActiveWord(uid, partIdx, wordIdx) — Active le surlignage du mot ciblé,
   retire celui du mot précédent. */
function _setActiveWord(uid, partIdx, wordIdx) {
  const container = document.querySelector('[data-tts-container="' + uid + '"]');
  if (!container) return;
  const prev = container.querySelectorAll('.tts-word-active');
  for (let i = 0; i < prev.length; i++) prev[i].classList.remove('tts-word-active');
  const target = container.querySelector('[data-tts-part="' + partIdx + '"][data-tts-word="' + wordIdx + '"]');
  if (target) target.classList.add('tts-word-active');
}

/* _clearWordHighlight(uid) — Retire tout surlignage actif (fin de lecture). */
function _clearWordHighlight(uid) {
  if (!uid) return;
  const container = document.querySelector('[data-tts-container="' + uid + '"]');
  if (!container) return;
  const prev = container.querySelectorAll('.tts-word-active');
  for (let i = 0; i < prev.length; i++) prev[i].classList.remove('tts-word-active');
}

/* _buildSpeakableHTML(text, uid) — Enveloppe chaque mot de `text` dans un
   <span> ciblable par le surlignage. Gère aussi les textes multi-parties
   séparées par '/' (chaque partie étant lue séparément par le moteur TTS).
   `uid` doit être unique dans le DOM à l'instant T — un seul mot est
   surligné à la fois dans l'app, un id fixe par zone d'affichage suffit. */
function _buildSpeakableHTML(text, uid) {
  const parts = (text || '').split('/').map((p) => { return p.trim(); }).filter(Boolean);
  const html = parts.map((part, pi) => {
    const offsets = _wordOffsets(part);
    const words = offsets.map((o, wi) => {
      return '<span class="tts-word" data-tts-part="' + pi + '" data-tts-word="' + wi + '">'
        + part.slice(o.start, o.end) + '</span>';
    });
    return words.join(' ');
  }).join(' <span class="tts-sep">/</span> ');
  return '<span data-tts-container="' + uid + '">' + html + '</span>';
}

/* speak(txt, triggerBtn, opts) — Point d'entrée unique pour la synthèse vocale.
   Gère automatiquement :
     - Les textes avec '/' (prononce chaque partie avec 800ms de pause)
     - Le mode 'learn_spain' → voix espagnole résolue dynamiquement
     - Le mode 'learn_french'  → voix française (voiceLang = 'fr-FR')
     - La répétition complète du mot/phrase selon _getTtsRepeat()
     - triggerBtn (optionnel) : reçoit .is-speaking pendant la lecture,
       retiré au dernier onend pour un retour visuel immédiat.
   opts (optionnel) : { highlightUid } — active le surlignage mot par mot
     sur le conteneur DOM correspondant (cf. _buildSpeakableHTML).
   Si la synthèse échoue silencieusement (ex : iOS Safari avant la première
   interaction tactile de la page), un indicateur "🔇 Audio indisponible"
   discret est affiché via _showAudioUnavailable(). */
function speak(txt, triggerBtn, opts) {
  opts = opts || {};
  const onDone = typeof opts.onDone === 'function' ? opts.onDone : null;
  if (!txt) { if (onDone) onDone(); return; }
  if (!window.speechSynthesis) {
    _showAudioUnavailable();
    if (onDone) onDone();
    return;
  }
  const rate = _getTtsRate();
  if (currentMode !== 'learn_french') {
    _resolveSpanishVoice((voice) => {
      _doSpeak(txt, voice, rate, triggerBtn, opts);
    });
  } else {
    _doSpeak(txt, null, rate, triggerBtn, opts);
  }
}

/* _waitForVoicesReady(callback) — Garantit que la liste des voix système est
   chargée avant de tenter une synthèse vocale.
   BUG 5.2 : sur certains navigateurs mobiles (ex : Brave/Android), au tout
   premier chargement de la page, speechSynthesis.getVoices() renvoie un
   tableau vide : la liste des voix est encore en cours de chargement par le
   moteur natif. Si on appelle speechSynthesis.speak() à ce moment précis,
   la synthèse échoue silencieusement (onerror) et affiche à tort le badge
   "🔇 Audio indisponible", alors que la voix fonctionne très bien si on
   réessaie un instant après.
   Cette fonction attend l'événement 'voiceschanged' (déclenché par le
   navigateur une fois les voix réellement chargées) avant d'exécuter le
   callback. Un timeout de sécurité de 1.5 s est prévu pour les navigateurs
   où cet événement ne se déclenche jamais (ex : iOS Safari) — le callback
   est alors exécuté quand même, avec les voix disponibles à ce moment. */
let _voicesReady = false;
function _waitForVoicesReady(callback) {
  if (_voicesReady || !window.speechSynthesis) { callback(); return; }

  const voices = speechSynthesis.getVoices();
  if (voices?.length > 0) {
    _voicesReady = true;
    callback();
    return;
  }

  let _settled = false;
  const _voicesReadyTimeout = setTimeout(() => {
    if (_settled) return;
    _settled = true;
    speechSynthesis.removeEventListener('voiceschanged', _onVoicesReady);
    _voicesReady = true;
    callback();
  }, 1500);

  function _onVoicesReady() {
    if (_settled) return;
    _settled = true;
    clearTimeout(_voicesReadyTimeout);
    speechSynthesis.removeEventListener('voiceschanged', _onVoicesReady);
    _voicesReady = true;
    callback();
  }
  speechSynthesis.addEventListener('voiceschanged', _onVoicesReady);
}

/* _doSpeak(txt, voiceObj, rate, triggerBtn, opts) — Moteur TTS unique bas niveau.
   Utilisé par speak() (français ET espagnol, la résolution de voix se fait
   en amont) et par speakSlow(). Gère en un seul endroit :
     - la découpe sur '/' (pause `opts.partGap`ms, 800 par défaut) ;
     - la répétition complète de la séquence selon _getTtsRepeat()
       (pause `opts.repeatGap`ms entre deux répétitions, 500 par défaut) ;
     - le surlignage mot par mot best-effort si opts.highlightUid est fourni
       (repose sur 'onboundary', non garanti par tous les moteurs — dégrade
       silencieusement en simple lecture si l'événement ne se déclenche pas) ;
     - un jeton de génération (_ttsGen) qui invalide les callbacks d'un appel
       précédent si un nouvel appel à speak()/_doSpeak() démarre entre-temps
       (évite un chevauchement audio si l'utilisateur tape vite plusieurs
       boutons pendant une répétition en cours) ;
     - triggerBtn (optionnel) reçoit .is-speaking pendant toute la séquence.
   Attend d'abord que les voix soient chargées via _waitForVoicesReady()
   (cf. Bug 5.2) pour éviter une fausse alerte au premier chargement. */
let _ttsGen = 0;
function _doSpeak(txt, voiceObj, rate, triggerBtn, opts) {
  opts = opts || {};
  const onDone = typeof opts.onDone === 'function' ? opts.onDone : null;
  if (!window.speechSynthesis) {
    _showAudioUnavailable();
    if (onDone) onDone();
    return;
  }
  const partGap   = opts.partGap   != null ? opts.partGap   : 800;
  const repeatGap = opts.repeatGap != null ? opts.repeatGap : 500;
  const uid       = opts.highlightUid || null;
  const repeatN   = Math.max(1, _getTtsRepeat());

  _waitForVoicesReady(() => {
    const myGen = ++_ttsGen;
    speechSynthesis.cancel();
    const parts = (txt || '').split('/').map((p) => { return p.trim(); }).filter(Boolean);
    if (triggerBtn) triggerBtn.classList.add('is-speaking');
    _clearWordHighlight(uid);

    function finishAll() {
      if (triggerBtn) triggerBtn.classList.remove('is-speaking');
      _clearWordHighlight(uid);
      // N'appelle onDone que si cet appel est toujours le plus récent
      // (évite qu'un onDone périmé ne déclenche le micro en double).
      if (onDone && myGen === _ttsGen) onDone();
    }

    function speakPart(rep, i) {
      if (myGen !== _ttsGen) return; // supersédé par un appel plus récent
      if (i >= parts.length) {
        if (rep + 1 < repeatN) setTimeout(() => { speakPart(rep + 1, 0); }, repeatGap);
        else finishAll();
        return;
      }
      const partText = parts[i];
      const u = new SpeechSynthesisUtterance(partText);
      u.lang = voiceObj ? voiceObj.lang : voiceLang;
      u.rate = rate;
      if (voiceObj) u.voice = voiceObj;

      if (uid) {
        const offsets = _wordOffsets(partText);
        u.onboundary = function(ev) {
          if (myGen !== _ttsGen) return;
          if (ev.name && ev.name !== 'word') return; // ignore les bornes 'sentence' éventuelles
          _setActiveWord(uid, i, _findWordIndex(offsets, ev.charIndex));
        };
      }

      u.onend = function() {
        if (myGen !== _ttsGen) return;
        _hideAudioUnavailable();
        if (i + 1 < parts.length) setTimeout(() => { speakPart(rep, i + 1); }, partGap);
        else speakPart(rep, parts.length);
      };
      u.onerror = function() {
        if (myGen !== _ttsGen) return;
        _showAudioUnavailable();
        finishAll();
      };
      speechSynthesis.speak(u);
    }
    speakPart(0, 0);
  });
}

/* speakSlow(txt, triggerBtn, opts) — Prononce toujours au palier le plus lent
   (SPEED_LEVELS[0]), indépendamment du réglage de vitesse choisi par
   l'utilisateur. Respecte comme speak() la répétition (_getTtsRepeat()) et
   le surlignage mot par mot (opts.highlightUid). Conserve une pause de
   1000ms entre les parties (au lieu de 800ms pour speak()) — lecture plus
   posée à vitesse lente.
   Note (07/07/2026) : n'est plus appelée depuis l'UI des flashcards — le
   bouton "🐢 Lent" a été retiré (redondant avec la barre de vitesse
   0.55×–1.20× déjà disponible juste au-dessus). Fonction conservée telle
   quelle en cas de réutilisation future. */
function speakSlow(txt, triggerBtn, opts) {
  if (!txt || !window.speechSynthesis) return;
  const slowRate   = SPEED_LEVELS[0].rate;
  const mergedOpts = Object.assign({ partGap: 1000 }, opts || {});
  if (currentMode !== 'learn_french') {
    _resolveSpanishVoice((voice) => {
      _doSpeak(txt, voice, slowRate, triggerBtn, mergedOpts);
    });
  } else {
    _doSpeak(txt, null, slowRate, triggerBtn, mergedOpts);
  }
}

/* _updateVoiceBadge() — Met à jour le badge de voix dans le header leçon.
   Affiche la qualité de voix (exact ✅ / secours ⚠️ / défaut ❓)
   avec le drapeau et le nom de la région. */
function _updateVoiceBadge() {
  const badge = document.getElementById('voice-quality-badge');
  if (!badge) return;

  // Mode français : badge simplifié
  if (currentMode === 'learn_french') {
    badge.innerHTML = '🇫🇷 <span class="vqb-label">Voix Français</span>';
    badge.className = 'voice-quality-badge vqb-exact';
    badge.title = 'Voix française système';
    return;
  }

  const flagEmojis = { ES:'🇪🇸', MX:'🇲🇽', CO:'🇨🇴', PE:'🇵🇪', VE:'🇻🇪', AR:'🇦🇷', EC:'🇪🇨' };
  const flag = flagEmojis[currentRegion] || '🇪🇸';

  if (!_spanishVoiceLabel) {
    // Voix pas encore résolue
    badge.innerHTML = flag + ' <span class="vqb-label">…</span>';
    badge.className = 'voice-quality-badge vqb-pending';
    badge.title     = L('Cargando voz…', 'Chargement de la voix…');
    return;
  }

  let qualityIcon, qualityClass, qualityTitle;
  if (_spanishVoiceQuality === 'exact') {
    qualityIcon  = '✅';
    qualityClass = 'vqb-exact';
    qualityTitle = L('Voz exacta disponible', 'Voix exacte disponible');
  } else if (_spanishVoiceQuality === 'fallback') {
    qualityIcon  = '⚠️';
    qualityClass = 'vqb-fallback';
    qualityTitle = L('Voz de sustitución', 'Voix de substitution');
  } else {
    qualityIcon  = '❓';
    qualityClass = 'vqb-default';
    qualityTitle = L('Voz por defecto', 'Voix système par défaut');
  }

  badge.innerHTML = flag + ' <span class="vqb-label">' + _escAttr(_spanishVoiceLabel) + '</span> ' + qualityIcon;
  badge.className = 'voice-quality-badge ' + qualityClass;
  badge.title     = qualityTitle + ' — ' + _spanishVoiceLabel;
}

/* _updateSpeedBar() — Met à jour les boutons de vitesse + les boutons de
   répétition dans la barre persistante. */
function _updateSpeedBar() {
  const bar = document.getElementById('tts-speed-bar');
  if (!bar) return;
  const current = _getTtsSpeed();
  SPEED_LEVELS.forEach((s) => {
    const btn = bar.querySelector('[data-speed="' + s.id + '"]');
    if (!btn) return;
    btn.classList.toggle('speed-active', s.id === current);
    btn.title = s.title();
  });
  const repeatN = _getTtsRepeat();
  for (let n = 2; n <= REPEAT_MAX; n++) {
    const btn = bar.querySelector('[data-repeat="' + n + '"]');
    if (!btn) continue;
    btn.classList.toggle('repeat-active', n === repeatN);
  }
}

/* _buildSpeedBar() — Génère le HTML de la barre vitesse + boutons répétition + slot PDF.
   Corrigé le 07/07/2026 :
     - Ligne "Vitesse" (label + tortue + paliers + lièvre) désormais garantie
       sur une seule ligne (voir .speed-bar-row en CSS, scrollable au besoin
       plutôt que de retomber sur 2 lignes comme avant).
     - Répétition : ×1 est la valeur par défaut (pas de répétition), donc pas
       de bouton pour ce cas. Seuls ×2 et ×3 sont affichés, en bascule
       (_toggleTtsRepeat) : cliquer sur un bouton déjà actif revient à ×1. */
function _buildSpeedBar() {
  const speedBtns = SPEED_LEVELS.map((s) => {
    const active = _getTtsSpeed() === s.id ? ' speed-active' : '';
    return '<button class="speed-btn' + active + '" data-speed="' + s.id + '"'
      + ' title="' + s.title() + '"'
      + ' onclick="_setTtsSpeed(\'' + s.id + '\')">'
      + s.label + '</button>';
  }).join('');

  const repeatN = _getTtsRepeat();
  const repeatBtns = [2, 3].map((n) => {
    const active = repeatN === n ? ' repeat-active' : '';
    return '<button class="repeat-choice-btn' + active + '" data-repeat="' + n + '"'
      + ' title="' + L('Repetir', 'Répéter') + ' ×' + n + '"'
      + ' onclick="_toggleTtsRepeat(' + n + ')">×' + n + '</button>';
  }).join('');

  return '<div id="tts-speed-bar" class="tts-speed-bar">'
    + '<div class="speed-bar-row">'
    +   '<span class="speed-bar-label">🐢 ' + L('Velocidad', 'Vitesse') + '</span>'
    +   '<span class="speed-bar-pills">' + speedBtns + '</span>'
    +   '<span class="speed-bar-hare" aria-hidden="true">🐇</span>'
    + '</div>'
    + '<div class="repeat-bar-row">'
    +   '<span class="repeat-bar-label">🔁 ' + L('Repetir', 'Répéter') + '</span>'
    +   '<span class="repeat-bar-pills">' + repeatBtns + '</span>'
    +   '<div id="meta-pdf-slot"></div>'
    + '</div>'
    + '</div>';
}

/* _updateMetaPdfBtn(tab) — Injecte ou retire le bouton PDF dans #meta-pdf-slot selon l'onglet.
   Appelée par switchTab() à chaque changement. PDF : flash (hors alpha), dialog, vocab. */
function _updateMetaPdfBtn(tab) {
  const slot = document.getElementById('meta-pdf-slot');
  if (!slot) return;
  let hasPdf = false, onclick = '', ariaLabel = '';
  if (tab === 'flash' && CT?.words && CT.type !== 'alpha') {
    hasPdf = true; onclick = '_exportVocab()';
    ariaLabel = L('Exportar vocabulario PDF', 'Exporter le vocabulaire PDF');
  } else if (tab === 'dialog') {
    hasPdf = true; onclick = '_exportSituation()';
    ariaLabel = L('Exportar situación PDF', 'Exporter la situation PDF');
  } else if (tab === 'vocab') {
    hasPdf = true; onclick = '_exportVocab()';
    ariaLabel = L('Exportar vocabulario PDF', 'Exporter le vocabulaire PDF');
  }
  slot.innerHTML = hasPdf
    ? '<button class="export-pdf-btn export-pdf-btn--meta" onclick="' + onclick + '" aria-label="' + ariaLabel + '">📄 PDF</button>'
    : '';
}

// §3c — Interruption TTS + micro à la mise en arrière-plan
// Corrigé le 07/07/2026 : le TTS était bien coupé (speechSynthesis.cancel()),
// mais pas la reconnaissance vocale (SpeechRecognition). Sur iOS, quitter
// l'app (changer d'app, verrouiller l'écran…) pendant une écoute laissait la
// session micro active côté système : le badge micro (barre d'état iOS)
// restait affiché même dans d'autres applications. On arrête donc aussi
// _micReco (via _rpClearTimers, qui coupe le micro ET les timers de
// l'onglet Répète) dès que document.hidden passe à true.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) return;
  if (window.speechSynthesis) {
    speechSynthesis.cancel();
  }
  if (typeof _rpClearTimers === 'function') {
    _rpClearTimers();
  } else if (typeof _stopMicReco === 'function') {
    _stopMicReco();
  }
});

/* ─────────────────────────────────────────────────────────
   §3d — KEEPALIVE WATCHDOG — Chrome / Android
   ─────────────────────────────────────────────────────────
   Bug Chrome/Android (Chromium #503948) : speechSynthesis.speaking
   passe silencieusement à false après ~15 s d'inactivité du moteur
   TTS, figeant la synthèse sans déclencher onend ni onerror.

   Remède : un setInterval à 10 s qui appelle pause()/resume()
   uniquement si le moteur est censé parler (speaking && !paused).
   Ce micro-jolt réveille le thread TTS sans interruption perçue.
   L'intervalle est suspendu quand l'app passe en arrière-plan
   (document.hidden) pour économiser la batterie.
───────────────────────────────────────────────────────── */
let _ttsKeepAliveTimer = null;

function _startTtsKeepAlive() {
  if (_ttsKeepAliveTimer) return;
  if (!window.speechSynthesis) return;
  _ttsKeepAliveTimer = setInterval(() => {
    if (document.hidden) return;
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setTimeout(() => { speechSynthesis.resume(); }, 50);
    }
  }, 8000);
}

_startTtsKeepAlive();


/* ─────────────────────────────────────────────────────────
   INDICATEUR "AUDIO INDISPONIBLE"
   ─────────────────────────────────────────────────────────
   Sur iOS notamment, speechSynthesis peut échouer silencieusement
   tant que l'utilisateur n'a pas encore interagi avec la page
   (politique de déblocage audio des navigateurs mobiles).
   Cet indicateur discret informe l'utilisateur sans bloquer l'UI.
───────────────────────────────────────────────────────── */

// Empêche les notifications répétées tant que l'indicateur est déjà affiché
let _audioUnavailableShown = false;

/* Affiche un badge discret "🔇 Audio indisponible" en bas d'écran. */
function _showAudioUnavailable() {
  if (_audioUnavailableShown) return;
  _audioUnavailableShown = true;

  let badge = document.getElementById('audio-unavailable-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'audio-unavailable-badge';
    badge.style.cssText =
      'position:fixed;bottom:14px;left:50%;transform:translateX(-50%);'
      + 'background:rgba(60,60,60,0.92);color:#fff;padding:6px 14px;border-radius:50px;'
      + 'font-size:.75rem;font-weight:600;text-align:center;white-space:nowrap;'
      + 'box-shadow:0 2px 10px rgba(0,0,0,.25);z-index:99999;pointer-events:none;'
      + 'opacity:0;transition:opacity .3s ease;';
    document.body.appendChild(badge);
  }
  const label = L('🔇 Audio no disponible', '🔇 Audio indisponible');
  badge.textContent = label;
  requestAnimationFrame(() => { badge.style.opacity = '1'; });
}

/* Masque le badge "Audio indisponible" dès qu'une lecture réussit. */
function _hideAudioUnavailable() {
  if (!_audioUnavailableShown) return;
  _audioUnavailableShown = false;
  const badge = document.getElementById('audio-unavailable-badge');
  if (badge) badge.style.opacity = '0';
}


/* _showToast(msg, duration) — Affiche un message discret en bas d'écran.
   Remplace les alert() bloquants pour les notifications non critiques.
   Portée depuis l'app Oromo :
   - Élément DOM frais à chaque appel (pas de singleton #app-toast).
   - Durée configurable (défaut 3000 ms).
   - Double requestAnimationFrame pour garantir la transition CSS d'entrée.
   - Le nœud est supprimé du DOM après la transition de sortie (300 ms). */
function _showToast(msg, duration) {
  duration = duration || 3000;

  const toast = document.createElement('div');
  toast.className = 'app-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);

  /* Différer l'ajout de .visible d'une double frame pour que la
     transition CSS d'entrée (opacité + translation) soit bien jouée. */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { toast.classList.add('visible'); });
  });

  setTimeout(() => {
    toast.classList.remove('visible');
    /* Laisser la transition de sortie se terminer avant de retirer le nœud. */
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
  }, duration);
}


/* _vibrateFeedback(isCorrect) — Retour haptique discret sur mobile pour les réponses
   du quiz. Bonne réponse : une vibration courte. Mauvaise réponse : deux vibrations
   courtes (motif distinct). Échoue silencieusement si l'API Vibration est absente
   (Safari iOS notamment ne la supporte pas). */
function _vibrateFeedback(isCorrect) {
  if (!('vibrate' in navigator)) return;
  try {
    navigator.vibrate(isCorrect ? 30 : [30, 60, 30]);
  } catch (e) {}
}


/* ═══════════════════════════════════════════════════════════
   4. PERSISTANCE — Progression & système d'étoiles
   ─────────────────────────────────────────────────────────
   La progression est sauvegardée dans localStorage sous forme
   d'un tableau JSON : [{ id: 'salut', stars: 2 }, ...]

   Règle d'attribution des étoiles (basée sur le % de bonnes réponses) :
     < 50%  → 0 étoile  (pas de sauvegarde)
     ≥ 50%  → ⭐ 1 étoile
     ≥ 75%  → ⭐⭐ 2 étoiles
     100%   → ⭐⭐⭐ 3 étoiles

   Un module conserve toujours son meilleur score (jamais rétrogradé).
═══════════════════════════════════════════════════════════ */

/* Charge la progression sauvegardée depuis localStorage.
   En cas de données corrompues, repart d'un tableau vide. */
function loadDone() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // Validation : on accepte uniquement un tableau d'objets { id: string, stars: 1|2|3 }
    done = Array.isArray(parsed)
      ? parsed.filter((d) => {
          return d && typeof d.id === 'string' && [1,2,3].includes(d.stars);
        })
      : [];
  } catch (e) { done = []; }
}

/* Sauvegarde silencieusement la progression dans localStorage. */
function saveDone() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); }
  catch (e) {}
}

/* Calcule le nombre d'étoiles en fonction du pourcentage de réussite. */
function _calcStars(pct) {
  if (pct === 100) return 3;
  if (pct >= 75)   return 2;
  if (pct >= 50)   return 1;
  return 0;
}

/* Marque un module comme terminé avec le nombre d'étoiles calculé.
   Ne sauvegarde que si au moins 1 étoile ; ne rétrograde jamais un score. */
function markDone(id, pct) {
  const newStars = _calcStars(pct);
  if (newStars === 0) return;

  const existing = done.find(d => d.id === id);
  if (existing) {
    if (newStars > existing.stars) {
      if (newStars === 3) _launchConfetti(true); // confetti aussi sur upgrade vers 3 étoiles
      existing.stars = newStars;
    }
  } else {
    done.push({ id: id, stars: newStars });
    if (newStars === 3) _launchConfetti(true);
  }
  saveDone();
}

/* Réinitialise la progression d'un module (bouton "Recommencer"). */
function resetTheme(id) {
  done = done.filter(d => d.id !== id);
  saveDone();
  renderSections(_currentThemeLevel);
}

/* Retourne true si le module a été complété au moins une fois (≥ 1 étoile). */
function isDone(id) {
  return done.some(d => d.id === id);
}

/* Retourne le nombre d'étoiles d'un module (0 si non commencé). */
function getThemeStars(id) {
  const found = done.find(d => d.id === id);
  return found ? found.stars : 0;
}


/* ─────────────────────────────────────────────────────────
   SUIVI DES MODULES OUVERTS — badge "🆕 Nouveau"
   ─────────────────────────────────────────────────────────
   Amélioration visuelle du 12/07/2026 (demande utilisateur).
   Distinct du système d'étoiles : un module à 0 étoile peut
   soit n'avoir jamais été ouvert, soit avoir été tenté sans
   réussir (< 50 %, donc aucune étoile sauvegardée). Le badge
   "Nouveau" ne doit s'afficher que dans le premier cas — d'où
   ce suivi séparé, posé au tout premier openTheme() du module.
───────────────────────────────────────────────────────── */

/* Charge la liste des modules déjà ouverts depuis localStorage.
   En cas de données corrompues, repart d'un tableau vide. */
function loadOpened() {
  try {
    const parsed = JSON.parse(localStorage.getItem(OPENED_STORAGE_KEY) || '[]');
    openedThemes = Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : [];
  } catch (e) { openedThemes = []; }
}

/* Sauvegarde silencieusement la liste des modules ouverts. */
function saveOpened() {
  try { localStorage.setItem(OPENED_STORAGE_KEY, JSON.stringify(openedThemes)); }
  catch (e) {}
}

/* Marque un module comme ouvert au moins une fois. Appelée depuis openTheme().
   N'écrit dans localStorage que si le module n'était pas déjà connu. */
function markThemeOpened(id) {
  if (!openedThemes.includes(id)) {
    openedThemes.push(id);
    saveOpened();
  }
}

/* Retourne true si le module a déjà été ouvert au moins une fois.
   Couvre aussi, sans migration explicite, le cas d'un module déjà étoilé
   avant l'introduction de ce suivi : avoir des étoiles implique forcément
   d'avoir déjà ouvert le module, même si l'entrée manque encore ici. */
function isThemeOpened(id) {
  return openedThemes.includes(id) || getThemeStars(id) > 0;
}

/* Retourne l'état visuel d'une carte de module : 'new' | 'progress' | 'complete'.
     'complete' → 3 étoiles (100 %)
     'progress' → déjà ouvert (ou étoilé), mais pas encore à 100 %
     'new'      → jamais ouvert */
function getModuleState(id) {
  if (getThemeStars(id) === 3) return 'complete';
  if (isThemeOpened(id)) return 'progress';
  return 'new';
}


/* ─────────────────────────────────────────────────────────
   REPRISE DE QUIZ — sessionStorage
   ─────────────────────────────────────────────────────────
   Si l'utilisateur quitte une leçon en plein quiz (q10 ou dq)
   et revient sur le même module, sa position et son score
   sont restaurés au lieu de relancer le quiz depuis le début.
   Portée : durée de l'onglet (sessionStorage), par thème.
───────────────────────────────────────────────────────── */

/* Sauvegarde l'état courant du quiz actif (appelée après chaque réponse). */
function _saveQuizSession() {
  if (!CT) return;
  const activeTabEl = document.querySelector('#lessonTabs .tab.active');
  const tabKey = activeTabEl ? activeTabEl.dataset.tab : null;
  if (tabKey !== 'quiz10' && tabKey !== 'dquiz') return;

  const state = {
    mode: currentMode,
    themeId: CT.id,
    tab: tabKey,
    q10Step: q10Step, q10Score: q10Score,
    dqStep: dqStep, dqScore: dqScore,
    // On fige les questions dynamiques pour que la reprise pose les mêmes questions
    dynQuiz: _currentDynQuiz
  };
  try { sessionStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(state)); }
  catch (e) {}
}

/* Tente de restaurer une session de quiz pour le thème courant.
   Retourne le tab à activer en priorité ('quiz10' | 'dquiz'), ou null si rien à reprendre. */
function _restoreQuizSession() {
  let raw;
  try { raw = sessionStorage.getItem(QUIZ_SESSION_KEY); }
  catch (e) { return null; }
  if (!raw) return null;

  let state;
  try { state = JSON.parse(raw); } catch (e) { return null; }
  if (!state || state.mode !== currentMode || state.themeId !== CT.id) return null;

  // Quiz déjà terminé dans la session sauvegardée : pas la peine de reprendre
  let total;
  if (state.tab === 'quiz10') {
    if (CT.type === 'alpha') {
      const alphaQs = getQuizQuestions(CT);
      total = alphaQs ? alphaQs.length : 0;
    } else if (CT.level === 1) {
      total = state.dynQuiz?.length || 0;
    } else {
      const stdQs = getQuizQuestions(CT);
      total = stdQs ? stdQs.length : 0;
    }
  } else {
    total = CT.quiz ? CT.quiz.length : 0;
  }
  const step = (state.tab === 'quiz10') ? state.q10Step : state.dqStep;
  if (total && step >= total) return null;

  if (state.tab === 'quiz10') {
    q10Step  = state.q10Step  || 0;
    q10Score = state.q10Score || 0;
    if (state.dynQuiz?.length) _currentDynQuiz = state.dynQuiz;
    _showToast(L('Quiz restaurado desde tu última sesión', 'Quiz restauré depuis votre dernière session'), 3500);
    return 'quiz10';
  }
  if (state.tab === 'dquiz') {
    dqStep  = state.dqStep  || 0;
    dqScore = state.dqScore || 0;
    _showToast(L('Quiz restaurado desde tu última sesión', 'Quiz restauré depuis votre dernière session'), 3500);
    return 'dquiz';
  }
  return null;
}

/* Efface la session de quiz sauvegardée (appelée quand un quiz se termine normalement). */
function _clearQuizSession() {
  try { sessionStorage.removeItem(QUIZ_SESSION_KEY); }
  catch (e) {}
}


/* ═══════════════════════════════════════════════════════════
   5. NAVIGATION — Changement d'écran
   ─────────────────────────────────────────────────────────
   L'application est composée de 4 écrans principaux :
     'app-launcher' → Sélection de langue (hors showScreen)
     'home'         → Accueil avec progression globale
     'sections'     → Grille des modules
     'lesson'       → Leçon active (flashcards, quiz, dialogue)

   showScreen(id) gère également le branchement du bouton
   "Retour" de l'écran home vers le launcher.
═══════════════════════════════════════════════════════════ */

/* _updateBottomNav(screenId) — Synchronise la barre de navigation basse
   avec l'écran actuellement affiché.
   • Toujours visible, sur TOUS les écrans y compris le launcher (écran 0).
   • Active visuellement le bouton correspondant à l'écran courant :
       app-launcher (Vue A & B) → Langue actif
       home                     → Guide actif
       sections-level1/2        → Modules actif
       lesson                   → Modules actif (on est dans un module)
       (Infos est une modale : flash visuel temporaire, jamais "collé")
   • Libellés et drapeau adaptés à la langue d'interface. */
function _updateBottomNav(screenId) {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;

  /* (1) Toujours visible — la barre est présente sur tous les écrans */
  nav.classList.add('visible');

  /* (2) État actif : reset tous les boutons, puis active le bon */
  ['navBtnLang', 'navBtnGuide', 'navBtnModules', 'navBtnCredits'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });

  if (screenId === 'app-launcher') {
    /* Écran 0 (Vue A choix de langue, Vue B sélecteur variante) → Langue actif */
    const btnLang = document.getElementById('navBtnLang');
    if (btnLang) btnLang.classList.add('active');
  } else if (screenId === 'home') {
    /* Écran Guide → Guide actif */
    const btnGuide = document.getElementById('navBtnGuide');
    if (btnGuide) btnGuide.classList.add('active');
  } else if (screenId === 'sections' || screenId === 'sections-level1' || screenId === 'sections-level2' || screenId === 'lesson') {
    /* Écrans Modules et Leçon → Modules actif */
    const btnModules = document.getElementById('navBtnModules');
    if (btnModules) btnModules.classList.add('active');
  }

  /* (3) Libellés bilingues via L(learn_french, learn_spain)
     Sur le launcher (avant tout choix), on affiche les libellés en français par défaut */
  const elLang    = document.getElementById('navLabelLang');
  const elGuide   = document.getElementById('navLabelGuide');
  const elModules = document.getElementById('navLabelModules');
  const elCredits = document.getElementById('navLabelCredits');
  const elSubLang    = document.getElementById('navSubLang');
  const elSubGuide   = document.getElementById('navSubGuide');
  const elSubModules = document.getElementById('navSubModules');
  const elSubCredits = document.getElementById('navSubCredits');

  if (!currentMode) {
    /* Launcher Vue A uniquement : bilingue FR + traduction ES en sous-titre */
    if (elLang)    elLang.textContent    = 'Langue';
    if (elGuide)   elGuide.textContent   = 'Guide';
    if (elModules) elModules.textContent = 'Modules';
    if (elCredits) elCredits.textContent = 'Infos';
    if (elSubLang)    elSubLang.textContent    = 'Idioma';
    if (elSubGuide)   elSubGuide.textContent   = 'Guía';
    if (elSubModules) elSubModules.textContent = 'Módulos';
    if (elSubCredits) elSubCredits.textContent = '';
  } else if (currentMode === 'learn_french') {
    /* Apprenant hispanophone : libellés en espagnol uniquement, pas de sous-titre */
    if (elLang)    elLang.textContent    = 'Idioma';
    if (elGuide)   elGuide.textContent   = 'Guía';
    if (elModules) elModules.textContent = 'Módulos';
    if (elCredits) elCredits.textContent = 'Infos';
    if (elSubLang)    elSubLang.textContent    = '';
    if (elSubGuide)   elSubGuide.textContent   = '';
    if (elSubModules) elSubModules.textContent = '';
    if (elSubCredits) elSubCredits.textContent = '';
  } else {
    /* Apprenant francophone : libellés en français uniquement, pas de sous-titre */
    if (elLang)    elLang.textContent    = 'Langue';
    if (elGuide)   elGuide.textContent   = 'Guide';
    if (elModules) elModules.textContent = 'Modules';
    if (elCredits) elCredits.textContent = 'Infos';
    if (elSubLang)    elSubLang.textContent    = '';
    if (elSubGuide)   elSubGuide.textContent   = '';
    if (elSubModules) elSubModules.textContent = '';
    if (elSubCredits) elSubCredits.textContent = '';
  }

  /* (4) Drapeau dynamique selon le mode et la région active
     Sur le launcher sans mode, on affiche 🌍 (neutre) */
  const langFlag = document.getElementById('navLangFlag');
  if (langFlag) {
    if (!currentMode) {
      langFlag.textContent = '🌍';
    } else if (currentMode === 'learn_french') {
      langFlag.textContent = '🇫🇷';
    } else {
      /* learn_spain : drapeau de la variante régionale active */
      const flagEmojis = { ES:'🇪🇸', MX:'🇲🇽', CO:'🇨🇴', PE:'🇵🇪', VE:'🇻🇪', AR:'🇦🇷', EC:'🇪🇨' };
      langFlag.textContent = flagEmojis[currentRegion] || '🇪🇸';
    }
  }

  /* (5) Ajouté le 09/07/2026 (retour testeur bêta Firefox/Android, point 1) :
     état visuel "verrouillé" du bouton Modules tant qu'aucune langue n'est
     choisie (currentMode vide). Avant ce correctif, le bouton avait l'air
     parfaitement cliquable mais navGoModules() ne faisait rien — d'où
     l'impression d'un bouton bloqué/cassé pour un nouvel utilisateur.
     Appliqué en style inline : style.css n'était pas disponible au moment
     du correctif pour y ajouter une classe .nav-btn--locked dédiée. À migrer
     proprement vers une classe CSS si cette règle inline pose problème. */
  const btnModulesEl = document.getElementById('navBtnModules');
  if (btnModulesEl) {
    const locked = !currentMode;
    btnModulesEl.classList.toggle('nav-btn--locked', locked);
    btnModulesEl.style.opacity = locked ? '0.4' : '';
    /* Le clic reste actif (pas de pointer-events:none) : navGoModules()
       gère déjà le cas verrouillé avec un toast + redirection, ce qui est
       plus explicite pour l'utilisateur qu'un bouton totalement inerte. */
    btnModulesEl.setAttribute('aria-disabled', locked ? 'true' : 'false');
  }
}

/* ─────────────────────────────────────────────────────────
   5b. NAVIGATION NIVEAUX — helpers
   ─────────────────────────────────────────────────────────
   _currentThemeLevel — Mémorise le niveau du thème ouvert (1 ou 2)
                        pour que le retour depuis la leçon revienne
                        au bon écran (sections-level1 ou sections-level2).

   _updateLevelTabs(screenId) — Synchronise l'état actif des boutons
                        d'onglets Niveau 1 / 2 sur les deux paires
                        (#sections-level1 et #sections-level2).

   lessonGoBack()    — Retour depuis la leçon vers le bon écran de niveau.

   navGoModules()    — Bouton Modules de la nav bar : navigue vers
                        l'écran du niveau mémorisé.
───────────────────────────────────────────────────────── */

/** Niveau du thème ouvert (1 ou 2) — mémorisé pour retour et flèches */
let _currentThemeLevel = 1;

/**
 * Synchronise l'état actif des onglets Niveau 1 / 2
 * sur les deux paires de boutons (level-tab) selon l'écran affiché.
 * @param {string} screenId
 */
function _updateLevelTabs(screenId) {
  const isL1 = (screenId === 'sections-level1');
  const isL2 = (screenId === 'sections-level2');
  if (!isL1 && !isL2) return;

  /* Onglets dans sections-level1 */
  const t1a = document.getElementById('lvlTab1');
  const t2a = document.getElementById('lvlTab2');
  if (t1a) t1a.classList.toggle('active', isL1);
  if (t2a) t2a.classList.toggle('active', isL2);

  /* Onglets dans sections-level2 */
  const t1b = document.getElementById('lvlTab1b');
  const t2b = document.getElementById('lvlTab2b');
  if (t1b) t1b.classList.toggle('active', isL1);
  if (t2b) t2b.classList.toggle('active', isL2);
}

/**
 * Retour depuis la leçon → retourne au bon écran de niveau.
 * renderSections() est appelé ICI (pas dans showScreen) pour éviter le double rendu.
 */
function lessonGoBack() {
  const target = (_currentThemeLevel === 2) ? 'sections-level2' : 'sections-level1';
  /* Pré-rend les grilles AVANT la transition pour que le contenu soit
     présent au moment où l'écran devient visible (pas de flash vide). */
  renderSections(_currentThemeLevel);
  /* On passe skipRender=true via le flag interne pour que showScreen()
     ne rappelle pas renderSections une 2e fois. */
  _showScreenNoRender(target, 'back');
}

/**
 * Bouton Modules dans la nav bar :
 * va sur l'écran du niveau mémorisé (ou niveau 1 par défaut).
 */
function navGoModules() {
  /* Corrigé le 09/07/2026 (retour testeur bêta Firefox/Android) :
     BUG — si ALL_THEMES n'était pas encore chargé (aucune langue choisie),
     cette fonction sortait silencieusement sans aucun retour visuel. Pour
     un nouvel utilisateur qui clique sur "Modules" avant tout autre choix,
     le bouton donnait l'impression d'être bloqué/cassé. On affiche
     désormais un toast explicite et on renvoie vers l'écran de choix
     de langue plutôt que de ne rien faire. */
  if (!ALL_THEMES || !ALL_THEMES.length) {
    _showToast(L('🌍 Elige primero tu idioma', '🌍 Choisis d\'abord ta langue'));
    showLauncher();
    return;
  }

  const target = (_currentThemeLevel === 2) ? 'sections-level2' : 'sections-level1';

  /* Déterminer l'écran courant */
  let current = null;
  document.querySelectorAll('.screen').forEach((s) => {
    if (s.classList.contains('active')) current = s.id;
  });

  /* Si on est déjà sur le bon écran, ne rien faire */
  if (current === target) return;

  /* Direction : depuis lesson = back, depuis home = forward, sinon auto */
  const dir = (current === 'lesson') ? 'back' : 'forward';

  /* Pré-rend les grilles pour éviter le double rendu dans showScreen() */
  renderSections(_currentThemeLevel);
  _showScreenNoRender(target, dir);
}

/* Ordre canonique des écrans pour le calcul automatique de direction.
   'app-launcher' est l'écran racine (index 0), puis les deux écrans
   de sections par niveau (1a et 1b), puis 'lesson' le plus profond. */
const _SCREEN_ORDER = ['app-launcher', 'home', 'sections-level1', 'sections-level2', 'lesson'];

/**
 * _showScreenNoRender(id, dir) — Variante interne de showScreen() qui effectue
 * UNIQUEMENT la transition visuelle sans rappeler renderSections() ni renderHome().
 * À utiliser quand le rendu a déjà été fait juste avant (lessonGoBack, navGoModules).
 */
function _showScreenNoRender(id, dir) {
  if (_screenTransitionTimer) { clearTimeout(_screenTransitionTimer); _screenTransitionTimer = null; }
  document.querySelectorAll('.screen').forEach((s) => {
    s.classList.remove('active', 'slide-out-left', 'slide-out-right', 'slide-in-right', 'slide-in-left');
  });
  window.scrollTo(0, 0);
  const nextEl = document.getElementById(id);
  if (!nextEl) { console.error('_showScreenNoRender: écran introuvable :', id); return; }
  nextEl.classList.add('active');
  if (dir) {
    nextEl.classList.add(dir === 'forward' ? 'slide-in-right' : 'slide-in-left');
    _screenTransitionTimer = setTimeout(() => {
      _screenTransitionTimer = null;
      nextEl.classList.remove('slide-in-right', 'slide-in-left');
    }, 300);
  }
  _updateLevelTabs(id);
  _updateBottomNav(id);
}

/* Verrou anti-navigation simultanée : empêche deux transitions qui se croisent */
const _screenTransitionInProgress = false;
let _screenTransitionTimer = null;

function showScreen(id, dir) {
  // Détermine l'écran actuellement actif (avant de le masquer)
  const currentEl = document.querySelector('.screen.active');
  const currentId = currentEl ? currentEl.id : null;

  // Corrigé le 07/07/2026 : quitter un écran (ex : retour arrière depuis la
  // leçon) pendant une session micro active (onglet 🎤 Répète) laissait la
  // reconnaissance vocale tourner en arrière-plan. On la coupe systématiquement
  // dès qu'on change réellement d'écran, en plus du filet de sécurité posé sur
  // 'visibilitychange' pour le cas où l'app entière passe en arrière-plan.
  if (currentId && currentId !== id && typeof _rpClearTimers === 'function') {
    _rpClearTimers();
  }

  // Quitter le guide (#home) pour un autre écran = onboarding "vu" POUR CE
  // MODE : il ne se relancera plus tout seul au prochain lancement dans cette
  // même langue (cf. _maybeAutoShowGuide / _guideSeenKey). Couvre "▶ Commencer"
  // comme n'importe quelle autre sortie du guide.
  if (currentId === 'home' && id !== 'home') {
    _markGuideSeen();
  }

  // Si on demande l'écran déjà actif, mise à jour des onglets et nav seulement
  if (currentId === id) {
    // Quand même re-rendre le contenu si c'est un écran sections
    // (peut être appelé depuis un onglet de niveau déjà sur cet écran)
    if (id === 'sections-level1') renderSections(1);
    if (id === 'sections-level2') renderSections(2);
    _updateLevelTabs(id);
    _updateBottomNav(id);
    return;
  }

  // Nettoyage immédiat de toute animation en cours
  if (_screenTransitionTimer) {
    clearTimeout(_screenTransitionTimer);
    _screenTransitionTimer = null;
  }
  document.querySelectorAll('.screen').forEach((s) => {
    s.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-right', 'slide-in-left');
  });

  // Calcul automatique de la direction si elle n'est pas fournie
  if (!dir && currentId) {
    const fromIdx = _SCREEN_ORDER.indexOf(currentId);
    const toIdx   = _SCREEN_ORDER.indexOf(id);
    if (fromIdx !== -1 && toIdx !== -1) {
      dir = toIdx > fromIdx ? 'forward' : 'back';
    }
  }

  // Masque IMMÉDIATEMENT tous les écrans (retire display:flex, évite les clics fantômes)
  document.querySelectorAll('.screen').forEach((s) => {
    s.classList.remove('active');
  });

  window.scrollTo(0, 0);

  const nextEl = document.getElementById(id);
  if (!nextEl) {
    console.error('showScreen: écran introuvable :', id);
    return;
  }

  // Active le nouvel écran
  nextEl.classList.add('active');

  // Animation d'entrée uniquement (l'écran sortant est déjà masqué — pas de risque de clic)
  if (dir) {
    nextEl.classList.add(dir === 'forward' ? 'slide-in-right' : 'slide-in-left');
    _screenTransitionTimer = setTimeout(() => {
      _screenTransitionTimer = null;
      nextEl.classList.remove('slide-in-right', 'slide-in-left');
    }, 300);
  }

  // Rendu du contenu de l'écran
  if (id === 'home')              renderHome();
  if (id === 'sections-level1')   renderSections(1);
  if (id === 'sections-level2')   renderSections(2);

  _updateLevelTabs(id);
  _updateBottomNav(id);
}


/* ═══════════════════════════════════════════════════════════
   6. ÉCRAN HOME — Barre de progression et étoiles totales
   ─────────────────────────────────────────────────────────
   Affiche :
     - La barre de progression (% de modules validés)
     - Le label bilingue (n / total modules — %)
     - Le total d'étoiles gagnées (sur le maximum possible)
═══════════════════════════════════════════════════════════ */

/**
 * Calcule la progression globale en un seul endroit.
 * Utilisé par renderHome() ET renderSections() pour éviter la duplication.
 * @returns {{ total: number, n: number, pct: number,
 *             starsEarned: number, starsMax: number }}
 */
function _getProgress() {
  const total = ALL_THEMES.length;
  const n     = done.length;
  return {
    total      : total,
    n          : n,
    pct        : total > 0 ? Math.round(n / total * 100) : 0,
    starsEarned: done.reduce((acc, d) => acc + d.stars, 0),
    starsMax   : total * 3
  };
}

function renderHome() {
  if (!ALL_THEMES.length) return;

  const p = _getProgress();

  /* ── Cercle SVG de progression ── */
  const wrap = document.getElementById('homeProgressCircleWrap');
  if (wrap) {
    if (p.n === 0) {
      /* Première visite : on cache le cercle */
      wrap.style.display = 'none';
    } else {
      wrap.style.display = 'flex';

      /* Circonférence pour r=50 : 2π×50 = 314.16 px */
      const CIRC   = 314.16;
      const offset = CIRC - (CIRC * p.pct / 100);

      const arc     = document.getElementById('hpcArc');
      const pctTxt  = document.getElementById('hpcPct');
      const subTxt  = document.getElementById('hpcSub');
      const titleEl = document.getElementById('hpcTitle');
      const descEl  = document.getElementById('hpcDesc');

      /* Léger délai pour déclencher la transition CSS après display:flex */
      setTimeout(() => {
        if (arc) arc.style.strokeDashoffset = offset;
      }, 50);

      if (pctTxt) pctTxt.textContent = p.pct + '%';
      if (subTxt) subTxt.textContent = '⭐ ' + p.starsEarned + ' / ' + p.starsMax;

      /* Nombre de modules validés, en texte simple sous le cercle (hors SVG
         pour ne pas surcharger/déborder le petit texte "hpc-sub" interne) */
      const modulesEl = document.getElementById('hpcModulesLine');
      if (modulesEl) modulesEl.textContent = p.n + '/' + p.total + ' ' + L('módulos', 'modules');

      /* Textes accessibles (aria) */
      const a11yLabel = L(
        p.n + ' / ' + p.total + ' modules validés — ' + p.pct + '% — ' + p.starsEarned + ' étoiles / ' + p.starsMax,
        p.n + ' / ' + p.total + ' módulos completados — ' + p.pct + '% — ' + p.starsEarned + ' estrellas / ' + p.starsMax
      );
      if (titleEl) titleEl.textContent = a11yLabel;
      if (descEl)  descEl.textContent  = a11yLabel;
    }
  }

  /* ── Widget de variante régionale (mode Espagnol uniquement) ── */
  _renderHomeRegionWidget();

  /* ── Résumé de progression de l'AUTRE parcours (si déjà commencé) ── */
  _renderOtherModeProgress();
}

/**
 * _renderOtherModeProgress() — Affiche un petit badge de progression pour
 * l'AUTRE parcours (Français ↔ Espagnol) sur l'écran #home, si l'apprenant
 * l'a déjà commencé. Reste masqué si l'autre parcours est vierge, pour ne
 * pas surcharger l'écran avec une barre de progression vide.
 *
 * Note : les deux parcours partagent toujours le même total de 53 modules
 * (37 thèmes + 16 dialogues depuis le 26/08/2026, cf. Bilan_technique.md) — on réutilise donc
 * ALL_THEMES.length du mode courant comme référence pour l'autre parcours,
 * sans avoir à charger son fichier de données juste pour ce nombre.
 */
function _renderOtherModeProgress() {
  const wrap = document.getElementById('homeOtherProgress');
  if (!wrap) return;

  const otherMode = (currentMode === 'learn_french') ? 'learn_spain' : 'learn_french';
  const otherKey  = (otherMode === 'learn_french') ? 'pe_es_fr_done_v1' : 'pe_fr_es_done_v1';

  let otherDone = [];
  try {
    otherDone = JSON.parse(localStorage.getItem(otherKey) || '[]');
  } catch (e) {
    otherDone = [];
  }

  if (!Array.isArray(otherDone) || otherDone.length === 0) {
    wrap.style.display = 'none';
    return;
  }

  const total       = ALL_THEMES.length || 53;
  const starsMax    = total * 3;
  const starsEarned = otherDone.reduce((acc, d) => acc + (d.stars || 0), 0);
  const flagEmojis  = { ES:'🇪🇸', MX:'🇲🇽', CO:'🇨🇴', PE:'🇵🇪', VE:'🇻🇪', AR:'🇦🇷', EC:'🇪🇨' };
  const flag        = (otherMode === 'learn_french') ? '🇫🇷' : (flagEmojis[currentRegion] || '🇪🇸');

  wrap.style.display = 'flex';
  wrap.innerHTML = flag
    + ' <strong>' + otherDone.length + '/' + total + '</strong>'
    + ' <span class="hop-sep">·</span> ⭐ ' + starsEarned + '/' + starsMax;

  const a11y = L(
    'Otro recorrido: ' + otherDone.length + '/' + total + ' módulos, ' + starsEarned + '/' + starsMax + ' estrellas',
    'Autre parcours : ' + otherDone.length + '/' + total + ' modules, ' + starsEarned + '/' + starsMax + ' étoiles'
  );
  wrap.setAttribute('aria-label', a11y);
  wrap.setAttribute('title', a11y);
}


/* ─────────────────────────────────────────────────────────
   _renderHomeRegionWidget()
   ─────────────────────────────────────────────────────────
   Génère le sélecteur de variante régionale dans l'écran #home.
   Visible uniquement en mode learn_spain.

   UX : 7 chips cliquables (une par variante). La chip active
   est mise en valeur avec le fond var(--c-primary) et la bordure
   var(--c-accent), héritant automatiquement des CSS custom
   properties appliquées par pickRegion() sur <html>.
   Ainsi le widget est toujours aux couleurs du pays sélectionné.

   Appelle pickRegion() au clic (persistance + cascade CSS + voix).
───────────────────────────────────────────────────────── */
function _renderHomeRegionWidget() {
  const widget = document.getElementById('home-region-widget');
  if (!widget) return;

  /* Masquer le widget en mode Français */
  if (currentMode !== 'learn_spain') {
    widget.style.display = 'none';
    return;
  }
  widget.style.display = 'block';

  const regions = [
    { id:'ES', flag:'🇪🇸', name: 'Espagne'    },
    { id:'MX', flag:'🇲🇽', name: 'Mexique'    },
    { id:'CO', flag:'🇨🇴', name: 'Colombie'   },
    { id:'PE', flag:'🇵🇪', name: 'Pérou'      },
    { id:'VE', flag:'🇻🇪', name: 'Venezuela'  },
    { id:'AR', flag:'🇦🇷', name: 'Argentine'  },
    { id:'EC', flag:'🇪🇨', name: 'Équateur'   }
  ];

  const labelText = L('Variante regional :', 'Variante régionale :');

  let html = '<div class="hrw-wrap">'
    + '<p class="hrw-label">' + labelText + '</p>'
    + '<div class="hrw-chips" role="group" aria-label="' + labelText + '">';

  regions.forEach((r) => {
    const isActive = (currentRegion === r.id);
    html += '<button'
      + ' class="hrw-chip' + (isActive ? ' hrw-chip--active' : '') + '"'
      + ' onclick="pickRegion(\'' + r.id + '\');_renderHomeRegionWidget();"'
      + ' aria-pressed="' + isActive + '"'
      + ' title="' + r.name + ' ' + REGION_MASCOTS[r.id].phrase + '">'
      + '<span class="hrw-chip-flag">' + r.flag + '</span>'
      + '<span class="hrw-chip-mascot" aria-hidden="true">🐄' + REGION_MASCOTS[r.id].symbol + '</span>'
      + '<span class="hrw-chip-name">' + r.name + '</span>'
      + '</button>';
  });

  html += '</div></div>';
  widget.innerHTML = html;
}


/* ═══════════════════════════════════════════════════════════
   7. ÉCRAN SECTIONS — Grille des thèmes (Niveau 1 & 2)
   ─────────────────────────────────────────────────────────
   Génère dynamiquement les cartes de module pour chaque niveau.
   Chaque carte affiche : emoji, titre, sous-titre, étoiles,
   et un bouton "Recommencer" si le module a été validé.

   Regroupement par catégories + carte "Continuer" — ajouté le
   26/08/2026 (suite, demande utilisateur : la grille à plat des 37
   thèmes du Niveau 1 pouvait faire l'effet d'un "mur de cartes"
   décourageant au premier coup d'œil pour un grand débutant).
   THEME_CATEGORIES (5 groupes thématiques ci-dessous, 37 thèmes au
   total) regroupe les cartes du Niveau 1 sous des <details>/
   <summary> natifs — repli/dépli sans JS de toggle dédié,
   accessible clavier + lecteur d'écran par défaut du navigateur.
   Seule la catégorie "en cours" (1ère catégorie contenant un thème
   pas encore à 3 étoiles) est dépliée par défaut, le reste replié
   (_buildThemeGridHTML()). Le Niveau 2 (16 dialogues) reste en
   grille simple, jugé déjà assez court pour ne pas avoir besoin de
   catégorisation. _buildContinueCard() ajoute par ailleurs, au-dessus
   de la grille des 2 niveaux, un bouton "▶ Continuer" pointant
   directement vers le prochain thème pertinent (en cours, sinon
   jamais ouvert), pour ne pas obliger à parcourir la grille pour
   reprendre sa leçon.
   Affichage pleine largeur — ajusté le 27/08/2026 (demande
   utilisateur, capture d'écran à l'appui) : #grid1 (catégories du
   Niveau 1) et #grid2 (cartes à plat du Niveau 2) réutilisaient la
   classe .themes-grid en grille 2 colonnes, pensée pour des cartes
   de thème individuelles — appliquée par erreur aux 5 <details> de
   catégorie eux-mêmes, elle les empilait 2 par ligne et les
   rétrécissait de moitié (cartes tronquées à l'écran). #grid1/#grid2
   passent en colonne unique dans style.css ; seule .theme-subgrid
   (cartes à l'intérieur d'une catégorie) garde ses 2 colonnes. Et
   comme deux catégories dépliées côte à côte sur 2 colonnes trop
   étroites devient une seule catégorie dépliée en pleine largeur,
   n'ouvrir que la catégorie "en cours" (et non plus courante +
   suivante, voir ci-dessus) évite un écran d'un coup trop chargé.
═══════════════════════════════════════════════════════════ */

/* THEME_CATEGORIES — 5 regroupements thématiques du Niveau 1 (37
   thèmes au total, tous couverts). Purement un regroupement
   d'affichage (accordéon) : ne modifie ni l'ordre de progression,
   ni les données de data-fr.js/data-es.js, ni les clés de
   sauvegarde (`done`/`openedThemes`) — indexé uniquement par
   thème.id, résolu dynamiquement contre ALL_THEMES à chaque rendu. */
const THEME_CATEGORIES = [
  { id: 'bases',     emoji: '🌱', labelEs: 'Lo Esencial',           labelFr: 'Les Bases',
    themeIds: ['alpha','salut','pres','express','interrog','num','verb','conn'] },
  { id: 'describir', emoji: '😊', labelEs: 'Describir y Sentir',    labelFr: 'Décrire & Ressentir',
    themeIds: ['heure_calendrier','meteo_climat','adj','emot','fam','col','corps'] },
  { id: 'quotidien', emoji: '🏡', labelEs: 'Vida Cotidiana',        labelFr: 'Vie Quotidienne',
    themeIds: ['adv','viequot','nour','bois','objets','log','muebles_equipamiento','veth'] },
  { id: 'sorties',   emoji: '🚌', labelEs: 'Salidas y Situaciones', labelFr: 'Sorties & Situations',
    themeIds: ['rest','orient','lieux','trans','met','sante','securite','dinero'] },
  { id: 'monde',     emoji: '🌍', labelEs: 'El Mundo',              labelFr: 'Le Monde',
    themeIds: ['viaje','pays','ocio','plan','anim','agric'] }
];

/* Retourne le prochain thème à proposer dans la carte "Continuer" :
   priorité à un thème déjà entamé (state 'progress'), sinon le 1er
   thème jamais ouvert (state 'new'), dans l'ordre de data-fr.js/
   data-es.js. Retourne null si le niveau entier est à 3 étoiles. */
function _findNextThemeToContinue(level) {
  const themes = ALL_THEMES.filter(t => t.level === level);
  return themes.find(t => getModuleState(t.id) === 'progress')
      || themes.find(t => getModuleState(t.id) === 'new')
      || null;
}

/* Construit le HTML de la carte "▶ Continuer" affichée en tête de
   grille — raccourci direct vers openTheme() sans avoir à chercher
   la bonne carte dans la grille catégorisée. Affiche un message de
   félicitations à la place si le niveau est déjà entièrement à
   3 étoiles (aucune action au clic dans ce cas). */
function _buildContinueCard(level) {
  const next = _findNextThemeToContinue(level);
  if (!next) {
    return '<div class="continue-card continue-card--done">'
      + '<span class="continue-card-emoji" aria-hidden="true">🏆</span>'
      + '<div class="continue-card-text">'
      + '<div class="continue-card-title">' + L('¡Todo completado!', 'Tout est terminé !') + '</div>'
      + '<div class="continue-card-sub">' + L('Puedes repasar cualquier tema cuando quieras', "Tu peux réviser n'importe quel thème quand tu veux") + '</div>'
      + '</div></div>';
  }
  const { main } = _themeTitle(next);
  const isNew = getModuleState(next.id) === 'new';
  const verb = isNew ? L('Empezar', 'Commencer') : L('Seguir con', 'Continuer');
  return '<button class="continue-card" onclick="openTheme(\'' + next.id + '\')">'
    + '<span class="continue-card-emoji" aria-hidden="true">' + next.emoji + '</span>'
    + '<div class="continue-card-text">'
    + '<div class="continue-card-label">▶ ' + verb + '</div>'
    + '<div class="continue-card-title">' + main + '</div>'
    + '</div>'
    + '<span class="continue-card-arrow" aria-hidden="true">→</span>'
    + '</button>';
}

/* Construit le HTML de la grille de thèmes d'un niveau.
   Niveau 1 : regroupé en catégories repliables (THEME_CATEGORIES).
   Niveau 2 : grille simple inchangée (16 dialogues). */
function _buildThemeGridHTML(level) {
  const themesForLevel = ALL_THEMES.filter(t => t.level === level);

  if (level !== 1) {
    return themesForLevel.map(t => _buildThemeCard(t)).join('');
  }

  // Catégorie "en cours" = 1ère catégorie contenant un thème pas
  // encore à 3 étoiles ; seule celle-ci est ouverte par défaut
  // (n'ouvre plus la suivante en plus, depuis le 27/08/2026, cf.
  // commentaire de section ci-dessus), le reste replié. Si tout est
  // déjà terminé, on ouvre la 1ère.
  let currentIdx = THEME_CATEGORIES.findIndex(cat =>
    cat.themeIds.some(id => {
      const t = themesForLevel.find(x => x.id === id);
      return t && getModuleState(t.id) !== 'complete';
    })
  );
  if (currentIdx === -1) currentIdx = 0;

  return THEME_CATEGORIES.map((cat, idx) => {
    const catThemes = cat.themeIds
      .map(id => themesForLevel.find(t => t.id === id))
      .filter(Boolean);
    if (!catThemes.length) return '';

    const catDone = catThemes.filter(t => getModuleState(t.id) === 'complete').length;
    const isOpen  = (idx === currentIdx);

    return '<details class="theme-category"' + (isOpen ? ' open' : '') + '>'
      + '<summary class="theme-category-summary">'
      + '<span class="theme-category-emoji" aria-hidden="true">' + cat.emoji + '</span>'
      + '<span class="theme-category-label">' + L(cat.labelEs, cat.labelFr) + '</span>'
      + '<span class="theme-category-count">' + catDone + ' / ' + catThemes.length + '</span>'
      + '</summary>'
      + '<div class="themes-grid theme-subgrid">'
      + catThemes.map(t => _buildThemeCard(t)).join('')
      + '</div>'
      + '</details>';
  }).join('');
}

function renderSections(activeLevel) {
  if (!ALL_THEMES.length) return;
  if (!activeLevel) activeLevel = 1;

  /* Ajouté le 18/07/2026 (3e retour utilisateur) : dès que l'écran Modules
     est effectivement rendu (donc réellement vu par l'apprenant, quel que
     soit le chemin d'entrée), on pose le flag lu par _hasVisitedModules()
     (§15d) — les cartes de langue du Lanceur ne se redéploieront plus
     automatiquement au prochain retour sur l'écran 0. */
  _markModulesVisited();

  const total = ALL_THEMES.length;
  const n     = done.length;
  const pct   = Math.round(n / total * 100);
  const totalStarsEarned = done.reduce((acc, d) => acc + d.stars, 0);
  const maxStarsPossible = total * 3;
  // Modules réellement terminés à 100 % (3 étoiles) — distinct de `n` ci-dessus,
  // qui compte tout module ne serait-ce qu'entamé (≥ 50 %, donc ≥ 1 étoile)
  const completedCount = done.filter(d => d.stars === 3).length;

  /* ── Helper : remplir les éléments d'un header de sections ── */
  function _fillHeader(suffix) {
    const s = suffix || '';
    // Barre de progression
    const gp = document.getElementById('globalProgress' + s);
    if (gp) gp.style.width = pct + '%';

    // Label de progression
    const pl = document.getElementById('progressLabel' + s);
    if (pl) {
      pl.innerHTML = L(
        n + ' / ' + total + ' modules — ' + pct + '%',
        n + ' / ' + total + ' módulos — '  + pct + '%'
      );
    }

    // Étoiles totales + modules terminés (2 pastilles côte à côte), plus une
    // 3e pastille mascotte VACHÉBO (.sections-mascot-all) quand la totalité
    // des modules est à 3 étoiles — clin d'œil via REGION_MASCOTS (§15b),
    // régional en mode Espagnol, France (🗼) en mode Français depuis le
    // 20/07/2026 (demande utilisateur — auparavant un jeu de mots sans
    // symbole), comme les autres clins d'œil mascotte de l'app. Clé résolue
    // par _mascotKeyForMode(). Ajouté le 20/07/2026 (demande utilisateur).
    const se = document.getElementById('sectionsStars' + s);
    if (se) {
      const allDone = total > 0 && completedCount === total;
      const mAll = REGION_MASCOTS[_mascotKeyForMode()];
      const mascotAllLine = '🐄' + mAll.symbol + ' ' + mAll.phrase;
      se.innerHTML =
        '<span class="stars-pill">⭐ ' + totalStarsEarned + ' / ' + maxStarsPossible + '</span>'
        + '<span class="completed-pill">✅ ' + completedCount + ' / ' + total + ' '
        + L('terminados', 'terminés') + '</span>'
        + (allDone ? '<span class="sections-mascot-all">' + mascotAllLine + '</span>' : '');
    }

    // Sous-titre bilingue
    const subtitle = document.getElementById('sectionsSubtitle' + s);
    if (subtitle) {
      if (isFrench()) {
        subtitle.innerHTML = '<span class="translation-sub">Módulos</span>';
      } else {
        subtitle.innerHTML = '<span class="translation-sub">Modules</span>';
      }
    }

    /* aria-label du bouton 🔄 de réinitialisation globale — dynamique selon
       la LANGUE DE L'APPRENANT (ajouté le 22/07/2026, demande utilisateur) :
       contrairement aux icônes 🏠/🌎/❓/🚪 du même en-tête (aria-label
       bilingue concaténé, volontairement figé), celui-ci suit la langue que
       l'apprenant lit réellement — l'espagnol en mode learn_french
       (hispanophone apprenant le français), le français en mode learn_spain
       (francophone apprenant l'espagnol). Valeur HTML statique
       ("Réinitialiser la progression") conservée comme repli avant ce
       premier rendu JS. */
    const resetBtn = document.getElementById('resetInlineBtn' + s);
    if (resetBtn) {
      resetBtn.setAttribute('aria-label', isFrench()
        ? 'Reiniciar la progresión'
        : 'Réinitialiser la progression');
    }

    // Footer dynamique selon le mode
    const footer = document.getElementById('sectionsFooter' + s);
    if (footer) {
      if (isFrench()) {
        footer.innerHTML =
          '© Junio 2026 – Desarrollado por Sébastien Godet<br>'
          + 'Asistido por IA Claude Sonnet 4.6 y Gemini 3.5 Flash<br>'
          + '<button class="footer-antispam-btn" onclick="openAndCopyEmail()">✉️ <span class="antispam-email">moc.liamg@61tedog.neitsabes</span></button> · '
          + '<a href="https://www.linkedin.com/in/s%C3%A9bastien-godet-142ba6145" target="_blank" rel="noopener noreferrer">LinkedIn</a>';
      } else {
        footer.innerHTML =
          '© Juin 2026 – Développé par Sébastien Godet<br>'
          + 'Assisté par IA Claude Sonnet 4.6 et Gemini 3.5 Flash<br>'
          + '<button class="footer-antispam-btn" onclick="openAndCopyEmail()">✉️ <span class="antispam-email">moc.liamg@61tedog.neitsabes</span></button> · '
          + '<a href="https://www.linkedin.com/in/s%C3%A9bastien-godet-142ba6145" target="_blank" rel="noopener noreferrer">LinkedIn</a>';
      }
    }
  }

  /* ── Remplir les deux headers (level1 et level2) ── */
  _fillHeader('');    // IDs sans suffixe → #sections-level1
  _fillHeader('2');   // IDs avec suffixe '2' → #sections-level2

  /* ── Carte "Continuer" (ajoutée le 26/08/2026, suite) ── */
  const continueWrap1 = document.getElementById('continueWrap1');
  const continueWrap2 = document.getElementById('continueWrap2');
  if (continueWrap1) continueWrap1.innerHTML = _buildContinueCard(1);
  if (continueWrap2) continueWrap2.innerHTML = _buildContinueCard(2);

  /* ── Grilles de thèmes (Niveau 1 catégorisé, Niveau 2 simple) ── */
  const grid1 = document.getElementById('grid1');
  const grid2 = document.getElementById('grid2');
  if (grid1) grid1.innerHTML = _buildThemeGridHTML(1);
  if (grid2) grid2.innerHTML = _buildThemeGridHTML(2);
}

/* _buildThemeCard(t) — Construit le HTML d'une carte de module.
   Gère l'affichage du titre dans la langue cible selon currentMode,
   les étoiles (remplies/vides) et le bouton de réinitialisation. */
function _buildThemeCard(t) {
  // Délègue entièrement la résolution du titre à _themeTitle()
  const { main: mainTitle, sub: subLine } = _themeTitle(t);

  // Configuration du bouton de réinitialisation
  const resetBtn = isDone(t.id)
    ? '<button onclick="event.stopPropagation();resetTheme(\'' + t.id + '\')" '
      + 'style="margin-top:6px;font-size:.65rem;background:#fff;border:1.5px solid #009A44;'
      + 'color:#009A44;border-radius:50px;padding:4px 10px;cursor:pointer;font-weight:700">'
      + L('🔄 Volver a empezar', '🔄 Recommencer')
      + '</button>'
    : '';

  // Génération de l'affichage des étoiles — pleines en couleur (.star-filled),
  // vides bien estompées (.star-empty, opacité réduite) pour plus de contraste
  // qu'un simple ☆ non stylé (Amélioration visuelle 12/07/2026)
  const currentStars = getThemeStars(t.id);
  const starsStr = Array.from({ length: 3 }, (_, i) => {
    return i < currentStars
      ? '<span class="star-filled">⭐</span>'
      : '<span class="star-empty">☆</span>';
  }).join('');

  // État visuel de la carte : 'new' (jamais ouvert) | 'progress' (ouvert,
  // pas encore 100 %) | 'complete' (3 étoiles) — cf getModuleState()
  const state = getModuleState(t.id);

  // Badge "🆕 Nouveau", uniquement pour les modules jamais ouverts
  const newBadge = (state === 'new')
    ? '<span class="badge-new" aria-hidden="true">' + L('🆕 Nuevo', '🆕 Nouveau') + '</span>'
    : '';

  // Libellés accessibles : titre principal + statut étoiles/état
  const starsLabel = currentStars > 0
    ? ' — ' + currentStars + L(' étoile(s)', ' estrella(s)')
    : '';
  const doneLabel = (state === 'complete')
    ? L(' (completado)', ' (complété)')
    : (state === 'new' ? L(' (nuevo)', ' (nouveau)') : '');

  // Rendu de la carte HTML
  // role="button" + tabindex="0" : rend la div navigable au clavier
  // (le keydown global dans app.js déclenche .click() sur Entrée/Espace)
  return '<div class="theme-card state-' + state
    + '" role="button" tabindex="0"'
    + ' aria-label="' + _escAttr(mainTitle + starsLabel + doneLabel) + '"'
    + ' onclick="openTheme(\'' + t.id + '\')">'
    + newBadge
    + '<div class="t-emoji" aria-hidden="true">' + t.emoji   + '</div>'
    + '<div class="t-name">'    + mainTitle + '</div>'
    + '<div class="t-sub">'     + subLine   + '</div>'
    + '<div class="t-stars" aria-hidden="true" style="letter-spacing:2px">' + starsStr + '</div>'
    + resetBtn
    + '</div>';
}


/* ═══════════════════════════════════════════════════════════
   8. OUVERTURE D'UN THÈME — Écran leçon + système d'onglets
   ─────────────────────────────────────────────────────────
   openTheme(id) — Initialise et affiche la leçon pour le thème choisi.

   Le système d'onglets varie selon le type de thème :
     'alpha'  → Flashcards alphabet + Quiz audio
     'dialog' → Dialogue + Vocabulaire + Mini-quiz
     Standard → Flashcards + Quiz QCM

   switchTab(tab) — Bascule entre les onglets et déclenche le rendu adapté.
═══════════════════════════════════════════════════════════ */

function openTheme(id) {
  // Suivi "module déjà ouvert" (badge 🆕 Nouveau — indépendant des étoiles)
  markThemeOpened(id);

  // Chargement du thème et réinitialisation de toutes les variables de session
  CT        = ALL_THEMES.find(t => t.id === id);
  fcIdx     = 0;
  dqStep    = 0; dqScore    = 0; dqAnswered  = false;
  sitIdx    = 0;
  q10Step   = 0; q10Score   = 0; q10Answered = false;

  // Mémoriser le niveau du thème ouvert (pour le retour depuis la leçon)
  if (CT) _currentThemeLevel = CT.level || 1;

  // Pré-génération du quiz dynamique pour les thèmes de Niveau 1 (hors alphabet)
  _currentDynQuiz = (CT?.level === 1 && CT.type !== 'alpha')
    ? _generateLevel1Quiz(CT)
    : [];

  // Tentative de reprise d'un quiz en cours (sessionStorage) pour ce même thème.
  // Si une session valide existe, on mémorise l'onglet à activer en priorité.
  const resumeTab = _restoreQuizSession();

  // Injection de l'emoji dans l'en-tête de leçon
  document.getElementById('lessonEmoji').textContent = CT.emoji;

  // Construction du titre de l'écran leçon via _themeTitle() (source unique de vérité)
  const { main: mainTitle, sub: subTitle } = _themeTitle(CT);

  // Génération finale du titre : "Titre principal — Sous-titre"
  document.getElementById('lessonTitle').textContent = mainTitle + ' — ' + subTitle;

  showScreen('lesson');
  _updateLessonNavArrows();

  /* ── Footer de la leçon dans la langue de l'apprenant ── */
  const lf = document.getElementById('lessonFooter');
  if (lf) {
    if (isFrench()) {
      lf.innerHTML =
        '© Junio 2026 – Sébastien Godet<br>'
        + 'Asistido por IA Claude Sonnet 4.6 y Gemini 3.5 Flash · '
        + '<button class="footer-antispam-btn" onclick="openAndCopyEmail()">✉️ <span class="antispam-email">moc.liamg@61tedog.neitsabes</span></button> · '
        + '<a href="https://www.linkedin.com/in/s%C3%A9bastien-godet-142ba6145" target="_blank" rel="noopener noreferrer">LinkedIn</a>';
    } else {
      lf.innerHTML =
        '© Juin 2026 – Sébastien Godet<br>'
        + 'Assisté par IA Claude Sonnet 4.6 et Gemini 3.5 Flash · '
        + '<button class="footer-antispam-btn" onclick="openAndCopyEmail()">✉️ <span class="antispam-email">moc.liamg@61tedog.neitsabes</span></button> · '
        + '<a href="https://www.linkedin.com/in/s%C3%A9bastien-godet-142ba6145" target="_blank" rel="noopener noreferrer">LinkedIn</a>';
    }
  }

  // Définition des onglets selon le type de thème et le mode courant
  let tabs;
  if (CT.type === 'dialog') {
    tabs = [
      { k:'dialog', lbl: L('💬 Diálogo',     '💬 Dialogue')   },
      { k:'vocab',  lbl: L('📚 Vocabulario', '📚 Vocabulaire') },
      { k:'dquiz',  lbl: L('❓ Prueba',       '❓ Quiz')        }
    ];
  } else if (CT.type === 'alpha') {
    tabs = [
      { k:'flash',  lbl: L('🔤 Alfabeto',     '🔤 Alphabet')    },
      { k:'quiz10', lbl: L('🔊 Prueba Audio', '🔊 Quiz Audio')  }
    ];
  } else {
    tabs = [
      { k:'flash',  lbl: L('🃏 Cartas', '🃏 Cartes') },
      { k:'quiz10', lbl: L('❓ Prueba', '❓ Quiz')    },
      { k:'repeat', lbl: L('🎤 Repite', '🎤 Répète') }
    ];
  }

  // Rendu des boutons d'onglets
  // Si une session de quiz a été restaurée, on active cet onglet plutôt que le premier
  const initialTab = (resumeTab && tabs.some(t => t.k === resumeTab))
    ? resumeTab : tabs[0].k;

  document.getElementById('lessonTabs').innerHTML = tabs.map((t, i) => {
    return '<button class="tab' + (t.k === initialTab ? ' active' : '')
      + '" data-tab="' + t.k + '" onclick="switchTab(\'' + t.k + '\')">' + t.lbl + '</button>';
  }).join('');

  // ─── Badge de voix + barre de vitesse — injectés sous les onglets ───
  let lessonMeta = document.getElementById('lesson-meta-bar');
  if (!lessonMeta) {
    lessonMeta = document.createElement('div');
    lessonMeta.id = 'lesson-meta-bar';
    lessonMeta.className = 'lesson-meta-bar';
    const lessonBody = document.getElementById('lessonBody');
    const tabs_el    = document.getElementById('lessonTabs');
    if (lessonBody && tabs_el?.nextSibling) {
      lessonBody.insertBefore(lessonMeta, tabs_el.nextSibling);
    } else if (lessonBody) {
      lessonBody.insertBefore(lessonMeta, lessonBody.firstChild);
    }
  }
  // Badge voix (ES uniquement) + barre de vitesse (les deux modes)
  const badgeHtml = (currentMode === 'learn_spain')
    ? '<div id="voice-quality-badge" class="voice-quality-badge vqb-pending" title="">🇪🇸 <span class="vqb-label">Espagne (Castillan)…</span></div>'
    : '<div id="voice-quality-badge" class="voice-quality-badge vqb-exact">🇫🇷 <span class="vqb-label">Voix Français</span></div>';
  lessonMeta.innerHTML = badgeHtml + _buildSpeedBar();

  // Résolution immédiate du badge (si voix déjà résolue)
  _updateVoiceBadge();
  _updateSpeedBar();

  // Bannière hors-ligne proactive (Prononcer/Écouter) — ajoutée le
  // 10/07/2026. Doit être appelée APRÈS avoir (re)posé lessonMeta.innerHTML
  // ci-dessus, qui écrase le contenu de la barre à chaque ouverture de
  // leçon (sinon la bannière d'un précédent thème resterait affichée un
  // instant avant d'être effacée par l'assignation ci-dessus).
  _updateOfflineAudioBanner();

  // Si mode espagnol, déclencher la résolution de voix en tâche de fond pour le badge
  if (currentMode === 'learn_spain' && _spanishVoice === undefined) {
    _resolveSpanishVoice(() => { _updateVoiceBadge(); });
  }

  // Affiche l'onglet initial (repris ou premier par défaut).
  // On évite de passer par switchTab() pour ne pas réinitialiser le quiz restauré.
  if (resumeTab === initialTab) {
    if (resumeTab === 'quiz10') renderQuiz10();
    else if (resumeTab === 'dquiz') renderDialogQuiz();
  } else {
    switchTab(initialTab);
  }
}

function lessonNav(delta) {
  if (!CT || !ALL_THEMES.length) return;
  const levelThemes = ALL_THEMES.filter(t => t.level === CT.level);
  const idx = levelThemes.findIndex((t) => { return t.id === CT.id; });
  if (idx === -1) return;
  const newIdx = idx + delta;
  if (newIdx < 0 || newIdx >= levelThemes.length) return;
  openTheme(levelThemes[newIdx].id);
}
/**
 * Met à jour l'état disabled des boutons ‹ / › de navigation entre modules.
 * Désactive la flèche gauche sur le premier thème du niveau,
 * la flèche droite sur le dernier.
 */
function _updateLessonNavArrows() {
  if (!CT) return;
  const levelThemes = ALL_THEMES.filter(t => t.level === CT.level);
  const idx = levelThemes.findIndex((t) => { return t.id === CT.id; });
  const prev = document.getElementById('lessonPrevBtn');
  const next = document.getElementById('lessonNextBtn');
  if (prev) prev.disabled = (idx <= 0);
  if (next) next.disabled = (idx >= levelThemes.length - 1);
}

/* switchTab(tab) — Active l'onglet demandé et déclenche son rendu.
   BUG 6.7 (corrigé) : cette fonction réinitialisait auparavant à tort les
   variables de quiz (q10Step/q10Score, dqStep/dqScore) à CHAQUE clic sur
   l'onglet Prueba/dquiz — y compris en revenant d'un simple aller-retour
   vers Cartas ou Repite. Un utilisateur à la question 4/10 qui cliquait
   sur Cartas puis revenait sur Prueba perdait donc sa progression.
   q10Step/q10Score/dqStep/dqScore sont des variables de module qui restent
   en mémoire tant que la leçon reste ouverte : il suffit de ne plus les
   écraser ici pour que la reprise fonctionne naturellement.

   Cas particulier des quiz dynamiques (Niveau 1, hors alphabet) :
   on veut GARDER un jeu de questions aléatoire différent à chaque
   nouvelle tentative (fonctionnalité voulue), mais SANS écraser un quiz
   déjà en cours. On ne régénère donc _currentDynQuiz que si q10Step === 0,
   c'est-à-dire qu'aucune question n'a encore été répondue dans cette
   visite de l'onglet — jamais si l'utilisateur est au milieu du quiz.

   La réinitialisation complète reste faite aux bons endroits :
     - openTheme()    → nouvelle leçon ouverte (reset complet)
     - _retryQuiz10() / bouton "Recommencer" du dialogue → reset explicite
   sessionStorage (_saveQuizSession/_restoreQuizSession) continue de gérer
   la reprise après fermeture complète de l'app/l'onglet navigateur. */
function switchTab(tab) {
  document.querySelectorAll('#lessonTabs .tab').forEach((b) => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  /* Mise à jour du bouton PDF dans la barre meta (même ligne que Vitesse) */
  _updateMetaPdfBtn(tab);
  if      (tab === 'flash')  { renderFlash(); }
  else if (tab === 'quiz10') {
    // Aucun quiz en cours (pas encore répondu à une question) : on peut
    // régénérer un nouveau jeu de questions dynamiques sans rien perdre.
    if (q10Step === 0 && CT?.level === 1 && CT.type !== 'alpha') {
      _currentDynQuiz = _generateLevel1Quiz(CT);
    }
    renderQuiz10();
  }
  else if (tab === 'dialog') { renderDialog(); }
  else if (tab === 'vocab')  { renderVocab(); }
  else if (tab === 'dquiz')  { renderDialogQuiz(); }
  else if (tab === 'repeat') { renderRepeat(); }
}


/* ═══════════════════════════════════════════════════════════
   9. CARTES FLASH — Flashcards (vocabulaire & alphabet)
   ─────────────────────────────────────────────────────────
   renderFlash() — Affiche la carte active.
     - Thèmes 'alpha'    : grille de lettres cliquables + zone de détail
     - Thèmes normaux    : carte retournable (recto/verso) avec navigation

   Les mots espagnols utilisent en priorité la variante régionale
   (card.variants[currentRegion]) avant le castillan par défaut (card.es).

   Symbole mascotte régional (.fc-region-mascot, REGION_MASCOTS §15) affiché
   à côté du nom de la variante dans le bandeau de section, dans les deux
   sens de carte (recto FR/verso ES et recto ES/verso FR) — cohérent avec
   .hrw-chip-mascot / .launcher-region-mascot. Ajouté le 20/07/2026
   (demande utilisateur).
═══════════════════════════════════════════════════════════ */

function renderFlash() {
  const w    = CT.words;
  const card = w[fcIdx];

  /* ─── Rendu spécifique : Alphabet (grille de lettres) ─── */
  if (CT.type === 'alpha') {
    const alphaLabel = L(
      '¡Haz clic en una letra para escucharla!',
      'Cliquez sur une lettre pour l\'écouter !'
    );

    document.getElementById('tabContent').innerHTML =
      '<div class="section-label">' + alphaLabel + '</div>'
      + '<div class="alpha-grid">' + w.map((c, i) => {
          const bigLetter = L(c.fr, c.es);
          const smallName = L(c.es, c.fr);
          return '<div class="alpha-card" onclick="pickAlpha(' + i + ')">'
            + '<div class="alpha-letter">' + bigLetter + '</div>'
            + '<div class="alpha-name">'   + smallName  + '</div>'
            + '</div>';
        }).join('') + '</div>'
      + '<div id="alphaDetail" class="alpha-detail">' + buildAlphaDetail(card) + '</div>';
    return;
  }

  /* ─── Rendu standard : Flashcard retournable ─── */

  // Résolution du mot espagnol : variante régionale prioritaire sur le castillan
  const finalEsWord = (card.variants?.[currentRegion])
    ? card.variants[currentRegion] : card.es;

  // Drapeau courant pour l'affichage dans la section-label
  const flagEmojis  = { ES:'🇪🇸', MX:'🇲🇽', CO:'🇨🇴', PE:'🇵🇪', VE:'🇻🇪', AR:'🇦🇷', EC:'🇪🇨' };
  const activeFlag  = flagEmojis[currentRegion] || '🇪🇸';

  // Optionnel : emoji décoratif sur les deux faces
  const emFr = card.em ? '<div class="fc-front-emoji">' + card.em + '</div>' : '';
  const emBk = card.em ? '<div class="fc-back-emoji">'  + card.em + '</div>' : '';

  const hasConj = card.conj?.es && card.conj?.fr;
  let frontContent, backContent;

  /* — MODE Français : Recto = FR, Verso = ES — */
  if (isFrench()) {
    const hintFr = L('Haz clic para ver su significado en español', '');
    if (hasConj) {
      // Carte conjugaison : affiche le tableau de conjugaison des deux côtés
      frontContent = emFr + '<div class="fc-front-word">' + _buildSpeakableHTML(card.fr, 'fcword') + '</div>'
        + '<div class="fc-conj">' + card.conj.fr.map((l) => {
            return '<div class="fc-conj-line">' + l + '</div>'; }).join('') + '</div>';
      backContent  = emBk + '<div class="fc-back-word">' + finalEsWord + '</div>'
        + '<div class="fc-conj">' + card.conj.es.map((l) => {
            return '<div class="fc-conj-line">' + l + '</div>'; }).join('') + '</div>';
    } else {
      frontContent = emFr + '<div class="fc-front-word">' + _buildSpeakableHTML(card.fr, 'fcword') + '</div>'
        + '<div class="fc-front-hint">👆 ' + hintFr + '</div>';
      backContent  = emBk + '<div class="fc-back-word">' + finalEsWord + '</div>';
    }

    const regionLabelsFR = { ES:'🇪🇸 España (Castellano)', MX:'🇲🇽 México', CO:'🇨🇴 Colombia', AR:'🇦🇷 Argentina', PE:'🇵🇪 Perú', VE:'🇻🇪 Venezuela', EC:'🇪🇨 Ecuador' };
    const regionFullLabel = regionLabelsFR[currentRegion] || ('🇪🇸 España (Castellano)');
    document.getElementById('tabContent').innerHTML =
      '<div class="section-label">Anverso : Francés 🇫🇷 — Reverso : Español '
      + '<span id="current-lang-flag">' + regionFullLabel + '</span>'
      + '<span class="fc-region-mascot" aria-hidden="true"> 🐄' + REGION_MASCOTS[currentRegion].symbol + '</span>'
      + ' · Haz clic para volver !</div>'
      + '<div class="fc-wrap"><div class="fc" id="fc" onclick="flipCard()">'
      + '<div class="fc-front">' + frontContent + '</div>'
      + '<div class="fc-back">'  + backContent  + '</div>'
      + '</div></div>'
      + '<div class="fc-nav">'
      + '<button onclick="prevCard()">← Anterior</button>'
      + '<span class="fc-counter">' + (fcIdx + 1) + ' / ' + w.length + '</span>'
      + '<button onclick="nextCard()">Siguiente →</button>'
      + '</div>'
      + '<div class="audio-btn-group">'
      + '<button class="audio-btn-big audio-btn-main" onclick="speak(\'' + esc(card.fr) + '\', this, {highlightUid:\'fcword\'})" aria-label="' + _escAttr(L("Escuchar : ", "Écouter : ") + card.fr) + '">🔊 ' + L('Escuchar audio', 'Écouter') + '</button>'
      + _buildMicButton(card.fr, 'fr-FR')
      + '</div>'
      + _buildMicFeedbackZone();

  /* — MODE Espagnol : Recto = ES (variante), Verso = FR — */
  } else {
    const hintEs = L('', 'Cliquez pour voir la traduction en français');
    if (hasConj) {
      frontContent = emFr + '<div class="fc-front-word">' + _buildSpeakableHTML(finalEsWord, 'fcword') + '</div>'
        + '<div class="fc-conj">' + card.conj.es.map((l) => {
            return '<div class="fc-conj-line">' + l + '</div>'; }).join('') + '</div>';
      backContent  = emBk + '<div class="fc-back-word">' + card.fr + '</div>'
        + '<div class="fc-conj">' + card.conj.fr.map((l) => {
            return '<div class="fc-conj-line">' + l + '</div>'; }).join('') + '</div>';
    } else {
      frontContent = emFr + '<div class="fc-front-word">' + _buildSpeakableHTML(finalEsWord, 'fcword') + '</div>'
        + '<div class="fc-front-hint">👆 ' + hintEs + '</div>';
      backContent  = emBk + '<div class="fc-back-word">' + card.fr + '</div>';
    }

    const regionLabelsES = { ES:'🇪🇸 Espagne (Castillan)', MX:'🇲🇽 Mexique', CO:'🇨🇴 Colombie', AR:'🇦🇷 Argentine', PE:'🇵🇪 Pérou', VE:'🇻🇪 Venezuela', EC:'🇪🇨 Équateur' };
    const regionFullLabelES = regionLabelsES[currentRegion] || ('🇪🇸 Espagne (Castillan)');
    document.getElementById('tabContent').innerHTML =
      '<div class="section-label">Recto : Espagnol <span id="current-lang-flag">'
      + regionFullLabelES + '</span>'
      + '<span class="fc-region-mascot" aria-hidden="true"> 🐄' + REGION_MASCOTS[currentRegion].symbol + '</span>'
      + ' — Verso : Français 🇫🇷 · Cliquez pour retourner !</div>'
      + '<div class="fc-wrap"><div class="fc" id="fc" onclick="flipCard()">'
      + '<div class="fc-front">' + frontContent + '</div>'
      + '<div class="fc-back">'  + backContent  + '</div>'
      + '</div></div>'
      + '<div class="fc-nav">'
      + '<button onclick="prevCard()">← Précédent</button>'
      + '<span class="fc-counter">' + (fcIdx + 1) + ' / ' + w.length + '</span>'
      + '<button onclick="nextCard()">Suivant →</button>'
      + '</div>'
      + '<div class="audio-btn-group">'
      + '<button class="audio-btn-big audio-btn-main" onclick="speak(\'' + esc(finalEsWord) + '\', this, {highlightUid:\'fcword\'})" aria-label="' + _escAttr("Écouter : " + finalEsWord) + '">' + activeFlag + ' 🔊 ' + L('Escuchar', 'Écouter') + '</button>'
      + _buildMicButton(finalEsWord, voiceLang)
      + '</div>'
      + _buildMicFeedbackZone();
  }

  _autosizeFlashCard();
}

/* _autosizeFlashCard() — Corrige un bug de recouvrement des boutons de
   navigation (← Précédent / Suivant →) sur les cartes à conjugaison
   (module Verbes) ou à texte long.
   Cause : .fc-front et .fc-back sont en position:absolute (nécessaire
   pour l'effet de retournement 3D), donc leur hauteur réelle ne
   contribue jamais à celle de .fc, qui reste bloquée à min-height:240px.
   Un contenu plus grand (ex : tableau de conjugaison de 6 lignes) déborde
   alors visuellement de .fc — et comme .fc est un élément positionné, cet
   excédent est peint AU-DESSUS du bloc .fc-nav qui suit dans le flux
   normal (peu importe son ordre dans le DOM), rendant les boutons
   invisibles ET incliquables sous la zone de débordement.
   Corrigé le 26/08/2026 (demande utilisateur, signalement maman du
   09/08/2026 : "module des verbes en espagnol, on ne voit que Ser, on ne
   peut pas cliquer" — Ser est la 1ère carte du thème et a toujours eu une
   conjugaison, donc le bug touchait déjà la toute première carte).
   Solution : on mesure après rendu la hauteur réelle du contenu des deux
   faces (scrollHeight) et on applique la plus grande valeur à .fc via une
   hauteur explicite, pour que son propre encombrement dans le flux
   corresponde à ce qui est réellement affiché — même technique que
   _resizeOpenAccordions() (§15b) pour les accordéons du Guide. */
function _autosizeFlashCard() {
  const fc = document.getElementById('fc');
  if (!fc) return;
  const front = fc.querySelector('.fc-front');
  const back  = fc.querySelector('.fc-back');
  if (!front || !back) return;
  fc.style.height = '';
  const h = Math.max(front.scrollHeight, back.scrollHeight, 240);
  fc.style.height = h + 'px';
}
/* Recalcule aussi au redimensionnement (rotation d'écran, clavier virtuel…) :
   un texte qui se réenroule sur plus ou moins de lignes change scrollHeight. */
window.addEventListener('resize', _autosizeFlashCard);

/* buildAlphaDetail(c) — Construit le panneau de détail d'une lettre de l'alphabet.
   Affiche la lettre en grand, son nom dans l'autre langue, et un bouton audio. */
function buildAlphaDetail(c) {
  const bigLetter = L(c.fr, c.es);
  const smallName = L(c.es, c.fr);
  const btnLabel  = L('🔊 Escuchar', '🔊 Écouter');
  const spokenKey = _spokenKey(c);
  return '<div style="font-size:2.5rem;font-weight:900;color:#009A44">' + bigLetter + '</div>'
    + '<div style="color:#555;margin:4px 0;font-size:.85rem">' + smallName + '</div>'
    + '<button onclick="speak(\'' + esc(spokenKey) + '\')" '
    + 'style="margin-top:10px;background:#009A44;color:#fff;border:none;border-radius:50px;'
    + 'padding:9px 18px;cursor:pointer;font-weight:700;min-height:44px">' + btnLabel + '</button>';
}

/* pickAlpha(i) — Sélectionne une lettre dans la grille de l'alphabet,
   la prononce et met à jour le panneau de détail. */
function pickAlpha(i) {
  fcIdx = i;
  const card      = CT.words[i];
  // _spokenKey() retourne le mot dans la langue source selon le mode actif
  const spokenKey = _spokenKey(card);
  speak(spokenKey);
  const d = document.getElementById('alphaDetail');
  if (d) d.innerHTML = buildAlphaDetail(card);
}

/* flipCard() — Retourne la carte flash active (toggle de classe CSS 'flipped'). */
function flipCard() {
  const fc = document.getElementById('fc');
  if (!fc) return;
  fc.classList.toggle('flipped');
}


/* ═══════════════════════════════════════════════════════════
   9b. RECONNAISSANCE VOCALE — Micro dans les flashcards
   ─────────────────────────────────────────────────────────
   Utilise la Web Speech API (SpeechRecognition).
   Disponible sur Chrome Android, partielle sur Safari iOS.

   Fonctions :
     _buildMicButton(word, lang)     — génère le bouton "Prononcer" (à
                                        côté du bouton "Écouter")
     _buildMicFeedbackZone()         — génère la zone de feedback + hint
     startMicReco(word, lang)        — lance la reconnaissance
     _stopMicReco()                  — arrête proprement la session
     _normalizeSpeech(s)             — nettoie la transcription pour
                                        comparaison souple (accents,
                                        ponctuation, casse)
═══════════════════════════════════════════════════════════ */

// Instance SpeechRecognition active (null si aucune)
let _micReco = null;

/* _normalizeSpeech(s) — Retire accents, ponctuation, casse et espaces
   superflus pour une comparaison souple entre ce que l'utilisateur a dit
   et le mot attendu. Ex : "Buenos días" → "buenos dias" */
function _normalizeSpeech(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire les accents
    .replace(/[^a-z0-9\s]/g, '')                      // retire ponctuation
    .replace(/\s+/g, ' ').trim();
}

/* _levenshtein(a, b) — Distance d'édition (Levenshtein) entre deux chaînes.
   Programmation dynamique : tableau 2D (|a|+1) × (|b|+1).
   Coût : substitution = 1, insertion = 1, suppression = 1. */
function _levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
    for (let j = 1; j <= n; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else {
        const cost = (a[i - 1] === b[j - 1]) ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,        // suppression
          dp[i][j - 1] + 1,        // insertion
          dp[i - 1][j - 1] + cost  // substitution
        );
      }
    }
  }
  return dp[m][n];
}

/* _speechMatch(spoken, expected) — Retourne true si la transcription vocale
   correspond au mot attendu, avec tolérance floue pour les mots longs.
   Règles (dans l'ordre) :
     (a) identité exacte ;
     (b) l'une des chaînes contient l'autre ;
     (c) expected.length ≤ 3 → pas de tolérance (identité seulement) ;
     (d) sinon, distance de Levenshtein ≤ 25 % de la longueur de expected ;
     (e) pour les expressions avec "/" (ex : "Buenos días / Buen día"),
         chaque partie est testée indépendamment — la STT ne transcrit
         qu'une seule formulation, le seuil global échouerait sinon. */
function _speechMatch(spoken, expected) {
  /* Teste une paire normalisée avec la logique Levenshtein */
  function _testPair(t, e) {
    if (!e) return false;
    if (t === e) return true;
    if (t.includes(e) || e.includes(t)) return true;
    if (e.length <= 3) return false;
    return _levenshtein(t, e) <= Math.floor(e.length * 0.25);
  }

  /* Test direct sur l'expression complète */
  if (_testPair(spoken, expected)) return true;

  /* Si l'expression contient "/", tester chaque partie séparément */
  if (expected.indexOf('/') !== -1) {
    const parts = expected.split('/').map((p) => { return p.trim(); }).filter(Boolean);
    for (let i = 0; i < parts.length; i++) {
      const normPart = _normalizeSpeech(parts[i]);
      if (_testPair(spoken, normPart)) return true;
    }
  }

  return false;
}

/* _micBlockedHtml() — Retourne le HTML (icône + message clair) à afficher
   quand le micro est bloqué/refusé par le navigateur (erreurs SpeechRecognition
   'not-allowed' ou 'service-not-allowed'). L'icône 🚫🎤 est volontairement
   très reconnaissable, et le texte explique en 1 clic comment réactiver
   l'accès (icône cadenas/réglages dans la barre d'adresse). */
function _micBlockedHtml() {
  const msg = L(
    '🚫🎤 Micrófono bloqueado — toca el icono 🔒/⚙️ junto a la dirección del sitio, luego autoriza el micrófono y recarga la página.',
    '🚫🎤 Micro bloqué — touche l\'icône 🔒/⚙️ à côté de l\'adresse du site, puis autorise le micro et recharge la page.'
  );
  return '<span class="mic-blocked-icon">🚫🎤</span> ' + msg;
}

/* _isMicBlockedError(err) — true si l'erreur correspond à un refus de
   permission micro (et non à un simple silence ou souci réseau). */
function _isMicBlockedError(err) {
  return err === 'not-allowed' || err === 'service-not-allowed';
}

/* ─────────────────────────────────────────────────────────
   Ajouté le 09/07/2026 (retour testeur bêta) : la reconnaissance vocale
   (SpeechRecognition) envoie l'audio à un service cloud pour le transcrire
   — c'est vrai sur Chrome/Edge/Safari, qui reposent sur les serveurs de
   Google/Apple, et c'est une limitation de facto de l'API elle-même, pas
   de cette app. Contrairement à la synthèse vocale (speechSynthesis), qui
   PEUT fonctionner hors-ligne si une voix locale est déjà installée sur
   l'appareil, la reconnaissance ne fonctionne quasiment jamais sans réseau.
   On détecte donc l'état hors-ligne en amont pour afficher un message clair
   au lieu de laisser échouer la tentative avec une erreur technique brute
   ('network'). Ce n'est pas contournable proprement sans un moteur de
   reconnaissance embarqué (modèle ML téléchargé, ex. Vosk/whisper.cpp en
   WASM) — option écartée ici car elle contredit le principe "zéro
   dépendance" du projet et pèserait plusieurs dizaines de Mo par langue,
   pour un gain limité (voir échange du 09/07/2026 pour le détail). */
function _isOffline() {
  return typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine;
}
function _micOfflineHtml() {
  // Corrigé le 10/07/2026 : le message affirmait auparavant sans nuance que
  // "Écouter reste disponible hors ligne". C'est vrai que speechSynthesis
  // PEUT fonctionner sans réseau (contrairement à SpeechRecognition), mais
  // seulement si une voix locale existe déjà sur l'appareil pour la langue
  // voulue — sinon _resolveSpanishVoice() retombe sur voices[0] (voir plus
  // haut), qui peut être une voix dans une tout autre langue que celle
  // apprise. D'où la nuance ajoutée ici. Voir aussi _updateOfflineAudioBanner()
  // pour l'indicateur proactif équivalent, affiché sans attendre un clic.
  const msg = L(
    '🎤📡 El reconocimiento de voz necesita conexión a Internet — no disponible sin conexión. 🔊 Escuchar puede funcionar sin conexión (voz local), pero no siempre en el idioma correcto.',
    '🎤📡 La reconnaissance vocale nécessite une connexion Internet — indisponible hors ligne. 🔊 Écouter peut fonctionner hors ligne (voix locale), mais pas forcément dans la bonne langue.'
  );
  return '<span class="mic-blocked-icon">🎤📡</span> ' + msg;
}

/* ─────────────────────────────────────────────────────────
   Ajouté le 10/07/2026 (retour utilisateur) : les deux messages ci-dessus
   (_micOfflineHtml, _micBlockedHtml) ne s'affichent qu'APRÈS un clic sur
   "Prononcer" ou "Écouter" — un apprenant hors ligne pouvait donc essuyer
   un échec avant de comprendre la limitation. Cette bannière est proactive
   et persistante : injectée dans la barre meta de la leçon (#lesson-meta-bar,
   visible sur tous les onglets — Cartes/Quiz/Répète/Dialogue/Vocabulaire)
   dès que l'appareil est détecté hors ligne, sans attendre une interaction.
   Couvre les deux limitations réelles :
     • 🎤 Prononcer (SpeechRecognition) : ne fonctionne JAMAIS hors ligne
       (service cloud, cf. _isOffline() plus haut) — non affiché si la
       leçon n'a pas de fonction Prononcer (thèmes alphabet/dialogue).
     • 🔊 Écouter (speechSynthesis) : PEUT fonctionner hors ligne, mais
       utilisera la langue par défaut du système à la place de la langue
       apprise si aucune voix locale correspondante n'est installée sur
       l'appareil (cf. _resolveSpanishVoice(), repli sur voices[0]).
   Se met à jour en direct via les évènements 'online'/'offline' — pas
   besoin de rouvrir la leçon pour que la bannière apparaisse/disparaisse. */

/* _lessonHasMicFeature() — true si la leçon actuellement ouverte propose
   le bouton "Prononcer" (thèmes vocabulaire normaux, onglets Cartes et
   Répète). Absent des thèmes alphabet (buildAlphaDetail() n'a pas de
   micro) et des dialogues (onglets Dialogue/Vocabulaire/Quiz, pas de
   micro non plus) — voir _buildMicButton()/_rpStartMic() pour le détail
   des onglets concernés. */
function _lessonHasMicFeature() {
  return !!(CT && CT.type !== 'alpha' && CT.type !== 'dialog');
}

/* _buildOfflineAudioBannerHtml(hasMic) — Construit le texte bilingue de
   la bannière hors-ligne, adapté selon que la leçon ouverte propose ou
   non la fonction Prononcer (cf. _lessonHasMicFeature()). */
function _buildOfflineAudioBannerHtml(hasMic) {
  const micPart = hasMic
    ? L(
        '🎤 Pronunciar no disponible sin conexión. ',
        '🎤 Prononcer indisponible hors ligne. '
      )
    : '';
  // Le nom de la langue prononcée dépend du mode : learn_french → voix
  // française attendue (interface espagnole) ; learn_spain → voix
  // espagnole attendue (interface française). Cf. convention L(fr, es)
  // documentée en §1b (fr = texte espagnol affiché en mode learn_french,
  // es = texte français affiché en mode learn_spain).
  const listenPart = L(
    '🔊 Escuchar puede funcionar sin conexión, pero usará el idioma por defecto del aparato si la voz francesa no está instalada.',
    '🔊 Écouter peut fonctionner hors ligne, mais utilisera la langue par défaut de l\'appareil si la voix espagnole n\'est pas installée.'
  );
  return '<span class="offline-banner-icon" aria-hidden="true">📡</span>'
    + '<span class="offline-banner-text">' + micPart + listenPart + '</span>';
}

/* _updateOfflineAudioBanner() — Affiche/masque/actualise la bannière
   #offline-audio-banner dans #lesson-meta-bar selon l'état de connexion
   (_isOffline()) et le type de leçon ouverte (_lessonHasMicFeature()).
   Sans effet si aucune leçon n'est ouverte (pas de #lesson-meta-bar dans
   le DOM) — la fonction ne fait alors rien plutôt que de planter. */
function _updateOfflineAudioBanner() {
  const lessonMeta = document.getElementById('lesson-meta-bar');
  if (!lessonMeta) return;

  let banner = document.getElementById('offline-audio-banner');
  if (_isOffline()) {
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'offline-audio-banner';
      banner.className = 'offline-audio-banner';
      banner.setAttribute('role', 'status');
      lessonMeta.insertBefore(banner, lessonMeta.firstChild);
    }
    banner.innerHTML = _buildOfflineAudioBannerHtml(_lessonHasMicFeature());
  } else if (banner) {
    banner.remove();
  }
}

// Mise à jour en direct au changement de connectivité (sans attendre un
// clic ni une réouverture de leçon). Sans effet si aucune leçon n'est
// ouverte au moment du changement (cf. garde en tête de fonction).
window.addEventListener('online',  _updateOfflineAudioBanner);
window.addEventListener('offline', _updateOfflineAudioBanner);

/* _buildMicButton(word, lang) — Génère uniquement le bouton "Prononcer".
   Corrigé le 07/07/2026 : séparé de _buildMicZone pour pouvoir l'afficher
   à côté du bouton "Écouter" (même ligne, cf. .audio-btn-group dans
   renderFlash), à la place de l'ancien bouton "🐢 Lent" retiré (redondant
   avec la barre de vitesse déjà disponible juste au-dessus).
   word = mot attendu, lang = code BCP-47. Retourne '' si la reconnaissance
   vocale n'est pas disponible sur ce navigateur (le message correspondant
   est affiché par _buildMicFeedbackZone à la place). */
function _buildMicButton(word, lang) {
  if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    return '';
  }
  const btnLbl = L('🎤 Pronunciar', '🎤 Prononcer');
  return '<button class="audio-btn-big mic-btn" id="micBtn" '
    +   'onclick="startMicReco(\'' + esc(word) + '\',\'' + lang + '\')">'
    +   btnLbl
    + '</button>';
}

/* _buildMicFeedbackZone() — Génère la zone de feedback/hint sous les boutons
   Écouter/Prononcer (résultat de la reconnaissance, ou message "non
   disponible" si le navigateur ne supporte pas SpeechRecognition). */
function _buildMicFeedbackZone() {
  const hint = L(
    'Pulsa el micrófono, luego pronúncialo en voz alta',
    'Appuie sur le micro, puis prononce le mot à voix haute'
  );
  const unsupported = L(
    '⚠️ Reconocimiento de voz no disponible en este navegador.',
    '⚠️ Reconnaissance vocale non disponible sur ce navigateur.'
  );

  if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    return '<div class="mic-zone mic-zone--unsupported">' + unsupported + '</div>';
  }

  return '<div class="mic-zone" id="micZone">'
    + '<div class="mic-feedback" id="micFeedback"></div>'
    + '<div class="mic-hint">' + hint + '</div>'
    + '</div>';
}

/* startMicReco(word, lang) — Lance une session de reconnaissance vocale.
   Compare la transcription obtenue au mot attendu (normalisation souple).
   Affiche vert ✅ si correct, orange 🔁 sinon, avec le texte reconnu. */
function startMicReco(word, lang) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;

  // Corrigé le 09/07/2026 : reconnaissance vocale = service cloud, ne
  // fonctionne pas hors ligne (contrairement à l'écoute). On le détecte
  // avant de lancer la session plutôt que de laisser échouer avec une
  // erreur technique brute 'network'.
  if (_isOffline()) {
    const fb = document.getElementById('micFeedback');
    if (fb) {
      fb.className  = 'mic-feedback mic-feedback--blocked';
      fb.innerHTML  = _micOfflineHtml();
    }
    return;
  }

  // Arrête une session précédente éventuelle
  _stopMicReco();

  const isFR = (currentMode === 'learn_french');

  // Mise à jour du bouton : état "en écoute"
  const btn = document.getElementById('micBtn');
  const fb  = document.getElementById('micFeedback');
  if (btn) {
    btn.textContent = L('⏹ Parar', '⏹ Arrêter');
    btn.classList.add('mic-btn--listening');
    btn.onclick = function() { _stopMicReco(); };
  }
  if (fb) {
    fb.className  = 'mic-feedback mic-feedback--listening';
    fb.textContent = L('🎙️ Escuchando…', '🎙️ Écoute en cours…');
  }

  // Création et configuration de la session
  const reco        = new SR();
  _micReco        = reco;
  reco.lang       = lang;
  reco.continuous = false;
  reco.interimResults = false;

  reco.onresult = function(e) {
    const transcript = e.results[0][0].transcript;
    const expected   = _normalizeSpeech(word);
    const spoken     = _normalizeSpeech(transcript);
    const ok         = _speechMatch(spoken, expected);

    const fbEl = document.getElementById('micFeedback');
    if (fbEl) {
      if (ok) {
        fbEl.className  = 'mic-feedback mic-feedback--ok';
        fbEl.innerHTML  = L('✅ ¡Muy bien! ', '✅ Parfait ! ')
          + '<span class="mic-transcript">"' + _escAttr(transcript) + '"</span>';
      } else {
        fbEl.className  = 'mic-feedback mic-feedback--ko';
        fbEl.innerHTML  = L('🔁 Inténtalo otra vez · ', '🔁 Réessaie · ')
          + L('Escuchado : ', 'Entendu : ')
          + '<span class="mic-transcript">"' + _escAttr(transcript) + '"</span>';
      }
    }
    _resetMicBtn(word, lang);
  };

  reco.onerror = function(e) {
    const fbEl = document.getElementById('micFeedback');
    if (fbEl) {
      if (_isMicBlockedError(e.error)) {
        fbEl.className  = 'mic-feedback mic-feedback--blocked';
        fbEl.innerHTML  = _micBlockedHtml();
      } else if (e.error === 'network') {
        // Corrigé le 09/07/2026 : message clair au lieu de "Erreur : network"
        // (ex. connexion perdue en cours d'écoute).
        fbEl.className  = 'mic-feedback mic-feedback--blocked';
        fbEl.innerHTML  = _micOfflineHtml();
      } else if (e.error !== 'no-speech') {
        // 'no-speech' = silence, pas vraiment une erreur à afficher
        fbEl.className  = 'mic-feedback mic-feedback--ko';
        fbEl.textContent = L('⚠️ Error: ', '⚠️ Erreur : ') + e.error;
      } else {
        fbEl.className  = 'mic-feedback';
        fbEl.textContent = '';
      }
    }
    _resetMicBtn(word, lang, _isMicBlockedError(e.error));
  };

  reco.onend = function() {
    _micReco = null;
    _resetMicBtn(word, lang);
  };

  reco.start();
}

/* _stopMicReco() — Arrête proprement la session en cours. */
function _stopMicReco() {
  if (_micReco) {
    try { _micReco.stop(); } catch(e) {}
    _micReco = null;
  }
}

/* _resetMicBtn(word, lang, blocked) — Remet le bouton micro en état "prêt".
   Si blocked=true (micro refusé par le navigateur), affiche une icône
   🚫🎤 facilement reconnaissable directement sur le bouton, pour que
   l'apprenant comprenne immédiatement qu'il doit réautoriser l'accès. */
function _resetMicBtn(word, lang, blocked) {
  const btn = document.getElementById('micBtn');
  if (!btn) return;
  btn.textContent = blocked
    ? L('🚫🎤 Bloqueado — toca para reintentar', '🚫🎤 Bloqué — touche pour réessayer')
    : L('🎤 Pronunciar', '🎤 Prononcer');
  btn.classList.remove('mic-btn--listening');
  btn.classList.toggle('mic-btn--blocked', !!blocked);
  btn.onclick = function() { startMicReco(word, lang); };
}

/* nextCard() — Passe à la carte suivante et prononce automatiquement le mot. */
function nextCard() {
  fcIdx = (fcIdx + 1) % CT.words.length;
  renderFlash();
  // Prononce le mot dans la langue cible (avec variante régionale si espagnol)
  let spokenKey;
  if (isFrench()) {
    spokenKey = CT.words[fcIdx].fr;
  } else {
    spokenKey = (CT.words[fcIdx].variants && CT.words[fcIdx].variants[currentRegion])
      ? CT.words[fcIdx].variants[currentRegion]
      : CT.words[fcIdx].es;
  }
  setTimeout(() => { speak(spokenKey); }, 300);
}

/* prevCard() — Revient à la carte précédente. */
function prevCard() {
  fcIdx = (fcIdx - 1 + CT.words.length) % CT.words.length;
  renderFlash();
}

/* isAlphaQuiz() — Retourne true si le thème courant est de type alphabet. */
function isAlphaQuiz() { return CT?.type === 'alpha'; }


/* ═══════════════════════════════════════════════════════════
   9c. ONGLET RÉPÈTE — Répétition orale guidée (Niveau 1 uniquement)
   ─────────────────────────────────────────────────────────
   Séquence par mot :
     1. Affiche le mot dans la langue cible (+ emoji si dispo)
     2. Lance speak() automatiquement
     3. Après un délai adapté à la longueur du mot (voir _rpMicDelay :
        1800ms de base, +1400ms par "/" pour les mots à deux formulations
        comme "Buenos días / Buen día", +90ms par mot supplémentaire),
        déclenche startMicReco avec la bonne langue
     4. Affiche feedback vert/orange identique à l'option A
     5. Après 2500ms de feedback, passe au mot suivant (ou attend le bouton)
   Contrôles permanents : compteur, score, bouton ⏭ Passer, 🔁 Réentendre.
   Fin de session : écran récap avec score X/total + bouton Recommencer.
═══════════════════════════════════════════════════════════ */

// Variables d'état de la session Répète
let _rpIdx       = 0;    // Index du mot courant
let _rpScore     = 0;    // Nombre de réussites
let _rpWords     = [];   // Liste des mots (filtrés fr+es)
let _rpAnswered  = false; // Empêche le double-déclenchement
let _rpAutoTimer   = null; // Timer pour l'avancement automatique
let _rpMicTimer    = null; // Timer pour le délai avant micro
let _rpMicWatchdog = null; // Sécurité : évite un blocage indéfini si le micro ne répond jamais (voir _rpStartMic)

/* _rpGetWord(idx) — Retourne le mot courant avec sa forme cible résolue. */
function _rpGetWord(idx) {
  const card = _rpWords[idx];
  if (!card) return null;
  let targetWord, displayEmoji;
  if (currentMode === 'learn_french') {
    targetWord   = card.fr;
  } else {
    targetWord = (card.variants?.[currentRegion])
      ? card.variants[currentRegion] : card.es;
  }
  displayEmoji = card.em || '';
  return { card: card, word: targetWord, emoji: displayEmoji };
}

/* _rpMicDelay(word) — Calcule le court délai (ms) laissé après la FIN RÉELLE
   de la synthèse vocale (callback onDone de speak()) avant de démarrer le
   micro. Ce n'est plus une estimation de la durée totale de la parole (le
   micro démarre désormais après la fin effective de l'audio, cf. bug iOS
   ci-dessous) : juste un court temps de battement, plus un supplément pour
   les mots à double formulation ("Adiós / Hasta luego") afin de laisser à
   l'apprenant le temps de réfléchir aux deux versions.
   BUG iOS (corrigé le 07/07/2026) : Safari iOS partage une seule session
   audio entre lecture (TTS) et enregistrement (micro). Démarrer la
   reconnaissance vocale AVANT la fin réelle de l'audio (l'ancien code se
   basait sur un délai fixe estimé, souvent trop court) pouvait mettre la
   session audio dans un état incohérent : le micro semblait actif (voyant
   d'enregistrement du système allumé) mais ne renvoyait plus jamais de
   résultat ni d'erreur, bloquant l'apprenant sur "Écoute en cours…". */
function _rpMicDelay(word) {
  const BASE      = 450;  // battement court après la fin réelle de l'audio
  const PER_SLASH = 500;  // réflexion supplémentaire par formulation alternative

  if (!word) return BASE;
  const slashCount = (word.match(/\//g) || []).length;
  return BASE + slashCount * PER_SLASH;
}

/* _rpClearTimers() — Annule les timers en cours (changement manuel). */
function _rpClearTimers() {
  if (_rpAutoTimer)    { clearTimeout(_rpAutoTimer);    _rpAutoTimer    = null; }
  if (_rpMicTimer)     { clearTimeout(_rpMicTimer);     _rpMicTimer     = null; }
  if (_rpMicWatchdog)  { clearTimeout(_rpMicWatchdog);  _rpMicWatchdog  = null; }
  _stopMicReco();
}

/* renderRepeat() — Point d'entrée : initialise la session et affiche le premier mot. */
function renderRepeat() {
  _rpClearTimers();
  _rpIdx      = 0;
  _rpScore    = 0;
  _rpAnswered = false;
  // Filtre les mots ayant fr ET es
  _rpWords = (CT.words || []).filter(w => w.fr && w.es);

  if (!_rpWords.length) {
    const noW = L('No hay palabras disponibles.', 'Aucun mot disponible.');
    document.getElementById('tabContent').innerHTML = '<div class="result-box"><p>' + noW + '</p></div>';
    return;
  }
  _rpShowWord();
}

/* _rpShowWord() — Affiche le mot courant et lance la séquence audio + micro. */
function _rpShowWord() {
  _rpClearTimers();
  _rpAnswered = false;

  if (_rpIdx >= _rpWords.length) {
    _rpShowEnd();
    return;
  }

  const total  = _rpWords.length;
  const info   = _rpGetWord(_rpIdx);
  if (!info) { _rpIdx++; _rpShowWord(); return; }

  const micLang    = isFrench() ? 'fr-FR' : voiceLang;
  const counterLbl = L('Palabra', 'Mot');
  const scoreLbl   = L('Aciertos', 'Réussites');
  const skipLbl    = L('⏭ Saltar', '⏭ Passer');
  const rehearLbl  = L('🔁 Volver a escuchar', '🔁 Réentendre');

  const emojiHtml = info.emoji
    ? '<div class="rp-word-emoji">' + info.emoji + '</div>'
    : '';

  document.getElementById('tabContent').innerHTML =
    '<div class="rp-wrap">'
    + '<div class="rp-header">'
    +   '<span class="rp-counter">' + counterLbl + ' ' + (_rpIdx + 1) + ' / ' + total + '</span>'
    +   '<span class="rp-score">' + scoreLbl + ' : <strong>' + _rpScore + '</strong></span>'
    + '</div>'
    + '<div class="rp-word-box">'
    +   emojiHtml
    +   '<div class="rp-word">' + info.word + '</div>'
    + '</div>'
    + '<div class="rp-feedback" id="rpFeedback"></div>'
    + '<div class="rp-controls">'
    +   '<button class="mic-btn rp-rehear-btn" id="rpRehearBtn" onclick="_rpRehear()">' + rehearLbl + '</button>'
    +   '<button class="mic-btn rp-skip-btn"   id="rpSkipBtn"   onclick="_rpSkip()">'   + skipLbl   + '</button>'
    + '</div>'
    + '</div>';

  // 1. Prononce le mot automatiquement, PUIS (onDone) lance le micro une
  //    fois la synthèse vocale réellement terminée — voir _rpMicDelay()
  //    pour l'explication du bug iOS que ceci corrige.
  speak(info.word, null, {
    onDone: () => {
      _rpMicTimer = setTimeout(() => {
        const fbEl = document.getElementById('rpFeedback');
        if (fbEl) {
          fbEl.className   = 'rp-feedback mic-feedback mic-feedback--listening';
          fbEl.textContent = L('🎙️ Escuchando…', '🎙️ Écoute en cours…');
        }
        _rpStartMic(info.word, micLang);
      }, _rpMicDelay(info.word));
    }
  });
}

/* _rpStartMic(word, lang) — Lance la reconnaissance vocale dans le contexte Répète. */
function _rpStartMic(word, lang) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    const fbEl = document.getElementById('rpFeedback');
    if (fbEl) {
      fbEl.className   = 'rp-feedback mic-feedback mic-feedback--ko';
      fbEl.textContent = L(
        '⚠️ Reconocimiento de voz no disponible.',
        '⚠️ Reconnaissance vocale non disponible.'
      );
    }
    return;
  }
  // Corrigé le 09/07/2026 : même détection hors-ligne que startMicReco()
  // (Cartes) — voir _isOffline()/_micOfflineHtml() pour le détail.
  if (_isOffline()) {
    const fbEl = document.getElementById('rpFeedback');
    if (fbEl) {
      fbEl.className = 'rp-feedback mic-feedback mic-feedback--blocked';
      fbEl.innerHTML = _micOfflineHtml();
    }
    return;
  }
  _stopMicReco();

  const reco = new SR();
  _micReco = reco;
  reco.lang           = lang;
  reco.continuous     = false;
  reco.interimResults = false;

  reco.onresult = function(e) {
    if (_rpAnswered) return;
    _rpAnswered = true;
    if (_rpMicWatchdog) { clearTimeout(_rpMicWatchdog); _rpMicWatchdog = null; }
    const transcript = e.results[0][0].transcript;
    const expected   = _normalizeSpeech(word);
    const spoken     = _normalizeSpeech(transcript);
    const ok = _speechMatch(spoken, expected);

    if (ok) _rpScore++;
    _vibrateFeedback(ok);
    _rpShowFeedback(ok, transcript, word, lang);
  };

  reco.onerror = function(e) {
    if (_rpAnswered) return;
    _rpAnswered = true;
    if (_rpMicWatchdog) { clearTimeout(_rpMicWatchdog); _rpMicWatchdog = null; }
    const fbEl = document.getElementById('rpFeedback');

    if (_isMicBlockedError(e.error)) {
      // Micro bloqué : on ne fait PAS avancer automatiquement, l'apprenant
      // doit d'abord réautoriser l'accès. On affiche un message clair avec
      // une icône facilement reconnaissable et un bouton pour réessayer.
      if (fbEl) {
        fbEl.className = 'rp-feedback mic-feedback mic-feedback--blocked';
        fbEl.innerHTML = _micBlockedHtml()
          + '<br><button class="mic-btn rp-retry-btn" style="margin-top:8px" '
          + 'onclick="_rpRehear()">' + L('🔁 Reintentar', '🔁 Réessayer') + '</button>';
      }
      return; // pas de _rpAutoTimer : on attend l'action de l'apprenant
    }

    if (fbEl && e.error === 'network') {
      // Corrigé le 09/07/2026 : message clair au lieu de "Erreur : network".
      fbEl.className = 'rp-feedback mic-feedback mic-feedback--blocked';
      fbEl.innerHTML = _micOfflineHtml();
      return; // pas de _rpAutoTimer : cf. branche 'blocked' ci-dessus
    }

    if (fbEl && e.error !== 'no-speech') {
      fbEl.className   = 'rp-feedback mic-feedback mic-feedback--ko';
      fbEl.textContent = L('⚠️ Error: ', '⚠️ Erreur : ') + e.error;
    } else if (fbEl) {
      fbEl.className   = 'rp-feedback';
      fbEl.textContent = '';
    }
    // Passe au mot suivant après un silence
    _rpAutoTimer = setTimeout(() => { _rpIdx++; _rpShowWord(); }, 2000);
  };

  /* BUG CORRIGÉ (07/07/2026) : sur iOS Safari, une session de reconnaissance
     peut se terminer (déclenchement de 'onend') SANS jamais avoir déclenché
     ni 'onresult' ni 'onerror' — notamment en cas de silence. Comme _rpAnswered
     restait alors à false et qu'aucun code ici ne réagissait à ce cas, l'écran
     restait bloqué indéfiniment sur "Écoute en cours…" (symptôme exact remonté
     par les tests iPhone). On traite donc maintenant ce cas comme un silence :
     on efface le message et on passe au mot suivant après un court délai. */
  reco.onend = function() {
    _micReco = null;
    if (_rpMicWatchdog) { clearTimeout(_rpMicWatchdog); _rpMicWatchdog = null; }
    if (_rpAnswered) return; // déjà traité par onresult/onerror ci-dessus
    _rpAnswered = true;
    const fbEl = document.getElementById('rpFeedback');
    if (fbEl) { fbEl.className = 'rp-feedback'; fbEl.textContent = ''; }
    _rpAutoTimer = setTimeout(() => { _rpIdx++; _rpShowWord(); }, 1200);
  };

  reco.start();

  /* Filet de sécurité supplémentaire : sur iOS, il est arrivé (retours de
     tests) que la reconnaissance reste "en écoute" plusieurs minutes sans
     qu'aucun événement (result/error/end) ne se déclenche du tout. Après
     10 s sans aucune réponse, on arrête nous-mêmes la session et on propose
     un bouton "Réessayer" plutôt que de laisser l'apprenant bloqué sans
     retour ni recours. */
  _rpMicWatchdog = setTimeout(() => {
    if (_rpAnswered) return;
    _rpAnswered = true;
    _stopMicReco();
    const fbEl = document.getElementById('rpFeedback');
    if (fbEl) {
      fbEl.className = 'rp-feedback mic-feedback mic-feedback--blocked';
      fbEl.innerHTML = L('⏱️ Sin respuesta del micrófono · ', '⏱️ Pas de réponse du micro · ')
        + '<button class="mic-btn rp-retry-btn" style="margin-top:8px" '
        + 'onclick="_rpRehear()">' + L('🔁 Reintentar', '🔁 Réessayer') + '</button>';
    }
  }, 10000);
}

/* _rpShowFeedback(ok, transcript, word, lang) — Affiche le feedback et programme l'avancement. */
function _rpShowFeedback(ok, transcript, word, lang) {
  const fbEl = document.getElementById('rpFeedback');
  if (fbEl) {
    if (ok) {
      fbEl.className = 'rp-feedback mic-feedback mic-feedback--ok';
      fbEl.innerHTML = L('✅ ¡Muy bien! ', '✅ Parfait ! ')
        + '<span class="mic-transcript">"' + _escAttr(transcript) + '"</span>';
    } else {
      fbEl.className = 'rp-feedback mic-feedback mic-feedback--ko';
      fbEl.innerHTML = L('🔁 Inténtalo otra vez · Escuchado : ', '🔁 Réessaie · Entendu : ')
        + '<span class="mic-transcript">"' + _escAttr(transcript) + '"</span>';
    }
  }
  // Avancement automatique après 2500ms
  _rpAutoTimer = setTimeout(() => { _rpIdx++; _rpShowWord(); }, 2500);
}

/* _rpRehear() — Prononce à nouveau le mot courant et relance le micro. */
function _rpRehear() {
  _rpClearTimers();
  _rpAnswered = false;
  const micLang = isFrench() ? 'fr-FR' : voiceLang;
  const info   = _rpGetWord(_rpIdx);
  if (!info) return;

  const fbEl = document.getElementById('rpFeedback');
  if (fbEl) { fbEl.className = 'rp-feedback'; fbEl.textContent = ''; }

  speak(info.word, null, {
    onDone: () => {
      _rpMicTimer = setTimeout(() => {
        const fbEl2 = document.getElementById('rpFeedback');
        if (fbEl2) {
          fbEl2.className   = 'rp-feedback mic-feedback mic-feedback--listening';
          fbEl2.textContent = L('🎙️ Escuchando…', '🎙️ Écoute en cours…');
        }
        _rpStartMic(info.word, micLang);
      }, _rpMicDelay(info.word));
    }
  });
}

/* _rpSkip() — Passe au mot suivant sans réponse (ne compte pas comme réussite). */
function _rpSkip() {
  _rpClearTimers();
  _rpAnswered = true;
  _rpIdx++;
  _rpShowWord();
}

/* _rpShowEnd() — Affiche l'écran de fin de session avec score et bouton Recommencer. */
function _rpShowEnd() {
  _rpClearTimers();
  const total  = _rpWords.length;
  const pct    = total ? Math.round(_rpScore / total * 100) : 0;

  /* Sauvegarde des étoiles — l'onglet Répète contribue à la progression
     au même titre que les onglets Quiz (markDone ne rétrograde jamais). */
  const starsEarned = _calcStars(pct);
  if (starsEarned > 0 && CT) {
    markDone(CT.id, pct);
    /* Rafraîchit les étoiles dans la grille de modules (visible au retour) */
    renderSections(_currentThemeLevel);
  }

  const titleOk  = L('¡Sesión completada!', 'Session terminée !');
  const retryLbl = L('🔁 Volver a empezar', '🔁 Recommencer');
  const scoreLbl = L('Resultado', 'Score');

  const starsHtml   = Array.from({ length: 3 }, (_, i) => {
    return i < starsEarned ? '⭐' : '☆';
  }).join('');

  /* Clin d'œil mascotte VACHÉBO sur un sans-faute (3 étoiles), au même
     titre que les écrans de résultat des quiz — voir _mascotSansFauteLine()
     (§14), factorisée le 20/07/2026 (demande utilisateur) pour être
     partagée entre les quiz et l'onglet Répète. */
  const mascotLine = _mascotSansFauteLine(starsEarned);

  document.getElementById('tabContent').innerHTML =
    '<div class="result-box">'
    + '<div style="font-size:2rem;margin-bottom:5px;">' + starsHtml + '</div>'
    + '<h3>' + titleOk + '</h3>'
    + (mascotLine ? '<div class="quiz-mascot-line">' + mascotLine + '</div>' : '')
    + '<div class="score-num">' + _rpScore + ' / ' + total + '</div>'
    + '<div style="font-size:.9rem;color:#666;margin:6px 0">' + scoreLbl + ' : ' + pct + '%</div>'
    + '<button class="retry-btn" style="margin-top:14px;background:#888" onclick="renderRepeat()">'
    + retryLbl + '</button>'
    + '</div>';
}


/* ═══════════════════════════════════════════════════════════
   10. QUIZ 10 QUESTIONS — QCM dynamique avec étoiles
   ─────────────────────────────────────────────────────────
   Deux types de quiz coexistent :

   A) Quiz Niveau 1 (vocabulaire) — DYNAMIQUE
      Questions générées aléatoirement à partir des mots du thème.
      La variante régionale est prise en compte pour les réponses.
      Nombre de questions adapté à la taille du thème :
        < 10 mots  → 3 questions
        10–14 mots → 5 questions
        15–27 mots → 8 questions
        > 27 mots  → 10 questions

   B) Quiz Alphabet — Questions audio fixes (données dans data.js)

   C) Quiz Niveau 2 (dialogue) — Questions fixes embarquées dans les données
═══════════════════════════════════════════════════════════ */

/* Retourne le nombre de questions du quiz selon la taille du thème. */
function getQuizTotal(theme) {
  if (theme.level === 2) return (theme.quiz || []).length; // Niveau 2 : questions fixes
  const n = (theme.words || []).length;
  if (n < 10)  return 3;
  if (n < 15)  return 5;
  if (n <= 27) return 8;
  return 10;
}

/* _shuffle(arr) — Mélange un tableau selon l'algorithme Fisher-Yates.
   Retourne un nouveau tableau (n'altère pas l'original). */
function _shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j  = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

/* _generateLevel1Quiz(theme) — Génère dynamiquement les questions du quiz Niveau 1.
   Pour chaque question :
     - Sélectionne un mot de la liste (mélangée)
     - Applique la variante régionale au mot espagnol
     - Génère 3 distracteurs aléatoires + 1 bonne réponse (position aléatoire)
   Retourne un tableau de questions [{q, opts:[4], ans:index}] */
function _generateLevel1Quiz(theme) {
  // Filtre les mots incomplets (sans fr ou sans es)
  const words = (theme.words || []).filter(w => w.fr && w.es);
  if (words.length < 2) return [];

  const total = getQuizTotal(theme);
  const pool  = _shuffle(words).slice(0, total);

  return pool.map((card) => {
    // Résolution du mot espagnol (variante régionale ou castillan par défaut)
    const correctEs = (card.variants?.[currentRegion])
      ? card.variants[currentRegion] : card.es;
    const correctFr = card.fr;

    // Question et réponse correcte selon le mode
    let qText, correctAnswer;
    if (currentMode === 'learn_french') {
      qText         = '¿Cómo se dice "' + correctFr  + '" en español?';
      correctAnswer = correctEs;
    } else {
      qText         = 'Comment dit-on "' + correctEs + '" en français ?';
      correctAnswer = correctFr;
    }

    // Génération de 3 distracteurs depuis les autres mots du thème
    const distractors = _shuffle(words.filter(w => w !== card))
      .slice(0, 3)
      .map((d) => {
        return currentMode === 'learn_french'
          ? ((d.variants?.[currentRegion]) ? d.variants[currentRegion] : d.es)
          : d.fr;
      });

    // Insertion de la bonne réponse à un index aléatoire parmi les 4 options
    const opts   = distractors.slice(0, 3);
    const ansIdx = Math.floor(Math.random() * 4);
    opts.splice(ansIdx, 0, correctAnswer);

    return { q: qText, opts: opts, ans: ansIdx };
  });
}

/* getQuizQuestions(theme) — Retourne les questions selon le type de thème.
   Dispatche vers la source appropriée (fixe ou dynamique). */
function getQuizQuestions(theme) {
  if (theme.level === 2 || theme.type === 'dialog') return (theme.quiz    || []);
  if (theme.type === 'alpha')                        return (theme.quiz10  || []).slice(0, 12);
  return _generateLevel1Quiz(theme); // Niveau 1 standard : génération dynamique
}

/* renderQuiz10() — Affiche la question courante du quiz, ou l'écran de résultats. */
function renderQuiz10() {
  // Sélection de la source de questions
  let qs;
  if (CT?.type === 'alpha') {
    qs = getQuizQuestions(CT);
  } else if (CT?.level === 1) {
    qs = _currentDynQuiz.length ? _currentDynQuiz : _generateLevel1Quiz(CT);
  } else {
    qs = getQuizQuestions(CT);
  }
  const total = qs.length;

  // Cas : aucune question disponible
  if (!qs || !total) {
    const noQLabel = L(
      'No hay ningún cuestionario disponible.',
      'Aucun quiz disponible.'
    );
    document.getElementById('tabContent').innerHTML =
      '<div class="result-box"><p>' + noQLabel + '</p></div>';
    return;
  }

  /* ─── Écran de résultats (toutes les questions répondues) ─── */
  if (q10Step >= total) {
    _clearQuizSession();
    const pct         = Math.round(q10Score / total * 100);
    const earnedStars = _calcStars(pct);
    if (earnedStars > 0) markDone(CT.id, pct);

    const r         = _quizResultStrings(pct, 'q10');
    const isSuccess = earnedStars > 0;
    const endStars  = Array.from({ length: 3 }, (_, i) => {
      return i < earnedStars ? '⭐' : '☆';
    }).join('');

    document.getElementById('tabContent').innerHTML =
      '<div class="result-box">'
      + '<div style="font-size:2rem;margin-bottom:5px;">'
      + (earnedStars === 3 ? '⭐⭐⭐' : endStars) + '</div>'
      + '<h3>' + r.title + '</h3>'
      + (r.mascotLine ? '<div class="quiz-mascot-line">' + r.mascotLine + '</div>' : '')
      + '<div class="score-num">' + q10Score + '/' + total + '</div>'
      + '<div style="font-size:1rem;margin:6px 0;color:'
      + (isSuccess ? '#009A44' : '#EF2B2D') + '">' + r.sub + '</div>'
      + '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:14px">'
      + '<button class="retry-btn retry-btn--secondary" onclick="_retryQuiz10()">'
      + r.retry + '</button>'
      + (isSuccess
          ? '<button class="retry-btn" onclick="renderSections(_currentThemeLevel);_showScreenNoRender(_currentThemeLevel===2?\'sections-level2\':\'sections-level1\',\'back\')">'
            + r.finish + '</button>'
          : '')
      + '</div></div>';
    renderSections(_currentThemeLevel);
    return;
  }

  const q = qs[q10Step];

  /* ─── Quiz audio (alphabet) ─── */
  if (isAlphaQuiz()) {
    const audioLabel = L(
      'Escucha el sonido y elige la letra correcta',
      'Écoutez le son et choisissez la bonne lettre'
    );
    const listenHint = L('Haz clic para escuchar', 'Cliquez pour écouter');
    const qLabel     = L('Pregunta ', 'Question ') + (q10Step + 1) + '/' + total;

    const opts = q.opts.map((o, i) => {
      return '<button class="quiz-opt" id="q10o' + i
        + '" onclick="checkQ10(' + i + ',' + q.ans + ')" '
        + 'style="font-size:1.4rem;font-weight:900;letter-spacing:2px">' + o + '</button>';
    }).join('');

    document.getElementById('tabContent').innerHTML =
      '<div class="alpha-audio-quiz">'
      + '<div class="alpha-audio-label">' + audioLabel + '<br><small>' + qLabel + '</small></div>'
      + '<button class="alpha-audio-btn" id="playAudioBtn" onclick="playAlphaAudio(\'' + esc(q.audio) + '\')" title="' + listenHint + '">🔊</button>'
      + '<div style="font-size:.75rem;color:#aaa;margin-bottom:14px">' + listenHint + '</div>'
      + '<div class="quiz-options" style="grid-template-columns:1fr 1fr;gap:12px">' + opts + '</div>'
      + '<div class="quiz-feedback" id="q10fb"></div>'
      + '</div>';

    setTimeout(() => { playAlphaAudio(q.audio); }, 400); // Lecture automatique de la lettre
    q10Answered = false;
    return;
  }

  /* ─── Quiz standard (vocabulaire) ─── */
  const qStdLabel = L('Pregunta ', 'Question ') + (q10Step + 1) + '/' + total;

  const stdOpts = q.opts.map((o, i) => {
    return '<button class="quiz-opt" id="q10o' + i
      + '" onclick="checkQ10(' + i + ',' + q.ans + ')">' + o + '</button>';
  }).join('');

  document.getElementById('tabContent').innerHTML =
    '<div class="dialog-quiz-wrap">'
    + '<div class="quiz-q"><div class="q-text">' + qStdLabel + '<br><b>' + _escAttr(q.q) + '</b></div></div>'
    + '<div class="quiz-options" style="grid-template-columns:1fr">' + stdOpts + '</div>'
    + '<div class="quiz-feedback" id="q10fb"></div>'
    + '</div>';
  q10Answered = false;
}

/* playAlphaAudio(letter) — Prononce une lettre de l'alphabet + animation bouton. */
function playAlphaAudio(letter) {
  speak(letter);
  const btn = document.getElementById('playAudioBtn');
  if (btn) {
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
  }
}

/* _retryQuiz10() — Relance le quiz en régénérant les questions si Niveau 1. */
function _retryQuiz10() {
  q10Step = 0; q10Score = 0; q10Answered = false;
  _clearQuizSession();
  if (CT?.level === 1 && CT.type !== 'alpha') {
    _currentDynQuiz = _generateLevel1Quiz(CT);
  }
  renderQuiz10();
}

/* checkQ10(chosen, correct) — Valide la réponse choisie pour le quiz 10.
   Colore les boutons (vert = correct, rouge = erreur), prononce la réponse
   correcte, puis passe automatiquement à la question suivante après 1,6s. */
function checkQ10(chosen, correct) {
  if (q10Answered) return;
  q10Answered = true;

  // Sélection de la source de questions (identique à renderQuiz10)
  let qs;
  if (CT?.type === 'alpha')  { qs = getQuizQuestions(CT); }
  else if (CT?.level === 1) { qs = _currentDynQuiz; }
  else                           { qs = getQuizQuestions(CT); }

  // Coloration des boutons : vert pour la bonne réponse, rouge pour le mauvais choix
  document.querySelectorAll('[id^=q10o]').forEach((b, i) => {
    b.classList.add('disabled');
    if (i === correct) b.classList.add('correct');
    else if (i === chosen && chosen !== correct) b.classList.add('wrong');
  });

  if (chosen === correct) q10Score++;

  // Retour haptique discret (mobile uniquement, échoue silencieusement ailleurs)
  _vibrateFeedback(chosen === correct);

  const correctWord = qs[q10Step].opts[correct];
  const fb = document.getElementById('q10fb');
  const fbOk  = L('✅ ¡Correcto! ¡Enhorabuena!',           '✅ Correct ! Félicitations !');
  const fbErr = L('❌ Respuesta incorrecta. La solución era: ', '❌ Mauvaise réponse. La solution était : ');
  fb.textContent = (chosen === correct) ? fbOk : fbErr + correctWord;
  fb.style.color = (chosen === correct) ? '#009A44' : '#c0392b';

  // Prononciation de la réponse correcte
  if (isAlphaQuiz()) {
    if (chosen !== correct) setTimeout(() => { speak(qs[q10Step].audio); }, 300);
  } else if (CT.words) {
    // Recherche du mot dans le dictionnaire pour en extraire la forme régionale
    const match = CT.words.find((w) => {
      const regionalVar = (w.variants?.[currentRegion]) ? w.variants[currentRegion] : '';
      return w.es === correctWord || w.fr === correctWord || regionalVar === correctWord;
    });
    if (match) {
      const finalEsMatch = (match.variants?.[currentRegion])
        ? match.variants[currentRegion] : match.es;
      speak(L(match.fr, finalEsMatch));
    }
  }

  // Passage automatique à la question suivante après 1,6s
  setTimeout(() => { q10Step++; renderQuiz10(); }, 1600);

  // Mémorise la position courante (sessionStorage) pour permettre la reprise
  _saveQuizSession();
}


/* ═══════════════════════════════════════════════════════════
   11. DIALOGUE — Bulles de conversation situationnelles
   ─────────────────────────────────────────────────────────
   renderDialog() — Affiche les situations de dialogue avec :
     - Sélecteur de situation (Sit. 1, Sit. 2, Sit. 3)
     - Bulles de conversation avec animation d'apparition progressive
     - Bouton audio sur chaque bulle (prononce la ligne dans la langue cible)
     - Traduction affichée sous chaque bulle
     - Adaptation automatique des variantes régionales hispaniques

   _DIALOG_REGIONAL_SUBS — Table de substitution castillan → variante AL
     Utilisée par _adaptDialogueLine() pour les lignes sans variants explicite.
═══════════════════════════════════════════════════════════ */

/* Table de substitutions pour adapter les dialogues à la variante régionale active.
   Format : { 'mot_castillan': { CODE_PAYS: 'mot_regional', ... } }
   Utilisée uniquement quand la ligne n'a pas de propriété `variants` propre. */
const _DIALOG_REGIONAL_SUBS = {
  // Transports
  'autobús':    { MX:'camión',      AR:'colectivo',   CO:'bus',         VE:'autobús',  PE:'micro',   CL:'micro' },
  'billete':    { MX:'boleto',      AR:'boleto',      CO:'pasaje',      VE:'pasaje',   PE:'boleto',  CL:'boleto' },
  'coche':      { MX:'carro',       AR:'auto',        CO:'carro',       VE:'carro',    PE:'carro',   CL:'auto' },
  // Boissons
  'zumo':       { MX:'jugo',        AR:'jugo',        CO:'jugo',        VE:'jugo',     PE:'jugo',    EC:'jugo' },
  // Nourriture
  'patata':     { MX:'papa',        AR:'papa',        CO:'papa',        VE:'papa',     PE:'papa',    EC:'papa' },
  'patatas':    { MX:'papas',       AR:'papas',       CO:'papas',       VE:'papas',    PE:'papas',   EC:'papas' },
  // Technologie
  'móvil':      { MX:'celular',     AR:'celular',     CO:'celular',     VE:'celular',  PE:'celular', CL:'celular' },
  'ordenador':  { MX:'computadora', AR:'computadora', CO:'computador',  VE:'computador', PE:'computadora', CL:'computador' },
  // Personnel de service
  'camarero':   { MX:'mesero',      AR:'mozo',        CO:'mesero',      VE:'mesero',   PE:'mesero',  CL:'mesero' },
  'camarera':   { MX:'mesera',      AR:'moza',        CO:'mesera',      VE:'mesera',   PE:'mesera',  CL:'mesera' },
  // Expressions familières
  '¡Vale!':     { MX:'¡Sale!',      AR:'¡Dale!',      CO:'¡Listo!',     VE:'¡Listo!',  PE:'¡Dale!',  EC:'¡Dale!' },
  'Vale,':      { MX:'Sale,',       AR:'Dale,',       CO:'Listo,',      VE:'Listo,',   PE:'Dale,',   EC:'Dale,' },
  '¡Venga!':    { MX:'¡Órale!',     AR:'¡Dale!',      CO:'¡Dale!',      VE:'¡Dale!',   PE:'¡Dale!',  EC:'¡Dale!' },
  // Logement
  'piso':       { MX:'departamento', AR:'departamento', CO:'apartamento', VE:'apartamento', PE:'departamento' }
};

/* _adaptDialogueLine(esText) — Remplace les mots castillans par leurs équivalents régionaux.
   Respecte les frontières de mots (word-boundary) et les caractères spéciaux espagnols.
   Ne modifie rien si la région n'a pas de substitution définie pour ce mot. */
function _adaptDialogueLine(esText) {
  if (!esText) return esText;
  let result = esText;
  Object.keys(_DIALOG_REGIONAL_SUBS).forEach((castillanWord) => {
    const regionMap = _DIALOG_REGIONAL_SUBS[castillanWord];
    const regional  = regionMap[currentRegion];
    if (!regional) return; // Pas de variante → on conserve le castillan
    const escaped = castillanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Remplacement insensible à la casse avec simulation de word-boundary pour l'espagnol
    result = result.replace(
      new RegExp('(?<![\\wÁÉÍÓÚáéíóúÑñ])' + escaped + '(?![\\wÁÉÍÓÚáéíóúÑñ])', 'g'),
      regional
    );
  });
  return result;
}

/* renderDialog() — Construit et affiche les bulles de conversation pour la situation active. */
function renderDialog() {
  const sits    = CT.situations;
  const sit     = sits[sitIdx];

  // Boutons de sélection de situation (Sit. 1, Sit. 2, Sit. 3)
  const sitBtns = sits.map((s, i) => {
    return '<button class="sit-btn' + (i === sitIdx ? ' active' : '')
      + '" onclick="pickSit(' + i + ')">' + s.label + '</button>';
  }).join('');

  // Génération des bulles avec adaptation régionale et animation d'entrée
  const bubbles = sit.dialogue.map((ln, i) => {
    // Priorité 1 : variants explicite sur la ligne → Priorité 2 : substitution auto
    const finalEsLine = (ln.variants?.[currentRegion])
      ? ln.variants[currentRegion]
      : _adaptDialogueLine(ln.es);

    const mainMsg   = L(ln.fr, finalEsLine);
    const transMsg  = L(finalEsLine, ln.fr);
    const spokenKey = L(ln.fr, finalEsLine);
    const listenTip    = L('Escuchar', 'Écouter');
    // aria-label descriptif : nom du locuteur + action + texte prononcé
    // (pattern repris de l'app Oromo pour l'accessibilité lecteurs d'écran)
    const ariaListen   = _escAttr(listenTip + ' : ' + ln.s + ' — ' + spokenKey);

    // Les bulles commencent invisibles et s'affichent via un délai croissant (effet cascade)
    return '<div class="bubble ' + ln.side + '" style="opacity:0;transition:opacity .3s '
      + (i * 0.08) + 's" id="bl' + i + '">'
      + '<div class="speaker-name">' + ln.s + '</div>'
      + '<div class="msg-row">'
      + '<div class="msg">' + mainMsg + '</div>'
      + '<button class="speak-bubble-btn" onclick="speak(\'' + esc(spokenKey) + '\')" title="' + listenTip + '" aria-label="' + ariaListen + '">🔊</button>'
      + '</div>'
      + '<div class="bubble-translation">' + transMsg + '</div>'
      + '</div>';
  }).join('');

  const quizBtnLabel = L('Iniciar el minicuestionario ➜', 'Lancer le mini quiz ➜');

  document.getElementById('tabContent').innerHTML =
    '<div class="sit-nav">' + sitBtns + '</div>'
    + '<div class="dialogue-box">'
    + '<div class="scene-img-big">' + sit.img + '</div>'
    + '<div class="bubble-wrap">' + bubbles + '</div>'
    + '</div>'
    + '<div class="action-row">'
    + '<button class="btn-start-quiz" onclick="switchTab(\'dquiz\')">' + quizBtnLabel + '</button>'
    + '</div>';

  // Déclenche l'animation d'apparition des bulles après un délai minimal
  setTimeout(() => {
    document.querySelectorAll('[id^=bl]').forEach(b => { b.style.opacity = '1'; });
  }, 80);
}

/* pickSit(i) — Sélectionne la situation i et rafraîchit le dialogue. */
function pickSit(i) { sitIdx = i; renderDialog(); }


/* ═══════════════════════════════════════════════════════════
   12. VOCABULAIRE — Lexique cliquable (chips)
   ─────────────────────────────────────────────────────────
   renderVocab() — Affiche les mots-clés du thème sous forme
   de "chips" cliquables. Un clic prononce le mot dans la langue cible.

   Format des données vocab[] : 'mot_ES = mot_FR'
   La variante régionale est recherchée dans CT.words pour
   les mots espagnols qui en ont une.
═══════════════════════════════════════════════════════════ */

function renderVocab() {
  const chips = CT.vocab.map((v) => {
    const parts = v.split('=');
    const es    = parts[0].trim();
    const fr    = parts[1] ? parts[1].trim() : '';

    // Recherche de la variante régionale dans le dictionnaire du thème
    let finalEs = es;
    if (CT.words) {
      const match = CT.words.find((w) => {
        if (w.es === es) return true;
        // Gère les cas avec barres obliques (ex: "Morado / Violeta")
        const esParts = w.es.split('/').map(p => p.trim());
        return esParts.includes(es);
      });
      if (match?.variants?.[currentRegion]) {
        finalEs = match.variants[currentRegion];
      }
    }

    const mainWord  = L(fr,      finalEs);
    const subWord   = L(finalEs, fr);
    const spokenKey = L(fr,      finalEs);

    return '<span class="vocab-chip" style="display:inline-flex;flex-direction:column;align-items:center;text-align:center;" onclick="speak(\'' + esc(spokenKey) + '\')">'
      + '<span class="vocab-item-et" style="font-weight:bold;">' + mainWord + '</span>'
      + (subWord ? '<span class="vocab-translation-sub">' + subWord + '</span>' : '')
      + '</span>';
  }).join('');

  const vocabTitle   = L(
    '📚 Vocabulario básico — ¡Haz clic para escuchar el español!',
    '📚 Lexique essentiel — Cliquez pour écouter l\'Espagnol !'
  );
  const quizBtnLabel = L('Iniciar el minicuestionario ➜', 'Lancer le mini quiz ➜');

  document.getElementById('tabContent').innerHTML =
    '<div class="vocab-section">'
    + '<div class="vocab-title">' + vocabTitle + '</div>'
    + '<div class="vocab-grid">'  + chips      + '</div>'
    + '</div>'
    + '<div class="action-row">'
    + '<button class="btn-start-quiz" onclick="switchTab(\'dquiz\')">' + quizBtnLabel + '</button>'
    + '</div>';
}


/* ═══════════════════════════════════════════════════════════
   13. QUIZ DIALOGUE — Mini-quiz de fin de dialogue
   ─────────────────────────────────────────────────────────
   Questions à choix multiples (4 options) issues des données
   fixes du thème (CT.quiz[]).
   Mêmes règles d'étoiles que le quiz 10 questions.
═══════════════════════════════════════════════════════════ */

function renderDialogQuiz() {
  const qs    = CT.quiz;
  const total = qs.length;

  /* ─── Écran de résultats ─── */
  if (dqStep >= total) {
    _clearQuizSession();
    const pct         = Math.round(dqScore / total * 100);
    const earnedStars = _calcStars(pct);
    if (earnedStars > 0) markDone(CT.id, pct);

    const r         = _quizResultStrings(pct, 'dq');
    const isSuccess = earnedStars > 0;
    const endStars  = Array.from({ length: 3 }, (_, i) => {
      return i < earnedStars ? '⭐' : '☆';
    }).join('');

    document.getElementById('tabContent').innerHTML =
      '<div class="result-box">'
      + '<div style="font-size:2rem;margin-bottom:5px;">'
      + (earnedStars === 3 ? '🎉🎉🎉' : endStars) + '</div>'
      + '<h3>' + r.title + '</h3>'
      + (r.mascotLine ? '<div class="quiz-mascot-line">' + r.mascotLine + '</div>' : '')
      + '<div class="score-num">' + dqScore + '/' + total + '</div>'
      + '<div style="font-size:.9rem;margin-top:6px;color:'
      + (isSuccess ? '#009A44' : '#EF2B2D') + '">' + r.sub + '</div>'
      + '<div style="display:flex;gap:8px;justify-content:center;margin-top:14px;flex-wrap:wrap">'
      + '<button class="retry-btn retry-btn--secondary" onclick="dqStep=0;dqScore=0;dqAnswered=false;_clearQuizSession();renderDialogQuiz()">'
      + r.retry + '</button>'
      + (isSuccess
          ? '<button class="retry-btn" onclick="renderSections(_currentThemeLevel);_showScreenNoRender(_currentThemeLevel===2?\'sections-level2\':\'sections-level1\',\'back\')">'
            + r.finish + '</button>'
          : '')
      + '</div></div>';
    renderSections(_currentThemeLevel);
    return;
  }

  /* ─── Question courante ─── */
  const q      = qs[dqStep];
  const qLabel = L('Pregunta ', 'Question ') + (dqStep + 1) + '/' + total;

  const opts = q.opts.map((o, i) => {
    return '<button class="quiz-opt" id="dqo' + i
      + '" onclick="checkDQ(' + i + ',' + q.ans + ')">' + o + '</button>';
  }).join('');

  document.getElementById('tabContent').innerHTML =
    '<div class="dialog-quiz-wrap">'
    + '<div class="quiz-q"><div class="q-text">' + qLabel + '<br><b>' + _escAttr(q.q) + '</b></div></div>'
    + '<div class="quiz-options" style="grid-template-columns:1fr">' + opts + '</div>'
    + '<div class="quiz-feedback" id="dqfb"></div>'
    + '</div>';
  dqAnswered = false;
}

/* checkDQ(chosen, correct) — Valide une réponse du mini-quiz dialogue.
   Feedback immédiat + passage automatique à la question suivante après 1,5s. */
function checkDQ(chosen, correct) {
  if (dqAnswered) return;
  dqAnswered = true;

  document.querySelectorAll('[id^=dqo]').forEach((b, i) => {
    b.classList.add('disabled');
    if (i === correct) b.classList.add('correct');
    else if (i === chosen && chosen !== correct) b.classList.add('wrong');
  });

  if (chosen === correct) dqScore++;

  // Retour haptique discret (mobile uniquement, échoue silencieusement ailleurs)
  _vibrateFeedback(chosen === correct);

  const fb   = document.getElementById('dqfb');
  const fbOk = L('✅ ¡Buena respuesta!',    '✅ Bonne réponse !');
  const fbErr= L('❌ ¡Inténtalo de nuevo!', '❌ Réessayer !');
  fb.textContent = (chosen === correct) ? fbOk : fbErr;
  fb.style.color = (chosen === correct) ? '#009A44' : '#c0392b';

  setTimeout(() => { dqStep++; renderDialogQuiz(); }, 1500);

  // Mémorise la position courante (sessionStorage) pour permettre la reprise
  _saveQuizSession();
}


/* ═══════════════════════════════════════════════════════════
   14. UTILITAIRES — Chaînes de résultat & échappement HTML
   ─────────────────────────────────────────────────────────
   _quizResultStrings(pct, type) — Génère les textes de l'écran
     de résultat (titre, sous-titre, boutons) dans la bonne langue.

   _mascotSansFauteLine(starsEarned) — Clin d'œil mascotte VACHÉBO sur un
     sans-faute (3 étoiles), partagé par les quiz et l'onglet Répète.
     Ajouté le 20/07/2026.

   esc(s) — Échappe les guillemets simples et doubles pour
     insertion sécurisée dans les attributs HTML onclick.
═══════════════════════════════════════════════════════════ */

/* Retourne un objet {title, sub, retry, finish} localisé selon le mode et le score. */
function _quizResultStrings(pct) {
  const stars     = _calcStars(pct);
  const isSuccess = stars > 0;

  let title = L('¡Prueba terminada!', 'Quiz terminé !');
  if      (stars === 3) title = L('¡Perfecto! ⭐⭐⭐',  'Parfait ! ⭐⭐⭐');
  else if (stars === 2) title = L('¡Muy bien! ⭐⭐',    'Très bien ! ⭐⭐');
  else if (stars === 1) title = L('¡Bien! ⭐',           'Bien ! ⭐');

  /* Clin d'œil mascotte VACHÉBO sur un sans-faute (3 étoiles) — logique
     factorisée dans _mascotSansFauteLine() (voir plus bas dans cette
     section §14), partagée avec _rpShowEnd() (onglet Répète, §9c) depuis
     le 20/07/2026. */
  const mascotLine = _mascotSansFauteLine(stars);

  return {
    title      : title,
    mascotLine : mascotLine,
    sub   : isSuccess
      ? L('¡Módulo superado! Puedes pasar al siguiente o volver a intentarlo para conseguir más estrellas.',
          'Module validé ! Vous pouvez passer au suivant ou réessayer pour plus d\'étoiles.')
      : L('Necesitas al menos un 50 % de respuestas correctas (1⭐) para que cuente. ¡Inténtalo de nuevo!',
          'Il vous faut au moins 50% de bonnes réponses (1⭐) pour valider. Réessayez !'),
    retry : L('🔄 Inténtalo de nuevo', '🔄 Réessayer'),
    finish: L('✓ Finalizar',           '✓ Terminer')
  };
}

/* _mascotSansFauteLine(starsEarned) — Retourne le clin d'œil mascotte VACHÉBO
   à afficher sur un sans-faute (3 étoiles), ou une chaîne vide sinon : la
   vache du logo sort son exclamation via REGION_MASCOTS — régionale en mode
   Espagnol (cohérente avec les chips du Lanceur/Home), France (🗼) en mode
   Français depuis le 20/07/2026 (demande utilisateur — auparavant un jeu de
   mots sans symbole ; une seule entrée FR suffit, pas de région à
   distinguer côté FR). Clé résolue par _mascotKeyForMode() (voir
   REGION_MASCOTS). Utilisée avec la classe CSS partagée .quiz-mascot-line.
   Factorisée le 20/07/2026 (demande utilisateur) à partir de la logique
   auparavant écrite en dur dans _quizResultStrings() (19/07/2026) —
   désormais partagée par les quiz (§10 Quiz 10 questions, §13 Quiz
   Dialogue, tous deux via _quizResultStrings() ci-dessus) et l'onglet
   Répète (§9c, via _rpShowEnd()), au lieu d'être dupliquée. */
function _mascotSansFauteLine(starsEarned) {
  if (starsEarned !== 3) return '';
  const m = REGION_MASCOTS[_mascotKeyForMode()];
  return '🐄' + m.symbol + ' ' + m.phrase;
}

/* esc(s) — Échappe les caractères spéciaux pour injection dans les onclick="" HTML.
   Gère les antislashs, guillemets simples et doubles. */
function esc(s) {
  return (s || '')
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/* _escAttr(s) — Échappe une chaîne pour injection dans un attribut HTML (aria-label, title…).
   Remplace les guillemets doubles et les caractères HTML sensibles.
   Différent de esc() qui cible les contextes onclick="…" JS. */
function _escAttr(s) {
  return (s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}


/* ═══════════════════════════════════════════════════════════
   15. VARIANTES RÉGIONALES — Sélecteur de pays hispanophones
   ─────────────────────────────────────────────────────────
   Permet à l'utilisateur de choisir sa variante d'espagnol :
   Castillan (ES), Mexique, Colombie, Pérou, Venezuela,
   Argentine, Équateur.

   Fonctions :
     renderRegionOptions() — Construit le sélecteur déroulant HTML
     pickRegion(regionId)  — Applique immédiatement la variante choisie
     changeRegion(region)  — Alias léger (pour rétro-compatibilité)

   Effets de pickRegion() :
     - Sauvegarde le choix dans localStorage
     - Applique la classe CSS region-XX sur <html>
     - Réinitialise la voix espagnole (force une nouvelle détection)
     - Met à jour les drapeaux dans l'interface
     - Rafraîchit le contenu de l'onglet actif si une leçon est ouverte
═══════════════════════════════════════════════════════════ */

/* REGION_MASCOTS — Symbole culturel + exclamation locale associés à chaque
   variante régionale, dans l'esprit du logo VACHÉBO (vache + élément visuel
   du pays). Le logo lui-même n'est pas modifié : ces symboles ne servent
   qu'aux éléments d'interface ci-dessous (chips, grille du Lanceur, bandeau
   du Guide) et s'ajoutent au drapeau selon l'emplacement.
   Les couleurs de région (variables CSS --c-primary/--c-accent par
   html.theme-spain.region-XX) restent, elles, entièrement inchangées.
   Ajouté le 19/07/2026 (demande utilisateur).
   Entrée FR ajoutée le 20/07/2026 (demande utilisateur) : le logo a un
   élément visuel par pays, Tour Eiffel incluse pour la France, mais ce clin
   d'œil manquait côté mode Français dans les 3 emplacements qui affichent
   la ligne mascotte (pied de page, pastille « tout terminé » de l'écran
   Sections, ligne sans-faute des quiz/Répète) — ceux-ci retombaient sur un
   simple jeu de mots sans symbole. Clé 'FR' utilisée uniquement pour ces 3
   emplacements (jamais comme valeur de currentRegion, qui reste toujours
   une variante hispanique même en mode Français — cf. renderRegionGrid). */
const REGION_MASCOTS = {
  FR: { symbol: '🗼', phrase: 'Oh la vache, qué chévère !' },
  ES: { symbol: '🐂', phrase: '¡Mola!'          },
  MX: { symbol: '🌵', phrase: '¡Chido!'         },
  CO: { symbol: '☕', phrase: '¡Qué chévere!'   },
  PE: { symbol: '🦙', phrase: '¡Qué bacán!'     },
  AR: { symbol: '🧉', phrase: '¡Qué copado!'    },
  VE: { symbol: '🌺', phrase: '¡Chévere, pana!' },
  EC: { symbol: '🦅', phrase: '¡Chévere nomás!' }
};

/* _mascotKeyForMode() — Retourne la clé REGION_MASCOTS à utiliser pour la
   ligne mascotte du mode courant : 'FR' en mode Français (une seule entrée,
   pas de variante à distinguer côté FR), ou la variante hispanique active
   (currentRegion) en mode Espagnol. Factorisée le 20/07/2026 (demande
   utilisateur) pour éviter de dupliquer ce choix dans les 3 emplacements
   qui affichent la ligne mascotte (voir ci-dessus). */
function _mascotKeyForMode() {
  return (currentMode === 'learn_french') ? 'FR' : currentRegion;
}

/* _refreshFooterMascot() — Signe les deux pieds de page (#footerMascotLauncher,
   #footerMascotLesson) d'un clin d'œil à la mascotte du logo VACHÉBO :
   symbole + exclamation via REGION_MASCOTS, régionale en mode Espagnol,
   France (🗼) en mode Français depuis le 20/07/2026 (demande utilisateur —
   auparavant un jeu de mots générique sans symbole, seul mode à ne pas
   reprendre l'élément visuel pays du logo). Clé résolue par
   _mascotKeyForMode() (voir REGION_MASCOTS ci-dessus).
   Appelée par pickRegion() à chaque changement de variante, et une première
   fois au chargement (voir DOMContentLoaded / initApp).
   Ajouté le 19/07/2026 (suite, demande utilisateur). */
function _refreshFooterMascot() {
  const m = REGION_MASCOTS[_mascotKeyForMode()];
  const line = '🐄' + m.symbol + ' <em>' + m.phrase + '</em>';
  ['footerMascotLauncher', 'footerMascotLesson'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = line;
  });
}

/* changeRegion(region) — Alias de pickRegion() conservé pour rétro-compatibilité.
   Tout appel à changeRegion() délègue désormais entièrement à pickRegion()
   qui gère la voix, les couleurs, les drapeaux et le rafraîchissement de contenu. */
function changeRegion(region) {
  pickRegion(region);
}

/* renderRegionOptions() — Génère le sélecteur déroulant de variante hispanique.
   Affiche également un bandeau d'information sur la variante active. */
function renderRegionOptions() {
  const selectContainer = document.getElementById('region-select-container');
  const msgBox          = document.getElementById('region-message-box');
  if (!selectContainer) return;

  // Liste des régions disponibles avec labels localisés selon le mode
  const regions = [
    { id:'ES', name: L('España (Castellano)', 'Espagne (Castillan)'), flag:'🇪🇸' },
    { id:'AR', name: L('Argentina',           'Argentine'),           flag:'🇦🇷' },
    { id:'CO', name: L('Colombia',            'Colombie'),            flag:'🇨🇴' },
    { id:'EC', name: L('Ecuador',             'Équateur'),            flag:'🇪🇨' },
    { id:'MX', name: L('México',              'Mexique'),             flag:'🇲🇽' },
    { id:'PE', name: L('Perú',                'Pérou'),               flag:'🇵🇪' },
    { id:'VE', name: L('Venezuela',           'Venezuela'),           flag:'🇻🇪' }
  ];

  // Construction du <select>
  let html = '<div style="padding:10px 10px 5px 10px;">'
    + '<select id="regionSelector" onchange="pickRegion(this.value)" '
    + 'style="width:100%;padding:12px;border-radius:12px;border:1px solid #ddd;'
    + 'font-size:1rem;background:#fff;cursor:pointer;outline:none;">';
  regions.forEach((r) => {
    const selected = (currentRegion === r.id) ? ' selected' : '';
    html += '<option value="' + r.id + '"' + selected + '>' + r.flag + ' ' + r.name + '</option>';
  });
  html += '</select></div>';
  selectContainer.innerHTML = html;

  // Bandeau d'info sur la variante active
  const activeRegion = regions.find(r => r.id === currentRegion) || regions[0];
  if (msgBox) {
    const bannerMsg = L(
      'ℹ️ Tu aplicación está configurada actualmente con la variante de <strong>' + activeRegion.name + '</strong>.',
      'ℹ️ Votre application est actuellement configurée sur la variante <strong>' + activeRegion.name + '</strong>.'
    );
    msgBox.innerHTML = '<div style="margin:5px 10px 15px 10px;padding:12px;background-color:#eef9ff;'
      + 'border-left:4px solid #007bff;border-radius:8px;font-size:0.9rem;color:#333;text-align:left;">'
      + bannerMsg + '</div>';
  }
}

/* renderRegionGrid(mode) — Génère la grille visuelle de 7 drapeaux pour le sélecteur
   de variante hispanique dans le Launcher Vue B (Écran 4).
   Affichée pour les DEUX modes :
     • learn_spain  → choisir la variante d'espagnol à apprendre
     • learn_french → choisir sa variante d'espagnol maternelle (origine)
                      pour que l'interface s'adapte à l'apprenant hispanophone. */
function renderRegionGrid(mode) {
  const container = document.getElementById('region-grid-container');
  const msgBox    = document.getElementById('region-message-box');
  if (!container) return;

  /* Utilise le mode courant si aucun n'est passé en paramètre */
  const activeMode = mode || currentMode;

  const regions = [
    { id:'AR', flag:'🇦🇷', nameEs:'Argentina', nameFr:'Argentine' },
    { id:'CO', flag:'🇨🇴', nameEs:'Colombia',  nameFr:'Colombie'  },
    { id:'EC', flag:'🇪🇨', nameEs:'Ecuador',   nameFr:'Équateur'  },
    { id:'ES', flag:'🇪🇸', nameEs:'España',    nameFr:'Espagne'   },
    { id:'MX', flag:'🇲🇽', nameEs:'México',    nameFr:'Mexique'   },
    { id:'PE', flag:'🇵🇪', nameEs:'Perú',      nameFr:'Pérou'     },
    { id:'VE', flag:'🇻🇪', nameEs:'Venezuela', nameFr:'Venezuela' }
  ];

  /* Label du bloc selon le parcours */
  const gridLabel = (activeMode === 'learn_french')
    ? 'TU VARIANTE DE ESPAÑOL'   /* hispanophone : sa langue maternelle */
    : 'VARIANTE RÉGIONALE';      /* francophone  : la variante à apprendre */

  let html = '<div class="launcher-region-grid-wrap">'
    + '<p class="launcher-region-grid-label">' + gridLabel + '</p>'
    + '<div class="launcher-region-grid" role="group" aria-label="' + gridLabel + '">';

  regions.forEach((r) => {
    const isActive  = (currentRegion === r.id);
    /* Nom du pays dans la langue d'interface :
       learn_french → interface en espagnol → nom en espagnol
       learn_spain  → interface en français → nom en français */
    const countryName = (activeMode === 'learn_french') ? r.nameEs : r.nameFr;
    html += '<button'
      + ' class="launcher-region-btn' + (isActive ? ' launcher-region-btn--active' : '') + '"'
      + ' onclick="pickRegion(\'' + r.id + '\');renderRegionGrid(currentMode);"'
      + ' aria-pressed="' + isActive + '"'
      + ' title="' + countryName + ' ' + REGION_MASCOTS[r.id].phrase + '">'
      + '<span class="launcher-region-flag">' + r.flag + '</span>'
      + '<span class="launcher-region-mascot" aria-hidden="true">🐄' + REGION_MASCOTS[r.id].symbol + '</span>'
      + '<span class="launcher-region-name">' + countryName + '</span>'
      + '</button>';
  });

  html += '</div></div>';
  container.innerHTML = html;

  /* Le bandeau d'info (#region-message-box) n'est plus initialisé ici
     depuis le 20/07/2026 (demande utilisateur, gain de place) : il ne
     contenait qu'un texte générique avec un exemple ("Ex. : si tu es
     argentino…"), immédiatement écrasé par pickRegion() lors de l'appel
     initial (showLauncherVariant() enchaîne toujours renderRegionGrid()
     puis pickRegion()) — mais PAS lors d'un nouveau clic sur un drapeau
     (onclick="pickRegion(...);renderRegionGrid(...)"), où l'ordre inverse
     laissait réapparaître l'exemple générique à la place du message
     concret. pickRegion() est désormais la seule source de ce bandeau,
     dans les deux cas. */
  void msgBox; /* variable conservée pour lisibilité, plus utilisée ici */
}

/* pickRegion(regionId) — Applique complètement une nouvelle variante régionale.
   Persiste le choix, met à jour la voix BCP-47, les couleurs CSS, les drapeaux
   et rafraîchit le contenu de l'onglet actif si une leçon est ouverte. */
function pickRegion(regionId) {
  // Validation : seules les 7 régions connues sont acceptées (sécurité injection CSS/localStorage)
  const ALLOWED_REGIONS = ['ES', 'MX', 'CO', 'PE', 'VE', 'AR', 'EC'];
  if (!ALLOWED_REGIONS.includes(regionId)) {
    console.warn('pickRegion: regionId invalide ignoré :', regionId);
    return;
  }
  // Mémorisation du choix dans localStorage (persiste entre les sessions)
  localStorage.setItem('user_preferred_region', regionId);
  currentRegion = regionId;

  // Mise à jour du code BCP-47 pour la synthèse vocale (mode Espagnol ou pré-sélection Launcher)
  // On applique aussi depuis le Launcher (currentMode non encore défini) pour que la voix
  // soit correcte dès le lancement et que la classe CSS de région soit bien positionnée.
  const isSpainMode = (currentMode === 'learn_spain') || (currentMode === '');
  if (currentMode !== 'learn_french') {
    const voiceMap = {
      ES:'es-ES', MX:'es-MX', CO:'es-CO', PE:'es-PE', VE:'es-VE', AR:'es-AR', EC:'es-EC'
    };
    voiceLang = voiceMap[regionId] || 'es-ES';

    // Application de la classe CSS de région sur <html>
    document.documentElement.classList.remove(
      'region-ES','region-MX','region-CO','region-PE','region-VE','region-AR','region-EC'
    );
    document.documentElement.classList.add('region-' + regionId);
  }

  // Force la résolution d'une nouvelle voix espagnole adaptée à la région
  _spanishVoice        = undefined;
  _hasNotifiedVoice    = false;
  _spanishVoiceQuality = null;
  _spanishVoiceLabel   = '';

  // Mettre le badge en état "chargement" immédiatement
  _updateVoiceBadge();

  // Déclencher la résolution en tâche de fond pour mettre à jour le badge
  _resolveSpanishVoice(() => { _updateVoiceBadge(); });

  // Mise à jour du bandeau d'information avec la note audio
  const msgBox = document.getElementById('region-message-box');
  if (msgBox) {
    const regionsNames = {
      ES: L('España (Castellano)', 'Espagne (Castillan)'),
      MX: L('México',              'Mexique'),
      CO: L('Colombia',            'Colombie'),
      PE: L('Perú',                'Pérou'),
      VE: L('Venezuela',           'Venezuela'),
      AR: L('Argentina',           'Argentine'),
      EC: L('Ecuador',             'Équateur')
    };
    const activeName = regionsNames[currentRegion] || currentRegion;
    const noteAudio  = L(
      '<div style="margin-top:5px;font-size:0.75rem;color:#666;font-style:italic;">'
        + 'Nota: El acento real depende de las voces instaladas en la configuración de síntesis de voz de tu dispositivo.'
        + '</div>',
      '<div style="margin-top:5px;font-size:0.75rem;color:#666;font-style:italic;">'
        + 'Note : L\'accent audio dépend des voix espagnoles installées dans les paramètres de synthèse vocale de votre smartphone.'
        + '</div>'
    );
    const mainMsg = L(
      'ℹ️ Tu aplicación está configurada actualmente con la variante de <strong>' + activeName + '</strong>.',
      'ℹ️ Votre application est actuellement configurée sur la variante <strong>' + activeName + '</strong>.'
    );

    msgBox.innerHTML = '<div style="margin:5px 10px 15px 10px;padding:12px;background-color:#eef9ff;'
      + 'border-left:4px solid #007bff;border-radius:8px;font-size:0.9rem;color:#333;text-align:left;">'
      + mainMsg + noteAudio + '</div>';
  }

  /* — Construction de l'image drapeau via Twemoji CDN — */
  // Utilise des images SVG au lieu d'émojis natifs pour un rendu cohérent sur Windows
  const flagCodes = { ES:'es', MX:'mx', CO:'co', PE:'pe', VE:'ve', AR:'ar', EC:'ec' };
  const code      = flagCodes[currentRegion] || 'es';
  // Table de correspondance code pays → codepoint Unicode Twemoji
  const twemojiMap = {
    es:'1f1ea-1f1f8', mx:'1f1f2-1f1fd', co:'1f1e8-1f1f4',
    pe:'1f1f5-1f1ea', ve:'1f1fb-1f1ea', ar:'1f1e6-1f1f7', ec:'1f1ea-1f1e8'
  };
  const flagHtml = '<img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/'
    + twemojiMap[code] + '.svg" style="width:1.5em;vertical-align:middle;display:inline-block;" alt="flag">';

  // Mise à jour du grand drapeau sur l'écran d'accueil (home)
  const homeFlagRow = document.getElementById('homeFlagRow');
  if (homeFlagRow) {
    if (currentMode === 'learn_spain') {
      homeFlagRow.innerHTML = flagHtml;
    } else {
      // Mode Français : drapeau FR toujours fixe
      homeFlagRow.innerHTML = '<img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1eb-1f1f7.svg" style="width:1.5em;vertical-align:middle;" alt="fr">';
    }
  }

  // Mise à jour du drapeau dans la Vue B du Launcher (si visible) — tous modes
  const launcherFlagRow = document.getElementById('launcherFlagRow');
  const flagEmojis = { ES:'🇪🇸', MX:'🇲🇽', CO:'🇨🇴', PE:'🇵🇪', VE:'🇻🇪', AR:'🇦🇷', EC:'🇪🇨' };
  if (launcherFlagRow && currentMode !== 'learn_french') {
    launcherFlagRow.textContent = flagEmojis[currentRegion] || '🇪🇸';
  }

  // Mise à jour du drapeau de l'écran Sections (variante régionale apprise)
  const sectionsFlag = document.getElementById('sectionsFlag');
  if (sectionsFlag && currentMode !== 'learn_french') {
    sectionsFlag.innerHTML = flagHtml;
  }

  // Mise à jour de l'inscription audio dans les flashcards (section-label)
  // Utilise le même format texte complet que renderFlash() pour la cohérence
  const flagSpan = document.getElementById('current-lang-flag');
  if (flagSpan) {
    if (currentMode === 'learn_french') {
      const regionLabelsFR2 = { ES:'🇪🇸 España (Castellano)', MX:'🇲🇽 México', CO:'🇨🇴 Colombia', AR:'🇦🇷 Argentina', PE:'🇵🇪 Perú', VE:'🇻🇪 Venezuela', EC:'🇪🇨 Ecuador' };
      flagSpan.textContent = regionLabelsFR2[currentRegion] || '🇪🇸 España (Castellano)';
    } else {
      const regionLabelsES2 = { ES:'🇪🇸 Espagne (Castillan)', MX:'🇲🇽 Mexique', CO:'🇨🇴 Colombie', AR:'🇦🇷 Argentine', PE:'🇵🇪 Pérou', VE:'🇻🇪 Venezuela', EC:'🇪🇨 Équateur' };
      flagSpan.textContent = regionLabelsES2[currentRegion] || '🇪🇸 Espagne (Castillan)';
    }
  }

  // Rafraîchissement de l'onglet actif si une leçon est ouverte
  // Note : activeTab n'est pas une variable globale, on teste directement l'onglet actif
  const activeTabEl = document.querySelector('#lessonTabs .tab.active');
  if (activeTabEl) {
    const at = activeTabEl.dataset.tab;
    if (at === 'vocab')  renderVocab();
    if (at === 'dialog') renderDialog();
    if (at === 'flash')  renderFlash();
  }

  // Rafraîchissement du widget région dans l'écran Home si celui-ci est actif
  const homeScreen = document.getElementById('home');
  if (homeScreen?.classList.contains('active')) {
    _renderHomeRegionWidget();
  }

  // Rafraîchissement du guide utilisateur si la modale est actuellement ouverte
  // sur son bloc espagnol (cas : changement de variante depuis l'écran home
  // pendant que le guide reste accessible en arrière-plan via une autre action).
  const guideModal = document.getElementById('guide-modal');
  if (guideModal?.classList.contains('active')) {
    const guideES = document.getElementById('guideContentES');
    if (guideES?.style.display !== 'none') _refreshGuideRegion();
  }

  /* Mise à jour du drapeau dans la barre de nav basse */
  const langFlag = document.getElementById('navLangFlag');
  if (langFlag && currentMode !== 'learn_french') {
    langFlag.textContent = flagEmojis[currentRegion] || '🇪🇸';
  }

  /* Signature mascotte des pieds de page (voir _refreshFooterMascot ci-dessus) */
  _refreshFooterMascot();
}


/* toggleAcc(btn) — Ouvre ou ferme un panneau accordéon du guide.
   Paramètre : le bouton .guide-acc-header cliqué.
   Bascule aria-expanded et la classe .open sur le body frère.

   Le dépliage utilise une max-height CALCULÉE dynamiquement à partir de
   body.scrollHeight (hauteur réelle du contenu), plutôt qu'une valeur CSS
   fixe (ex: 2000px). Avec une valeur fixe, les sections longues (ex :
   « Configurer l'audio », qui contient 3 grandes cartes détaillées) peuvent
   dépasser cette limite et donc être tronquées visuellement. En mesurant
   la hauteur réelle à l'ouverture, le panneau se déplie toujours en entier,
   quel que soit son contenu. */
function toggleAcc(btn) {
  const isOpen = btn.getAttribute('aria-expanded') === 'true';
  const body   = btn.nextElementSibling;

  btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  if (!body) return;

  if (isOpen) {
    body.style.maxHeight = body.scrollHeight + 'px';
    body.offsetHeight;
    requestAnimationFrame(() => {
      body.classList.remove('open');
      body.style.maxHeight = '0px';
    });
  } else {
    body.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
  }
}

/* toggleLevelAcc(btn) — Ouvre ou ferme un niveau (Niveau 1 / Niveau 2)
   dans l'écran Sections. Même principe que toggleAcc() du guide. */
function toggleLevelAcc(btn) {
  const isOpen = btn.getAttribute('aria-expanded') === 'true';
  const body   = btn.nextElementSibling;

  btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  if (!body) return;

  if (isOpen) {
    body.style.maxHeight = body.scrollHeight + 'px';
    body.offsetHeight;
    requestAnimationFrame(() => {
      body.classList.remove('open');
      body.style.maxHeight = '0px';
    });
  } else {
    body.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
  }
}

/* _resizeOpenAccordions() — Recalcule la max-height de tous les panneaux
   actuellement ouverts. Utile après un redimensionnement de fenêtre
   (rotation d'écran mobile) ou un changement de contenu dynamique
   (ex : _refreshGuideRegion() qui modifie le texte affiché). */
function _resizeOpenAccordions() {
  const openBodies = document.querySelectorAll('.guide-acc-body.open');
  openBodies.forEach((body) => {
    body.style.maxHeight = body.scrollHeight + 'px';
  });
}
window.addEventListener('resize', _resizeOpenAccordions);

/* _isBrandNewUser() — Ajouté le 11/07/2026 (demande utilisateur) : détecte
   le tout premier lancement de l'app, c'est-à-dire un utilisateur n'ayant
   encore fait AUCUN parcours dans AUCUN des deux modes (pas de progression
   sauvegardée, pas de guide déjà consulté). Sert uniquement à décider si la
   barre de navigation basse doit apparaître dès le chargement (voir plus
   bas) — elle n'a pas grand sens tant que rien n'a commencé (Guide non
   visité, Modules verrouillés).
   Les clés testées sont volontairement écrites en dur plutôt que déduites
   de STORAGE_KEY/_guideSeenKey() : ces deux helpers dépendent de currentMode,
   qui vaut '' sur l'écran 0 — il faut ici vérifier les DEUX modes à la fois,
   quel que soit celui éventuellement déjà choisi.
     • 'pe_es_fr_done_v1' / 'pe_fr_es_done_v1' → progression (cf. §4, L.609/630)
     • 'vachebo_guide_vu_fr' / 'vachebo_guide_vu_es' → guide vu par mode (§17)
     • 'vachebo_guide_vu' → ancien flag global pré-05/07/2026 (migration)
   Enveloppé en try/catch comme le reste des accès localStorage de l'app
   (navigation privée stricte, stockage désactivé) : en cas d'erreur, on
   considère prudemment que ce n'est PAS un nouvel utilisateur, pour ne pas
   risquer de cacher la barre à quelqu'un qui l'utilisait déjà. */
function _isBrandNewUser() {
  try {
    if (localStorage.getItem('pe_es_fr_done_v1')) return false;
    if (localStorage.getItem('pe_fr_es_done_v1')) return false;
    if (localStorage.getItem('vachebo_guide_vu_fr') === 'true') return false;
    if (localStorage.getItem('vachebo_guide_vu_es') === 'true') return false;
    if (localStorage.getItem('vachebo_guide_vu') === 'true') return false;
    return true;
  } catch (e) {
    return false;
  }
}

/* §15d — CARTES DE LANGUE FUSIONNÉES AVEC L'EXPLICATIF (écran 0, Vue A)
   Ajouté le 18/07/2026 (retour utilisateur), fusionné le même jour (second
   retour utilisateur) : chaque carte de langue (voir index.html,
   .lang-card--fr / .lang-card--es) contient désormais sa propre liste à
   puces dépliable, plutôt qu'un encadré séparé à 2 colonnes sous les
   cartes. Chaque carte a son propre bouton "i" et son propre état
   déplié/replié, indépendant de l'autre carte.

   Règle d'ouverture par défaut — revue le 18/07/2026 (3e retour
   utilisateur, après test réel) :
     1. La préférence EXPLICITE de l'apprenant (il a déjà touché le bouton
        "i" au moins une fois pour CETTE carte, cf. toggleLangBox() plus
        bas) prime toujours sur tout le reste, y compris s'il avait replié
        la carte dès le tout premier lancement, ou rouvert une carte après
        être allé aux modules.
     2. À défaut de préférence explicite : DÉPLIÉE tant que l'apprenant n'est
        jamais allé sur l'écran Modules (_hasVisitedModules() ci-dessous,
        posé depuis renderSections() §7) — comportement observé "très bien"
        par l'utilisateur lors du test du 18/07. REPLIÉE dès qu'il y est
        allé au moins une fois, pour ne plus s'imposer une fois que
        l'apprenant sait déjà à quoi sert l'appli.
   Remplace l'ancienne logique qui se basait sur _isBrandNewUser() (repère
   plus grossier, pensé pour la barre de nav basse — cf. §15c — et qui ne
   se déclenchait qu'après un module TERMINÉ ou le Guide consulté, pas
   simplement après une visite des Modules ; il ignorait aussi toute
   préférence explicite de l'apprenant tant que ces conditions n'étaient
   pas remplies). */

/* Flag "l'apprenant est déjà allé au moins une fois sur l'écran Modules"
   (peu importe le mode FR/ES : l'écran 0, lui, est commun aux deux) — posé
   par _markModulesVisited(), appelée depuis renderSections() (§7, L.2239)
   à chaque rendu de la grille de modules, quel que soit le chemin
   d'entrée (bouton nav, bouton "Commencer" du Guide, retour de leçon...). */
var MODULES_VISITED_KEY = 'vachebo_modules_visited_v1';

function _markModulesVisited() {
  try {
    if (localStorage.getItem(MODULES_VISITED_KEY) !== '1') {
      localStorage.setItem(MODULES_VISITED_KEY, '1');
    }
  } catch (e) {
    /* Stockage indisponible : tant pis, _hasVisitedModules() retombera sur
       false et les cartes resteront dépliées par défaut — comportement de
       repli sûr, jamais gênant (juste un peu plus verbeux qu'idéal). */
  }
}

function _hasVisitedModules() {
  try { return localStorage.getItem(MODULES_VISITED_KEY) === '1'; }
  catch (e) { return false; }
}

var LANG_BOX_KEYS = { fr: 'vachebo_langbox_fr_open_v1', es: 'vachebo_langbox_es_open_v1' };

/* Détermine si la carte `lang` ('fr' ou 'es') doit être ouverte au
   chargement — cf. commentaire §15d ci-dessus pour l'ordre de priorité. */
function _langBoxInitialOpen(lang) {
  try {
    var pref = localStorage.getItem(LANG_BOX_KEYS[lang]);
    if (pref === '1') return true;
    if (pref === '0') return false;
  } catch (e) {
    /* Stockage indisponible (navigation privée stricte) : on retombe
       sur l'heuristique ci-dessous. */
  }
  return !_hasVisitedModules(); /* pas encore de préférence explicite */
}

/* Applique visuellement l'état ouvert/fermé sur la carte `lang` (classe
   CSS .collapsed, attributs aria, icône du bouton). Ne touche PAS au
   localStorage — voir toggleLangBox() pour la mémorisation. */
function _setLangBoxOpen(lang, open) {
  var box  = document.getElementById('langBox-' + lang);
  var btn  = document.getElementById('langBoxToggle-' + lang);
  var icon = document.getElementById('langBoxToggleIcon-' + lang);
  if (!box || !btn) return;
  box.classList.toggle('collapsed', !open);
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  btn.setAttribute(
    'aria-label',
    open
      ? "Replier les explications / Contraer las explicaciones"
      : "Afficher les explications / Mostrar las explicaciones"
  );
  if (icon) icon.textContent = open ? '✕' : 'ℹ';
}

/* Initialise les deux cartes au chargement de l'écran 0 (appelé depuis le
   DOMContentLoaded existant, cf. plus bas). */
function _initLangBoxes() {
  _setLangBoxOpen('fr', _langBoxInitialOpen('fr'));
  _setLangBoxOpen('es', _langBoxInitialOpen('es'));
}

/* Bouton "i" de chaque carte (.lang-card-toggle, onclick dans index.html)
   — bascule l'état déplié/replié de CETTE carte uniquement et mémorise le
   choix séparément par langue (cf. commentaire §15d ci-dessus). Chaque
   carte reste indépendante de l'autre (retour utilisateur du 21/07/2026 :
   pas d'exclusivité mutuelle) — le vide visuel qui apparaissait quand
   l'une était repliée pendant que l'autre restait dépliée venait d'un
   autre problème, purement CSS (cf. .launcher-cards / .lang-card.collapsed,
   revu le 22/07/2026 pour aussi égaliser la hauteur des 2 cartes quand
   elles sont dans le même état). */
function toggleLangBox(lang) {
  var box = document.getElementById('langBox-' + lang);
  if (!box) return;
  var nextOpen = box.classList.contains('collapsed'); /* était repliée → on déplie */
  _setLangBoxOpen(lang, nextOpen);
  try {
    localStorage.setItem(LANG_BOX_KEYS[lang], nextOpen ? '1' : '0');
  } catch (e) {
    /* Navigation privée stricte / stockage désactivé : l'affichage reste
       correct pour la session en cours, seule la mémorisation échoue. */
  }
}

/* Au chargement du DOM, fixe la max-height réelle de toute section
   accordéon déjà ouverte par défaut dans le HTML (ex : « Comment ça
   marche », ouverte au premier affichage), pour éviter tout effet de
   troncature avant la première interaction utilisateur. */
document.addEventListener('DOMContentLoaded', () => {
  _resizeOpenAccordions();
  /* Ajouté le 18/07/2026 (demande utilisateur), fusionné le même jour
     (second retour utilisateur) : pose l'état initial (déplié/replié) des
     deux cartes de langue de l'écran 0 — voir §15d juste au-dessus pour
     le détail de la logique. */
  _initLangBoxes();
  /* Ajouté le 11/07/2026 (demande utilisateur) : sur le tout premier
     lancement de l'app (_isBrandNewUser() → aucun parcours, aucun mode
     jamais choisi), on n'affiche PAS encore la barre de navigation basse
     sur l'écran d'accueil — elle réapparaît dès la première interaction,
     via l'appel à _updateBottomNav() déjà présent dans
     showLauncherVariant() (clic sur une carte de langue). Sur tous les
     lancements suivants (ou si l'utilisateur a déjà fait quoi que ce soit
     par le passé), le comportement d'origine est conservé : barre visible
     dès le chargement, avec Langue actif (écran 0). */
  if (!_isBrandNewUser()) {
    _updateBottomNav('app-launcher');
  }
  /* Raccourci ❓ Guide de la Vue A — visible dès le 2e lancement (demande utilisateur du 20/07/2026) */
  _updateCardsNavIcons();
});

/* ═══════════════════════════════════════════════════════════
   16. REMERCIEMENTS — Modale de crédits
   ─────────────────────────────────────────────────────────
   Affiche la modale de remerciements définie dans le HTML.
   Fermée par le bouton "Fermer" intégré dans la modale.
═══════════════════════════════════════════════════════════ */

function showCredits() {
  document.getElementById('credits-modal').style.display = 'flex';
  /* Marque le bouton Infos actif pendant que la modale est ouverte */
  const btnCredits = document.getElementById('navBtnCredits');
  if (btnCredits) btnCredits.classList.add('active');
}


/* ═══════════════════════════════════════════════════════════
   17. GUIDE UTILISATEUR — Écran #home intégré (style Oromo)
   ─────────────────────────────────────────────────────────
   Le guide n'est plus une modale (#guide-modal) mais l'écran
   #home lui-même, avec :
     • topbar sticky sombre (.home-topbar)
     • hero coloré (.home-guide-header) avec drapeaux, titre,
       sous-titre et badges de fonctionnalités
     • barre sticky "Commencer + PDF" (.home-start-sticky)
     • accordéons natifs <details>/<summary> (zéro JS)
     • corps blanc arrondi (.home-guide-body)
   Deux blocs de contenu statiques dans index.html :
     #guideContentFR (.home-lang-block[data-lang="fr"])
     #guideContentES (.home-lang-block[data-lang="es"])
   _buildHomeGuide() active le bon bloc et injecte les dynamiques.

   Fonctions publiques :
     showGuide()           — alias de showOnboardingGuide()
     _buildHomeGuide()     — injecte les parties dynamiques
     _maybeAutoShowGuide() — affiche le guide à la 1re visite
     _refreshGuideRegion() — adapte le bandeau variante ES
     _refreshGuideHeroFR() — adapte le titre/drapeau bloc FR
═══════════════════════════════════════════════════════════ */

/**
 * _buildHomeGuide() — Active le bon bloc de langue et met à jour
 * les éléments dynamiques de l'écran #home (topbar, drapeaux, titre,
 * sous-titre, badges, boutons Commencer et PDF).
 * Appelée par initApp() après _setUI().
 */
function _buildHomeGuide() {
  const showFrench = (currentMode === 'learn_spain') || !currentMode;
  /* Convention :
     showFrench = true  → mode learn_spain (Francophone apprend l'Espagnol) → guide en FR → bloc [data-lang="fr"]
     showFrench = false → mode learn_french (Hispanophone apprend le Français) → guide en ES → bloc [data-lang="es"] */
  const activeLang = showFrench ? 'fr' : 'es';

  /* ── 1. Révèle le bon bloc, masque l'autre ── */
  document.querySelectorAll('.home-lang-block').forEach((el) => {
    if (el.dataset.lang === activeLang) {
      el.classList.remove('home-lang-hidden');
    } else {
      el.classList.add('home-lang-hidden');
    }
  });

  /* ── 2. Topbar titre ── */
  const topbarTitle = document.getElementById('homeTopbarTitle');
  if (topbarTitle) topbarTitle.textContent = showFrench ? 'Guide explicatif' : 'Guía explicativa';

  /* ── 3. En-tête : drapeaux, titre, sous-titre ── */
  const flagsEl = document.getElementById('homeGuideFlagsRow');
  if (flagsEl) {
    const flagEmojis = { ES:'🇪🇸', MX:'🇲🇽', CO:'🇨🇴', PE:'🇵🇪', VE:'🇻🇪', AR:'🇦🇷', EC:'🇪🇨' };
    const activeFlag = flagEmojis[currentRegion] || '🇪🇸';
    flagsEl.textContent = showFrench ? ('🇫🇷 → ' + activeFlag) : (activeFlag + ' → 🇫🇷');
  }

  const titleEl = document.getElementById('homeTitle');
  if (titleEl) {
    const flagEmojis2 = { ES:'🇪🇸', MX:'🇲🇽', CO:'🇨🇴', PE:'🇵🇪', VE:'🇻🇪', AR:'🇦🇷', EC:'🇪🇨' };
    const activeFlag2 = flagEmojis2[currentRegion] || '🇪🇸';
    titleEl.textContent = showFrench
      ? ('Apprends l\'Espagnol ' + activeFlag2)
      : ('Aprende Francés 🇫🇷');
  }

  const subEl = document.getElementById('homeGuideSubtitle');
  if (subEl) subEl.textContent = showFrench
    ? 'App gratuite — idéale pour les grands débutants.'
    : 'App gratuita — ideal para empezar desde cero.';

  /* ── 4. Badges de fonctionnalités ── */
  const badgesEl = document.getElementById('homeGuideBadges');
  if (badgesEl) {
    const badges = showFrench
      ? ['✅ Gratuit', '🚧 Sans inscription', '📱 Mobile & ordinateur', '🔊 Audio inclus', '🎤 Répétition orale', '🌎 7 variantes d\'espagnol']
      : ['✅ Gratis', '🚧 Sin registro', '📱 Móvil y ordenador', '🔊 Audio incluido', '🎤 Repetición oral', '🌎 7 variantes de español'];
    badgesEl.innerHTML = badges.map((b) => { return '<span class="hg-badge">' + b + '</span>'; }).join('');
  }

  /* ── 4b. Bouton "Installer en mode hors-ligne" (en-tête) ──
     Le texte suit la langue active ; l'affichage/masquage réel du bouton
     (selon la disponibilité de l'invite native beforeinstallprompt) reste
     géré par _initInstallButtons()/refresh() (§21c), qui cible toutes les
     ".pwa-install-btn" — celui-ci y compris.
     Renommé le 12/07/2026 (demande utilisateur) ; le badge "📲 Installable
     hors-ligne"/"Instalable sin conexión" a été retiré de la liste ci-dessus
     à la même occasion pour éviter la redondance avec ce bouton, qui occupe
     désormais visuellement sa place juste sous la rangée de badges. */
  const homeInstallBtn = document.getElementById('homeInstallBtn');
  if (homeInstallBtn) {
    homeInstallBtn.textContent = showFrench ? '📲 Installer en mode hors-ligne' : '📲 Instalar en modo sin conexión';
  }

  /* ── 5. Bouton Commencer ── */
  const startBtn = document.getElementById('homeStartBtn');
  if (startBtn) {
    startBtn.textContent = showFrench ? '▶ Commencer' : '▶ Empezar';
    startBtn.onclick = function() { showScreen('sections-level1'); };
  }

  /* ── 6. Bouton PDF guide ── */
  const exportBtn = document.getElementById('homeExportBtn');
  if (exportBtn) {
    exportBtn.textContent = '📄 PDF';
    exportBtn.title = showFrench ? 'Télécharger le guide (PDF)' : 'Descargar la guía (PDF)';
  }

  /* ── 7. Bandeau variante régionale (bloc ES) ── */
  _refreshGuideRegion();
}

/* ─────────────────────────────────────────────────────────
   RACCOURCIS DE NAVIGATION — AJOUTÉS LE 20/07/2026, RESTRUCTURÉS LE
   21/07/2026 (demandes utilisateur)
   ─────────────────────────────────────────────────────────
   Objectif : permettre d'aller à tout moment de n'importe quel écran
   (cartes de langue, Variantes, Guide, Modules) vers n'importe quel
   autre, sans devoir tout réinitialiser :
     • navToVariantSelector() — ouvre l'écran Variantes (Vue B du
       Launcher) pour le mode en cours, depuis le Guide ou les Modules.
     • navVariantToGuide() / navVariantToModules() — depuis l'écran
       Variantes, vont directement au Guide ou aux Modules du mode en
       cours.
     • navCardsToVariantSelector() / navCardsToGuide() / navCardsToModules()
       — depuis les cartes de langue (Vue A, où currentMode est encore
       vide), rouvrent Variantes/Guide/Modules du dernier mode déjà
       utilisé (cf. _lastUsedMode()).
     • _updateCardsNavIcons() — affiche/masque la ligne d'icônes de la
       Vue A (masquée tant qu'aucun mode n'a jamais été ouvert).
   Ces raccourcis rechargent les données du mode si besoin (comme le
   bouton "Continuer") avant de naviguer, puisqu'on peut y arriver sans
   être jamais passé par initApp() dans cette session. ───────────────────────────────────────────────────────── */

/**
 * navToVariantSelector() — Ouvre l'écran Variantes (sélecteur de région)
 * pour le mode actuellement actif, depuis le Guide ou les Modules.
 * Si aucun mode n'est actif (cas improbable ici), se rabat sur le
 * Launcher classique (Vue A).
 */
function navToVariantSelector() {
  if (!currentMode) { showLauncher(); return; }
  document.querySelectorAll('.screen').forEach((s) => { s.classList.remove('active'); });
  document.getElementById('app-launcher').classList.add('active');
  showLauncherVariant(currentMode);
  window.scrollTo(0, 0);
}

/**
 * navVariantToGuide() — Icône ❓ de l'écran Variantes : recharge les
 * données du mode si besoin puis affiche directement le Guide (même si
 * l'apprenant l'avait déjà fermé pour ce mode — navigation explicite).
 */
function navVariantToGuide() {
  if (!currentMode) return;
  const mode = currentMode;
  loadDataForMode(mode, () => {
    initApp(mode);
    showGuide();
  });
}

/**
 * navVariantToModules() — Icône 📚 de l'écran Variantes : recharge les
 * données du mode si besoin puis affiche directement les Modules.
 */
function navVariantToModules() {
  if (!currentMode) return;
  const mode = currentMode;
  loadDataForMode(mode, () => {
    initApp(mode);
    showScreen('sections-level1');
  });
}

/**
 * _lastUsedMode() — Déduit le dernier mode réellement utilisé, à partir
 * des flags localStorage existants (progression terminée ou guide déjà
 * vu). Sert à choisir la destination des raccourcis de la Vue A (cartes
 * de langue), quand aucun mode n'est encore actif. Limite connue : si
 * les DEUX modes ont déjà été utilisés, aucun horodatage n'existe pour
 * départager — on retient alors 'learn_spain' par défaut (mode le plus
 * fréquent pour ce public).
 */
function _lastUsedMode() {
  try {
    const frUsed = localStorage.getItem('vachebo_guide_vu_fr') === 'true' || !!localStorage.getItem('pe_es_fr_done_v1');
    const esUsed = localStorage.getItem('vachebo_guide_vu_es') === 'true' || !!localStorage.getItem('pe_fr_es_done_v1');
    if (esUsed) return 'learn_spain';
    if (frUsed) return 'learn_french';
  } catch (e) { /* localStorage indisponible : repli ci-dessous */ }
  return 'learn_spain';
}

/**
 * _restoreLastRegion() — Restaure currentRegion depuis la préférence
 * mémorisée ('user_preferred_region'), avec repli sur 'ES'. Factorisé le
 * 21/07/2026 : utilisé par les 3 raccourcis de la Vue A ci-dessous, qui
 * partent tous de currentMode vide et doivent donc restaurer la région
 * avant d'appeler initApp().
 */
function _restoreLastRegion() {
  const _VALID_REGIONS = ['ES', 'MX', 'CO', 'PE', 'VE', 'AR', 'EC'];
  const savedRegion = localStorage.getItem('user_preferred_region');
  currentRegion = _VALID_REGIONS.includes(savedRegion) ? savedRegion : 'ES';
}

/**
 * navCardsToVariantSelector() — Icône 🌎 de la Vue A (cartes de langue) :
 * ouvre directement l'écran Variantes pour le dernier mode utilisé (cf.
 * _lastUsedMode()), sans recharger les données (showLauncherVariant() ne
 * nécessite pas ALL_THEMES_FR/ES, seulement la liste statique des
 * régions).
 */
function navCardsToVariantSelector() {
  _restoreLastRegion();
  currentMode = _lastUsedMode();
  document.querySelectorAll('.screen').forEach((s) => { s.classList.remove('active'); });
  document.getElementById('app-launcher').classList.add('active');
  showLauncherVariant(currentMode);
  window.scrollTo(0, 0);
}

/**
 * navCardsToGuide() — Icône ❓ de la Vue A (cartes de langue) : rouvre le
 * Guide du dernier mode utilisé, en restaurant au passage la région
 * préférée mémorisée, puis recharge les données si besoin avant
 * d'afficher le Guide.
 */
function navCardsToGuide() {
  const mode = _lastUsedMode();
  _restoreLastRegion();
  loadDataForMode(mode, () => {
    initApp(mode);
    showGuide();
  });
}

/**
 * navCardsToModules() — Icône 📚 de la Vue A (cartes de langue) : rouvre
 * directement les Modules du dernier mode utilisé. Ajoutée le 21/07/2026
 * (demande utilisateur), sur le même principe que navCardsToGuide().
 */
function navCardsToModules() {
  const mode = _lastUsedMode();
  _restoreLastRegion();
  loadDataForMode(mode, () => {
    initApp(mode);
    showScreen('sections-level1');
  });
}

/**
 * _updateCardsNavIcons() — Affiche/masque la ligne d'icônes de la Vue A
 * (🌎 Variantes + ❓ Guide à gauche, 📚 Modules + 🚪 Sortie à droite)
 * uniquement à partir du 2e passage par l'app (!_isBrandNewUser()).
 * Appelée au chargement initial (DOMContentLoaded) et à chaque retour à
 * la Vue A (showLauncher()). Renommée le 21/07/2026 (gérait auparavant
 * seule l'icône ❓ ; gère désormais les 4 icônes des deux groupes).
 */
function _updateCardsNavIcons() {
  const show = !_isBrandNewUser();
  const left  = document.getElementById('launcherCardsIconsLeft');
  const right = document.getElementById('launcherCardsIconsRight');
  if (left)  left.style.display  = show ? 'flex' : 'none';
  if (right) right.style.display = show ? 'flex' : 'none';
}

/**
 * navBackToHome() — Bouton 🏠 du bouton retour à deux icônes (écran Modules).
 * L'écran #home est en réalité l'écran "Guide explicatif" (celui affiché par
 * showGuide()) : y afficher un titre "Accueil/Inicio" par-dessus son contenu
 * de Guide ne fait pas de #home un véritable accueil, ça laisse juste un
 * titre trompeur au-dessus du même contenu. Le véritable accueil de l'app
 * est l'écran #app-launcher ("Choisis ta langue / Elige tu idioma"), affiché
 * par showLauncher() — c'est donc lui qu'il faut appeler ici.
 */
function navBackToHome() {
  showLauncher();
}

/**
 * navBackToGuide() — Bouton ❓ du bouton retour à deux icônes (écran Modules).
 * Va sur #home via showGuide() (qui remet bien le titre "Guide explicatif").
 * L'écran #home a un scroll interne indépendant du scroll de la fenêtre
 * (remis à 0 par showScreen()), donc sans reset explicite ici il conservait
 * la position de défilement laissée par une visite précédente du Guide —
 * d'où l'écran qui apparaissait "pas en haut". On le remet en haut.
 */
function navBackToGuide() {
  showGuide();
  const homeEl = document.getElementById('home');
  if (homeEl) homeEl.scrollTop = 0;
}

/* ─────────────────────────────────────────────────────────
   MODALE "QUITTER L'APPLICATION" — ajoutée le 19/07/2026
   (demande utilisateur : un bouton 🚪 facile d'accès sur
   CHAQUE écran — lanceur, guide, sections niveau 1/2, leçon —
   plutôt qu'une seule sortie possible via le lanceur).
   Le clic ouvre #quit-modal (cf. index.html), qui propose deux
   issues distinctes :
     • quitCloseApp() — tentative réelle de fermeture de l'onglet/
       fenêtre.
     • quitGoHome()   — simple retour à l'écran de départ (choix
       de langue), qui sert de "sortie" logique dans l'app.
───────────────────────────────────────────────────────── */

/**
 * Ouvre la modale de confirmation (bouton 🚪 des 5 écrans).
 * Textes basculés le 21/07/2026 (demande utilisateur) : la modale
 * affichait un mélange bilingue FR/ES sur chaque ligne ("Quitter
 * l'application ? / ¿Salir de la aplicación?", etc.), quel que soit le
 * parcours en cours. Elle affiche désormais une seule langue à la fois,
 * celle de l'apprenant selon le parcours actif — même logique que le
 * reste de l'interface (cf. L(), déjà utilisé pour le toast de repli de
 * quitCloseApp() juste en dessous). Si aucun mode n'est encore choisi
 * (lanceur), L() retombe sur sa valeur par défaut (français), cohérente
 * avec le reste de l'app dans ce cas (cf. showFrench dans _buildHomeGuide()).
 */
function showQuitConfirm() {
  document.getElementById('quitModalTitle').textContent =
    L('🚪 ¿Salir de la aplicación?', '🚪 Quitter l\'application ?');
  document.getElementById('quitModalSubtitle').textContent =
    L('Elige una opción', 'Choisis une option');
  document.getElementById('quitModalCloseBtn').textContent =
    L('🚪 Cerrar la app', '🚪 Fermer l\'appli');
  document.getElementById('quitModalHomeBtn').textContent =
    L('🏠 Volver al inicio', '🏠 Revenir au départ');
  document.getElementById('quitModalCancelBtn').textContent =
    L('Cancelar', 'Annuler');
  document.getElementById('quit-modal').style.display = 'flex';
}

/** Ferme la modale sans action (bouton "Annuler / Cancelar"). */
function cancelQuit() {
  document.getElementById('quit-modal').style.display = 'none';
}

/** Bouton "Revenir au départ" : retour au lanceur (choix de langue). */
function quitGoHome() {
  document.getElementById('quit-modal').style.display = 'none';
  showLauncher();
}

/**
 * Bouton "Fermer l'application" : tente une fermeture réelle de
 * l'onglet/fenêtre via window.close(). Par sécurité navigateur,
 * window.close() ne fonctionne en pratique que sur un onglet/une
 * fenêtre ouvert(e) par du script — un onglet ouvert normalement
 * par l'utilisateur (cas quasi systématique ici) ne se fermera
 * PAS, et c'est le comportement standard de tous les navigateurs,
 * pas un bug de l'app. Impossible de détecter la fermeture elle-
 * même (le script s'arrête net si ça marche) : on programme donc
 * un message de repli à +400ms, qui ne s'affichera QUE si la page
 * est toujours là (donc que window.close() n'a rien fait), pour
 * indiquer à l'apprenant comment fermer lui-même.
 */
function quitCloseApp() {
  document.getElementById('quit-modal').style.display = 'none';
  try { window.close(); } catch (e) { /* ignoré : le repli ci-dessous s'en charge */ }
  setTimeout(() => {
    _showToast(L(
      '👉 Tu navegador no permite cerrar la pestaña sola. Ciérrala tú mismo o pulsa "atrás".',
      '👉 Ton navigateur ne permet pas de fermer l\'onglet automatiquement. Ferme-le toi-même ou appuie sur « retour ».'
    ), 5000);
  }, 400);
}

/**
 * showGuide() — Affiche le guide (écran #home) et met à jour les
 * éléments dynamiques. Alias de showOnboardingGuide() pour la
 * compatibilité avec les liens "Guide / Guía" dans les footers.
 */
function showGuide() {
  _buildHomeGuide();
  showScreen('home');
  /* Ligne d'icônes 🏠/🌎/📚/🚪 du Guide — restructurée le 21/07/2026
     (demande utilisateur) : masquée tant que l'app n'a pas été parcourue
     une 1ère fois, même principe que #launcherVariantIconsLeft/Right sur l'écran
     Variantes (cf. showLauncherVariant()). */
  const topbarNav = document.getElementById('homeTopbarNav');
  if (topbarNav) topbarNav.style.display = _isBrandNewUser() ? 'none' : 'flex';
}

/**
 * showOnboardingGuide() — Alias public de showGuide().
 * Appelée par le bouton ❓ de la barre de navigation basse.
 */
function showOnboardingGuide() {
  showGuide();
}

/**
 * closeGuide() — Conservée pour compatibilité (HTML inline).
 * Dans le nouveau style, "fermer" le guide = aller aux modules.
 */
function closeGuide() {
  showScreen('sections-level1');
}

/**
 * toggleGuideNoShow() — Conservée pour compatibilité (HTML inline).
 * Dans le nouveau style Oromo, il n'y a plus de checkbox "Ne plus afficher".
 * La fonction est gardée vide pour éviter toute erreur JS.
 */
function toggleGuideNoShow(cb) { /* no-op — supprimé dans le style Oromo */ }

/**
 * _guideSeenKey() — Clé localStorage du flag "guide vu", PAR LANGUE
 * ('vachebo_guide_vu_fr' / 'vachebo_guide_vu_es'). Avant le 05/07/2026 ce
 * flag était global (tous modes confondus) ; il est désormais scindé par
 * mode afin qu'un apprenant qui se trompe de langue au premier lancement
 * voie bien le guide une seconde fois lorsqu'il choisit la bonne langue.
 */
function _guideSeenKey() {
  return currentMode === 'learn_french' ? 'vachebo_guide_vu_fr' : 'vachebo_guide_vu_es';
}

/**
 * _hasSeenGuide() / _markGuideSeen() — Persistance en localStorage de l'état
 * "guide déjà consulté", PAR LANGUE (cf. _guideSeenKey()) : une fois le
 * guide quitté une première fois dans un mode donné, il ne se relance plus
 * tout seul pour CE mode — mais reste dû pour l'autre langue si elle n'a
 * jamais été visitée. Reste accessible à tout moment via le bouton ❓ Guide
 * de la barre de navigation basse (cf. showGuide()).
 * Migration : GUIDE_SEEN_KEY_LEGACY est l'ancien flag global (avant la
 * scission par langue) — s'il est posé, on le respecte une seule fois pour
 * ne pas faire revoir le guide aux apprenants qui l'avaient déjà terminé.
 * Enveloppé en try/catch : certains contextes (navigation privée stricte,
 * stockage désactivé) peuvent faire lever localStorage — on dégrade alors
 * simplement vers "jamais vu", sans casser l'app.
 */
const GUIDE_SEEN_KEY_LEGACY = 'vachebo_guide_vu';
function _hasSeenGuide() {
  try {
    if (localStorage.getItem(_guideSeenKey()) === 'true') return true;
    return localStorage.getItem(GUIDE_SEEN_KEY_LEGACY) === 'true';
  } catch (e) { return false; }
}
function _markGuideSeen() {
  try { localStorage.setItem(_guideSeenKey(), 'true'); } catch (e) {}
}

/**
 * _maybeAutoShowGuide() — Affiche le guide uniquement s'il n'a jamais été
 * quitté auparavant POUR LE MODE COURANT (cf. _hasSeenGuide()) ; sinon va
 * directement aux modules.
 * Appelée en fin d'initApp(), à la place de l'ancien showScreen('home') direct.
 * Le flag est posé par showScreen() lui-même dès qu'on quitte l'écran #home
 * (voir plus haut) — donc aussi bien via "▶ Commencer" que via n'importe
 * quelle autre sortie du guide (nav basse, etc.).
 */
function _maybeAutoShowGuide() {
  if (_hasSeenGuide()) {
    showScreen('sections-level1');
  } else {
    showScreen('home');
  }
}

/**
 * _refreshGuideRegion() — Adapte les bandeaux variante régionale des 2
 * blocs du Guide (#guideRegionBadgeES et #guideRegionBadgeFR) à
 * currentRegion.
 * Symbole mascotte corrigé le 21/07/2026 (demande utilisateur) : chaque
 * bandeau doit refléter ce qui est APPRIS, pas la variante d'origine —
 * même logique que _mascotKeyForMode() déjà utilisée ailleurs (pied de
 * page, pastille "tout terminé", ligne sans-faute des quiz), mais fixée
 * ici par bloc plutôt que par mode courant : le bloc ES n'est visible
 * QUE en mode learn_french (apprentissage du FRANÇAIS) → Tour Eiffel ;
 * le bloc FR n'est visible QUE en mode learn_spain (apprentissage de
 * l'ESPAGNOL) → symbole de la variante régionale active. Bandeau FR
 * ajouté le même jour : il n'existait pas du tout auparavant.
 * Markup scindé en 2 lignes le 21/07/2026 (2e passe, demande utilisateur) :
 * `.ghrb-icons` (drapeau + 🐄 + symbole mascotte, agrandis) au-dessus de
 * `.ghrb-text` (phrase descriptive, taille normale) — cf. règles CSS dans
 * style.css, juste avant `.guide-grid-2`.
 * Ajustements du 21/07/2026 (4e passe, demande utilisateur) :
 *  - Bandeau ES (bloc learn_french) : phrase raccourcie à "Oh la vache !"
 *    (au lieu de REGION_MASCOTS.FR.phrase complet "Oh la vache, qué
 *    chévère !"), pour un encadré de taille cohérente avec les rubriques
 *    en accordéon juste en dessous. Volontairement local à ce bandeau —
 *    REGION_MASCOTS.FR.phrase reste inchangée pour le pied de page, la
 *    pastille "tout terminé" et la ligne sans-faute des quiz.
 *  - Couleurs de l'encadré (bordure) : passées de teintes fixes
 *    (var(--g-fr-lt)/var(--g-es-lt), cf. ancienne règle CSS) à
 *    var(--c-primary), qui reflète déjà nativement le thème actif —
 *    bleu/rouge France en mode learn_french, couleurs de la variante
 *    hispanique choisie en mode learn_spain (cf. html.theme-french /
 *    html.theme-spain.region-XX dans style.css). Texte de la phrase
 *    laissé en noir (#333) dans les deux blocs, plutôt que teinté.
 */
function _refreshGuideRegion() {
  const REGIONS = {
    ES: { flag:'🇪🇸', name:'España (Castellano)' },
    MX: { flag:'🇲🇽', name:'México' },
    AR: { flag:'🇦🇷', name:'Argentina' },
    CO: { flag:'🇨🇴', name:'Colombia' },
    VE: { flag:'🇻🇪', name:'Venezuela' },
    PE: { flag:'🇵🇪', name:'Perú' },
    EC: { flag:'🇪🇨', name:'Ecuador' }
  };
  const region = REGIONS[currentRegion] ? currentRegion : 'ES';
  const r = REGIONS[region];

  /* Bandeau du bloc ES (guide en espagnol → mode learn_french, apprentissage
     du français) : mascotte Tour Eiffel, fixe, quel que soit currentRegion. */
  const badgeES = document.getElementById('guideRegionBadgeES');
  if (badgeES) badgeES.innerHTML =
      '<div class="ghrb-icons" aria-hidden="true">' + r.flag + ' 🐄' + REGION_MASCOTS.FR.symbol + '</div>'
    + '<div class="ghrb-text">Tu app está configurada en <strong>' + r.name + '</strong> — <em>Oh la vache !</em></div>';

  /* Bandeau du bloc FR (guide en français → mode learn_spain, apprentissage
     de l'espagnol) : mascotte régionale, selon la variante active. */
  const badgeFR = document.getElementById('guideRegionBadgeFR');
  if (badgeFR) badgeFR.innerHTML =
      '<div class="ghrb-icons" aria-hidden="true">' + r.flag + ' 🐄' + REGION_MASCOTS[region].symbol + '</div>'
    + '<div class="ghrb-text">Ton application est configurée sur <strong>' + r.name + '</strong> — <em>' + REGION_MASCOTS[region].phrase + '</em></div>';
}

/**
 * _refreshGuideHeroFR() — Adapte le titre/drapeau de l'en-tête
 * du bloc français (en-tête #home) à la variante régionale active.
 * Conservée pour compatibilité — _buildHomeGuide() gère déjà cela.
 */
function _refreshGuideHeroFR() {
  const flagEmojis = { ES:'🇪🇸', MX:'🇲🇽', CO:'🇨🇴', PE:'🇵🇪', VE:'🇻🇪', AR:'🇦🇷', EC:'🇪🇨' };
  const activeFlag = flagEmojis[currentRegion] || '🇪🇸';
  const flagsEl = document.getElementById('homeGuideFlagsRow');
  if (flagsEl) flagsEl.textContent = '🇫🇷 → ' + activeFlag;
  const titleEl = document.getElementById('homeTitle');
  if (titleEl) titleEl.textContent = 'Apprends l\'Espagnol ' + activeFlag;
}

/* ============================================================
   COPIE SÉCURISÉE DE L'E-MAIL — mécanisme unifié (≡ app Oromo)
   ─────────────────────────────────────────────────────────────
   Antispam double verrouillage :
     1. Dans le HTML, l'adresse est écrite à l'envers dans un
        <span class="antispam-email"> ; le CSS (direction:rtl)
        la remet à l'endroit visuellement sans toucher au DOM.
     2. Au clic, l'adresse est reconstituée en mémoire vive
        (jamais dans le DOM à l'endroit) pour ouvrir le client
        mail ET copier l'adresse dans le presse-papier.
   Feedback : toast _showToast() — universel, sans dépendance
   à un id de bouton.
   Fallback : si l'API Clipboard échoue, _showToast() affiche
   l'adresse pour une copie manuelle (5 s).
   ============================================================ */
function openAndCopyEmail() {
  const user   = 'sebastien.godet16';
  const domain = 'gmail.com';
  const full   = user + '@' + domain;

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(full).then(() => {
      _showToast(L('✅ E-mail copiado en el portapapeles', '✅ E-mail copié dans le presse-papier'));
    }).catch(() => {
      _showToast(L('📋 Copie manualmente: ', '📋 Copiez manuellement : ') + full, 5000);
    });
  } else {
    _showToast(L('📋 Copie manualmente: ', '📋 Copiez manuellement : ') + full, 5000);
  }

  window.location.href = 'mailto:' + full;
}

/* ════════════════════════════════════════════════════════════
   §21 — EXPORTS PDF
   ──────────────────────────────────────────────────────────
   3 fonctions d'export ouvrant une page HTML dans un nouvel
   onglet, puis déclenchant window.print() au onload.

   Couleurs selon le thème actif :
     theme-french → bleu #002395 / rouge #C60B1E (drapeaux FR + ES)
     theme-spain  → rouge #C60B1E / bleu #002395  (ES en couleur 1)

   Logo : img/Logo-appli-es-fr.png
   Bilingue via L() pour tous les libellés d'interface.
════════════════════════════════════════════════════════════ */

/* _pdfTheme() — Retourne les couleurs primaire / secondaire selon le thème actif. */
function _pdfTheme() {
  const isFR = isFrench();
  return {
    primary:   isFR ? '#002395' : '#C60B1E',
    secondary: isFR ? '#C60B1E' : '#002395',
    logoSrc:   'img/Logo-appli-es-fr.png'
  };
}

/* _pdfBaseStyles(th) — CSS commun à tous les exports PDF.
   th : objet retourné par _pdfTheme(). */
function _pdfBaseStyles(th) {
  return '<style>'
    + '*{box-sizing:border-box;margin:0;padding:0}'
    + 'body{font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#111;background:#fff;padding:0 18px 24px}'
    + '.pdf-header{display:flex;align-items:center;gap:14px;background:' + th.primary + ';color:#fff;padding:14px 18px;margin:0 -18px 22px}'
    + '.pdf-header img{height:48px;width:auto;object-fit:contain}'
    + '.pdf-header-info{flex:1}'
    + '.pdf-header h1{font-size:1.15rem;font-weight:900;letter-spacing:.02em}'
    + '.pdf-header p{font-size:.78rem;opacity:.88;margin-top:2px}'
    + '.pdf-badge{background:' + th.secondary + ';color:#fff;border-radius:50px;padding:2px 10px;font-size:.72rem;font-weight:700;margin-top:6px;display:inline-block}'
    + 'h2{font-size:1rem;font-weight:800;color:' + th.primary + ';border-bottom:2px solid ' + th.primary + ';padding-bottom:4px;margin:20px 0 10px}'
    + 'h3{font-size:.88rem;font-weight:700;color:' + th.secondary + ';margin:14px 0 6px}'
    + 'table{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:.88rem}'
    + 'th{background:' + th.primary + ';color:#fff;text-align:left;padding:6px 8px;font-size:.8rem}'
    + 'td{padding:5px 8px;border-bottom:1px solid #e0e0e0;vertical-align:top}'
    + 'tr:nth-child(even) td{background:#f5f7ff}'
    + '.conj{font-style:italic;color:#555;font-size:.8rem;margin-top:2px}'
    + '.bubble-row{display:flex;gap:8px;margin-bottom:8px;align-items:flex-start}'
    + '.bubble-side{width:28px;flex-shrink:0;font-size:.7rem;color:#888;padding-top:3px;text-align:center}'
    + '.bubble-box{background:#f0f4ff;border-left:3px solid ' + th.primary + ';border-radius:0 8px 8px 0;padding:6px 10px;flex:1}'
    + '.bubble-box.right{background:#fff5f5;border-left-color:' + th.secondary + '}'
    + '.bubble-main{font-weight:700;font-size:.9rem}'
    + '.bubble-trans{font-size:.78rem;color:#555;margin-top:2px}'
    + '.pdf-footer{margin-top:28px;padding-top:10px;border-top:1px solid #ddd;font-size:.72rem;color:#888;text-align:center}'
    + 'details summary{cursor:pointer;font-weight:700;padding:4px 0}'
    /* Ajouté le 22/07/2026 (demande utilisateur) : la règle qui affiche
       l'adresse email dans le bon sens (cf. .antispam-email dans
       style.css) ne vit que dans la feuille de style principale de
       l'app — absente de cette page d'export autonome, elle laissait
       s'afficher tel quel le texte inversé "anti-robots" présent dans
       le HTML (ex. "moc.liamg@61tedog.neitsabes" au lieu de
       "sebastien.godet16@gmail.com"). Ajoutée ici à l'identique : même
       mécanisme (le texte source reste inversé, seul l'AFFICHAGE est
       remis dans le bon sens via RTL), sans transformer l'adresse en
       lien cliquable. */
    + '.antispam-email{unicode-bidi:bidi-override;direction:rtl;display:inline}'
    + '.footer-antispam-btn,.antispam-btn{background:none;border:none;padding:0;font:inherit;color:inherit;cursor:default}'
    + '@media print{'
    + '  body{padding:0 12px}'
    + '  .pdf-header{-webkit-print-color-adjust:exact;print-color-adjust:exact}'
    + '  th{-webkit-print-color-adjust:exact;print-color-adjust:exact}'
    + '  tr:nth-child(even) td{-webkit-print-color-adjust:exact;print-color-adjust:exact}'
    + '  .bubble-box{-webkit-print-color-adjust:exact;print-color-adjust:exact}'
    + '}'
    + '</style>';
}

/* _pdfHeader(th, title, subtitle) — En-tête HTML avec logo + titre + badge. */
function _pdfHeader(th, title, subtitle) {
  return '<div class="pdf-header">'
    + '<img src="' + th.logoSrc + '" alt="VACHÉBO" onerror="this.style.display=\'none\'">'
    + '<div class="pdf-header-info">'
    + '<h1>' + title + '</h1>'
    + (subtitle ? '<p>' + subtitle + '</p>' : '')
    + '<span class="pdf-badge">VACHÉBO</span>'
    + '</div></div>';
}

/* _pdfFooter() — Pied de page avec date d'export. */
function _pdfFooter() {
  const d = new Date();
  const ds = d.toLocaleDateString(isFrench() ? 'es-ES' : 'fr-FR', {day:'2-digit',month:'long',year:'numeric'});
  return '<div class="pdf-footer">'
    + L('Exportado desde VACHÉBO · ' + ds, 'Exporté depuis VACHÉBO · ' + ds)
    + '</div>';
}

/* _pdfOpen(htmlContent) — Ouvre le HTML dans un nouvel onglet et lance l'impression.
   Double déclenchement : onload (navigateurs modernes) + setTimeout 800 ms (fallback Safari/Firefox
   où document.write() dans un nouvel onglet ne déclenche pas toujours onload). */
function _pdfOpen(htmlContent) {
  const w = window.open('', '_blank');
  if (!w) { _showToast(L('Autoriza las ventanas emergentes para exportar.', 'Autorisez les pop-ups pour exporter.')); return; }
  w.document.write(htmlContent);
  w.document.close();
  let _printed = false;
  function _doPrint() {
    if (_printed) return;
    _printed = true;
    w.focus();
    w.print();
  }
  w.onload = _doPrint;
  /* Fallback : onload ne se déclenche pas toujours (Safari, Firefox) quand le document
     est écrit via document.write() dans un onglet ouvert par window.open(). */
  setTimeout(_doPrint, 800);
}

/* ─────────────────────────────────────────────────────────
   _exportGuide() — Export PDF du guide utilisateur complet.
   Extrait le HTML de #guideContentFR ou #guideContentES
   selon le mode actif, l'enveloppe dans une page imprimable.

   Amélioration : le guide est structuré en rubriques <details>
   natives (repliées par défaut, dépliées au clic de l'apprenant).
   Un navigateur ne rend PAS le contenu d'un <details> fermé — donc
   copier innerHTML tel qu'affiché à l'écran exportait des rubriques
   vides si l'apprenant ne les avait pas toutes ouvertes. On travaille
   ici sur un CLONE du guide (jamais sur le DOM affiché — l'écran de
   l'utilisateur ne doit pas se déplier sous ses yeux) et on force
   l'attribut "open" sur chaque <details> du clone avant d'en lire
   le HTML : le PDF contient donc toujours les 100% des rubriques,
   qu'elles aient été consultées ou non. ─────────────────────────── */
function _exportGuide() {
  const th       = _pdfTheme();
  const guideId = !isFrench() ? 'guideContentFR' : 'guideContentES';
  const guideEl  = document.getElementById(guideId);
  let guideHTML;
  if (guideEl) {
    const guideClone = guideEl.cloneNode(true);
    guideClone.querySelectorAll('details').forEach((d) => {
      d.setAttribute('open', ''); /* déplie toutes les rubriques, même imbriquées */
    });
    guideHTML = guideClone.innerHTML;
  } else {
    guideHTML = '<p>' + L('Contenido no disponible.', 'Contenu indisponible.') + '</p>';
  }
  const title    = L('Guía del usuario — VACHÉBO', 'Guide utilisateur — VACHÉBO');
  const subtitle = L('Aprende Francés · Guía completa', 'Apprends l\'Espagnol · Guide complet');

  const html = '<!DOCTYPE html><html lang="' + (isFrench() ? 'es' : 'fr') + '"><head>'
    + '<meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + title + '</title>'
    + _pdfBaseStyles(th)
    + '<style>'
    + '.guide-hero{display:none}'          /* masque le hero visuel dans le PDF */
    + '.guide-region-grid{display:none}'   /* masque la grille des régions */
    + '.guide-hero-chips{display:none}'
    + '.guide-step-visual{display:none}'
    + 'details{margin-bottom:10px;border:1px solid #e0e0e0;border-radius:6px;padding:6px 10px}'
    + 'details summary{font-weight:700;padding:4px 0;list-style:none}'
    + 'details summary::before{content:"▶ ";color:' + th.primary + '}'
    + 'details[open] summary::before{content:"▼ "}'
    + 'p,li{margin-bottom:6px;line-height:1.55}'
    + 'ul,ol{padding-left:18px;margin-bottom:8px}'
    + '.guide-section-title{font-size:.95rem;font-weight:800;color:' + th.primary + ';margin:16px 0 6px}'
    + '</style>'
    + '</head><body>'
    + _pdfHeader(th, title, subtitle)
    + '<div>' + guideHTML + '</div>'
    + _pdfFooter()
    + '</body></html>';

  _pdfOpen(html);
}

/* ─────────────────────────────────────────────────────────
   _exportVocab() — Export PDF du tableau de vocabulaire.
   Colonnes : emoji | mot source | mot cible (+ variante régionale).
   Les conjugaisons (conj) sont affichées en italique sous le mot.
───────────────────────────────────────────────────────── */
function _exportVocab() {
  if (!CT || !CT.words) { _showToast(L('Sin vocabulario disponible.', 'Pas de vocabulaire disponible.')); return; }
  const th      = _pdfTheme();
  const words   = CT.words;
  const flagEmojis = { ES:'🇪🇸', MX:'🇲🇽', CO:'🇨🇴', PE:'🇵🇪', VE:'🇻🇪', AR:'🇦🇷', EC:'🇪🇨' };
  const regionFlag = isFrench() ? (flagEmojis[currentRegion] || '🇪🇸') : '🇫🇷';

  const title    = L(
    '📘 Vocabulario — ' + (CT.name || CT.id),
    '📘 Vocabulaire — ' + (CT.name || CT.id)
  );
  const subtitle = L(
    'Francés 🇫🇷 ↔ Español ' + regionFlag,
    'Français 🇫🇷 ↔ Espagnol ' + regionFlag
  );
  const hdrEmoji = 'Emoji';
  const hdrSrc   = L('Español ' + regionFlag, 'Français 🇫🇷');
  const hdrTgt   = L('Francés 🇫🇷', 'Espagnol ' + regionFlag);

  const rows = words.map((card) => {
    const finalEs = (card.variants?.[currentRegion])
      ? card.variants[currentRegion] : (card.es || '');
    const srcWord = L(finalEs, card.fr || '');
    const tgtWord = L(card.fr || '', finalEs);

    /* Conjugaisons éventuelles */
    let conjSrc = '', conjTgt = '';
    if (card.conj) {
      const cSrc = isFrench() ? card.conj.es : card.conj.fr;
      const cTgt = isFrench() ? card.conj.fr : card.conj.es;
      if (cSrc?.length) conjSrc = '<div class="conj">' + cSrc.join('<br>') + '</div>';
      if (cTgt?.length) conjTgt = '<div class="conj">' + cTgt.join('<br>') + '</div>';
    }

    return '<tr>'
      + '<td style="text-align:center;font-size:1.3rem;width:42px">' + (card.em || '') + '</td>'
      + '<td>' + srcWord + conjSrc + '</td>'
      + '<td>' + tgtWord + conjTgt + '</td>'
      + '</tr>';
  }).join('');

  const html = '<!DOCTYPE html><html lang="' + (isFrench() ? 'es' : 'fr') + '"><head>'
    + '<meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + title + '</title>'
    + _pdfBaseStyles(th)
    + '</head><body>'
    + _pdfHeader(th, title, subtitle)
    + '<table>'
    + '<thead><tr><th>' + hdrEmoji + '</th><th>' + hdrSrc + '</th><th>' + hdrTgt + '</th></tr></thead>'
    + '<tbody>' + rows + '</tbody>'
    + '</table>'
    + _pdfFooter()
    + '</body></html>';

  _pdfOpen(html);
}

/* ─────────────────────────────────────────────────────────
   _exportSituation() — Export PDF du dialogue actif.
   Affiche les bulles en 2 colonnes (locuteur | répliques FR + ES),
   puis le vocabulaire CT.vocab en tableau.
───────────────────────────────────────────────────────── */
function _exportSituation() {
  if (!CT || !CT.situations) { _showToast(L('Sin diálogo disponible.', 'Pas de dialogue disponible.')); return; }
  const th  = _pdfTheme();
  const sit = CT.situations[sitIdx] || CT.situations[0];
  const flagEmojis = { ES:'🇪🇸', MX:'🇲🇽', CO:'🇨🇴', PE:'🇵🇪', VE:'🇻🇪', AR:'🇦🇷', EC:'🇪🇨' };
  const regionFlag = flagEmojis[currentRegion] || '🇪🇸';

  const title    = L(
    '💬 Diálogo — ' + (CT.name || CT.id),
    '💬 Dialogue — ' + (CT.name || CT.id)
  );
  const subtitle = L(
    (sit.label || '') + ' · Situación ' + (sitIdx + 1),
    (sit.label || '') + ' · Situation ' + (sitIdx + 1)
  );

  /* Bulles de dialogue */
  const bubbles = sit.dialogue.map((ln) => {
    const finalEsLine = (ln.variants?.[currentRegion])
      ? ln.variants[currentRegion]
      : _adaptDialogueLine(ln.es);
    const isRight = ln.side === 'right';
    return '<div class="bubble-row">'
      + '<div class="bubble-side">' + (ln.s || '') + '</div>'
      + '<div class="bubble-box' + (isRight ? ' right' : '') + '">'
      + '<div class="bubble-main">' + (isFrench() ? ln.fr : finalEsLine) + '</div>'
      + '<div class="bubble-trans">' + (isFrench() ? finalEsLine : ln.fr) + '</div>'
      + '</div></div>';
  }).join('');

  /* Tableau du lexique vocab (format "ES = FR") */
  let vocabSection = '';
  if (CT.vocab?.length) {
    const vocabTitle = L('📚 Vocabulario de la situación', '📚 Vocabulaire de la situation');
    const hdrSrc = L('Español ' + regionFlag, 'Français 🇫🇷');
    const hdrTgt = L('Francés 🇫🇷', 'Espagnol ' + regionFlag);
    const vocabRows = CT.vocab.map((v) => {
      const parts   = v.split('=');
      const es      = parts[0] ? parts[0].trim() : '';
      const fr      = parts[1] ? parts[1].trim() : '';
      /* Variante régionale dans le lexique */
      let finalEs = es;
      if (CT.words) {
        const match = CT.words.find(w => w.es === es);
        if (match?.variants?.[currentRegion]) finalEs = match.variants[currentRegion];
      }
      const srcWord = L(finalEs, fr);
      const tgtWord = L(fr, finalEs);
      return '<tr><td>' + srcWord + '</td><td>' + tgtWord + '</td></tr>';
    }).join('');
    vocabSection = '<h2>' + vocabTitle + '</h2>'
      + '<table><thead><tr><th>' + hdrSrc + '</th><th>' + hdrTgt + '</th></tr></thead>'
      + '<tbody>' + vocabRows + '</tbody></table>';
  }

  const html = '<!DOCTYPE html><html lang="' + (isFrench() ? 'es' : 'fr') + '"><head>'
    + '<meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + title + '</title>'
    + _pdfBaseStyles(th)
    + '</head><body>'
    + _pdfHeader(th, title, subtitle)
    + '<h2>' + L('Diálogo', 'Dialogue') + '</h2>'
    + '<div>' + bubbles + '</div>'
    + vocabSection
    + _pdfFooter()
    + '</body></html>';

  _pdfOpen(html);
}


/* ════════════════════════════════════════
   ACCESSIBILITÉ CLAVIER — ÉLÉMENTS "BOUTON" NON NATIFS
   Permet d'activer au clavier (Entrée ou Espace) tous les
   éléments portant role="button" + tabindex="0"
   (flashcards, chips vocabulaire, cartes alphabet…).
   :focus-visible côté CSS complète ce mécanisme JS.
════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const target = e.target.closest('[role="button"]');
  if (!target) return;
  e.preventDefault();
  target.click();
});

/* ════════════════════════════════════════
   INITIALISATION DU LAUNCHER
   Branche les clics des cartes de langue
   sur showLauncherVariant() pour afficher
   le sélecteur de variante (Vue B).

   Note sur la stratégie de gestion des événements :
   • Les éléments STATIQUES du DOM (présents dès le chargement de
     index.html, comme les cartes de langue ci-dessous et le bouton
     retour du launcher) utilisent addEventListener() — c'est la
     méthode préférable, car elle permet plusieurs listeners et évite
     les réassignations silencieuses.
   • Les éléments DYNAMIQUES (onglets de leçon, cartes de modules,
     boutons de quiz…) sont générés via innerHTML et utilisent donc
     onclick="..." en attribut HTML — c'est inévitable dans ce
     contexte sans framework, et ce comportement est documenté ici
     pour éviter toute confusion lors de la maintenance.
════════════════════════════════════════ */
const cardFR = document.getElementById('card-learn-french');
if (cardFR) cardFR.addEventListener('click', () => {
  showLauncherVariant('learn_french');
});
const cardES = document.getElementById('card-learn-spain');
if (cardES) cardES.addEventListener('click', () => {
  showLauncherVariant('learn_spain');
});
/* ════════════════════════════════════════
   §21b — VIEWPORT HEIGHT FIX ANDROID
   Sur Android, 100vh inclut la barre de navigation du système,
   ce qui provoque un débordement silencieux. Cette section calcule
   la hauteur réelle du viewport (window.innerHeight) et l'expose
   via la custom property CSS --app-h, utilisée à la place de 100vh
   dans .app, #app-launcher, .screen et .screen.active.
   Trois points d'écoute couvrent :
     • window.resize       — rotation / redimensionnement fenêtre
     • visualViewport      — clavier virtuel Android (Chrome/WebView)
     • touchend + timeout  — cas résiduels où resize ne se déclenche pas
════════════════════════════════════════ */
(function() {
  let _vh_timer = null;

  function _updateAppHeight() {
    document.documentElement.style.setProperty('--app-h', window.innerHeight + 'px');
  }

  function _debounced80() {
    clearTimeout(_vh_timer);
    _vh_timer = setTimeout(_updateAppHeight, 80);
  }

  /* (1) Appel immédiat */
  _updateAppHeight();

  /* (3) Écoute resize classique avec debounce 80 ms */
  window.addEventListener('resize', _debounced80);

  /* (4) Écoute visualViewport (clavier virtuel Android) avec debounce 80 ms */
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', _debounced80);
  }

  /* (5) Fallback touchend avec setTimeout 300 ms */
  window.addEventListener('touchend', () => {
    setTimeout(_updateAppHeight, 300);
  });
})();

/* ════════════════════════════════════════
   §21c — BOUTON D'INSTALLATION PWA NATIVE
   Ajouté le 09/07/2026 (retour testeur bêta Firefox/Android, point 2 :
   installation hors-ligne jugée difficile à trouver/réaliser).

   L'événement 'beforeinstallprompt' est capturé le plus tôt possible par
   un script inline dans index.html (avant même le chargement de ce fichier)
   et stocké sur window._deferredInstallPrompt — voir index.html pour le
   détail. Cette section se contente d'afficher/masquer le(s) bouton(s)
   ".pwa-install-btn" et de déclencher l'invite native au clic.

   Mis à jour le 12/07/2026 (demande utilisateur) : les deux boutons qui
   existaient dans le Guide (§ Hors ligne / Sin conexión) ont été retirés,
   jugés redondants avec celui désormais affiché en tête de l'écran #home
   (#homeInstallBtn). Un seul ".pwa-install-btn" subsiste donc dans
   index.html ; le sélecteur `querySelectorAll` ci-dessous continue de
   fonctionner tel quel (il s'adapte au nombre d'éléments présents).

   IMPORTANT — limites connues, non corrigibles côté app :
     • Firefox (desktop ET Android) ne supporte PAS 'beforeinstallprompt'.
       Aucun événement n'arrivera jamais : le(s) bouton(s) restent masqués
       et l'utilisateur suit la méthode manuelle déjà documentée juste
       en dessous (menu ⋮ → "Ajouter à l'écran d'accueil" sur Firefox
       Android, quand disponible).
     • iOS Safari ne supporte pas non plus cette API — méthode manuelle
       uniquement (🔗 → "Sur l'écran d'accueil"), déjà documentée.
     • Sur Chrome/Edge/Samsung Internet, le bouton n'apparaît que si le
       navigateur juge l'app "installable" (manifest + Service Worker
       valides, ce qui est déjà le cas ici) ET que l'app n'est pas déjà
       installée.
════════════════════════════════════════ */
function _initInstallButtons() {
  function refresh() {
    const show = !!window._deferredInstallPrompt;
    document.querySelectorAll('.pwa-install-btn').forEach((btn) => {
      btn.style.display = show ? '' : 'none';
    });
  }
  window.addEventListener('vachebo:install-available', refresh);
  window.addEventListener('vachebo:install-done', refresh);
  refresh(); // état initial (l'événement a pu se déclencher avant ce point)
}

/**
 * _installPwa() — Déclenche l'invite d'installation native stockée par
 * index.html. Appelée par les boutons ".pwa-install-btn" du Guide.
 */
function _installPwa() {
  const promptEvent = window._deferredInstallPrompt;
  if (!promptEvent) return; // bouton normalement masqué dans ce cas
  promptEvent.prompt();
  promptEvent.userChoice
    .then((choice) => {
      window._deferredInstallPrompt = null;
      document.querySelectorAll('.pwa-install-btn').forEach((btn) => {
        btn.style.display = 'none';
      });
      if (choice && choice.outcome === 'accepted') {
        _showToast(L('✅ App instalada', '✅ Application installée'));
      }
    })
    .catch(() => { /* invite annulée/fermée — pas d'action nécessaire */ });
}

_initInstallButtons();