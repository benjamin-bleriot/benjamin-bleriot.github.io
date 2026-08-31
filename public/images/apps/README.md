# App assets

Create one directory per app, using its slug:

```text
public/images/apps/skyjo-keeper/
├── icon.png
└── screenshots/
    ├── 01-scoreboard.png
    └── 02-ranking.png
```

Icons named `icon.webp`, `icon.png`, or `icon.jpg` are detected automatically.
Images added to `screenshots/` are detected and displayed at the next build. Add an
entry to the app Markdown `screenshots` list only when you want a custom alt text or
caption. Do not commit App Store screenshots here unless you own the rights.
