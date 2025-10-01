// Serverless function voor Gemini API (compatibel met Vercel/Netlify)
// Deploy instructies:
// - Vercel: Plaats in /api/analyze.js
// - Netlify: Plaats in /netlify/functions/analyze.js
// - Voeg API key toe aan environment variables: GEMINI_API_KEY

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userName, companyName, industry, companySize, challenge } = req.body;

        // Validatie
        if (!userName || !companyName || !industry || !challenge) {
            return res.status(400).json({ 
                error: 'Ontbrekende velden',
                message: 'Naam, bedrijfsnaam, branche en uitdaging zijn verplicht.' 
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY niet gevonden in environment variables');
            return res.status(500).json({ 
                error: 'Configuratiefout',
                message: 'Server configuratie ontbreekt.' 
            });
        }

        const systemPrompt = `Je bent een commercieel strategiepanel met invalshoeken van: 
Mark Ritson, Byron Sharp, Philip Kotler, Rita McGrath, Peter Drucker, 
Clayton Christensen, Michael Porter, Les Binet & Peter Field, en Ram Charan. 

Je ontvangt input van een korte bedrijfsdiagnose 
(Probleem, Impact, Frustratie en eventueel AI & Funnel-antwoord).

Analyseer dit in zakelijke taal, alsof je tegen een CEO spreekt. 
Schrijf 300–400 woorden, verdeeld in duidelijke blokken. 
Gebruik korte alinea's (3–5 zinnen), geen bullets. 

Structuur van de output:

1. **Probleem**  
   Beschrijf de kern van het probleem in 3–4 zinnen. 
   Voeg minimaal één specialistische invalshoek toe (bijv. "Volgens Ritson…").  

2. **Impact**  
   Leg de consequenties concreet uit in 3–4 zinnen: omzet, marge, ROI, teamdynamiek. 
   Gebruik waar relevant een expertkader (bv. Kotler, Drucker).  

3. **Kans**  
   Beschrijf in 3–4 zinnen de commerciële kansen die gemist worden. 
   Benoem concreet mogelijke verbeterpercentages of groeiruimte. 
   Geef hier minimaal één expertreferentie (bv. Sharp, Christensen).  

4. **AI-inzet** (optioneel, alleen als er AI/Funnel-informatie aanwezig is)  
   Leg in 2–3 zinnen uit hoe AI praktisch ingezet kan worden als versneller. 
   Wees concreet (bijv. lead scoring, pricing, content).  

5. **Next Step**  
   Sluit af met 2–3 zinnen die duidelijk maken wat de organisatie NU moet doen. 
   Formuleer dit als direct advies, resultaatgericht en met urgentie.  

Schrijf kort, zakelijk en concreet. Geen consultancy-jargon, geen vage taal. 
De hele output moet tussen de 300 en 400 woorden zijn.`;

        const userQuery = `Analyseer de volgende situatie:
- Branche: ${industry}
- Bedrijfsgrootte: ${companySize} FTE
- Grootste commerciële uitdaging: "${challenge}"`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600,
                topP: 0.8,
                topK: 40
            }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Gemini API error:', errorData);
            return res.status(response.status).json({ 
                error: 'API fout',
                message: 'Kon analyse niet uitvoeren. Probeer het later opnieuw.' 
            });
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            const analysisText = candidate.content.parts[0].text;
            return res.status(200).json({ 
                success: true,
                analysis: analysisText,
                context: {
                    userName,
                    companyName,
                    industry,
                    companySize
                }
            });
        } else {
            return res.status(500).json({ 
                error: 'Ongeldige response',
                message: 'Geen geldige analyse ontvangen.' 
            });
        }

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ 
            error: 'Server fout',
            message: 'Er is iets misgegaan. Probeer het later opnieuw.' 
        });
    }
}

