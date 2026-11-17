# À faire / à suivre

## Avant la mise en ligne

- [ ] **Mentions légales** : compléter les valeurs `[To be completed]` dans `app/legal-notice/page.tsx`
      (statut juridique, adresse, téléphone, SIRET, TVA, médiateur de la consommation).
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

## À voir avec la cliente

- [ ] **Marques déposées** : des produits portent des noms de personnages protégés (« Bugs Bunny » — Warner Bros,
      « Ariel » — Disney, à vérifier aussi pour « Black Panther »). Risque de demande de retrait ou de litige :
      envisager de les renommer.
- [ ] « Bon à petit » : jeu de mots volontaire ou faute de frappe pour « Bon appétit » ?

## Catalogue Shopify (plus tard)

- [ ] Les handles des tirages ne correspondent pas à leurs titres : `/products/n-125` affiche « N°121 »,
      `n-124` → N°120, `n-123` → N°119, `n-122` → N°118. Corriger le handle dans Shopify
      en cochant « Créer une redirection URL ».
- [x] Handle du hoodie renommé en `oversized-hoodie-n-51` (redirection de l’ancienne URL dans `next.config.ts`).
- [ ] Importer des images produit en plus haute résolution (au moins 1200 px de large) : certaines font environ 580 px
      et paraissent floues sur écran Retina.
