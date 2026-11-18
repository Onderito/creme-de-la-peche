# À faire / à suivre

## Avant la mise en ligne

- [x] **Mentions légales** : statut, adresse du siège, SIRET, téléphone et n° de TVA remplis.
- [ ] **Médiateur de la consommation** (obligatoire pour la vente aux particuliers) : la cliente n'en a pas encore.
      Une fois inscrite, renseigner `mediator` dans `app/legal-notice/page.tsx` : la section s'affichera toute seule.
- [ ] **TVA à confirmer** : le n° FR06903155455 vient de Pappers, qui le calcule à partir du SIREN. Faire confirmer à
      la cliente qu'elle est bien assujettie à la TVA ; si elle est en franchise, remplacer par
      « VAT not applicable, art. 293 B of the French CGI ».
- [ ] **Adresse** : le siège déclaré (52 rue du Commerce) diffère de l'adresse de la boutique dans Shopify
      (31 rue Alphonse Baudin). Si elle a déménagé, elle doit mettre à jour son immatriculation (guichet unique INPI).
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
- [ ] « Bon à petit » : jeu de mots volontaire ou faute de frappe pour « Bon appétit » ?

## Catalogue Shopify (plus tard)

- [ ] Les handles des tirages ne correspondent pas à leurs titres : `/products/n-125` affiche « N°121 »,
      `n-124` → N°120, `n-123` → N°119, `n-122` → N°118. Corriger le handle dans Shopify
      en cochant « Créer une redirection URL ».
- [x] Handle du hoodie renommé en `oversized-hoodie-n-51` (redirection de l’ancienne URL dans `next.config.ts`).
- [ ] Importer des images produit en plus haute résolution (au moins 1200 px de large) : certaines font environ 580 px
      et paraissent floues sur écran Retina.
