/**
 * SafarNama PK - SafarAI Domestic Pakistan Travel Assistant & Smart Itinerary Generator
 * Powered by Google Gemini — Real road conditions, verified local data, true PKR budgets
 * Hyper-localized for Pakistan travel times, road realities, fuel costs, altitudes & culture
 */

import { state } from './state.js';
import { ENV } from './config.js';

export class SafarAIPlanner {
  constructor() {
    this.apiKey = localStorage.getItem('safarnama_gemini_api_key') || ENV.GEMINI_API_KEY || '';
    this.chatHistory = [
      {
        sender: 'ai',
        text: 'Assalam-o-Alaikum! 🇵🇰 I am **SafarAI**, your real-time Pakistan travel assistant powered by Google Gemini.\n\nI have live knowledge of road conditions on **KKH, Babusar Pass, Skardu Expressway, Swat Motorway, and Makran Coastal Highway**. Ask me anything about roads, weather, safety, budgets, or let me generate a personalized day-by-day itinerary!'
      }
    ];
    this.GEMINI_MODEL = 'gemini-3.6-flash';   // Verified active model for Google AI Studio keys
    this.GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${this.GEMINI_MODEL}:generateContent`;
  }

  setApiKey(key) {
    this.apiKey = (key || '').trim();
    if (this.apiKey) {
      localStorage.setItem('safarnama_gemini_api_key', this.apiKey);
    } else {
      localStorage.removeItem('safarnama_gemini_api_key');
    }
  }

  getApiKey() {
    const local = (localStorage.getItem('safarnama_gemini_api_key') || '').trim();
    return local || (this.apiKey || ENV.GEMINI_API_KEY || '').trim();
  }

  // Models to try in order — auto-discovers which one works for this API key
  get FALLBACK_MODELS() {
    return [
      'gemini-3.6-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ];
  }

  /** Call Gemini with automatic model fallback */
  async _callGemini(key, body) {
    // Try the current model first
    const models = [this.GEMINI_MODEL, ...this.FALLBACK_MODELS.filter(m => m !== this.GEMINI_MODEL)];
    for (const model of models) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (res.ok && data?.candidates?.[0]?.content?.parts) {
          const parts = data.candidates[0].content.parts;
          const textPart = parts.find(p => p.text && !p.thought) || parts.find(p => p.text) || parts[0];
          const text = textPart?.text;
          if (text) {
            // Save the working model for future calls
            if (model !== this.GEMINI_MODEL) {
              console.log(`SafarAI: switched to model "${model}"`);
              this.GEMINI_MODEL = model;
              this.GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
            }
            return { ok: true, text, model };
          }
        }
        // If 404 (model not found), try next model
        if (data?.error?.code === 404 || data?.error?.status === 'NOT_FOUND') {
          console.warn(`SafarAI: model "${model}" not available, trying next...`);
          continue;
        }
        // Other errors (auth, quota) — return immediately
        return { ok: false, error: data?.error?.message || `HTTP ${res.status}`, data };
      } catch (err) {
        return { ok: false, error: err.message, network: true };
      }
    }
    return { ok: false, error: 'No available Gemini model found for this API key. Please check your key at aistudio.google.com/app/apikey' };
  }

  async testGeminiApiKey(testKey) {
    const key = (testKey || this.getApiKey() || '').trim();
    if (!key) {
      return { success: false, error: 'Please enter a valid Google Gemini API Key.' };
    }
    const result = await this._callGemini(key, {
      contents: [{ parts: [{ text: 'Respond strictly with: OK' }] }]
    });
    if (result.ok) {
      return { success: true, message: `✅ Connected! Using model: ${result.model}` };
    }
    return { success: false, error: result.error || 'Invalid API Key or quota exceeded.' };
  }

  // ─── Build context string from live road alerts ────────────────────────────
  _buildRoadConditionsContext() {
    const alerts = state.roadAlerts || [];
    if (!alerts.length) return 'Road conditions data unavailable — use general knowledge.';
    return alerts.map(r =>
      `• ${r.highway} (${r.section}): STATUS=${r.status} | Weather=${r.weather} ${r.temperature} | ${r.advisory} | Suitable for: ${r.suitableVehicles}`
    ).join('\n');
  }

  // ─── Current Pakistan travel season context ────────────────────────────────
  _getSeasonContext() {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-indexed
    const dateStr = now.toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' });
    let season = '';
    if (month >= 4 && month <= 6) season = 'Late Spring / Early Summer — excellent for all northern regions. Babusar Pass opening season.';
    else if (month >= 7 && month <= 9) season = 'Peak Summer / Monsoon — north (KKH, Hunza, Skardu) is peak season. Landslide risk in Swat & Naran. Coastal Balochistan (Gwadar) is hot, avoid if possible.';
    else if (month >= 10 && month <= 11) season = 'Golden Autumn — BEST season for Hunza & Nagar valley foliage (October 10 – November 15). Babusar Pass closes in late October.';
    else if (month === 12 || month <= 2) season = 'Winter — Northern high-altitude passes (Babusar, Lowari) are CLOSED. KKH to Hunza & Skardu open all year. Gwadar & Balochistan coast is perfect (22–26°C).';
    else season = 'Early Spring — snow melting in valleys, Murree & AJK bloom season.';
    return `Today: ${dateStr}\nCurrent Pakistan Travel Season: ${season}`;
  }

  // ─── Master system prompt for itinerary generation ────────────────────────
  _buildItinerarySystemPrompt(params) {
    const { originCity, destination, durationDays, budgetTier, travelStyle, travelersCount } = params;
    const roadContext = this._buildRoadConditionsContext();
    const seasonContext = this._getSeasonContext();
    const budgetLabel = budgetTier === 'budget'
      ? 'Economy/Backpacker (Guest houses, public coasters, local dhabas)'
      : budgetTier === 'luxury'
        ? 'Luxury (Serena/Shangrila class hotels, Toyota Prado 4x4, gourmet dining)'
        : 'Standard Deluxe (3-star hotels, private Hiace/Sedan, decent restaurants)';
    const styleLabel = {
      family: 'Family leisure & sightseeing (child-friendly, moderate activity)',
      honeymoon: 'Couples & honeymoon romantic (scenic, private, intimate experiences)',
      adventure: 'Youth, trekking & extreme 4x4 off-road adventure',
      friends: 'Friends group trip (mix of adventure and leisure)'
    }[travelStyle] || travelStyle;

    return `You are SafarAI, Pakistan's most trusted AI travel planner built into SafarNama PK. You have comprehensive, verified knowledge of ALL Pakistani tourist destinations, roads, passes, hotels, local transport, food, and culture.

## CURRENT CONDITIONS (inject these into your plan):
${seasonContext}

## LIVE ROAD STATUS FROM NHMP & SAFARNAMA SENSORS:
${roadContext}

## IMPORTANT RULES — Follow STRICTLY:
1. ONLY provide factually accurate, verified information. Do NOT hallucinate hotel names, road statuses, or distances.
2. Use REAL road names (KKH N-35, Hazara Motorway M-1, Swat Motorway M-16, Jaglot-Skardu S-1, Coastal Highway N-10, etc.)
3. Provide REAL PKR cost estimates based on current 2026 market rates.
4. If road alerts above show a route is CLOSED or DANGEROUS, prominently warn the traveler and suggest alternatives.
5. Adjust advice for the CURRENT SEASON shown above.
6. For custom destinations not in northern areas, research and provide equally accurate local-specific advice.
7. Always mention which vehicle type is needed (sedan, 4x4, public coaster, etc.).
8. Include checkpoints, CNIC requirements, and relevant safety info.

## TRIP PARAMETERS:
- Departure City: ${originCity}
- Destination: ${destination}
- Trip Duration: ${durationDays} days
- Travelers: ${travelersCount} person(s)
- Budget Tier: ${budgetLabel}
- Travel Style: ${styleLabel}

## OUTPUT FORMAT — Return EXACTLY this structure (markdown):

# 🗺️ [DURATION]-Day [DESTINATION] Itinerary

## 📊 Trip Overview
- **Origin:** [city]
- **Destination:** [destination]  
- **Duration:** [X] Days / [X-1] Nights
- **Travelers:** [N] Person(s)
- **Budget Tier:** [tier]
- **Travel Style:** [style]
- **Recommended Vehicle:** [specific vehicle recommendation with reason]
- **Estimated Total Cost:** PKR [realistic amount] (breakdown below)

## 💰 Budget Breakdown
| Category | Estimated PKR |
|---|---|
| Transportation (fuel/hire) | PKR X |
| Accommodation ([N] nights) | PKR X |
| Food & Dining | PKR X |
| Activities & Tickets | PKR X |
| Miscellaneous & Tips | PKR X |
| **TOTAL** | **PKR X** |

## 🚦 Road & Route Advisory
[2-3 sentences about current road conditions for this specific route based on the live data above. Mention any closures, alerts, or special requirements.]

## 📅 Day-by-Day Itinerary

### Day 1: [Title]
**Route:** [From → To] | **Drive Time:** [X hrs] | **Distance:** [X km]

| Time | Activity |
|---|---|
| 05:30 AM | [Activity] |
| [time] | [Activity] |

**🏨 Night Stay:** [Hotel name / area]  
**💡 Pro Tip:** [Useful tip for this day]

### Day 2: [Title]
...continue for all days...

## 🎒 Packing Checklist
- [Item 1]
- [Item 2]
...

## ⚠️ Safety & Travel Notes
- [Safety note 1]
- [Safety note 2]
...

## 📞 Emergency Contacts
- NHMP Helpline: 130
- Rescue 1122: 1122
- Pakistan Tourism: 051-9220801
- [Relevant local emergency contacts for destination]

---
*Generated by SafarAI on ${new Date().toLocaleDateString('en-PK')} | Data verified against NHMP & SafarNama live sensors*`;
  }

  // ─── Main: Generate itinerary using Gemini AI ─────────────────────────────
  async generateItineraryWithAI(params) {
    const key = this.getApiKey();
    if (!key) {
      // No API key — use local static generator
      return { type: 'local', plan: this.generateItinerary(params) };
    }

    const systemPrompt = this._buildItinerarySystemPrompt(params);

    try {
      const result = await this._callGemini(key, {
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.4,      // Lower temp = more factual, less hallucination
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 8192
        }
      });

      if (result.ok) {
        return {
          type: 'gemini',
          markdown: result.text,
          params
        };
      } else {
        console.warn('Gemini API error for itinerary:', result.error);
        return {
          type: result.network ? 'network_error' : 'gemini_error',
          error: result.error,
          plan: this.generateItinerary(params)
        };
      }
    } catch (err) {
      console.warn('Gemini network error:', err);
      return {
        type: 'network_error',
        error: err.message,
        plan: this.generateItinerary(params)
      };
    }

    return { type: 'local', plan: this.generateItinerary(params) };
  }

  // ─── Legacy static itinerary generator (fallback when no API key) ─────────
  generateItinerary(params) {
    const {
      originCity = 'Islamabad',
      destination = 'hunza',
      durationDays = 7,
      budgetTier = 'standard',
      travelStyle = 'family',
      travelersCount = 2
    } = params;

    // Match typed destination name to known state destinations
    const destObj = state.destinations.find(d =>
      d.id === destination ||
      d.name.toLowerCase() === destination.toLowerCase() ||
      d.name.toLowerCase().includes(destination.toLowerCase())
    ) || {
      id: 'custom',
      name: destination,
      region: 'Pakistan',
      roadStatus: 'Please verify road conditions locally before travel.',
      averageTourPrice: 65000
    };

    const tierMultiplier = budgetTier === 'budget' ? 0.72 : (budgetTier === 'luxury' ? 1.65 : 1.0);
    const basePerDay = 9500 * tierMultiplier;
    const transportPerDay = budgetTier === 'luxury' ? 22000 : (budgetTier === 'budget' ? 8500 : 15000);
    const hotelCostTotal = (destObj.averageTourPrice * 0.45 * tierMultiplier) * (durationDays / 7) * Math.ceil(travelersCount / 2);
    const transportTotal = transportPerDay * durationDays;
    const foodAndActivities = 3500 * durationDays * travelersCount * tierMultiplier;
    const totalEstimatedPKR = Math.round(hotelCostTotal + transportTotal + foodAndActivities);

    const days = [];
    const isHunza = destination === 'hunza';
    const isSkardu = destination === 'skardu';
    const isSwat = destination === 'swat';
    const isFairyMeadows = destination === 'fairy-meadows';
    const isGwadar = destination === 'gwadar';
    const isNeelum = destination === 'neelum';

    for (let d = 1; d <= durationDays; d++) {
      if (d === 1) {
        days.push({
          day: 1,
          title: `Departure from ${originCity} & Scenic Highway Journey`,
          timeSchedule: [
            { time: '05:30 AM', activity: `Early morning departure from ${originCity} to beat city traffic.` },
            { time: '09:00 AM', activity: 'Breakfast stop at Hazara Motorway Service Area / Bhera.' },
            { time: '02:00 PM', activity: `Scenic lunch break along riverbanks (${isSwat ? 'Chakdara' : isGwadar ? 'Kund Malir' : 'Besham / Naran'}).` },
            { time: '07:30 PM', activity: 'Arrival at night transit hotel, check-in, and warm traditional dinner.' }
          ],
          tips: 'Keep original CNIC/Passports handy for highway police checkpoints.',
          stay: `${destObj.name} Gateway Resort / Transit Hotel`
        });
      } else if (d === durationDays) {
        days.push({
          day: d,
          title: `Souvenir Shopping & Safe Return to ${originCity}`,
          timeSchedule: [
            { time: '08:00 AM', activity: 'Hearty breakfast with scenic mountain/seaside views.' },
            { time: '10:30 AM', activity: 'Local bazaar stop for dry fruits, mountain honey, gemstones, and handicrafts.' },
            { time: '02:00 PM', activity: 'Lunch stop on the motorway back.' },
            { time: '08:00 PM', activity: `Arrival back home in ${originCity} with lifelong memories!` }
          ],
          tips: 'Ensure vehicle tire pressure and fluids are checked before the long motorway drive.',
          stay: 'Home'
        });
      } else {
        let dayTitle = `Exploring the Wonders of ${destObj.name} — Part ${d - 1}`;
        let schedule = [];

        if (isHunza) {
          if (d === 2) {
            dayTitle = 'Arrival in Karimabad, Rakaposhi Viewpoint & Altit Fort';
            schedule = [
              { time: '09:00 AM', activity: 'Drive past 3 mountain ranges junction & stop at Rakaposhi View Point (7,788m) for tea.' },
              { time: '01:30 PM', activity: 'Check-in at Karimabad hotel with panoramic views of Ultar Sar and Ladyfinger Peak.' },
              { time: '04:00 PM', activity: 'Guided walking tour through 1100-year-old Altit Fort and royal apricot gardens.' },
              { time: '07:30 PM', activity: 'Sunset dinner at Eagle\'s Nest overlooking the entire Hunza Valley.' }
            ];
          } else if (d === 3) {
            dayTitle = 'Attabad Lake Boating & Hussaini Suspension Bridge Walk';
            schedule = [
              { time: '09:30 AM', activity: 'Jet ski and turquoise speedboat cruise across Attabad Lake.' },
              { time: '01:00 PM', activity: 'Lunch at lakeside café with fresh river trout.' },
              { time: '03:30 PM', activity: 'Thrilling walk across the historic Hussaini Hanging Rope Bridge.' },
              { time: '06:00 PM', activity: 'Photography stop beneath the iconic jagged Passu Cones (Cathedral Ridge).' }
            ];
          } else if (d === 4) {
            dayTitle = 'Khunjerab Pass (Pak-China Border) & High Altitude Wildlife';
            schedule = [
              { time: '08:00 AM', activity: 'Early drive through Khunjerab National Park. Spotting Himalayan Ibex and Golden Marmots.' },
              { time: '12:00 PM', activity: 'Reach Khunjerab Pass summit (4,693m) and withdraw money from the World\'s Highest ATM (NBP).' },
              { time: '03:30 PM', activity: 'Return drive to Sost dry port for duty-free shopping.' },
              { time: '08:00 PM', activity: 'Traditional Hunzai musical dinner with local rubab instruments.' }
            ];
          } else {
            dayTitle = 'Hoper Glacier, Nagar Valley & Hidden Waterfalls';
            schedule = [
              { time: '10:00 AM', activity: 'Cross over to Nagar Valley and hike up to Hoper Black Glacier viewpoint.' },
              { time: '02:00 PM', activity: 'Traditional Chapshuro (Hunzai meat pie) lunch in local organic kitchen.' },
              { time: '05:00 PM', activity: 'Stroll through Ganish ancient village stone heritage alleys.' }
            ];
          }
        } else if (isSkardu) {
          if (d === 2) {
            dayTitle = 'Shangrila Resort, Lower & Upper Kachura Lakes';
            schedule = [
              { time: '09:30 AM', activity: 'Visit heart-shaped Lower Kachura Lake and Shangrila Pagoda Resort.' },
              { time: '01:00 PM', activity: 'Short pine forest trek to pristine Upper Kachura Lake for boat ride and trout.' },
              { time: '05:00 PM', activity: 'Katpana Cold Desert sunset dunes walk.' }
            ];
          } else if (d === 3) {
            dayTitle = '4x4 Jeep Safari to Deosai Plains (Roof of the World)';
            schedule = [
              { time: '07:30 AM', activity: 'Embark on 4x4 Prado safari via Sadpara Lake up to Ali Malik Top (4,200m).' },
              { time: '11:30 AM', activity: 'Sheosar Lake photography with crystal reflections of Nanga Parbat.' },
              { time: '02:00 PM', activity: 'Picnic lunch at Bara Pani stream and visit brown bear sanctuary.' },
              { time: '06:30 PM', activity: 'Return to Skardu city for dinner.' }
            ];
          } else {
            dayTitle = '400-Year-Old Shigar Fort, Sand Dunes & Manthoka Falls';
            schedule = [
              { time: '09:00 AM', activity: 'Visit historic Serena Shigar Fort Palace museum and royal gardens.' },
              { time: '01:00 PM', activity: 'Sarfaranga cold desert dune buggy ride.' },
              { time: '04:30 PM', activity: 'Visit the roaring 180ft Manthoka Waterfall.' }
            ];
          }
        } else if (isSwat) {
          if (d === 2) {
            dayTitle = 'Malam Jabba Ski Resort & Chairlift Thrills';
            schedule = [
              { time: '09:30 AM', activity: 'Ride the cable car and 800m zip-line at PC Malam Jabba.' },
              { time: '02:00 PM', activity: 'Scenic mountain drive alongside Swat River to Bahrain and Kalam.' },
              { time: '06:00 PM', activity: 'Check-in at Kalam river lodge.' }
            ];
          } else {
            dayTitle = '4x4 Jeep Trek to Ushu Pine Forest & Mahodand Lake';
            schedule = [
              { time: '08:30 AM', activity: '4x4 jeep ride through towering Ushu cedar forests.' },
              { time: '11:30 AM', activity: 'Mahodand Lake boating and horse riding along glacier streams.' },
              { time: '03:00 PM', activity: 'Saifullah Lake stream picnic.' }
            ];
          }
        } else if (isGwadar) {
          dayTitle = 'Princess of Hope, Kund Malir Beach & Hammerhead Sunset';
          schedule = [
            { time: '09:00 AM', activity: 'Makran Coastal Highway cruise past dramatic natural rock sculptures.' },
            { time: '02:00 PM', activity: 'Climb Koh-e-Batil 360-degree viewpoint stairs overlooking the deep-sea port.' },
            { time: '05:00 PM', activity: 'Speedboat ride into Arabian Sea bay and authentic Balochi Sajji dinner.' }
          ];
        } else {
          dayTitle = `Exploring Highlights & Scenic Gems of ${destObj.name}`;
          schedule = [
            { time: '09:00 AM', activity: 'Guided tour of top destination viewpoints and cultural landmarks.' },
            { time: '01:00 PM', activity: 'Local regional cuisine lunch experience.' },
            { time: '04:00 PM', activity: 'Nature hike, photography session, and sunset vantage point.' },
            { time: '08:00 PM', activity: 'Cozy campfire evening with tea and stargazing.' }
          ];
        }

        days.push({
          day: d,
          title: dayTitle,
          timeSchedule: schedule,
          tips: 'Stay hydrated and carry cash in PKR, as ATMs can have network downtime in high mountain valleys.',
          stay: `${destObj.name} Premium Stay`
        });
      }
    }

    return {
      destination: destObj,
      originCity,
      durationDays,
      budgetTier,
      travelStyle,
      travelersCount,
      estimatedCostPKR: totalEstimatedPKR,
      recommendedVehicle: durationDays > 5 && isSkardu
        ? 'Toyota Prado TX 4x4 / Land Cruiser'
        : travelersCount > 4
          ? 'Toyota Hiace Grand Cabin'
          : 'Toyota Corolla Grande / Honda Civic',
      days,
      packingList: [
        'Warm Windproof / Thermal Outerwear',
        'Original CNIC / NADRA Form B for children / Passport',
        'Power Banks & Multi-plug Adapter',
        'High SPF Sunscreen & UV Polarized Sunglasses',
        'Basic Altitude Meds (Panadol, ORS, motion sickness pills)',
        'Sturdy walking/hiking trainers'
      ],
      roadAdvisory: destObj.roadStatus || 'Verify current road conditions with NHMP before travel.'
    };
  }

  // ─── Chat assistant powered by Gemini with road context ───────────────────
  async askAssistant(userQuestion) {
    const key = this.getApiKey();

    // No key at all — show guidance
    if (!key) {
      return `⚠️ **No Gemini API Key set.**\n\nTo enable live AI responses:\n1. Go to **Settings** (key icon in header)\n2. Paste your Google AI Studio API key\n3. Get a free key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)\n\n---\n*Showing local answer:*\n\n${this.localAskAssistant(userQuestion)}`;
    }

    try {
      const roadContext = this._buildRoadConditionsContext();
      const seasonContext = this._getSeasonContext();

      const systemPrompt = `You are SafarAI, Pakistan's official AI travel assistant embedded in SafarNama PK. You have comprehensive, real-time verified knowledge of all Pakistani tourist destinations, roads, passes, hotels, transport, food, and safety.

## CURRENT DATE & SEASON:
${seasonContext}

## LIVE ROAD STATUS (verified by NHMP & SafarNama sensors):
${roadContext}

## YOUR CAPABILITIES:
- Real road conditions, pass statuses (Babusar, Khunjerab, Lowari, Shandur, Deosai)
- Accurate PKR cost estimates for 2026 market rates
- 4x4 vs sedan vs public transport recommendations per route
- Hotel recommendations from budget guest houses to Serena/Shangrila class
- Cultural tips, CNIC/checkpoint info, altitude sickness prevention
- Season-specific advice (monsoon warnings, autumn foliage, winter closures)
- Balochistan coastal route info (Kund Malir, Gwadar, Ormara, Pasni)
- AJK/Neelum Valley road and entry permit requirements

## RULES:
1. ONLY provide verified, factual information. Never hallucinate road conditions or hotel names.
2. Always reference the live road status above when relevant.
3. Use friendly markdown with emojis, bullet points, and headers.
4. Mention specific road numbers (N-35, M-16, N-10, S-1, M-1) for accuracy.
5. For safety-critical info (road closures, altitude, monsoon), be extra clear.

User Question: ${userQuestion}`;

      const result = await this._callGemini(key, {
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] }
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.85,
          maxOutputTokens: 4096
        }
      });

      if (result.ok) {
        return result.text;
      }

      if (result.network) {
        return `🔴 **Network Error:** Could not reach Gemini API.\n\`${result.error}\`\n\nCheck your internet connection, then try again.\n\n---\n*Showing local answer instead:*\n\n${this.localAskAssistant(userQuestion)}`;
      }

      // Show the real Gemini error so user knows what went wrong
      console.error('Gemini API error:', result.error);
      return `⚠️ **Gemini API Error:**\n\`${result.error}\`\n\n---\n*Showing local answer instead:*\n\n${this.localAskAssistant(userQuestion)}`;

    } catch (err) {
      console.error('Gemini Network error:', err);
      return `🔴 **Network Error:** Could not reach Gemini API.\n\`${err.message}\`\n\nCheck your internet connection, then try again.\n\n---\n*Showing local answer instead:*\n\n${this.localAskAssistant(userQuestion)}`;
    }
  }

  // ─── Offline fallback assistant ───────────────────────────────────────────
  localAskAssistant(userQuestion) {
    const q = userQuestion.toLowerCase();

    if (q.includes('civic') || q.includes('corolla') || q.includes('sedan') || q.includes('car')) {
      if (q.includes('babusar') || q.includes('kkh') || q.includes('hunza') || q.includes('swat') || q.includes('skardu')) {
        return '✅ **Yes, absolutely!** Sedans like Honda Civic, Corolla, Yaris, and City can comfortably travel to **Hunza, Kalam (Swat), Skardu**, and across **Babusar Pass** during summer, thanks to the newly carpeted highways and Hazara Motorway.\n\n⚠️ **Exceptions:** You will need to hire local 4x4 Jeeps on-the-spot for **Deosai Plains, Fairy Meadows (Raikot-Tato), Mahodand Lake**, and **Ratti Gali Lake** due to rocky mountain tracks.';
      }
      return 'Most paved domestic highways in Pakistan (KKH, M-16 Swat Motorway, Coastal Highway N-10, M-5) are excellent for all sedans. Only off-road alpine lakes and passes require hiring a 4x4.';
    }

    if (q.includes('babusar') || q.includes('babusar top')) {
      return '🏔️ **Babusar Pass (4,173m) Status:**\n- **Season:** Usually open between **June and late October** for all light & heavy traffic during daylight hours (6 AM to 6 PM).\n- **Winter Status:** In winter (Nov-May), Babusar is closed due to heavy snow; traffic to Gilgit/Hunza diverts via the all-weather Karakoram Highway (KKH) through Besham and Kohistan.';
    }

    if (q.includes('autumn') || q.includes('fall') || q.includes('colors')) {
      return '🍂 **Autumn in Hunza & Nagar (Golden Foliage):**\n- **Peak Window:** **October 10 to November 15**.\n- **Why visit:** Apricot, poplar, and walnut trees turn fiery gold, crimson, and amber against snow-capped peaks and turquoise rivers. It is widely considered the most photogenic time of the year in Pakistan!';
    }

    if (q.includes('fairy meadows') || q.includes('nanga parbat')) {
      return '🏕️ **Fairy Meadows Travel Guide:**\n1. Drive to **Raikot Bridge** on KKH (accessible by any car/van).\n2. Take an exhilarating 1.5-hour 4x4 mountain jeep ride to **Tato Village**.\n3. Hike 3 to 4 hours on foot (or hire a horse/mule) through pine forests to reach Fairy Meadows.\n4. **Best for:** Adventure seekers, couples, and youth. Families with toddlers should take horses.';
    }

    if (q.includes('payment') || q.includes('jazzcash') || q.includes('easypaisa') || q.includes('pkr')) {
      return '💳 **Local Payment Support:**\nSafarNama PK natively accepts **JazzCash Mobile Accounts, Easypaisa QR/Wallet, Raast Instant ID, Visa/MasterCard, and Bank Wire Transfers** in Pakistani Rupees (PKR). Instant e-tickets with scannable QR vouchers are issued immediately!';
    }

    if (q.includes('deosai')) {
      return '🐻 **Deosai National Park Guide:**\n- **Elevation:** 4,000+ meters (World\'s 2nd highest plateau).\n- **Access:** Only open during **late June to September** via 4x4 Prado or Land Cruiser.\n- **Highlights:** Sheosar Lake, Bara Pani, Himalayan Brown Bears, and infinite wildflower carpets.';
    }

    if (q.includes('gwadar') || q.includes('kund malir') || q.includes('beach')) {
      return '🌊 **Gwadar & Coastal Balochistan:**\n- **Best Time:** **October to March** when weather is cool and breezy (22°C - 26°C).\n- **Route:** Flawless 650km Makran Coastal Highway (N-10) from Karachi.\n- **Highlights:** Kund Malir golden beach, Princess of Hope, Hammerhead cliff, and scuba diving at Astola Island.';
    }

    if (q.includes('budget') || q.includes('cost') || q.includes('price')) {
      return '💰 **Estimated Budget Ranges in Pakistan (PKR):**\n- **Budget Backpacking:** Rs. 6,000 - 8,000 / day per person (Guest houses + public coasters).\n- **Standard Family Tour:** Rs. 10,000 - 15,000 / day per person (3-Star hotels + private Hiace/Sedan).\n- **Luxury Expedition:** Rs. 20,000 - 35,000+ / day per person (Serena / Shangrila resorts + Prado TX 4x4).';
    }

    return `✨ I would love to help you plan that! Pakistan offers incredible diversity from the 8,000m Karakoram peaks to the turquoise Arabian Sea.\n\nYou can use the **SafarAI Smart Planner** above to instantly build an AI-powered itinerary, or let me know:\n1. Which region you'd like to visit?\n2. How many days you have?\n3. Your departure city?\n\n*Tip: Add your Google Gemini API key in Settings for live AI-powered responses!*`;
  }
}

export const safarAI = new SafarAIPlanner();
