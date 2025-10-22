This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Détails :

Sur le projet, il y a 2 branches, une branche old_version où l'on peut trouver mes premiers travaux et une branche main où j'ai instancié un serveur node qui sert mon application front.
J'ai dû passer par un serveur node afin d'ajouter la partie configuration (conf.json) que je n'arrivais pas à faire en JS natif.

## Commencer à utiliser le projet :

Premièrement, lancer le serveur de développement :

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Énoncé du brief

### Scénario
Vous êtes développeur web pour le compte d’une agence web. Votre agence a signé un contrat pour le développement d’interfaces météo à destination des usagers du réseau de transport en commun de plusieurs villes de taille moyenne en France. Les écrans seront intégrés aux écrans d’information dans les stations et dans les transports.
Les écrans doivent être programmés avec les technologies web, embarquées dans la webview du système des écrans de la compagnie de transports en commun de la ville.
L’interface ne doit pas inclure de moteur de recherche pour la localisation de l’information météo.
Mais, elle doit inclure un fichier de configuration (JSON par exemple) dans lequel l’information de la ville concernée sera entrée par l’entreprise de transport, et utilisée par votre code pour récupérer les bonnes données météo.

Développer l'application
    Chercher et choisir une API ouverte : OpenWeather
    Créer les différents fichiers nécessaires :
        Fichier HTML (index.html)
        Fichier CSS (style.css)
        Fichier de configuration de la ville (conf.json)
        Fichier Javascript (meteo.js)
    Programmer une récupération des données via l'API
    Déboguer en console afin de valider la procédure
    Intégrer une interface d'affichage de données météo
    Intégrer la mise à jour des données météo toutes les heures

Copyright Orane MERTZ
