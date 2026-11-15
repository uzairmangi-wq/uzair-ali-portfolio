# Uzair Ali — Portfolio

Personal portfolio of Uzair Ali: Computer Science student at SZABIST Larkana, two-time academic merit holder, university competition achiever and aspiring cybersecurity professional.

Plain HTML, CSS and JavaScript with GSAP, ScrollTrigger and Lenis (bundled in `assets/vendor`, no CDN). White, pink and lavender theme with scroll-linked animation. No build step. Works on GitHub Pages.

Animations are simplified on small screens and switched off when the visitor prefers reduced motion.

## Structure
```
index.html
assets/css/style.css
assets/js/main.js
assets/vendor/ (gsap.min.js, ScrollTrigger.min.js, lenis.min.js)
assets/img/uzair-ali.jpg, uzair-ali.webp, favicon.svg
assets/Uzair-Ali-CV.pdf
```

## Run locally
```
python3 -m http.server 8000
```
Open http://localhost:8000

## Deploy on GitHub Pages
1. Sign in at github.com as `uzairmangi-wq`. Click **+** > **New repository**.
2. Name it `uzair-ali-portfolio`, set it to **Public**, add the description from your brief, leave README/.gitignore unticked, and click **Create repository**.
3. On the empty repository page choose **uploading an existing file**. Unzip this project and drag the *contents* (index.html, README.md, the `assets` folder) into the page so `index.html` sits at the repository root. Write a commit message and click **Commit changes**.
4. Go to **Settings > Pages**. Under **Build and deployment** set Source to **Deploy from a branch**, Branch **main**, folder **/ (root)**, then **Save**.
5. Wait 1 to 3 minutes. The address appears at the top of the Pages screen: `https://uzairmangi-wq.github.io/uzair-ali-portfolio/`.
6. Test the live site: check the photo loads, every nav link scrolls, the mobile menu opens, **Download CV** downloads a PDF, and the email, GitHub and LinkedIn links open correctly.

Your existing repository `uzairmangi-portfolio` is not touched by any of this.

## Editing
- Text and projects: `index.html`
- Colors and layout: variables at the top of `assets/css/style.css`
- CV: replace `assets/Uzair-Ali-CV.pdf` (keep the file name)
- Add a project repository link by adding an `<a>` inside that project card once the repo is public.

## CV source
`cv-source/` holds the HTML used to produce `assets/Uzair-Ali-CV.pdf` (same fonts and colors as the site). Edit `cv.html`, print it to A4 PDF with backgrounds enabled, and replace the PDF in `assets/` keeping the same file name.
