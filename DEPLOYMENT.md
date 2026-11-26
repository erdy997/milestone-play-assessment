# Deploying for free and making the exhibition QR code

The app is a static website (HTML/JS/CSS only), so it can be hosted free with no backend.

## Option A: GitHub Pages (recommended, automatic)
1. Create a free account at https://github.com and a **new public repository**, e.g. `letzplay-development-check`.
2. Upload this whole folder to the repository (on github.com: *Add file → Upload files*, drag everything **except** `node_modules`, `dist`, `dist-single`; or use `git push`). The `.github/workflows/deploy.yml` file must be included.
3. In the repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
4. Open the **Actions** tab. The "Deploy to GitHub Pages" workflow runs tests, builds and publishes (about 2 minutes). Re-run it from the Actions tab if it started before step 3.
5. Your app is live at `https://<your-username>.github.io/letzplay-development-check/` (the exact link is shown in Settings → Pages and on the workflow run).

Any later change pushed to `main` redeploys automatically.

## Option B: Netlify Drop (no GitHub, 2 minutes)
1. On your computer run `npm install` then `npm run build`.
2. Go to https://app.netlify.com/drop and drag the `dist` folder onto the page.
3. Netlify gives you an `https://….netlify.app` address (create a free account to keep it permanently).

Cloudflare Pages and Vercel also work: build command `npm run build`, output folder `dist`.

## Making the QR code
1. Open your **deployed** link on any device and go to **Admin** (top-right icon).
2. In *Exhibition QR code* paste the public address (must start with `https://`) and tap **Generate QR code**. "Use this page's address" fills it in for you when you are on the deployed site.
3. Tap **Open the URL to test it**, then scan the QR with a phone that is **not** on your Wi-Fi (mobile data) to be sure it works publicly.
4. Tap **Download QR (PNG)** and print it on posters or table cards.

The QR is generated from exactly the URL you typed; the app refuses non-https addresses and warns about local/private addresses (localhost, 192.168.x.x…) that phones at the venue cannot open.

## Exhibition tips
- Each phone/tablet keeps its own data. Parents using their own phones keep their own results; the Admin page on your tablet only shows screenings done on that tablet.
- On a shared tablet, set an admin PIN the first time you open Admin, export CSV at the end of the day, then use **Delete All Data**.
- After the page has loaded once, it works without internet except for reloading. For fully offline kiosks, use `npm run build:single` and open `dist-single/index.html`.
