# Licences

Third-party components in this project and where they come from.

## Animation: no library added

Scroll reveal and hover effects are hand-written: a small
IntersectionObserver in `script.js` (about 20 lines, browser API) plus CSS
transitions and keyframes in `styles.css`. Chosen per the
ui-animation-sourcing checklist, where pure CSS / own IntersectionObserver is
the lightest option: AOS (MIT, about 14 KB gzipped) or GSAP (about 23 KB
gzipped) would add page weight for two simple effects on a local business
site. Nothing for motion is loaded from a CDN, so no `vendor/` directory is
needed and there is nothing external to pin.

## Fonts

Loaded from Google Fonts (not yet self-hosted):

| Component | Version | Licence | Source | Added |
| --- | --- | --- | --- | --- |
| Inter (400, 500, 600) | via Google Fonts CSS2 API | SIL Open Font License 1.1 | https://github.com/rsms/inter | 2026-10-17 |
| Playfair Display (500, 600) | via Google Fonts CSS2 API | SIL Open Font License 1.1 | https://github.com/clauseggers/Playfair | 2026-10-17 |

## Site code

All other HTML, CSS and JavaScript in this repository is original work.
