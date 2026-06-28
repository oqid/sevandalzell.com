# sevandalzell.com — site source

Plain HTML/CSS/JS. No build step, no framework — edit the files directly
and push. Structure:

```
index.html      page structure (loader, nav, the 4 panels)
style.css       all design tokens + layout + animation
script.js       loader sequence, pan navigation, portfolio render, lightbox
assets/         your images/video — see README.txt in each subfolder
CNAME           tells GitHub Pages to serve this at sevandalzell.com
```

---

## 1. Create the GitHub repo

1. Go to github.com and sign in (make an account first if you don't have one).
2. Click the **+** in the top right → **New repository**.
3. Name it `sevandalzell.com` (name doesn't actually matter, but this is
   tidy). Leave it **Public**. Don't tick "add a README" — we already have one.
4. Click **Create repository**. GitHub will show you a page with setup
   commands — keep that tab open.

## 2. Push these files to it

Open a terminal in this project folder and run:

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sevandalzell.com.git
git push -u origin main
```

(Swap in your actual GitHub username and repo name. GitHub will prompt you
to log in the first time — either via browser popup or a personal access
token, depending on how your git is set up.)

## 3. Turn on GitHub Pages

1. In your repo on github.com, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`. Click **Save**.
4. Under **Custom domain**, type `sevandalzell.com` and click **Save**.
   (This actually rewrites the CNAME file in your repo for you — the one
   already included here does the same thing, so you're covered either way.)
5. GitHub will show "DNS check unsuccessful" for now — that's expected,
   we haven't pointed the domain at it yet. That's step 4.

## 4. Point your Porkbun domain at GitHub

In a new tab, log into **porkbun.com** → your domain → **DNS** (or "DNS
Records").

Delete any existing `A`, `ALIAS`, or `CNAME` records on the root domain
and `www`, then add these:

**Four A records** (root domain, host field blank or `@`), one record per IP:

| Type | Host | Answer          |
|------|------|------------------|
| A    |      | 185.199.108.153  |
| A    |      | 185.199.109.153  |
| A    |      | 185.199.110.153  |
| A    |      | 185.199.111.153  |

**One CNAME record** for the `www` subdomain:

| Type  | Host | Answer                    |
|-------|------|---------------------------|
| CNAME | www  | YOUR-USERNAME.github.io   |

Save. DNS changes can take anywhere from a few minutes to a few hours to
propagate (Porkbun is usually fast — often under 30 min).

## 5. Confirm

Back in GitHub **Settings → Pages**, once DNS has propagated it'll flip to
"DNS check successful" and you can tick **Enforce HTTPS**. Then
`https://sevandalzell.com` should load the site.

---

## Editing later

- **Portfolio projects**: edit the `PROJECTS` array near the top of
  `script.js` — title, description, tags, and the media file path.
- **Photography grid**: drop images into `assets/photography/` and swap
  the placeholder `<figure>` blocks in `index.html` for real `<img>` tags
  (see `assets/photography/README.txt`).
- **Copy on home/about**: just edit the text directly in `index.html`.
- **Colours/font**: all defined as CSS variables at the top of `style.css`
  under `:root` — change `--linen`, `--ink`, `--accent` there and the
  whole site updates. The font is currently Space Mono (close stand-in
  for Autocode); swap the Google Fonts `<link>` in `index.html` and the
  `--mono` variable in `style.css` if you get hold of the real font file.

Every time you want to update the live site, it's just:

```bash
git add .
git commit -m "describe what changed"
git push
```

GitHub Pages rebuilds automatically within a minute or two of a push.
