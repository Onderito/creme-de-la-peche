# SEO et politiques de la boutique

## Domaine de référence

`SITE_URL` définit l’origine utilisée pour les URL canoniques, le sitemap et les
partages. Par défaut : `https://cremedelapeche.shop`. À adapter au déploiement si
le domaine final change. Ne pas utiliser l’URL temporaire d’une preview.

L’indexation est autorisée en production et désactivée en développement ainsi
que sur les previews Vercel (`VERCEL_ENV=preview`). Le panier reste en noindex.

## Contenu SEO

- Titres, descriptions, URL canoniques et balises Open Graph/Twitter sur
  l’accueil, les collections, les produits et les politiques.
- Les pages de pagination ont une URL canonique propre.
- Les anciennes URL artworks et les URL produit sous une collection redirigent
  de manière permanente vers leurs équivalents du front custom.
- `/opengraph-image` génère l’aperçu de marque ; chaque produit partage sa photo
  Shopify, convertie par le CDN en JPEG pour les robots sociaux.
- `/sitemap.xml` inclut l’accueil, les trois collections, tous les produits
  publiés dans le canal Storefront (pagination complète) et les trois politiques.
- Les prix et disponibilités des données structurées Product viennent des
  variantes Shopify. Aucun avis ni note n’est inventé.

## Politiques vérifiées le 17 novembre 2026

Pages publiques existantes avec contenu :

- https://cremedelapeche.shop/policies/refund-policy
- https://cremedelapeche.shop/policies/privacy-policy
- https://cremedelapeche.shop/policies/terms-of-service

Elles sont affichées aux mêmes chemins dans le front custom, à partir du contenu
Shopify Storefront (`shop.refundPolicy`, `privacyPolicy`, `termsOfService`), avec
cache et assainissement du HTML. Le contenu marchand n’est pas réécrit. La page
de confidentialité ajoute une section technique sur le cookie du front, dont la
durée est partagée avec le code du panier.

`/policies/shipping-policy` et `/policies/legal-notice` renvoient 200 sur l’ancien
site mais leur contenu est vide. Elles ne sont donc pas proposées dans le footer.
La page `/policies/contact-information` renvoie 404.

Après mise en ligne : soumettre le sitemap dans la Search Console du domaine et
vérifier une fiche avec Google Rich Results Test sur l’URL publique définitive.
