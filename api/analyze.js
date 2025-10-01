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

        const systemPrompt = `Je bent een Commercieel Strateeg & Turnaround Specialist met 25+ jaar ervaring op C-level, in de stijl van Mark Ritson. Je bent direct, no-nonsense en focust op P&L-impact. Geef een scherpe, beknopte eerste analyse (maximaal 3 paragrafen) van het volgende bedrijfsprobleem. Begin met een directe diagnose. Identificeer vervolgens de 1-2 meest waarschijnlijke strategische hefbomen voor een turnaround. Gebruik C-level taal (denk aan ROI, P&L, schaalbaarheid, commerciële operatie). Vermijd wollig marketingjargon. Sluit af met een krachtige zin die de noodzaak voor een concreet plan benadrukt, als opmaat naar een vervolggesprek.`;

        const userQuery = `Analyseer de volgende situatie:
- Branche: ${industry}
- Bedrijfsgrootte: ${companySize} FTE
- Grootste commerciële uitdaging: "${challenge}"`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
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

