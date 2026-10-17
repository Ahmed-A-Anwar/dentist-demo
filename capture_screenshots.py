"""Capture full-page screenshots at 375 / 768 / 1440 and report layout diagnostics."""
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = Path(__file__).resolve().parent
OUT = BASE / "screenshots"
OUT.mkdir(exist_ok=True)
URL = (BASE / "index.html").as_uri()

SIZES = [(375, 812), (768, 1024), (1440, 900)]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for width, height in SIZES:
        page = browser.new_page(viewport={"width": width, "height": height})
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(URL)
        page.wait_for_load_state("networkidle")
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(300)

        diag = page.evaluate(
            """() => {
              const de = document.documentElement;
              const overflowing = [...document.querySelectorAll('body *')]
                .filter(el => el.getBoundingClientRect().right > window.innerWidth + 1)
                .map(el => el.tagName.toLowerCase() + '.' + ((el.className.baseVal ?? el.className) || ''));
              const h1 = document.querySelector('h1');
              return {
                scrollWidth: de.scrollWidth,
                innerWidth: window.innerWidth,
                pageHeight: de.scrollHeight,
                overflowing: overflowing.slice(0, 8),
                h1Font: getComputedStyle(h1).fontFamily,
                bodyFont: getComputedStyle(document.body).fontFamily,
                playfairLoaded: document.fonts.check('600 40px "Playfair Display"'),
                interLoaded: document.fonts.check('400 16px "Inter"'),
                navVisible: getComputedStyle(document.querySelector('#site-nav')).display,
                heroArtW: Math.round(document.querySelector('.hero-art svg').getBoundingClientRect().width),
              };
            }"""
        )
        shot = OUT / f"{width}.png"
        page.screenshot(path=str(shot), full_page=True)
        print(f"--- {width}x{height} -> {shot.name}")
        print("   ", diag)
        print("    console errors:", errors or "none")
        page.close()

    # Interaction checks at 375
    page = browser.new_page(viewport={"width": 375, "height": 812})
    page.goto(URL)
    page.wait_for_load_state("networkidle")

    page.click(".nav-toggle")
    menu_state = {
        "aria-expanded": page.get_attribute(".nav-toggle", "aria-expanded"),
        "nav-display": page.eval_on_selector("#site-nav", "el => getComputedStyle(el).display"),
    }
    page.screenshot(path=str(OUT / "375-menu-open.png"))
    page.keyboard.press("Escape")
    menu_state["after-escape"] = page.get_attribute(".nav-toggle", "aria-expanded")

    page.fill("#name", "Mona")
    page.fill("#phone", "0100 000 0000")
    page.click("button[type=submit]")
    form_state = {
        "form-hidden": page.is_hidden("#callback-form"),
        "note": page.inner_text("#form-note"),
    }
    page.screenshot(path=str(OUT / "375-form-submitted.png"), full_page=True)
    print("--- menu:", menu_state)
    print("--- form:", form_state)
    page.close()
    browser.close()
