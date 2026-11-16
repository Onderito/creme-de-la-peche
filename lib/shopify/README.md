# Organisation de l’intégration Shopify

## État actuel

Le client Storefront et la lecture du catalogue sont implémentés : produits et
collections par handle ou ID, listes paginées, variantes, images et règles de
quantité. Les données proviennent de la boutique Shopify existante ; elles ne
sont pas dupliquées dans une base locale.

Le panier Storefront est implémenté sur `/cart` : création à l’ajout d’un article,
lecture paginée sans cache, modification des quantités et suppression. Son ID
complet reste dans un cookie HttpOnly ; les prix affichés viennent de Shopify.
Les actions valident les variantes et règles de quantité, puis relisent le panier.
Les erreurs et ajustements Shopify sont présentés dans l’interface.

`POST /api/checkout` vérifie l’origine, relit le panier et redirige vers le
`checkoutUrl` fourni par Shopify. Le paiement et la connexion restent hébergés
chez Shopify. Seul l’en-tête IP réécrit par Vercel est utilisé sur cet hébergeur.
Sur les autres hébergeurs, aucune IP provenant d’un en-tête arbitraire n’est transmise.

Une route `GET /api/shopify/check` permet de vérifier les services en développement.
Elle renvoie HTTP 404 en production. Aucun produit, stock ou commande n’est
modifié par cette route de diagnostic.

L’accueil, le panier et les fiches `/products/[handle]` partagent le header et le
footer. Les cartes produit de l’accueil et du panier ouvrent les fiches locales.
Les fiches affichent les images, options, prix de variante et descriptions du
catalogue. Le HTML marchand est assaini côté serveur ; les tableaux de mesures
restent accessibles dans un volet dédié. Les quantités ajoutées sont validées
avec les règles Shopify.

Les produits de la collection Shopify `creme-de-la-peche` (original artworks)
sont limités à un exemplaire par produit, toutes variantes confondues. Le sélecteur
de quantité est masqué sur leurs fiches et dans le panier. Répéter un ajout ouvre
le panier existant sans incrémenter la quantité ; les actions et le checkout
vérifient aussi cette limite. Les prints et vêtements conservent les quantités.

Quatre suggestions disponibles sont tirées au hasard à chaque requête de fiche,
sans doublons ni produit courant, depuis le catalogue paginé mis en cache.
Les collections de la boutique historique restent des liens externes : leur
panier de thème est distinct du panier Storefront de ce site.

## Arborescence

```text
app/
├── actions/
│   └── cart-actions.ts            # Entrées serveur des futurs formulaires
└── api/
    ├── checkout/
    │   └── route.ts              # Future redirection serveur vers Shopify
    └── shopify/check/
        └── route.ts              # Diagnostic catalogue en développement seulement

lib/shopify/
├── shopify-config.ts              # Domaine, jeton privé et version d’API
├── storefront-client.ts           # Transport GraphQL et erreurs HTTP / GraphQL
├── storefront-errors.ts           # Erreurs sans corps HTTP ni secrets
├── types/
│   ├── storefront-types.ts        # Réponses GraphQL, pagination et montants
│   ├── product-types.ts           # Produits, options et variantes
│   ├── collection-types.ts        # Collections et leurs produits
│   └── cart-types.ts              # Panier, lignes, erreurs et warnings
├── graphql/
│   ├── catalog-fragments.ts       # Champs communs du catalogue
│   ├── product-queries.ts         # Produits par handle / ID et pagination
│   ├── collection-queries.ts      # Collections par handle / ID et pagination
│   ├── cart-fragments.ts          # Champs du panier
│   ├── cart-queries.ts            # Relecture et pagination du panier
│   └── cart-mutations.ts          # Création, ajout, modification, suppression
├── catalog/
│   ├── catalog-inputs.ts          # Validation des identifiants, pages et marchés
│   ├── catalog-pagination.ts      # Collecte complète et détection des boucles
│   ├── product-service.ts         # Fonctions catalogue et cache
│   └── collection-service.ts      # Fonctions collections et cache
├── cart/
│   ├── cart-service.ts            # Logique du panier sans cache
│   └── cart-cookie.ts             # Persistance HttpOnly du seul cartId complet
├── checkout/
│   └── checkout-service.ts        # Panier frais et checkoutUrl
└── request/
    └── buyer-ip.ts                # Contexte IP de l’acheteur
```

## Règles de séparation

- Les fichiers `graphql/` contiendront uniquement les documents GraphQL.
- Les services utiliseront le client centralisé et les documents GraphQL.
- Les actions et routes valideront les entrées et géreront le contexte HTTP.
- Les futurs composants utiliseront les données et actions, jamais le token privé.
- Les types restent partageables sans importer de code serveur.
- Les modules qui accéderont à Shopify ou aux cookies sont marqués `server-only`.
- Le catalogue utilise `use cache` et `cacheLife` : `stale: 60`, `revalidate: 60`,
  `expire: 300` (secondes). Les contextes pays/langue et la pagination font partie
  des clés de cache. Les tags sont `shopify:catalog`, `shopify:products` et
  `shopify:collections`, pour une future invalidation à la demande.
- Le transport utilise toujours `cache: no-store`. Les paniers, les adresses IP
  et les données clients ne doivent jamais passer par les fonctions catalogue.
- `getProduct` résout toutes les pages d’images et de variantes. Les listes de
  produits et de collections renvoient `pageInfo` pour que le futur front choisisse
  sa pagination. Les lignes du futur panier devront aussi être paginées.
