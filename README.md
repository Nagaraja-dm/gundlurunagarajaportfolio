# G Nagaraja — Portfolio

A static one-page portfolio. No build step, no framework — plain HTML/CSS/JS, so it deploys as-is.

## Deploy to GitHub Pages

1. Create a new GitHub repo (e.g. `portfolio`).
2. Upload all files in this folder, keeping the `assets/` structure intact.
3. Go to **Settings → Pages** → set source to the `main` branch, root folder.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Deploy to Vercel

1. Push this folder to a GitHub repo (same as above).
2. Go to [vercel.com](https://vercel.com), click **New Project**, import the repo.
3. Framework preset: **Other** (no build command needed). Deploy.
4. Vercel gives you a live URL immediately, and you can attach a custom domain later.

## Making the contact form actually send data

The form is wired to call a URL you control (`FORM_ENDPOINT` in `script.js`), since a static
site has no backend of its own. Since you already know Google Apps Script, this is the
same pattern you used for the Cognitec landing pages:

1. Create a new Google Sheet. Name the first row: `Timestamp | Name | Phone | Email | Message`.
2. In the Sheet, go to **Extensions → Apps Script** and replace the code with:

   ```javascript
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     sheet.appendRow([
       new Date(),
       e.parameter.name,
       e.parameter.phone,
       e.parameter.email,
       e.parameter.message
     ]);

     MailApp.sendEmail({
       to: "nagaraja.g126@gmail.com",
       subject: "New portfolio contact: " + e.parameter.name,
       body: "Name: " + e.parameter.name +
             "\nPhone: " + e.parameter.phone +
             "\nEmail: " + e.parameter.email +
             "\nMessage: " + e.parameter.message
     });

     return ContentService.createTextOutput("OK");
   }
   ```

3. Click **Deploy → New deployment → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy the deployment URL it gives you.
5. Open `script.js`, find this line near the top:

   ```javascript
   const FORM_ENDPOINT = ""; // <-- paste your Google Apps Script Web App URL here
   ```

   and paste the URL between the quotes.
6. Redeploy (just push the updated `script.js` — GitHub Pages/Vercel will pick it up automatically).

Until you set `FORM_ENDPOINT`, the form still works — it opens a pre-filled email instead of
posting to Sheets, so nothing is broken in the meantime.

## Folder structure

```
index.html
styles.css
script.js
assets/
  fonts/     — Sora & Inter, self-hosted
  img/       — your photo, favicon, and the Cognitec case study screenshot
```

## Updating content later

All text lives directly in `index.html` — no CMS, no data file. Open it in any text editor,
search for the section you want to change (each is commented, e.g. `<!-- HERO -->`), and edit
the text between the tags.
