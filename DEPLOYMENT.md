# 🚀 Deployment Gids - KlantFans

## Snel Starten met Vercel (5 minuten)

### Stap 1: Vercel Account
1. Ga naar [vercel.com](https://vercel.com)
2. Klik "Sign Up" (gratis voor personal projects)
3. Log in met GitHub/GitLab/Bitbucket

### Stap 2: Git Repository
1. Maak een nieuwe Git repository:
   ```bash
   cd /Users/rbeute/klantfans-cms/klantfans-website
   git init
   git add .
   git commit -m "Initial commit: KlantFans landing page"
   ```

2. Push naar GitHub/GitLab:
   ```bash
   # Voor GitHub
   gh repo create klantfans-landing --public --source=. --remote=origin
   git push -u origin main
   ```

### Stap 3: Deploy naar Vercel
1. Ga naar [vercel.com/new](https://vercel.com/new)
2. Klik "Import Project"
3. Selecteer je `klantfans-landing` repository
4. Klik "Import"
5. Laat alle settings standaard
6. Klik "Deploy"

### Stap 4: API Key Toevoegen
1. Ga naar je project dashboard op Vercel
2. Klik "Settings" → "Environment Variables"
3. Voeg toe:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Je Gemini API key (verkrijg via [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))
   - **Environment**: Production, Preview, Development (alle aanvinken)
4. Klik "Save"
5. Ga terug naar "Deployments" tab
6. Klik op de laatste deployment → "..." → "Redeploy"

### Stap 5: Custom Domein (Optioneel)
1. Koop `klantfans.nl` bij TransIP/Versio/GoDaddy
2. In Vercel: Project Settings → Domains
3. Voeg domein toe: `klantfans.nl`
4. Update DNS records bij je domein provider:
   - **Type**: A
   - **Name**: @
   - **Value**: 76.76.21.21
   
   - **Type**: CNAME
   - **Name**: www
   - **Value**: cname.vercel-dns.com

5. Wacht 5-60 minuten op DNS propagatie
6. SSL certificaat wordt automatisch aangemaakt ✅

---

## Alternatief: Netlify

### Stap 1-2: Zelfde als Vercel (account + Git)

### Stap 3: Pas bestandsstructuur aan
```bash
# Verplaats API function
mkdir -p netlify/functions
mv api/analyze.js netlify/functions/analyze.js
```

### Stap 4: Update HTML
Open `index.html` en zoek regel 703:
```javascript
// Was:
const apiEndpoint = '/api/analyze';

// Wordt:
const apiEndpoint = '/.netlify/functions/analyze';
```

### Stap 5: Deploy naar Netlify
1. Ga naar [app.netlify.com](https://app.netlify.com)
2. Klik "Add new site" → "Import an existing project"
3. Selecteer je Git provider en repository
4. Build settings:
   - **Base directory**: leeg laten
   - **Build command**: leeg laten
   - **Publish directory**: `.` (punt)
5. Klik "Deploy site"

### Stap 6: API Key toevoegen
1. Site Settings → Environment Variables
2. Voeg toe: `GEMINI_API_KEY` = je API key
3. Trigger nieuwe deployment: Deploys → Trigger deploy

---

## 🧪 Testen na Deployment

### Checklist:
- [ ] Website laadt correct
- [ ] Mobiel menu werkt
- [ ] Alle afbeeldingen laden
- [ ] Cookie banner verschijnt en verdwijnt na accepteren
- [ ] Formulier validatie werkt (laat velden leeg)
- [ ] AI scan werkt (vul formulier in en klik "Analyseer")
- [ ] WhatsApp link werkt na analyse
- [ ] Privacy link werkt
- [ ] LinkedIn/email links werken
- [ ] HTTPS werkt (groene slotje in browser)

### Test AI Scan:
1. Vul formulier in:
   - Naam: Test Gebruiker
   - Bedrijf: Test BV
   - Branche: B2B SaaS
   - Uitdaging: "Onze sales pipeline is onvoorspelbaar..."
2. Klik "Analyseer mijn Groeipotentieel"
3. Wacht op resultaat (5-10 seconden)
4. Controleer WhatsApp link

---

## 🔧 Troubleshooting

### ❌ "API request failed"

**Oorzaak**: API key niet correct ingesteld

**Oplossing**:
1. Controleer environment variable in Vercel/Netlify
2. Check dat de key correct is (geen spaties)
3. Redeploy het project
4. Check function logs:
   - Vercel: Project → Functions → Logs
   - Netlify: Site → Functions → analyze

### ❌ Formulier werkt niet

**Oorzaak**: JavaScript error

**Oplossing**:
1. Open browser console (F12)
2. Check voor errors
3. Controleer dat de API endpoint klopt (Vercel: `/api/analyze`, Netlify: `/.netlify/functions/analyze`)

### ❌ Cookie banner werkt niet

**Oorzaak**: LocalStorage geblokkeerd

**Oplossing**:
- Incognito mode? LocalStorage kan geblokkeerd zijn
- Check browser privacy instellingen
- Test in normale browser window

### ❌ Afbeeldingen laden niet

**Oorzaak**: Externe URLs geblokkeerd of offline

**Oplossing**:
1. Download logo's lokaal
2. Plaats in `images/logos/`
3. Update HTML img src naar lokale paden
4. Commit en push naar Git

---

## 📈 Performance Optimalisatie (Later)

### 1. Lokale Tailwind CSS
```bash
npm install -D tailwindcss
npx tailwindcss init
```

### 2. Afbeeldingen Optimaliseren
- Converteer PNG naar WebP
- Comprimeer met TinyPNG
- Gebruik Vercel Image Optimization

### 3. Analytics Toevoegen
```html
<!-- Google Analytics 4 (optioneel) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### 4. Caching
```json
// vercel.json
{
  "headers": [
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 🎯 Volgende Stappen

Na succesvolle deployment:

1. **✅ Test alles grondig** (gebruik checklist hierboven)
2. **📧 Stuur test email** naar ronald@klantfans.nl
3. **📱 Test op mobiel** (verschillende browsers)
4. **🔍 Google Search Console** setup voor SEO
5. **📊 Analytics** toevoegen (Google Analytics of Plausible)
6. **🎨 Branding** verfijnen (logo's, kleuren)
7. **📝 Content** reviewen en optimaliseren

---

## 💰 Kosten

- **Vercel Free Tier**: €0/maand
  - Unlimited websites
  - 100GB bandwidth
  - Serverless functions

- **Gemini API**: 
  - Free tier: 1,500 requests/dag
  - Genoeg voor 30-50 analyses per dag
  - [Pricing details](https://ai.google.dev/pricing)

- **Domein**: €10-15/jaar (optioneel)

**Totaal**: €0-15/jaar 🎉

---

Succes met de launch! 🚀

