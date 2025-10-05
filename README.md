# KlantFans Landing Page

Professionele landing page voor KlantFans - Commercieel Strateeg & Turnaround Specialist

## ✨ Features

- **Moderne UI/UX**: Responsive design met Tailwind CSS
- **AI-gedreven Scan**: Gemini AI integratie voor commerciële analyse
- **Veilige Backend**: API key verborgen in serverless function
- **SEO Geoptimaliseerd**: Meta tags, Open Graph, structured data
- **AVG Compliant**: Cookie banner en privacy verklaring
- **Performance**: Lazy loading, optimale laadtijden
- **Accessibility**: ARIA labels en semantische HTML

## 🚀 Deployment

### Vercel (Aanbevolen)

1. **Installeer Vercel CLI** (optioneel):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel dashboard**:
   - Ga naar [vercel.com](https://vercel.com)
   - Klik op "Add New Project"
   - Importeer deze Git repository
   - Voeg environment variable toe:
     - `GEMINI_API_KEY` = je Gemini API key
   - Website wordt live op: **klantfans.vercel.app**

3. **Of deploy via CLI**:
   ```bash
   vercel
   ```

4. **Voeg API key toe**:
   ```bash
   vercel env add GEMINI_API_KEY
   ```

5. **Custom domein koppelen** (optioneel, voor later):
   - Ga naar Project Settings → Domains
   - Voeg klantfans.nl toe
   - Voeg www.klantfans.nl toe
   - Volg DNS instructies van Vercel

### Netlify

1. **Deploy via Netlify dashboard**:
   - Ga naar [netlify.com](https://netlify.com)
   - Klik op "Add new site" → "Import an existing project"
   - Selecteer je Git repository
   
2. **Verplaats de API function**:
   - Verplaats `api/analyze.js` naar `netlify/functions/analyze.js`
   
3. **Voeg environment variable toe**:
   - Ga naar Site settings → Environment variables
   - Voeg toe: `GEMINI_API_KEY` = je Gemini API key

4. **Update API endpoint in HTML** (regel 597):
   ```javascript
   const apiEndpoint = '/.netlify/functions/analyze';
   ```

## 🔑 API Key Setup

1. **Verkrijg een Gemini API key**:
   - Ga naar [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Maak een nieuwe API key aan
   
2. **Voeg toe aan environment variables**:
   - Bij Vercel: Project Settings → Environment Variables
   - Bij Netlify: Site Settings → Environment Variables
   - **BELANGRIJK**: Voeg NOOIT je API key direct toe aan de HTML!

## 📁 Project Structuur

```
KlantFans/
├── index.html                # Hoofdpagina
├── api/
│   └── analyze.js            # Serverless API endpoint (Vercel)
├── images/
│   ├── logos/                # Client logos
│   ├── ronald-beute.jpg      # Profielfoto
│   └── og-image.jpg          # Open Graph afbeelding
├── vercel.json               # Vercel configuratie
└── README.md                 # Deze file
```

## 🛠️ Lokaal Testen

### Met Vercel CLI:
```bash
# Installeer Vercel CLI
npm install -g vercel

# Start lokale development server
vercel dev

# Voeg API key toe aan .env.local
echo "GEMINI_API_KEY=your_api_key_here" > .env.local
```

### Zonder serverless function:
Open gewoon `index.html` in je browser. De AI scan werkt niet zonder backend, maar de rest van de site wel.

## 📋 Checklist voor Live Gang

- [ ] Vercel/Netlify account aangemaakt
- [ ] Git repository gekoppeld
- [ ] Environment variable `GEMINI_API_KEY` toegevoegd
- [ ] Website live op **klantfans.vercel.app**
- [ ] SSL certificaat geactiveerd (automatisch via Vercel/Netlify)
- [ ] Profielfoto vervangen in hero sectie
- [ ] Open Graph afbeelding toegevoegd (`images/og-image.jpg`)
- [ ] Alle placeholder content gecontroleerd
- [ ] Contact gegevens gevalideerd
- [ ] WhatsApp nummer gecontroleerd (regel 781)
- [ ] Custom domein klantfans.nl koppelen (optioneel, voor later)

## 🔒 Privacy & Beveiliging

- **API Key**: Nooit in frontend, altijd via environment variables
- **HTTPS**: Automatisch via Vercel/Netlify
- **Cookie Banner**: AVG compliant
- **Privacy Verklaring**: Opgenomen in footer
- **Geen tracking**: Geen Google Analytics of third-party trackers

## 🎨 Aanpassingen

### Kleuren wijzigen:
Zoek naar deze CSS classes in de `<style>` tag:
- `.text-navy` / `.bg-navy`: #1a2a4c (hoofdkleur)
- `.accent-orange` / `.bg-accent-orange`: #dd6b20 (accentkleur)

### WhatsApp nummer wijzigen:
Zoek naar `https://wa.me/31623885227` in de HTML (regel 626)

### Logo's vervangen:
Plaats nieuwe logo's in `images/logos/` en update de `<img>` tags

## 📊 Performance Tips

1. **Lazy Loading**: Al geïmplementeerd voor afbeeldingen
2. **Minify**: Gebruik een tool zoals HTMLMinifier voor productie
3. **CDN**: Overweeg lokale Tailwind CSS in plaats van CDN
4. **Caching**: Configureer in Vercel/Netlify settings

## 🐛 Troubleshooting

### "API request failed"
- Controleer of `GEMINI_API_KEY` environment variable is ingesteld
- Check Vercel/Netlify function logs voor errors

### Cookie banner blijft terugkomen
- LocalStorage wordt geblokkeerd? Check browser privacy settings

### Afbeeldingen laden niet
- Externe URLs kunnen geblokkeerd worden door CORS
- Download en host logo's lokaal in `images/logos/`

## 📞 Support

Bij vragen of problemen:
- Email: ronald@klantfans.nl
- LinkedIn: [Ronald Beute](https://www.linkedin.com/in/ronald-beute/)

---

**Laatste update**: Oktober 2025  
**Versie**: 2.0 (Geoptimaliseerd & Beveiligd)