- Les prix et règles de quantité proviendront de Shopify.
- Le cartId restera complet, y compris sa clé, uniquement dans le cookie HttpOnly
  et le code serveur. Les actions ne l’exposeront pas aux composants clients.

## Ordre d’implémentation prévu

1. Configuration, types partagés et client GraphQL centralisé.
2. Catalogue : fragments, produits, collections, pagination et cache.
3. Contexte acheteur et cookie du panier.
4. Requêtes et mutations du panier, récupération après expiration,
   relecture après mutation, erreurs et warnings.
5. Actions serveur et route du checkout.
6. Composants et pages après définition des maquettes.

La version stable vérifiée le 11 novembre 2026 est `2026-10` ; elle est centralisée
dans `shopify-config.ts`. La revérifier lors des futures mises à jour. Shopify
exige des requêtes distinctes par handle et par ID : envoyer les deux arguments,
même avec une valeur `null`, provoque une erreur de validation.

Relire les guides locaux de Next.js dans `node_modules/next/dist/docs/` avant les
prochaines modifications. Le projet active `cacheComponents` et `partialPrefetching`.

## Services disponibles

Tous s’importent depuis le code serveur, jamais dans un composant `use client` :

- `getProducts(pagination?, context?)` : une page de produits résumés.
- `getProduct({ handle } | { id }, context?)` : une fiche complète ou `null`.
- `getCollections(pagination?, context?)` : une page de collections.
- `getCollection({ handle } | { id }, context?)` : une collection ou `null`.
- `getCollectionProducts({ handle } | { id }, pagination?, context?)` : une
  collection et une page de ses produits, ou `null`.

`pagination` accepte `first` (1–250, 24 par défaut) et `after` (curseur opaque).
`context` accepte les codes Shopify `country` et `language`, par exemple `FR`.
Sans contexte explicite, les réglages par défaut de la boutique s’appliquent.
Les montants restent des chaînes décimales associées à une devise.

Les entrées sont validées avant la frontière de cache. Le client lève un
`StorefrontError` typé pour les erreurs de configuration, transport, HTTP et
GraphQL. Les données partielles GraphQL sont rejetées. Après sérialisation par
le cache Next.js, le prototype et les propriétés personnalisées d’une erreur
peuvent être perdus ; le diagnostic utilise alors une réponse amont générique 502.

## Vérifier en local sans front

Lancer `npm run dev`, puis ouvrir :

```text
http://localhost:3000/api/shopify/check
http://localhost:3000/api/shopify/check?resource=products&first=3
http://localhost:3000/api/shopify/check?collection=shop&first=3
http://localhost:3000/api/shopify/check?collection=creme-de-la-peche&first=3
```

Les handles ci-dessus sont uniquement des exemples de diagnostic. Aucun produit,
prix ou identifiant de variante n’est codé en dur dans les services.

Paramètres supplémentaires :

- `product` ou `productId` : fiche complète par handle ou ID.
- `collection` ou `collectionId` : collection et produits paginés.
- `metadataOnly=true` : uniquement les métadonnées de la collection.
- `resource=products` ou `resource=collections` : liste à paginer.
- `first`, `after`, `country`, `language` : pagination et contexte explicites.

Une seule ressource/identification est acceptée à la fois. Pour paginer une liste,
réutiliser son propre `pageInfo.endCursor` avec le paramètre `after`. Un curseur
de produits ne doit pas être réutilisé pour les collections.

Les réponses du diagnostic portent `Cache-Control: no-store`. Les données privées
et le jeton ne sont pas renvoyés. La route n’existe fonctionnellement qu’en mode
développement ; ne pas l’utiliser comme API publique du futur front.

## Vérifications

```sh
npm run lint
npm run test:shopify
npx next typegen
npx tsc --noEmit
npm run build
```

Les tests unitaires utilisent des réponses simulées et aucun identifiant réel.
Ils vérifient notamment l’absence de fuite du jeton, les erreurs HTTP/GraphQL,
la transmission optionnelle d’une IP valide et les erreurs de pagination.

La route de diagnostic permet en plus de vérifier les services avec la vraie
boutique : lecture par handle et ID, pagination, variantes et images. Ces lectures
ne créent ni panier ni commande et ne modifient pas le catalogue.

## Variables d’environnement

Les valeurs sont à conserver dans `.env.local`, ignoré par Git :

- `SHOPIFY_STORE_DOMAIN` : domaine permanent `*.myshopify.com`.
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` : jeton **privé** Storefront envoyé dans
  `Shopify-Storefront-Private-Token`. Aucun préfixe `NEXT_PUBLIC_`.

Les variables `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID` et `NEXT_SITE_URL` sont
réservées à une éventuelle intégration de la Customer Account API moderne.
L’espace client ne fait pas partie de ce squelette ; un achat en invité n’en
dépend pas si les réglages de la boutique l’autorisent.

## À examiner avant la mise en ligne

- Publication des produits et collections sur le canal Headless.
- Applications qui ajoutent des fonctions au thème actuel.
- Conservation des URL existantes et redirections SEO nécessaires.
- Marchés, devises, langue et cohérence du contexte entre catalogue et panier.
- Suivi des conversions et consentement.
- Parcours panier → checkout Shopify, livraison, réductions et paiement.
- Bascule du domaine uniquement lorsque le storefront est prêt et validé.

## Références

- [Storefront API et jetons](https://shopify.dev/docs/storefronts/headless/overview)
- [Produit par handle ou ID](https://shopify.dev/docs/api/storefront/latest/queries/product)
- [Gestion du panier](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage)
- [Règles de quantité](https://shopify.dev/docs/api/storefront/latest/objects/QuantityRule)
