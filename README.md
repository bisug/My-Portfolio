# Bisu's Portfolio

A personal portfolio website built with HTML, CSS, and Vanilla JavaScript. Features a custom vintage gold dark theme, typewriter animations, and intersection observer scroll reveals.

## Features
- **Zero Dependencies**: Pure HTML/CSS/JS with no libraries or frameworks.
- **Custom CSS Design System**: Organized using CSS Layers (`@layer`) and BEM-inspired naming conventions.
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop viewports.
- **Performance Focused**: Uses deferred scripts, modern CSS architecture, and intersection observers for lightweight animations.

## Local Setup

No build tools are required!
Simply clone the repository and open `index.html` in your browser.

```bash
git clone https://github.com/bisug/portfolio.git
cd portfolio
# Use a local server if you want, e.g., using Python:
python -m http.server
```

## Structure
- `css/` - Modular CSS files loaded via `@layer`
  - `variables.css` - Design tokens (colors, typography, scale)
  - `reset.css`, `base.css` - Foundation
  - Component specific CSS (`nav.css`, `hero.css`, etc.)
- `js/` - Vanilla Javascript modules
  - `main.js` - Initialization
  - `scroll.js` - Intersection Observers for reveal animations and nav tracking
  - `typewriter.js` - Hero text animation logic

## License
MIT License
