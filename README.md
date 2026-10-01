# Build Once, Earn Forever

Event page for the 3 October 2026 passive income hackathon. A plain static site (one `index.html`), hosted on GitHub Pages.

Live at: https://baminico.github.io/build-once-earn-forever/

## 1. Collect sign-ups in a Google Sheet (5 minutes)

GitHub Pages cannot store data, so the form sends each sign-up to a Google Sheet through a small Google Apps Script.

1. Create a new Google Sheet (name it anything, for example "Hackathon sign-ups").
2. In the sheet, open **Extensions > Apps Script**.
3. Delete the starter code and paste in everything from `apps-script/Code.gs`. Click **Save**.
4. Click **Deploy > New deployment**. Click the gear next to "Select type" and choose **Web app**.
5. Set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy**.
6. Google asks you to authorize. Choose your account. If you see "Google hasn't verified this app", click **Advanced > Go to (project name) (unsafe)** and **Allow**. This is your own script running on your own sheet.
7. Copy the **Web app URL** (it ends in `/exec`). Open it in a browser tab: you should see `{"ok":true,"message":"Sign-up endpoint is running."}`.
8. In `index.html`, find the line `var SIGNUP_URL = "";` and paste the URL between the quotes.

Each sign-up becomes a row in a "Sign-ups" tab. Signing up again with the same email updates the existing row. If you change `Code.gs` later, use **Deploy > Manage deployments > Edit > New version** so the URL stays the same.

## 2. Publish on GitHub Pages

1. On GitHub, create a **public** repository named `build-once-earn-forever` under BaMiniCo.
2. Click **Add file > Upload files** and drag in `index.html`, `og.png`, `README.md` and the `apps-script` folder. Commit.
3. Go to **Settings > Pages**. Under "Build and deployment" choose **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
4. After a minute or two the site is live at https://baminico.github.io/build-once-earn-forever/

## 3. Fill in the details later

All of these are near the top of the `<script>` in `index.html`. To edit, open the file on GitHub, click the pencil icon, change it, and commit. The site updates in about a minute.

- `VENUE`: the address for in-person guests
- `MEET_LINK`: the online meeting link (must start with https://)
- `SIGNUP_URL`: the Apps Script URL from step 1
- `WHATSAPP_NUMBER`: optional, with country code and digits only (for example `919876543210`). If a sign-up cannot be saved, guests get a "Send on WhatsApp" button to message you their details.

## Notes

- The page works even if sign-ups fail: guests see their details and can copy them or send them on WhatsApp.
- The WhatsApp link preview uses `og.png` and the tags in the `<head>` of `index.html`. If you rename the repo, update the URLs in those tags.
- The Apps Script URL is visible in the page source. The script only accepts name, email and the form fields, and writes them as plain text to your sheet.
