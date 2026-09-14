# Moodsk Website

Public marketing site for [Moodsk](https://github.com/Ajigu-Studio/FolderArt), a macOS
file & folder icon editor. Single-page, plain HTML/CSS/JS — no build step.

Live on GitHub Pages: <https://ajigu-studio.github.io/moodsk-website/>

## Structure

- `index.html` — the landing page (zh-Hans primary copy, English section eyebrows)
- `styles.css` — design system; paper-cut sticker aesthetic matching the app icon
- `main.js` — sticky nav background and scroll-reveal animations
- `assets/` — app icon, favicon, real app screenshots (`assets/screens/`), and cropped pack/sticker art used as decoration

## Updating screenshots

Screenshots are captured from the running app with `screencapture -x -o -l <windowID>` and
compressed to JPEG (quality ~82). Replace the files under `assets/screens/` keeping the same
names when the UI changes.

## App Store link

The download buttons currently point to `#` / `#download`. Replace the `href` of the
`.btn-primary` CTA anchors in `index.html` (nav, hero, and download section) with the real
App Store URL once it is available.

## Preview locally

```sh
python3 -m http.server 8080
# open http://localhost:8080
```

Any static host works; all asset paths are relative, so the site also serves fine from a
subpath (e.g. GitHub Pages project sites).
