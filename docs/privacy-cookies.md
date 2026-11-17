# Cookies du front custom — état au 17 novembre 2026

## Cookie identifié dans le code

| Nom | Finalité | Durée maximale | Attributs |
| --- | --- | --- | --- |
| `cdlp_cart` | Conserver l’identifiant du panier Shopify entre les visites et retrouver la sélection | 7 jours à partir de son écriture | HttpOnly, SameSite=Lax, Secure en production, chemin `/` |

Il est écrit par les actions du panier. Il n’est pas utilisé pour de la publicité
ou de la mesure d’audience. Aucun outil analytics, pixel publicitaire ou autre
stockage de suivi n’a été trouvé dans le code du front lors de cette vérification.
Cela ne constitue pas un inventaire des cookies du checkout et du compte client
hébergés séparément chez Shopify, ni de ceux d’un futur hébergeur.

## Information affichée dans le front

Les politiques du front sont synchronisées depuis Shopify. Une section technique
« Cookies on this storefront » est ajoutée sur la page de confidentialité du front.
Sa durée vient de la même constante que le cookie pour éviter toute divergence.
Le contenu source enregistré chez Shopify reste inchangé. Le passage ci-dessous
peut également être repris dans sa politique Shopify.

> Our custom storefront uses a cookie named `cdlp_cart` to remember your Shopify
> shopping cart and retrieve your selection when you return. It stores a cart
> identifier and is kept for up to 7 days. This cookie is necessary to provide the
> shopping cart you request; it is not used for advertising or audience measurement.
> Shopify may use additional cookies on its hosted checkout and customer account
> pages, as described in the relevant privacy information.

La CNIL cite les traceurs conservant le contenu d’un panier parmi ceux exemptés
de consentement, sous réserve qu’ils restent strictement nécessaires à cette
finalité. Une information reste à fournir aux visiteurs. L’ajout futur de traceurs
non essentiels nécessitera de réévaluer le mécanisme de consentement avant de
les activer.

Source : https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi

La durée de 7 jours est un choix de conception pour cette boutique, pas une durée
imposée par la CNIL ni une garantie de sécurité. L’expiration du cookie dans le
navigateur ne supprime pas à elle seule le panier enregistré chez Shopify.
