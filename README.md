# Portfolio — Oussama El Menichi

Portfolio interactif d'ingénieur I&C construit avec React, Next/vinext et
Cloudflare Workers.

## Fonctionnalités

- Interface « Control / Signal » responsive et accessible
- Six dossiers projet avec 56 vues techniques
- Galerie clavier et mobile
- API publique des projets : `GET /api/projects`
- État du service : `GET /api/health`
- Formulaire de contact persistant : `POST /api/contact`
- Validation serveur, honeypot et limitation anti-spam
- Base D1 avec migrations Drizzle

## Développement local

```bash
npm install
npm run dev
```

Le site est ensuite disponible sur `http://localhost:3000`.

## Vérification

```bash
npm run lint
npm run build
```

Les documents sont dans `public/docs/` et les images dans
`public/assets/img/`.

La précédente version statique reste disponible dans `legacy-index.html`.
