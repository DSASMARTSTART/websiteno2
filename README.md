# DSA Smart Start

Sito vetrina multilingue basato sui contenuti Canva di DSA Smart Start e sullo stile di [Eduway Academy](https://www.eduway.academy/): sfondo scuro, accenti viola e rosa, pulsanti verdi e schede arrotondate.

**L’italiano è la lingua principale e predefinita.** Il selettore nella navigazione permette di scegliere inglese, serbo (cirillico) e spagnolo, mantenendo la pagina corrente. Non viene applicato alcun reindirizzamento automatico in base alla lingua del browser.

## Avvio locale

Richiede Node.js 18 o successivo. Nessuna dipendenza da installare.

```sh
npm run dev
```

Il sito è disponibile su `http://localhost:4173`. Per utilizzare un’altra porta:

```sh
PORT=4185 npm run dev
```

## Build per la pubblicazione

```sh
npm run build
```

Il build genera 12 pagine HTML complete in `dist/`, con immagini e font locali. Pubblicare il contenuto di `dist/` su un hosting statico. Configurazione dell’hosting: comando di build `npm run build`, cartella di output `dist`.

```sh
npm run preview
```

## Pagine e lingue

| Lingua | Home | Chi siamo | FAQ |
|---|---|---|---|
| Italiano (predefinita) | `/` | `/chi-siamo/` | `/faq/` |
| English | `/en/` | `/en/chi-siamo/` | `/en/faq/` |
| Српски | `/sr/` | `/sr/chi-siamo/` | `/sr/faq/` |
| Español | `/es/` | `/es/chi-siamo/` | `/es/faq/` |

Tutte le versioni includono i testi delle tre pagine, le 18 domande con risposte, la navigazione, le etichette accessibili e i metadati tradotti. La ricerca FAQ è localizzata; in serbo accetta ricerche sia in cirillico sia in latino.

I pulsanti usano i collegamenti originali al catalogo Shopify, al calendario di prenotazione e a WhatsApp. Le fotografie per bambini, adolescenti, universitari e adulti vengono caricate immediatamente.

## Modifica dei contenuti

- `templates/`: struttura delle tre pagine italiane.
- `locales/it.json`: testo originale, identificato da chiavi stabili.
- `locales/en.json`, `locales/sr.json`, `locales/es.json`: traduzioni con le stesse chiavi.
- `scripts/generate-locales.mjs`: generazione delle versioni localizzate; il processo segnala traduzioni mancanti.
- `styles.css`: stile condiviso e layout responsive.
- `app.js`: selettore delle lingue, menu mobile e ricerca FAQ.

Modificare template e traduzioni, poi eseguire `npm run build` o `npm run dev`. I file HTML nella radice e nelle cartelle delle lingue sono generati automaticamente. I materiali privati di riferimento non fanno parte del repository né del build.

Inter è ospitato localmente con caratteri latini e cirillici. Le licenze dei font sono in `assets/fonts/`.

## Verifiche

- Build completo delle 12 pagine.
- Cambio di lingua con mantenimento della pagina corrente e italiano predefinito sulla Home.
- Ricerca FAQ in inglese, serbo e spagnolo.
- Layout delle 12 pagine a 320 e 1280 px senza scorrimento orizzontale; controllo visivo mobile a 390 px.
- Caricamento delle quattro immagini dei programmi e risposte HTTP corrette per pagine, immagini e font.

## Contenuti da completare prima della pubblicazione definitiva

I materiali forniti citano Cookie Policy, Privacy Policy, condizioni di pagamento e politica di rimborso, ma non includono testi o collegamenti per questi documenti. Sono da aggiungere quando disponibili.

La sezione “Scopri il Metodo” usa l’immagine di copertina del video originale. Per la riproduzione occorre aggiungere il file MP4 o un collegamento permanente incorporabile.
