# Krushi Patel — Portfolio (React + Vite)

Scroll-animated portfolio: React, GSAP (ScrollTrigger + SplitText), Lenis smooth scroll, Three.js hero,
3 themes (Ember, Emerald, Sand) and a contact form that saves messages in MongoDB.

## Run locally
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production build in dist/

## Put your own content
Everything (text, projects, skills, links) is in `src/data.js`.
For each project replace `live:` and `code:` with your real Vercel / Firebase / GitHub link.

## Deploy on Vercel (easiest)
1. Upload this folder to a GitHub repo (without node_modules).
2. vercel.com > Add New Project > import the repo > Deploy. Nothing else to configure.
3. Contact form (optional): create a free MongoDB Atlas cluster, then in Vercel > Settings > Environment Variables add
   MONGODB_URI (your connection string) and MONGODB_DB (e.g. portfolio). Redeploy.
   Messages are stored in the `messages` collection. Without these, the form shows an "email me directly" fallback.

Firebase Hosting also works for the site itself (npm run build, then host the dist folder), but the
/api/contact form needs Vercel (or any Node host).

## Themes
Click the small colour pill in the navbar to switch Ember / Emerald / Sand. Colours live at the top of `src/styles.css`.
