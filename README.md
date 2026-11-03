# LearniQ Docs

Static documentation site (HTML, CSS, JavaScript). No build step.

## Run locally
Open index.html in a browser, or run `python -m http.server 8000` and visit http://localhost:8000

## Deploy on Netlify
1. Push this folder to a GitHub repo (keep it private).
2. Netlify > Add new site > Import from Git > pick the repo.
3. Build command: leave empty. Publish directory: `.`
4. Every push to GitHub updates the site automatically.

## Add a page
1. Copy an existing page inside 01-overview/ and edit the content.
2. Set a unique data-page value on <body>.
3. Add one line for it in the NAV list in js/main.js.
