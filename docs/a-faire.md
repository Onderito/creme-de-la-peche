# À faire / à suivre

## Avant la mise en ligne

- [x] **Mentions légales** : statut, adresse du siège, SIRET, téléphone et n° de TVA remplis.
- [x] **Adresse** : siège du 52 rue du Commerce retenu pour les mentions légales.
- [ ] **Politique de livraison** : la rédiger dans l’admin Shopify (Paramètres → Politiques → Politique d’expédition).
      Le lien « Shipping » apparaît automatiquement dans le footer dès qu’elle est remplie (cache d’environ 1 h).

## En dernier : domaine et compte client (à faire ensemble)

- [ ] **SITE_URL** : `SITE_URL=https://cremedelapeche.shop` dans les variables Production de Vercel.
- [ ] **Bascule du domaine** : faire pointer `cremedelapeche.shop` vers Vercel (le site Next). Côté Shopify, ajouter
      un sous-domaine (ex. `checkout.cremedelapeche.shop`) et le définir comme domaine principal : sinon l’URL de
      checkout renvoyée par Shopify pointera vers le site Next et le paiement cassera. Tester un checkout complet après.
- [ ] **Lien « Account »** : une fois le domaine basculé, `cremedelapeche.shop/account` n’existera plus côté Shopify.
      Récupérer l’URL du compte client Shopify (Admin → Paramètres → Comptes clients, ex. `shopify.com/<id>/account`)
      et remplacer `shopUrl/account` dans `app/components/site-header.tsx` et `app/components/site-footer.tsx`.
- [ ] **Google Search Console** (compte Google de la cliente) :
      1. Vérifier si une propriété existe déjà (ancienne boutique Shopify).
      2. Sinon, ajouter une propriété « Domaine » `cremedelapeche.shop` et coller l’enregistrement TXT fourni par
         Google dans les DNS Shopify (peut être fait dès maintenant, sans impact sur le site ni les mails).
      3. Après la bascule du domaine : menu Sitemaps → envoyer `sitemap.xml`.
      4. Demander à la cliente de m’ajouter dans Paramètres → Utilisateurs et autorisations (accès « Total »).

## À voir avec la cliente

- [x] **Marques déposées** (Bugs Bunny, Ariel, Black Panther) : signalé. La cliente vendait déjà ces pièces avant la
      refonte ; décision qui lui revient.
- [x] « Bon à petit » : nom volontaire, on garde.

## Catalogue Shopify (vérifié le 18/11/2026, 309 produits)

- [ ] **Handles décalés (optionnel, cosmétique)** : environ 110 tirages ont un numéro d'URL décalé par rapport au titre
      (ex. `n-125` → « N°121 », de `n-9` → « N°8 » jusqu'à `n-125`). Sans impact pour les clients ; à laisser tel quel,
      les URL sont déjà connues de Google.
- [ ] **Handles trompeurs (optionnel)** : URL qui portent le nom d'un autre produit :
      `marylin-monroe-1` (« Cindrella »), `cindrella-kopie` (« Mona Lisa x Boobs »), `marylin-monroe-3`
      (« Warrior with tattoos »), `travis-barker-tee-1` (« Grateful tee »), `copy-of-hoodie-x-marylin-monroe`
      (« Hoodie x Mac Miller »), `copy-of-oversized-rihanna-hoodie` (« Oversized hoodie looneytunes »),
      `copy-of-oversize-hoodie-n-52` (« Oversized hoodie x Angel »). Si renommés dans Shopify, ajouter la redirection
      de l'ancienne URL dans `next.config.ts`.
- [x] Handle du hoodie N°51 renommé en `oversized-hoodie-n-51` (redirection dans `next.config.ts`).
- [x] **Photos** : résolution correcte (2048 px et plus pour vêtements et tirages, environ 1170 px pour les originaux).
      Seule `cindrella-3` est faible (793 px).

## Mis de côté

- [ ] **TVA à confirmer** : le n° FR06903155455 vient de Pappers, qui le calcule à partir du SIREN. Faire confirmer à
      la cliente qu'elle est bien assujettie à la TVA ; si elle est en franchise, remplacer par
      « VAT not applicable, art. 293 B of the French CGI ».
- [ ] **Médiateur de la consommation** (obligatoire pour la vente aux particuliers) : la cliente n'en a pas encore.
      Une fois inscrite, renseigner `mediator` dans `app/legal-notice/page.tsx` : la section s'affichera toute seule.
