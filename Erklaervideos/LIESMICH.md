# Erklärvideos Wirbelstromprüfung – für den eigenen Server

Dieser Ordner enthält alle Erklärvideos der Wirbelstrom-Schulung als fertige Dateien:

| Datei | Inhalt |
|---|---|
| `NN-titel.mp4` | Video, 1280 × 720, H.264 + AAC, ohne eingebrannte Untertitel |
| `NN-titel.de.vtt` | Untertitel (WebVTT, Deutsch) – im Player ein-/ausschaltbar |
| `NN-titel.jpg` | Vorschaubild (Poster) |
| `videos.json` | Liste aller Videos mit Titel, Kapitel, Länge und Dateinamen |
| `index.html` | Fertige Mediathek-Seite mit Player und Untertitel-Schalter |

## In den eigenen Node-Server einbinden (z. B. Express)

```js
const express = require('express');
const app = express();
// Ordner unter /erklaervideos bereitstellen – Range-Anfragen macht express.static selbst
app.use('/erklaervideos', express.static('/pfad/zu/Erklaervideos', {
  setHeaders(res, file) { if (file.endsWith('.vtt')) res.type('text/vtt'); }
}));
app.listen(3000);
```

## Einzelnes Video in eine eigene Seite einbauen

```html
<video controls playsinline preload="metadata"
       poster="/erklaervideos/02-risserkennung-grundprinzip.jpg">
  <source src="/erklaervideos/02-risserkennung-grundprinzip.mp4" type="video/mp4">
  <track kind="subtitles" srclang="de" label="Deutsch"
         src="/erklaervideos/02-risserkennung-grundprinzip.de.vtt" default>
</video>
```

* `default` am `<track>` = Untertitel sind beim Start an. Ohne `default` sind sie aus und lassen sich im Player (CC-Knopf) einschalten.
* Untertitel und Video müssen von derselben Domain kommen (oder der Server muss CORS für `.vtt` erlauben).
* Der Server muss `.vtt` als `text/vtt` ausliefern und Range-Anfragen unterstützen (Spulen im Video, nötig für Safari/iPad) – `express.static` kann beides.
* Die Mediathek-Seite `index.html` braucht nichts weiter: Ordner bereitstellen und `/erklaervideos/` aufrufen.
