import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════
// SUPABASE CLIENT — connects ForkStep to its real database
// ═══════════════════════════════════════════════════════

const SUPABASE_URL = "https://qsmddahzjehhlkirfjez.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable__584-JHbtsvKMV-sgBOTcw_QzhGaACK";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ═══════════════════════════════════════════════════════
// DATA LAYER
// ═══════════════════════════════════════════════════════

const FOOD_DB = [
  { id:"f1",  name:"Chicken Breast (cooked)", cal:165, p:31, c:0,  f:3.6, unit:"100g", aff:{store:"ButcherBox",url:"https://butcherbox.com"} },
  { id:"f2",  name:"Salmon Fillet",           cal:208, p:20, c:0,  f:13,  unit:"100g", aff:{store:"Vital Choice",url:"https://vitalchoice.com"} },
  { id:"f3",  name:"Whey Protein Isolate",    cal:110, p:25, c:2,  f:1,   unit:"1 scoop (30g)", aff:{store:"Amazon",url:"https://amzn.to/whey"} },
  { id:"f4",  name:"Casein Protein",          cal:120, p:24, c:3,  f:1,   unit:"1 scoop (33g)", aff:{store:"Amazon",url:"https://amzn.to/casein"} },
  { id:"f5",  name:"Egg Whites",              cal:52,  p:11, c:0.7,f:0.2, unit:"100ml", aff:null },
  { id:"f6",  name:"Whole Eggs",              cal:155, p:13, c:1.1,f:11,  unit:"100g (2 large)", aff:null },
  { id:"f7",  name:"Greek Yogurt (0% fat)",   cal:59,  p:10, c:3.6,f:0.4, unit:"100g", aff:null },
  { id:"f8",  name:"Cottage Cheese",          cal:72,  p:12, c:3.1,f:1,   unit:"100g", aff:null },
  { id:"f9",  name:"Ground Turkey (93%)",     cal:170, p:20, c:0,  f:9,   unit:"100g", aff:{store:"ButcherBox",url:"https://butcherbox.com"} },
  { id:"f10", name:"Tuna (canned, water)",    cal:116, p:26, c:0,  f:1,   unit:"100g", aff:{store:"Amazon",url:"https://amzn.to/tuna"} },
  { id:"f11", name:"Beef Sirloin (lean)",     cal:207, p:26, c:0,  f:11,  unit:"100g", aff:{store:"ButcherBox",url:"https://butcherbox.com"} },
  { id:"f12", name:"Tempeh",                  cal:193, p:19, c:9,  f:11,  unit:"100g", aff:null },
  { id:"f13", name:"Tofu (extra firm)",       cal:80,  p:8,  c:2,  f:4,   unit:"100g", aff:null },
  { id:"f14", name:"Vega Sport Protein",      cal:140, p:30, c:5,  f:2.5, unit:"1 scoop", aff:{store:"Amazon",url:"https://amzn.to/vegasport"} },
  { id:"f15", name:"Shrimp (cooked)",         cal:99,  p:24, c:0.2,f:0.3, unit:"100g", aff:null },
  { id:"c1",  name:"Rolled Oats",             cal:389, p:17, c:66, f:7,   unit:"100g dry", aff:{store:"Amazon",url:"https://amzn.to/oats"} },
  { id:"c2",  name:"Brown Rice (cooked)",     cal:112, p:2.6,c:23, f:0.9, unit:"100g", aff:null },
  { id:"c3",  name:"White Rice (cooked)",     cal:130, p:2.7,c:28, f:0.3, unit:"100g", aff:null },
  { id:"c4",  name:"Sweet Potato",            cal:86,  p:1.6,c:20, f:0.1, unit:"100g", aff:null },
  { id:"c5",  name:"Quinoa (cooked)",         cal:120, p:4.4,c:21, f:1.9, unit:"100g", aff:{store:"Amazon",url:"https://amzn.to/quinoa"} },
  { id:"c6",  name:"Pasta (cooked)",          cal:158, p:5.8,c:31, f:0.9, unit:"100g", aff:null },
  { id:"c7",  name:"Banana",                  cal:89,  p:1.1,c:23, f:0.3, unit:"1 medium", aff:null },
  { id:"c8",  name:"White Bagel",             cal:270, p:10, c:53, f:1.5, unit:"1 large", aff:null },
  { id:"c9",  name:"Blueberries",             cal:57,  p:0.7,c:14, f:0.3, unit:"100g", aff:null },
  { id:"c10", name:"Apple",                   cal:52,  p:0.3,c:14, f:0.2, unit:"1 medium", aff:null },
  { id:"c11", name:"GU Energy Gel",           cal:100, p:0,  c:22, f:0,   unit:"1 gel", aff:{store:"GU Energy",url:"https://guenergy.com"} },
  { id:"c12", name:"Maurten 320",             cal:320, p:0,  c:80, f:0,   unit:"1 bottle", aff:{store:"Maurten",url:"https://maurten.com"} },
  { id:"a1",  name:"Avocado",                 cal:160, p:2,  c:9,  f:15,  unit:"100g", aff:null },
  { id:"a2",  name:"Peanut Butter",           cal:588, p:25, c:20, f:50,  unit:"100g", aff:{store:"Amazon",url:"https://amzn.to/pb"} },
  { id:"a3",  name:"Almonds",                 cal:579, p:21, c:22, f:50,  unit:"100g", aff:null },
  { id:"a4",  name:"Olive Oil",               cal:884, p:0,  c:0,  f:100, unit:"100ml", aff:null },
  { id:"a5",  name:"Chia Seeds",              cal:486, p:17, c:42, f:31,  unit:"100g", aff:null },
  { id:"v1",  name:"Broccoli",                cal:34,  p:2.8,c:7,  f:0.4, unit:"100g", aff:null },
  { id:"v2",  name:"Spinach",                 cal:23,  p:2.9,c:3.6,f:0.4, unit:"100g", aff:null },
  { id:"v3",  name:"Asparagus",               cal:20,  p:2.2,c:3.7,f:0.1, unit:"100g", aff:null },
  { id:"v4",  name:"Edamame (shelled)",       cal:121, p:11, c:9,  f:5,   unit:"100g", aff:null },
  { id:"v5",  name:"Mixed Greens",            cal:20,  p:2,  c:3,  f:0.2, unit:"100g", aff:null },
  { id:"d1",  name:"Whole Milk",              cal:61,  p:3.2,c:4.8,f:3.3, unit:"100ml", aff:null },
  { id:"d2",  name:"Almond Milk (unsweetened)",cal:13, p:0.4,c:0.3,f:1.1, unit:"100ml", aff:null },
  { id:"d3",  name:"RXBAR",                   cal:210, p:12, c:24, f:9,   unit:"1 bar", aff:{store:"Amazon",url:"https://amzn.to/rxbar"} },
  { id:"d4",  name:"Black Beans (cooked)",    cal:132, p:8.9,c:24, f:0.5, unit:"100g", aff:null },
  { id:"d5",  name:"Chickpeas (cooked)",      cal:164, p:8.9,c:27, f:2.6, unit:"100g", aff:null },
  { id:"d6",  name:"Almond Butter",           cal:614, p:21, c:19, f:56,  unit:"100g", aff:{store:"Amazon",url:"https://amzn.to/almondbuttr"} },
];

const MEAL_SLOTS = ["Breakfast","Morning Snack","Lunch","Afternoon Snack","Pre-Workout","Post-Workout","Dinner","Evening Snack"];

const RANKS = [
  { name:"Rookie",    min:0,    icon:"🥉", color:"#CD7F32" },
  { name:"Contender", min:200,  icon:"🥈", color:"#A8A9AD" },
  { name:"Athlete",   min:500,  icon:"🥇", color:"#FFD700" },
  { name:"Elite",     min:1000, icon:"⚡", color:"#C8F135" },
  { name:"Legend",    min:2500, icon:"🔥", color:"#FF6B35" },
];
const getRank = (pts) => [...RANKS].reverse().find(r => pts >= r.min) || RANKS[0];

// ─── FEED RANKING ALGORITHM ──────────────────────────────────────────────────
// Score = engagement_rate × recency × sport_match × graph_proximity
// Higher score = higher in feed
function scorePost(post, userSport, following) {
  const now = Date.now();
  const ageHours = (now - (post._ts || now - 86400000)) / 3_600_000;
  const recency  = Math.max(0.05, 1 / (1 + ageHours / 12)); // half-life 12h
  const engRate  = (post.kudos + post.comments.length * 3) / Math.max(1, post.user.followers / 1000);
  const sportMatch = post.user.sport?.toLowerCase() === userSport?.toLowerCase() ? 1.8 : 1;
  const graphProx  = following.includes(post.userId) ? 2.2 : 1;
  return recency * Math.log1p(engRate) * sportMatch * graphProx;
}

// Attach mock timestamps to seed posts
const NOW = Date.now();
const SEED_POSTS = [
  {
    id:1, userId:"u1", user:SEED_USERS[0],
    date:"2h ago", _ts: NOW - 2*3600000,
    title:"Competition Prep – 8 Weeks Out",
    macros:{ protein:210, carbs:180, fat:55, calories:2055 },
    meals:[
      { name:"Pre-Workout Oats", time:"6:00 AM", items:[
        { name:"Rolled Oats", qty:"100g", cals:389, p:17, c:66, f:7, aff:{store:"Amazon",url:"https://amzn.to/oats"} },
        { name:"Whey Isolate", qty:"1 scoop", cals:110, p:25, c:2, f:1, aff:{store:"Amazon",url:"https://amzn.to/whey"} },
        { name:"Blueberries", qty:"80g", cals:46, p:0.6, c:11, f:0.2, aff:null },
      ]},
      { name:"Lean Lunch Bowl", time:"12:00 PM", items:[
        { name:"Chicken Breast", qty:"200g", cals:330, p:62, c:0, f:7.2, aff:{store:"ButcherBox",url:"https://butcherbox.com"} },
        { name:"Brown Rice", qty:"150g", cals:168, p:3.9, c:34.5, f:1.4, aff:null },
        { name:"Broccoli", qty:"1 cup", cals:34, p:2.8, c:7, f:0.4, aff:null },
      ]},
    ],
    kudos:847, comments:[
      { id:"c1", userId:"u2", user:SEED_USERS[1], text:"This macro split for comp prep is 🔥 what's your protein goal per lb?", time:"1h ago", likes:12 },
      { id:"c2", userId:"u3", user:SEED_USERS[2], text:"Incredible discipline. How many weeks out did you start cutting carbs?", time:"45m ago", likes:7 },
      { id:"c3", userId:"u5", user:SEED_USERS[4], text:"As a nutritionist I love seeing this. Clean and dialed in.", time:"20m ago", likes:21 },
    ],
    coverPhotos:["https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=80","https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=700&q=80"],
    tags:["#CompetitionPrep","#PowerLifting","#MacroTracking"],
  },
  {
    id:2, userId:"u2", user:SEED_USERS[1],
    date:"Yesterday", _ts: NOW - 26*3600000,
    title:"Marathon Training – Long Run Day (22 miles) 🏃",
    macros:{ protein:155, carbs:420, fat:70, calories:2950 },
    meals:[
      { name:"Pre-Run Breakfast", time:"5:30 AM", items:[
        { name:"White Bagel", qty:"2 large", cals:540, p:20, c:106, f:3, aff:null },
        { name:"Peanut Butter", qty:"2 tbsp", cals:188, p:8, c:6.4, f:16, aff:{store:"Amazon",url:"https://amzn.to/pb"} },
        { name:"Banana", qty:"1 large", cals:89, p:1.1, c:23, f:0.3, aff:null },
      ]},
      { name:"Mid-Run Fuel", time:"During run", items:[
        { name:"GU Energy Gels", qty:"4 gels", cals:400, p:0, c:88, f:0, aff:{store:"GU Energy",url:"https://guenergy.com"} },
        { name:"Maurten 320", qty:"1 bottle", cals:320, p:0, c:80, f:0, aff:{store:"Maurten",url:"https://maurten.com"} },
      ]},
    ],
    kudos:1204, comments:[
      { id:"c4", userId:"u5", user:SEED_USERS[4], text:"Maurten is a game changer for long runs. What's your carb/hr target?", time:"10h ago", likes:34 },
      { id:"c5", userId:"u8", user:SEED_USERS[7], text:"Fellow endurance athlete here — have you tried Precision Hydration?", time:"8h ago", likes:5 },
    ],
    coverPhotos:["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80"],
    tags:["#MarathonTraining","#EnduranceFuel","#CarbLoad"],
  },
  {
    id:3, userId:"u3", user:SEED_USERS[2],
    date:"2 days ago", _ts: NOW - 50*3600000,
    title:"Plant-Based Day 🌱 – Hitting 160g Protein",
    macros:{ protein:162, carbs:280, fat:65, calories:2365 },
    meals:[
      { name:"Green Power Smoothie", time:"7:00 AM", items:[
        { name:"Vega Sport Protein", qty:"2 scoops", cals:280, p:60, c:10, f:5, aff:{store:"Amazon",url:"https://amzn.to/vegasport"} },
        { name:"Spinach", qty:"60g", cals:14, p:1.7, c:2.2, f:0.2, aff:null },
        { name:"Banana", qty:"1 medium", cals:89, p:1.1, c:23, f:0.3, aff:null },
      ]},
      { name:"Tofu Power Bowl", time:"1:00 PM", items:[
        { name:"Tofu (extra firm)", qty:"300g", cals:240, p:24, c:6, f:12, aff:null },
        { name:"Quinoa (cooked)", qty:"180g", cals:216, p:7.9, c:37.8, f:3.4, aff:{store:"Amazon",url:"https://amzn.to/quinoa"} },
        { name:"Edamame (shelled)", qty:"100g", cals:121, p:11, c:9, f:5, aff:null },
      ]},
    ],
    kudos:2341, comments:[
      { id:"c6", userId:"u1", user:SEED_USERS[0], text:"160g on plants is insane! Leila you're a legend 👏", time:"1d ago", likes:89 },
      { id:"c7", userId:"u4", user:SEED_USERS[3], text:"ok you've convinced me to try Vega Sport. been avoiding plant-based protein for years", time:"1d ago", likes:43 },
    ],
    coverPhotos:["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80","https://images.unsplash.com/photo-1540914124281-342587941389?w=700&q=80","https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&q=80"],
    tags:["#PlantBased","#VeganAthlete","#HighProtein"],
  },
];

// ─── WEEKLY LEADERBOARD ──────────────────────────────────────────────────────
const LEADERBOARD = {
  "Powerlifting": [
    { user:SEED_USERS[0], logs:7, streak:14, topKudos:847 },
    { user:SEED_USERS[3], logs:5, streak:7,  topKudos:312 },
    { user:{...SEED_USERS[5], name:"Jake W."}, logs:4, streak:5, topKudos:188 },
  ],
  "Marathon": [
    { user:SEED_USERS[1], logs:7, streak:31, topKudos:1204 },
    { user:SEED_USERS[4], logs:6, streak:19, topKudos:540 },
    { user:SEED_USERS[7], logs:4, streak:3,  topKudos:220 },
  ],
  "CrossFit": [
    { user:SEED_USERS[2], logs:7, streak:22, topKudos:2341 },
    { user:SEED_USERS[5], logs:6, streak:5,  topKudos:634 },
    { user:SEED_USERS[6], logs:5, streak:11, topKudos:441 },
  ],
  "Bodybuilding": [
    { user:SEED_USERS[3], logs:6, streak:7,  topKudos:312 },
    { user:SEED_USERS[0], logs:5, streak:14, topKudos:290 },
    { user:SEED_USERS[5], logs:3, streak:5,  topKudos:155 },
  ],
  "Cycling": [
    { user:SEED_USERS[7], logs:7, streak:3,  topKudos:220 },
    { user:SEED_USERS[1], logs:4, streak:31, topKudos:180 },
    { user:SEED_USERS[4], logs:3, streak:19, topKudos:140 },
  ],
};

const ME = {
  id:"me", name:"You", handle:"@you", avatar:"ME", tier:"PRO",
  points:340, sport:"Weightlifting", followers:24, following:7,
  bio:"Just started my fitness journey. Logging every day 💪", streak:3,
};

// ═══════════════════════════════════════════════════════
// DESIGN TOKENS — light (B) + dark (A) themes
// ═══════════════════════════════════════════════════════

const LIGHT = {
  bg:"#F2F0EA", card:"#FFFFFF", surface:"#E8E5DC", border:"#E0DDD5", border2:"#CCCCB8",
  lime:"#3A9A5C", blue:"#185FA5", orange:"#993C1D",
  text:"#1B3A2A", muted:"#7A9A88", purple:"#7B2D8B",
  accent:"#3A9A5C", deep:"#0A0A0A",
  navBg:"rgba(242,240,234,0.97)",
  macroP:"#EAF3E6", macroPtext:"#27500A",
  macroC:"#E6F1FB", macroCtext:"#0C447C",
  macroF:"#FAECE7", macroFtext:"#712B13",
  tagBg:"#EAF3E6", tagText:"#27500A",
  kudosActive:"#EAF3E6", kudosActiveBorder:"#3A9A5C", kudosActiveText:"#1B3A2A",
  streakBg:"#EAF3E6", streakBorder:"rgba(58,154,92,0.3)", streakText:"#1B3A2A",
  statCard:"#EAF3E6",
  ring1:"#3A9A5C", ring2:"#185FA5", ring3:"#993C1D", ringTrack:"#E0DDD5",
};

const DARK = {
  bg:"#0C1810", card:"#111F16", surface:"#18291F", border:"#1E3328", border2:"#2A4A36",
  lime:"#5FCF7A", blue:"#4FC3F7", orange:"#FF8A65",
  text:"#F7F6F1", muted:"#7A9A88", purple:"#BF5AF2",
  accent:"#3A9A5C", deep:"#1B3A2A",
  navBg:"rgba(12,24,16,0.97)",
  macroP:"#1B3A2A", macroPtext:"#5FCF7A",
  macroC:"#0C2A3A", macroCtext:"#4FC3F7",
  macroF:"#2A1A10", macroFtext:"#FF8A65",
  tagBg:"rgba(79,195,247,0.12)", tagText:"#4FC3F7",
  kudosActive:"rgba(95,207,122,0.15)", kudosActiveBorder:"#5FCF7A", kudosActiveText:"#5FCF7A",
  streakBg:"#1B3A2A", streakBorder:"rgba(95,207,122,0.25)", streakText:"#5FCF7A",
  statCard:"#18291F",
  ring1:"#5FCF7A", ring2:"#4FC3F7", ring3:"#FF8A65", ringTrack:"#1E3328",
};

const ThemeCtx = { current: LIGHT };
const getC = () => ThemeCtx.current;

function MacroRing({ protein=0, carbs=0, fat=0, size=72 }) {
  const C = getC();
  const total = protein*4 + carbs*4 + fat*9 || 1;
  const circ = 2*Math.PI*(size*0.36);
  const segs = [{ pct:(protein*4)/total, col:C.ring1 },{ pct:(carbs*4)/total, col:C.ring2 },{ pct:(fat*9)/total, col:C.ring3 }];
  let off = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={size*0.36} fill="none" stroke={C.ringTrack} strokeWidth={size*0.1}/>
      {segs.map((s,i)=>{ const d=s.pct*circ; const so=circ-off*circ; off+=s.pct;
        return <circle key={i} cx={size/2} cy={size/2} r={size*0.36} fill="none" stroke={s.col}
          strokeWidth={size*0.1} strokeDasharray={`${d} ${circ-d}`} strokeDashoffset={so}
          style={{transform:"rotate(-90deg)",transformOrigin:"center"}}/>;
      })}
    </svg>
  );
}

function MacroPills({ protein, carbs, fat }) {
  const C = getC();
  return (
    <div style={{display:"flex",gap:8,flex:1}}>
      {[["Protein",protein,C.macroP,C.macroPtext],["Carbs",carbs,C.macroC,C.macroCtext],["Fat",fat,C.macroF,C.macroFtext]].map(([l,v,bg,tc])=>(
        <div key={l} style={{flex:1,background:bg,borderRadius:8,padding:"7px 8px"}}>
          <div style={{color:tc,fontSize:15,fontWeight:800,fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>{v}g</div>
          <div style={{color:tc,fontSize:9,opacity:0.7,letterSpacing:"0.07em",marginTop:2}}>{l.toUpperCase()}</div>
        </div>
      ))}
    </div>
  );
}

function Avatar({ user, size=40, onClick }) {
  const C = getC();
  const colors = { u1:"#1B3A2A,#5FCF7A", u2:"#3A9A5C,#4FC3F7", u3:"#5FCF7A,#1B3A2A", u4:"#3A9A5C,#FF8A65", u5:"#7A9A88,#5FCF7A", u6:"#FF8A65,#3A9A5C", u7:"#5FCF7A,#7A9A88", u8:"#4FC3F7,#3A9A5C", me:"#1B3A2A,#5FCF7A" };
  const grad = colors[user.id] || "#1B3A2A,#5FCF7A";
  return (
    <div onClick={onClick} style={{ width:size, height:size, borderRadius:"50%", flexShrink:0,
      background:`linear-gradient(135deg,${grad.split(",")[0]},${grad.split(",")[1]})`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontWeight:800, fontSize:size*0.3, color:"#F7F6F1", fontFamily:"Space Grotesk,sans-serif",
      cursor:onClick?"pointer":"default" }}>
      {user.avatar}
    </div>
  );
}

function TierBadge({ tier }) {
  const C = getC();
  const map = { PRO:{bg:C.lime,c:C.deep}, ELITE:{bg:"#FFD700",c:C.deep}, CREATOR:{bg:C.purple,c:"#fff"} };
  const s = map[tier]||{bg:C.muted,c:"#fff"};
  return <span style={{background:s.bg,color:s.c,fontSize:9,fontWeight:800,padding:"2px 6px",borderRadius:3,letterSpacing:"0.08em",fontFamily:"Space Grotesk,sans-serif"}}>{tier}</span>;
}

function AffiliateBtn({ store, url }) {
  const C = getC();
  return <a href={url} target="_blank" rel="noopener noreferrer"
    style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:4,
      border:`1px solid ${C.lime}`,color:C.lime,fontSize:11,fontWeight:700,
      textDecoration:"none",whiteSpace:"nowrap",fontFamily:"Space Grotesk,sans-serif"}}>
    🛒 {store}
  </a>;
}

function Toast({ msg, onDone }) {
  const C = getC();
  useEffect(()=>{ const t=setTimeout(onDone,2400); return ()=>clearTimeout(t); },[]);
  return <div style={{position:"fixed",top:66,right:16,zIndex:9999,background:C.lime,color:C.deep,
    padding:"10px 18px",borderRadius:10,fontWeight:800,fontSize:14,fontFamily:"Space Grotesk,sans-serif",
    animation:"slideIn 0.3s ease",boxShadow:`0 4px 20px ${C.lime}40`}}>{msg}</div>;
}

// ═══════════════════════════════════════════════════════
// FOOD SEARCH MODAL — Live APIs (USDA + Open Food Facts)
// ═══════════════════════════════════════════════════════

const UNITS = ["g", "oz", "lb"];
const toGrams = (val, unit) => {
  const v = +val || 0;
  if (unit === "oz") return +(v * 28.3495).toFixed(1);
  if (unit === "lb") return +(v * 453.592).toFixed(1);
  return v;
};
const unitDefaults = { g:"100", oz:"3.5", lb:"0.22" };

const USDA_KEY = "DEMO_KEY";
async function searchUSDA(query) {
  try {
    const res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=15&dataType=Foundation,SR%20Legacy,Branded&api_key=${USDA_KEY}`
    );
    const data = await res.json();
    return (data.foods || []).map(f => {
      const n = (id) => (f.foodNutrients?.find(n => n.nutrientId === id)?.value) || 0;
      return {
        id: `usda_${f.fdcId}`,
        name: f.description,
        brand: f.brandOwner || f.brandName || "",
        cal: Math.round(n(1008)),
        p: +n(1003).toFixed(1),
        c: +n(1005).toFixed(1),
        f: +n(1004).toFixed(1),
        unit: "100g",
        source: "USDA",
        aff: null,
      };
    }).filter(f => f.cal > 0);
  } catch { return []; }
}

async function searchOFF(query) {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=15&fields=product_name,brands,nutriments,code`
    );
    const data = await res.json();
    return (data.products || []).map(p => {
      const n = p.nutriments || {};
      return {
        id: `off_${p.code}`,
        name: p.product_name || "Unknown",
        brand: p.brands || "",
        cal: Math.round(n["energy-kcal_100g"] || (n["energy_100g"] || 0) / 4.184),
        p: +((n.proteins_100g) || 0).toFixed(1),
        c: +((n.carbohydrates_100g) || 0).toFixed(1),
        f: +((n.fat_100g) || 0).toFixed(1),
        unit: "100g",
        source: "Open Food Facts",
        aff: null,
      };
    }).filter(f => f.name && f.name !== "Unknown" && f.cal > 0);
  } catch { return []; }
}

async function lookupBarcode(barcode) {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await res.json();
    if (data.status !== 1) return null;
    const p = data.product;
    const n = p.nutriments || {};
    return {
      id: `off_${barcode}`,
      name: p.product_name || "Unknown",
      brand: p.brands || "",
      cal: Math.round(n["energy-kcal_100g"] || 0),
      p: +((n.proteins_100g) || 0).toFixed(1),
      c: +((n.carbohydrates_100g) || 0).toFixed(1),
      f: +((n.fat_100g) || 0).toFixed(1),
      unit: "100g",
      source: "Open Food Facts",
      aff: null,
    };
  } catch { return null; }
}

function SourceBadge({ source }) {
  const cfg = {
    "USDA":            { bg:"#1B3A2A", c:"#5FCF7A", label:"USDA" },
    "Open Food Facts": { bg:"#1A2A3A", c:"#4FC3F7", label:"OFF"  },
    "Local":           { bg:"#2A1A2A", c:"#BF5AF2", label:"LOCAL"},
  };
  const s = cfg[source] || cfg["Local"];
  return (
    <span style={{background:s.bg,color:s.c,fontSize:9,fontWeight:800,padding:"2px 5px",
      borderRadius:4,letterSpacing:"0.07em",fontFamily:"Space Grotesk,sans-serif",flexShrink:0}}>
      {s.label}
    </span>
  );
}
function FoodSearchModal({ onSelect, onClose }) {
  const C = getC();
  const [tab, setTab]           = useState("search");
  const [q, setQ]               = useState("");
  const [sel, setSel]           = useState(null);
  const [unit, setUnit]         = useState("g");
  const [qty, setQty]           = useState("100");
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [barcode, setBarcode]   = useState("");
  const [barcodeResult, setBarcodeResult] = useState(null);
  const [barcodeLoading, setBarcodeLoading] = useState(false);
  const [barcodeError, setBarcodeError]   = useState("");
  const searchRef   = useRef();
  const barcodeRef  = useRef();
  const debounceRef = useRef();

  useEffect(() => { searchRef.current?.focus(); }, []);
  useEffect(() => { if (tab === "barcode") setTimeout(() => barcodeRef.current?.focus(), 50); }, [tab]);

  useEffect(() => {
    setSel(null);
    if (!q.trim()) {
      setResults(FOOD_DB.slice(0, 18).map(f => ({...f, source:"Local"})));
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const [usda, off] = await Promise.all([searchUSDA(q), searchOFF(q)]);
      const local = FOOD_DB
        .filter(f => f.name.toLowerCase().includes(q.toLowerCase()))
        .map(f => ({...f, source:"Local"}));
      const merged = [...usda, ...off, ...local];
      const seen = new Set();
      const deduped = merged.filter(f => {
        const key = f.name.toLowerCase().slice(0, 30);
        if (seen.has(key)) return false;
        seen.add(key); return true;
      });
      setResults(deduped.slice(0, 24));
      setLoading(false);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [q]);

  useEffect(() => {
    setResults(FOOD_DB.slice(0, 18).map(f => ({...f, source:"Local"})));
  }, []);

  const switchUnit = (u) => { setUnit(u); setQty(unitDefaults[u]); };
  const grams = toGrams(qty, unit);
  const scaleMacro = (per100) => +((per100 / 100) * grams).toFixed(1);
  const qtyLabel = () => {
    const v = +qty || 0;
    if (unit === "oz") return `${v} oz (${grams}g)`;
    if (unit === "lb") return `${v} lb (${grams}g)`;
    return `${v}g`;
  };
  const buildItem = (food) => ({
    name: food.brand ? `${food.name} — ${food.brand}` : food.name,
    qty: qtyLabel(),
    cals: scaleMacro(food.cal),
    p: scaleMacro(food.p),
    c: scaleMacro(food.c),
    f: scaleMacro(food.f),
    aff: food.aff || null,
  });

  const handleBarcodeLookup = async () => {
    if (!barcode.trim()) return;
    setBarcodeLoading(true); setBarcodeError(""); setBarcodeResult(null);
    const result = await lookupBarcode(barcode.trim());
    if (result) { setBarcodeResult(result); }
    else { setBarcodeError("Product not found. Try a different barcode."); }
    setBarcodeLoading(false);
  };

  const activeSel = tab === "barcode" ? barcodeResult : sel;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.93)",zIndex:3000,
      display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px"}}>
      <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border2}`,
        width:"100%",maxWidth:500,maxHeight:"85vh",display:"flex",flexDirection:"column"}}>

        <div style={{padding:"14px 18px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:C.text,fontWeight:800,fontSize:15,fontFamily:"Space Grotesk,sans-serif"}}>Add Food</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:22,cursor:"pointer",lineHeight:1}}>×</button>
        </div>

        <div style={{display:"flex",gap:0,padding:"10px 18px 0",borderBottom:`1px solid ${C.border}`}}>
          {[["search","🔍 Search"],["barcode","📦 Barcode"]].map(([t,label])=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{padding:"7px 16px",background:"none",border:"none",cursor:"pointer",
                fontFamily:"Space Grotesk,sans-serif",fontWeight:700,fontSize:12,
                color:tab===t?C.lime:C.muted,
                borderBottom:tab===t?`2px solid ${C.lime}`:"2px solid transparent",
                marginBottom:-1,transition:"0.15s"}}>
              {label}
            </button>
          ))}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,paddingBottom:8}}>
            <span style={{fontSize:10,color:C.muted,fontFamily:"Inter,sans-serif"}}>Powered by</span>
            <span style={{fontSize:9,fontWeight:700,color:"#5FCF7A",fontFamily:"Space Grotesk,sans-serif"}}>USDA</span>
            <span style={{fontSize:9,color:C.muted}}>+</span>
            <span style={{fontSize:9,fontWeight:700,color:"#4FC3F7",fontFamily:"Space Grotesk,sans-serif"}}>Open Food Facts</span>
          </div>
        </div>

        {tab === "search" && (<>
          <div style={{padding:"10px 18px",borderBottom:`1px solid ${C.border}`}}>
            <div style={{position:"relative"}}>
              <input ref={searchRef} value={q} onChange={e=>{setQ(e.target.value);setSel(null);}}
                placeholder="Search any food, brand, or ingredient…"
                style={{width:"100%",padding:"9px 13px 9px 36px",background:C.bg,border:`1px solid ${C.border2}`,
                  borderRadius:9,color:C.text,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"Inter,sans-serif"}}/>
              <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none"}}>
                {loading ? "⏳" : "🔍"}
              </span>
            </div>
            {q && !loading && (
              <div style={{fontSize:11,color:C.muted,marginTop:5,fontFamily:"Inter,sans-serif"}}>
                {results.length} results · USDA + Open Food Facts + local
              </div>
            )}
          </div>
          <div style={{overflowY:"auto",flex:1}}>
            {results.length === 0 && !loading && q && (
              <div style={{padding:"40px 20px",textAlign:"center",color:C.muted,fontFamily:"Inter,sans-serif"}}>
                No results. Try a different search term.
              </div>
            )}
            {loading && (
              <div style={{padding:"30px 20px",textAlign:"center",color:C.muted,fontFamily:"Inter,sans-serif"}}>
                Searching USDA + Open Food Facts…
              </div>
            )}
            {!loading && results.map((f,i) => (
              <div key={f.id||i} onClick={()=>setSel(f)}
                style={{padding:"10px 18px",cursor:"pointer",display:"flex",justifyContent:"space-between",
                  alignItems:"center",borderBottom:`1px solid ${C.border}`,
                  background:sel?.id===f.id?C.surface:"transparent",transition:"background 0.1s",gap:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
                    <span style={{color:C.text,fontSize:13,fontWeight:sel?.id===f.id?700:400,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:220}}>{f.name}</span>
                    <SourceBadge source={f.source||"Local"}/>
                  </div>
                  {f.brand && <div style={{color:C.muted,fontSize:11,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{f.brand}</div>}
                  <div style={{color:C.muted,fontSize:11}}>per {f.unit}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{color:C.lime,fontSize:13,fontWeight:700}}>{f.cal} kcal</div>
                  <div style={{color:C.muted,fontSize:10}}>P{f.p} C{f.c} F{f.f}</div>
                </div>
              </div>
            ))}
          </div>
        </>)}

        {tab === "barcode" && (
          <div style={{padding:"18px",display:"flex",flexDirection:"column",gap:12,flex:1}}>
            <div style={{color:C.muted,fontSize:13,fontFamily:"Inter,sans-serif",lineHeight:1.6}}>
              Enter a product barcode (EAN-13 or UPC-A) to pull nutrition data from Open Food Facts — 2.5M+ products worldwide.
            </div>
            <div style={{display:"flex",gap:8}}>
              <input ref={barcodeRef} value={barcode} onChange={e=>setBarcode(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleBarcodeLookup()}
                placeholder="e.g. 737628064502"
                style={{flex:1,padding:"10px 13px",background:C.bg,border:`1px solid ${C.border2}`,
                  borderRadius:9,color:C.text,fontSize:14,outline:"none",fontFamily:"Inter,sans-serif",
                  letterSpacing:"0.05em"}}/>
              <button onClick={handleBarcodeLookup} disabled={barcodeLoading||!barcode.trim()}
                style={{padding:"10px 16px",background:barcode.trim()?C.lime:C.border2,border:"none",
                  borderRadius:9,color:barcode.trim()?C.deep:C.muted,fontWeight:800,fontSize:13,
                  cursor:barcode.trim()?"pointer":"default",fontFamily:"Space Grotesk,sans-serif",whiteSpace:"nowrap"}}>
                {barcodeLoading ? "…" : "Look up"}
              </button>
            </div>
            {barcodeError && <div style={{color:C.orange,fontSize:13,fontFamily:"Inter,sans-serif"}}>{barcodeError}</div>}
            {barcodeResult && (
              <div style={{background:C.surface,borderRadius:10,padding:"14px",border:`1px solid ${C.lime}30`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{color:C.text,fontWeight:700,fontSize:14}}>{barcodeResult.name}</div>
                    {barcodeResult.brand&&<div style={{color:C.muted,fontSize:12,marginTop:2}}>{barcodeResult.brand}</div>}
                    <div style={{marginTop:6,display:"flex",gap:6,alignItems:"center"}}>
                      <SourceBadge source="Open Food Facts"/>
                      <span style={{color:C.muted,fontSize:11,fontFamily:"Inter,sans-serif"}}>per 100g</span>
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{color:C.lime,fontSize:20,fontWeight:800,fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>{barcodeResult.cal}</div>
                    <div style={{color:C.muted,fontSize:10}}>kcal</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:16}}>
                  {[["PROTEIN",barcodeResult.p,C.lime],["CARBS",barcodeResult.c,C.blue],["FAT",barcodeResult.f,C.orange]].map(([l,v,col])=>(
                    <div key={l}>
                      <div style={{color:col,fontSize:15,fontWeight:800,fontFamily:"Space Grotesk,sans-serif"}}>{v}g</div>
                      <div style={{color:C.muted,fontSize:9,letterSpacing:"0.07em"}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeSel && (
          <div style={{padding:"13px 18px",borderTop:`1px solid ${C.border}`,background:"#0A180E"}}>
            <div style={{color:C.lime,fontSize:12,fontWeight:700,marginBottom:9,fontFamily:"Space Grotesk,sans-serif",
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {activeSel.name}{activeSel.brand ? ` — ${activeSel.brand}` : ""}
            </div>
            <div style={{display:"flex",gap:0,marginBottom:9,background:C.surface,
              borderRadius:8,border:`1px solid ${C.border2}`,padding:3,width:"fit-content"}}>
              {UNITS.map(u=>(
                <button key={u} onClick={()=>switchUnit(u)}
                  style={{padding:"5px 16px",borderRadius:6,border:"none",cursor:"pointer",
                    fontWeight:700,fontSize:13,fontFamily:"Space Grotesk,sans-serif",transition:"all 0.15s",
                    background:unit===u?C.lime:"transparent",color:unit===u?C.deep:C.muted}}>
                  {u}
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{flex:1,position:"relative"}}>
                <input type="number" value={qty} onChange={e=>setQty(e.target.value)}
                  min="0" step={unit==="lb"?"0.01":"0.1"}
                  style={{width:"100%",padding:"9px 40px 9px 13px",background:C.surface,
                    border:`1px solid ${C.border2}`,borderRadius:9,color:C.text,fontSize:16,
                    fontWeight:700,outline:"none",boxSizing:"border-box",fontFamily:"Space Grotesk,sans-serif"}}/>
                <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                  color:C.muted,fontSize:12,fontWeight:700,pointerEvents:"none",fontFamily:"Space Grotesk,sans-serif"}}>
                  {unit}
                </span>
              </div>
              <button onClick={()=>{ if(activeSel&&qty&&+qty>0) onSelect(buildItem(activeSel)); }}
                disabled={!qty||+qty<=0}
                style={{padding:"9px 18px",background:qty&&+qty>0?C.lime:C.border2,border:"none",
                  borderRadius:9,color:qty&&+qty>0?C.deep:C.muted,fontWeight:800,fontSize:13,
                  cursor:qty&&+qty>0?"pointer":"default",fontFamily:"Space Grotesk,sans-serif",whiteSpace:"nowrap"}}>
                Add Food
              </button>
            </div>
            {qty && +qty > 0 && (
              <div style={{marginTop:9,display:"flex",alignItems:"center",gap:14,
                padding:"9px 12px",background:C.bg,borderRadius:8}}>
                <div>
                  <div style={{color:C.lime,fontSize:17,fontWeight:900,fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>
                    {scaleMacro(activeSel.cal)} kcal
                  </div>
                  {unit!=="g"&&<div style={{color:C.muted,fontSize:10,marginTop:1}}>({grams}g equiv.)</div>}
                </div>
                <div style={{display:"flex",gap:12}}>
                  {[["P",activeSel.p,C.lime],["C",activeSel.c,C.blue],["F",activeSel.f,C.orange]].map(([l,v,col])=>(
                    <div key={l} style={{textAlign:"center"}}>
                      <div style={{color:col,fontSize:13,fontWeight:800,fontFamily:"Space Grotesk,sans-serif"}}>{scaleMacro(v)}g</div>
                      <div style={{color:C.muted,fontSize:9,letterSpacing:"0.07em"}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// LOG DAY MODAL
// ═══════════════════════════════════════════════════════

// ─── Photo Upload helper ──────────────────────────────
function usePhotoUpload() {
  const readFile = (file) => new Promise((res, rej) => {
    if (!file) return rej();
    const reader = new FileReader();
    reader.onload = (e) => res(e.target.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
  const openPicker = (onResult, { multiple = false } = {}) => {
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = "image/*"; inp.multiple = multiple;
    inp.onchange = async () => {
      const files = Array.from(inp.files || []);
      if (!files.length) return;
      if (multiple) {
        const urls = await Promise.all(files.map(readFile));
        onResult(urls);
      } else {
        const url = await readFile(files[0]);
        onResult(url);
      }
    };
    inp.click();
  };
  return { openPicker };
}

// ─── Photo Grid (display uploaded photos) ────────────
function PhotoGrid({ photos, onRemove, compact = false }) {
  const C = getC();
  if (!photos?.length) return null;
  const single = photos.length === 1;
  return (
    <div style={{ display: "grid", gap: 3,
      gridTemplateColumns: single ? "1fr" : photos.length === 2 ? "1fr 1fr" : photos.length >= 3 ? "2fr 1fr" : "1fr",
      gridTemplateRows: single ? "auto" : "auto",
      borderRadius: compact ? 8 : 0, overflow: "hidden", marginBottom: compact ? 8 : 0 }}>
      {photos.map((src, i) => (
        <div key={i} style={{ position: "relative",
          gridColumn: !single && i === 0 && photos.length >= 3 ? "1" : "auto",
          gridRow:    !single && i === 0 && photos.length >= 3 ? "1 / span 2" : "auto" }}>
          <img src={src} alt="" style={{ width: "100%", height: single ? 320 : 180,
            objectFit: "cover", display: "block",
            filter: "brightness(0.95)" }}/>
          {/* Macro overlay on first photo */}
          {i === 0 && <div style={{ position:"absolute", bottom:0, left:0, right:0,
            background:"linear-gradient(transparent, rgba(10,10,15,0.88))",
            padding:"20px 12px 10px", pointerEvents:"none" }}/>}
          {onRemove && (
            <button onClick={() => onRemove(i)}
              style={{ position:"absolute", top:7, right:7, width:24, height:24,
                borderRadius:"50%", background:"rgba(0,0,0,0.7)", border:"none",
                color:"#fff", fontSize:14, cursor:"pointer", display:"flex",
                alignItems:"center", justifyContent:"center", lineHeight:1 }}>×</button>
          )}
          {photos.length > 3 && i === 2 && (
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.55)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#fff", fontWeight:800, fontSize:22, fontFamily:"Space Grotesk,sans-serif" }}>
              +{photos.length - 3}
            </div>
          )}
        </div>
      )).slice(0, 3)}
    </div>
  );
}

// ─── Macro Overlay (shown on top of cover photo in feed) ───
function MacroOverlay({ macros }) {
  const C = getC();
  return (
    <div style={{ padding:"10px 16px 14px", display:"flex", alignItems:"center", gap:14 }}>
      <MacroRing {...macros} size={56}/>
      <div style={{ display:"flex", gap:14 }}>
        {[["PROTEIN",macros.protein,C.lime],["CARBS",macros.carbs,C.blue],["FAT",macros.fat,C.orange]].map(([l,v,c])=>(
          <div key={l}>
            <div style={{color:c,fontSize:15,fontWeight:800,fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>{v}g</div>
            <div style={{color:C.muted,fontSize:9,letterSpacing:"0.08em",marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ marginLeft:"auto", textAlign:"right" }}>
        <div style={{color:C.lime,fontSize:17,fontWeight:800,fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>{macros.calories.toLocaleString()}</div>
        <div style={{color:C.muted,fontSize:9,letterSpacing:"0.06em"}}>KCAL</div>
      </div>
    </div>
  );
}


// ─── Inline Food Search Panel ────────────────────────────────────────────────
function InlineFoodSearch({ onSelect, onClose, C }) {
  const [q, setQ]             = useState("");
  const [sel, setSel]         = useState(null);
  const [unit, setUnit]       = useState("g");
  const [qty, setQty]         = useState("100");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef           = useRef();
  const inputRef              = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    setSel(null);
    if (!q.trim()) { setResults(FOOD_DB.slice(0,12).map(f=>({...f,source:"Local"}))); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const [usda, off] = await Promise.all([searchUSDA(q), searchOFF(q)]);
      const local = FOOD_DB.filter(f=>f.name.toLowerCase().includes(q.toLowerCase())).map(f=>({...f,source:"Local"}));
      const seen = new Set();
      const deduped = [...usda,...off,...local].filter(f=>{ const k=f.name.toLowerCase().slice(0,30); if(seen.has(k)) return false; seen.add(k); return true; });
      setResults(deduped.slice(0,16));
      setLoading(false);
    }, 380);
    return () => clearTimeout(debounceRef.current);
  }, [q]);

  useEffect(() => { setResults(FOOD_DB.slice(0,12).map(f=>({...f,source:"Local"}))); }, []);

  const switchUnit = (u) => { setUnit(u); setQty(unitDefaults[u]); };
  const grams = toGrams(qty, unit);
  const scale = (v) => +((v/100)*grams).toFixed(1);
  const qtyLabel = () => {
    const v = +qty||0;
    if (unit==="oz") return `${v} oz (${grams}g)`;
    if (unit==="lb") return `${v} lb (${grams}g)`;
    return `${v}g`;
  };

  const handleAdd = () => {
    if (!sel||!qty||+qty<=0) return;
    onSelect({ name:sel.brand?`${sel.name} — ${sel.brand}`:sel.name, qty:qtyLabel(),
      cals:scale(sel.cal), p:scale(sel.p), c:scale(sel.c), f:scale(sel.f), aff:sel.aff||null });
  };

  return (
    <div style={{borderTop:`1px solid ${C.border}`,background:C.bg}}>
      <div style={{padding:"10px 13px 6px",display:"flex",gap:8,alignItems:"center"}}>
        <div style={{flex:1,position:"relative"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:13,pointerEvents:"none",color:C.muted}}>{loading?"⏳":"🔍"}</span>
          <input ref={inputRef} value={q} onChange={e=>{setQ(e.target.value);setSel(null);}}
            placeholder="Search food, brand…"
            style={{width:"100%",padding:"8px 10px 8px 32px",background:C.surface,
              border:`1px solid ${C.border2}`,borderRadius:8,color:C.text,fontSize:13,
              outline:"none",boxSizing:"border-box",fontFamily:"Inter,sans-serif"}}/>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:18,cursor:"pointer",lineHeight:1,padding:"0 4px",flexShrink:0}}>×</button>
      </div>
      <div style={{maxHeight:200,overflowY:"auto"}}>
        {results.map((f,i)=>(
          <div key={f.id||i} onClick={()=>setSel(f)}
            style={{padding:"8px 13px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`,background:sel?.id===f.id?C.surface:"transparent",transition:"background 0.1s",gap:8}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                <span style={{color:C.text,fontSize:12,fontWeight:sel?.id===f.id?700:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200}}>{f.name}</span>
                <SourceBadge source={f.source||"Local"}/>
              </div>
              {f.brand&&<div style={{color:C.muted,fontSize:10,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.brand}</div>}
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{color:C.lime,fontSize:12,fontWeight:700}}>{f.cal} kcal</div>
              <div style={{color:C.muted,fontSize:10}}>P{f.p} C{f.c} F{f.f}</div>
            </div>
          </div>
        ))}
      </div>
      {sel&&(
        <div style={{padding:"10px 13px 12px",borderTop:`1px solid ${C.border}`,background:C.surface}}>
          <div style={{color:C.lime,fontSize:11,fontWeight:700,marginBottom:8,fontFamily:"Space Grotesk,sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sel.name}{sel.brand?` — ${sel.brand}`:""}</div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{display:"flex",background:C.bg,borderRadius:7,border:`1px solid ${C.border2}`,padding:2,flexShrink:0}}>
              {UNITS.map(u=>(
                <button key={u} onClick={()=>switchUnit(u)}
                  style={{padding:"4px 9px",borderRadius:5,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"Space Grotesk,sans-serif",transition:"all 0.12s",background:unit===u?C.lime:"transparent",color:unit===u?C.deep:C.muted}}>
                  {u}
                </button>
              ))}
            </div>
            <div style={{flex:1,position:"relative"}}>
              <input type="number" value={qty} onChange={e=>setQty(e.target.value)} min="0" step={unit==="lb"?"0.01":"1"}
                style={{width:"100%",padding:"7px 28px 7px 10px",background:C.bg,border:`1px solid ${C.border2}`,borderRadius:7,color:C.text,fontSize:14,fontWeight:700,outline:"none",boxSizing:"border-box",fontFamily:"Space Grotesk,sans-serif"}}/>
              <span style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:10,fontWeight:700,pointerEvents:"none",fontFamily:"Space Grotesk,sans-serif"}}>{unit}</span>
            </div>
            <button onClick={handleAdd} disabled={!qty||+qty<=0}
              style={{padding:"7px 14px",background:qty&&+qty>0?C.lime:C.border2,border:"none",borderRadius:7,color:qty&&+qty>0?C.deep:C.muted,fontWeight:800,fontSize:12,cursor:qty&&+qty>0?"pointer":"default",fontFamily:"Space Grotesk,sans-serif",whiteSpace:"nowrap",flexShrink:0}}>
              Add
            </button>
          </div>
          {qty&&+qty>0&&(
            <div style={{display:"flex",gap:12,marginTop:7,flexWrap:"wrap"}}>
              <span style={{color:C.lime,fontSize:12,fontWeight:700,fontFamily:"Space Grotesk,sans-serif"}}>{scale(sel.cal)} kcal</span>
              {unit!=="g"&&<span style={{color:C.muted,fontSize:11}}>({grams}g)</span>}
              {[["P",sel.p,C.lime],["C",sel.c,C.blue],["F",sel.f,C.orange]].map(([l,v,col])=>(
                <span key={l} style={{color:col,fontSize:11,fontFamily:"Space Grotesk,sans-serif"}}>{l} {scale(v)}g</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Log Day Modal ────────────────────────────────────
function LogDayModal({ onClose, onSubmit }) {
  const C = getC();
  const [title, setTitle]           = useState("");
  const [tags, setTags]             = useState("");
  const [meals, setMeals]           = useState([{ name:"Breakfast", items:[], photos:[], searchOpen:false }]);
  const [coverPhotos, setCoverPhotos] = useState([]);
  const { openPicker } = usePhotoUpload();

  const addMeal     = () => setMeals(m=>[...m,{name:MEAL_SLOTS[Math.min(m.length,MEAL_SLOTS.length-1)],items:[],photos:[],searchOpen:false}]);
  const removeItem  = (mi,ii) => setMeals(m=>m.map((ml,i)=>i===mi?{...ml,items:ml.items.filter((_,j)=>j!==ii)}:ml));
  const toggleSearch = (mi) => setMeals(m=>m.map((ml,i)=>i===mi?{...ml,searchOpen:!ml.searchOpen}:{...ml,searchOpen:false}));
  const closeSearch  = (mi) => setMeals(m=>m.map((ml,i)=>i===mi?{...ml,searchOpen:false}:ml));
  const addFood      = (mi,food) => setMeals(m=>m.map((ml,i)=>i===mi?{...ml,items:[...ml.items,food],searchOpen:false}:ml));

  const addCoverPhotos   = () => openPicker(urls=>setCoverPhotos(p=>[...p,...urls].slice(0,6)),{multiple:true});
  const removeCoverPhoto = (i)  => setCoverPhotos(p=>p.filter((_,j)=>j!==i));
  const addMealPhotos    = (mi) => openPicker(urls=>setMeals(m=>m.map((ml,idx)=>idx===mi?{...ml,photos:[...(ml.photos||[]),...urls].slice(0,4)}:ml)),{multiple:true});
  const removeMealPhoto  = (mi,pi) => setMeals(m=>m.map((ml,idx)=>idx===mi?{...ml,photos:(ml.photos||[]).filter((_,j)=>j!==pi)}:ml));

  const totals     = meals.reduce((a,m)=>{ m.items.forEach(it=>{a.cal+=it.cals||0;a.p+=it.p||0;a.c+=it.c||0;a.f+=it.f||0;}); return a; },{cal:0,p:0,c:0,f:0});
  const totalItems = meals.reduce((a,m)=>a+m.items.length,0);
  const canPost    = title && totalItems > 0;

  const handlePost = () => {
    if (!canPost) return;
    onSubmit({ title, meals, coverPhotos,
      macros:{ protein:Math.round(totals.p), carbs:Math.round(totals.c), fat:Math.round(totals.f), calories:Math.round(totals.cal) },
      tags: tags.split(" ").filter(t=>t.startsWith("#")) });
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.96)",zIndex:2000,display:"flex",flexDirection:"column",fontFamily:"Inter,sans-serif"}}>
      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"13px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:14,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>← Cancel</button>
        <span style={{color:C.text,fontWeight:800,fontSize:15,fontFamily:"Space Grotesk,sans-serif"}}>Log Your Day</span>
        <button onClick={handlePost} disabled={!canPost}
          style={{background:canPost?C.lime:C.border2,border:"none",borderRadius:8,padding:"6px 14px",color:canPost?C.deep:C.muted,fontWeight:800,fontSize:13,cursor:canPost?"pointer":"default",fontFamily:"Space Grotesk,sans-serif"}}>
          Post
        </button>
      </div>
      <div style={{overflowY:"auto",flex:1,padding:"14px 18px 50px"}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Name this day (e.g. 'Leg Day – High Carb')"
          style={{width:"100%",padding:"11px 14px",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:10,color:C.text,fontSize:15,fontWeight:600,outline:"none",boxSizing:"border-box",fontFamily:"Space Grotesk,sans-serif",marginBottom:12}}/>
        <div style={{marginBottom:14}}>
          <div style={{color:C.muted,fontSize:10,fontWeight:700,letterSpacing:"0.07em",fontFamily:"Space Grotesk,sans-serif",marginBottom:7}}>COVER PHOTOS</div>
          {coverPhotos.length>0&&<div style={{marginBottom:8,borderRadius:10,overflow:"hidden",border:`1px solid ${C.border}`}}><PhotoGrid photos={coverPhotos} onRemove={removeCoverPhoto}/></div>}
          <button onClick={addCoverPhotos} style={{width:"100%",padding:"11px",background:C.surface,border:`1px dashed ${C.border2}`,borderRadius:10,color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"Inter,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
            <span style={{fontSize:18}}>📷</span>{coverPhotos.length>0?"Add more photos":"Add day cover photo(s)"}
          </button>
        </div>
        {totalItems>0&&(
          <div style={{padding:"12px 14px",background:C.deep,borderRadius:11,border:`1px solid ${C.lime}30`,display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
            <MacroRing protein={totals.p} carbs={totals.c} fat={totals.f} size={56}/>
            <div style={{flex:1}}>
              <div style={{color:C.lime,fontSize:20,fontWeight:900,fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>{Math.round(totals.cal).toLocaleString()} kcal</div>
              <div style={{display:"flex",gap:10,marginTop:4}}>{[["P",totals.p,C.lime],["C",totals.c,C.blue],["F",totals.f,C.orange]].map(([l,v,c])=><span key={l} style={{color:c,fontSize:12,fontWeight:700,fontFamily:"Space Grotesk,sans-serif"}}>{l} {Math.round(v)}g</span>)}</div>
            </div>
            <div style={{color:C.lime,fontSize:12,fontWeight:700,fontFamily:"Space Grotesk,sans-serif"}}>+{totalItems*10+50} Strides</div>
          </div>
        )}
        {meals.map((meal,mi)=>(
          <div key={mi} style={{marginBottom:10,background:C.card,borderRadius:11,border:`1px solid ${C.border}`,overflow:"hidden"}}>
            <div style={{padding:"9px 13px",background:C.surface,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <select value={meal.name} onChange={e=>setMeals(m=>m.map((ml,i)=>i===mi?{...ml,name:e.target.value}:ml))}
                style={{background:"none",border:"none",color:C.lime,fontSize:13,fontWeight:700,cursor:"pointer",outline:"none",fontFamily:"Space Grotesk,sans-serif"}}>
                {MEAL_SLOTS.map(s=><option key={s} value={s} style={{background:C.surface}}>{s}</option>)}
              </select>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {meal.items.length>0&&<span style={{color:C.muted,fontSize:11}}>{Math.round(meal.items.reduce((a,i)=>a+(i.cals||0),0))} kcal</span>}
                {meals.length>1&&<button onClick={()=>setMeals(m=>m.filter((_,i)=>i!==mi))} style={{background:"none",border:"none",color:C.muted,fontSize:16,cursor:"pointer"}}>×</button>}
              </div>
            </div>
            {(meal.photos||[]).length>0&&(
              <div style={{display:"flex",gap:6,padding:"8px 13px",overflowX:"auto"}}>
                {(meal.photos||[]).map((src,pi)=>(
                  <div key={pi} style={{position:"relative",flexShrink:0}}>
                    <img src={src} alt="" style={{width:80,height:80,objectFit:"cover",borderRadius:8,display:"block"}}/>
                    <button onClick={()=>removeMealPhoto(mi,pi)} style={{position:"absolute",top:3,right:3,width:18,height:18,borderRadius:"50%",background:"rgba(0,0,0,0.7)",border:"none",color:"#fff",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                  </div>
                ))}
                <button onClick={()=>addMealPhotos(mi)} style={{width:80,height:80,flexShrink:0,background:C.surface,border:`1px dashed ${C.border2}`,borderRadius:8,cursor:"pointer",color:C.muted,fontSize:22,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              </div>
            )}
            {meal.items.map((item,ii)=>(
              <div key={ii} style={{padding:"8px 13px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <div style={{flex:1}}>
                  <div style={{color:C.text,fontSize:13}}>{item.name}</div>
                  <div style={{color:C.muted,fontSize:11,marginTop:1}}>{item.qty} · {item.cals} kcal · P{item.p}g C{item.c}g F{item.f}g</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                  {item.aff&&<AffiliateBtn store={item.aff.store} url={item.aff.url}/>}
                  <button onClick={()=>removeItem(mi,ii)} style={{background:"none",border:"none",color:C.muted,fontSize:16,cursor:"pointer"}}>×</button>
                </div>
              </div>
            ))}
            {meal.searchOpen ? (
              <InlineFoodSearch C={C} onSelect={food=>addFood(mi,food)} onClose={()=>closeSearch(mi)}/>
            ) : (
              <div style={{display:"flex",alignItems:"center",borderTop:`1px solid ${C.border}`}}>
                <button onClick={()=>toggleSearch(mi)}
                  style={{flex:1,padding:"10px 13px",background:"none",border:"none",color:C.blue,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"left",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:16}}>+</span> Add food
                </button>
                <div style={{width:1,height:20,background:C.border}}/>
                <button onClick={()=>addMealPhotos(mi)} style={{padding:"10px 13px",background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"Inter,sans-serif",display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:15}}>📷</span> Photo
                </button>
              </div>
            )}
          </div>
        ))}
        <button onClick={addMeal} style={{width:"100%",padding:"10px",background:C.surface,border:`1px dashed ${C.border2}`,borderRadius:10,color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"Inter,sans-serif",marginBottom:10}}>+ Add meal</button>
        <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="#LegDay #HighCarb #Vegan"
          style={{width:"100%",padding:"9px 13px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,color:C.blue,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"Inter,sans-serif"}}/>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// COMMENTS SECTION
// ═══════════════════════════════════════════════════════

function CommentsSection({ comments, onAddComment, onLikeComment }) {
  const C = getC();
  const [text, setText] = useState("");
  const [likedComments, setLikedComments] = useState({});
  const submit = () => { if(!text.trim()) return; onAddComment(text.trim()); setText(""); };
  return (
    <div style={{borderTop:`1px solid ${C.border}`,padding:"12px 16px"}}>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:12}}>
        {comments.map(c=>(
          <div key={c.id} style={{display:"flex",gap:9,alignItems:"flex-start"}}>
            <Avatar user={c.user} size={30}/>
            <div style={{flex:1,background:C.surface,borderRadius:10,padding:"8px 11px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                <span style={{color:C.lime,fontSize:12,fontWeight:700,fontFamily:"Space Grotesk,sans-serif"}}>{c.user.name}</span>
                <span style={{color:C.muted,fontSize:10}}>{c.time}</span>
              </div>
              <div style={{color:C.text,fontSize:13,lineHeight:1.4}}>{c.text}</div>
              <button onClick={()=>{ setLikedComments(l=>({...l,[c.id]:!l[c.id]})); onLikeComment(c.id,!likedComments[c.id]); }}
                style={{marginTop:5,background:"none",border:"none",cursor:"pointer",color:likedComments[c.id]?C.lime:C.muted,fontSize:11,fontFamily:"Inter,sans-serif",padding:0}}>
                ♥ {c.likes+(likedComments[c.id]?1:0)}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <Avatar user={ME} size={30}/>
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}
          placeholder="Add a comment…"
          style={{flex:1,padding:"8px 12px",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:20,color:C.text,fontSize:13,outline:"none",fontFamily:"Inter,sans-serif"}}/>
        <button onClick={submit} disabled={!text.trim()} style={{padding:"8px 14px",background:text.trim()?C.lime:C.border2,border:"none",borderRadius:20,color:text.trim()?C.bg:C.muted,fontWeight:700,fontSize:12,cursor:text.trim()?"pointer":"default",fontFamily:"Space Grotesk,sans-serif",whiteSpace:"nowrap"}}>Post</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// POST CARD
// ═══════════════════════════════════════════════════════

function PostCard({ post, onKudos, onComment, onLikeComment, onViewProfile, onReport, onShare }) {
  const C = getC();
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [openMeal, setOpenMeal] = useState(null);
  const [kudosed, setKudosed] = useState(false);
  const hasPhotos = post.coverPhotos?.length > 0;

  return (
    <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:14,fontFamily:"Inter,sans-serif"}}>

      {/* ── User header ── */}
      <div style={{padding:"13px 18px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:11,alignItems:"center"}}>
          <Avatar user={post.user} size={40} onClick={()=>onViewProfile(post.user)}/>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              <button onClick={()=>onViewProfile(post.user)} style={{background:"none",border:"none",cursor:"pointer",padding:0,color:C.text,fontWeight:700,fontSize:14,fontFamily:"Inter,sans-serif"}}>{post.user.name}</button>
              <TierBadge tier={post.user.tier}/>
            </div>
            <div style={{color:C.muted,fontSize:11,marginTop:1}}>{post.user.handle} · {post.date} · {post.user.sport}</div>
          </div>
        </div>
      </div>

      {/* ── Title ── */}
      <div style={{padding:"0 18px 10px",color:C.text,fontSize:15,fontWeight:600,lineHeight:1.35}}>{post.title}</div>

      {/* ── Cover photos with macro overlay ── */}
      {hasPhotos ? (
        <div style={{position:"relative",marginBottom:0}}>
          <PhotoGrid photos={post.coverPhotos}/>
          <div style={{position:"absolute",bottom:0,left:0,right:0,
            background:"linear-gradient(transparent 0%, rgba(10,10,15,0.92) 60%)",
            padding:"32px 16px 12px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <MacroRing {...post.macros} size={52}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {[["P",post.macros.protein],["C",post.macros.carbs],["F",post.macros.fat]].map(([l,v])=>(
                    <div key={l}><span style={{color:"#F7F6F1",fontSize:14,fontWeight:800,fontFamily:"Space Grotesk,sans-serif"}}>{v}g </span><span style={{color:"rgba(255,255,255,0.45)",fontSize:10}}>{l==="P"?"PROTEIN":l==="C"?"CARBS":"FAT"}</span></div>
                  ))}
                </div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{color:"#5FCF7A",fontSize:18,fontWeight:900,fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>{post.macros.calories.toLocaleString()}</div>
                <div style={{color:"rgba(255,255,255,0.4)",fontSize:9,letterSpacing:"0.07em"}}>KCAL</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{padding:"0 18px 12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{color:C.lime,fontSize:20,fontWeight:900,fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>{post.macros.calories.toLocaleString()}</div>
            <div style={{color:C.muted,fontSize:10,letterSpacing:"0.07em",paddingTop:2}}>KCAL</div>
          </div>
          <MacroPills protein={post.macros.protein} carbs={post.macros.carbs} fat={post.macros.fat}/>
        </div>
      )}

      {/* ── Tags ── */}
      {post.tags?.length>0&&<div style={{padding:"4px 18px 8px",display:"flex",flexWrap:"wrap",gap:4}}>
        {post.tags.map(t=><span key={t} style={{color:C.lime,fontSize:11,background:C.tagBg,color:C.tagText,padding:"2px 8px",borderRadius:20}}>{t}</span>)}
      </div>}

      {/* ── Meals accordion ── */}
      <div style={{borderTop:`1px solid ${C.border}`,marginTop:hasPhotos?0:4}}>
        <button onClick={()=>setExpanded(!expanded)} style={{width:"100%",padding:"10px 18px",background:"none",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",color:C.text}}>
          <span style={{fontSize:12,fontWeight:600,color:C.muted}}>{post.meals.length} meal{post.meals.length!==1?"s":""} · see exactly what they ate</span>
          <span style={{color:C.lime,fontSize:13,transform:expanded?"rotate(180deg)":"none",transition:"0.2s"}}>▾</span>
        </button>
        {expanded&&<div style={{padding:"0 14px 12px",display:"flex",flexDirection:"column",gap:7}}>
          {post.meals.map((meal,i)=>{ const isOpen=openMeal===i; const mc=meal.items.reduce((a,it)=>a+(it.cals||0),0);
            return <div key={i} style={{background:C.surface,borderRadius:10,overflow:"hidden"}}>
              <button onClick={()=>setOpenMeal(isOpen?null:i)} style={{width:"100%",padding:"9px 13px",background:"none",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  {(meal.photos||[]).length>0&&<img src={meal.photos[0]} alt="" style={{width:28,height:28,borderRadius:6,objectFit:"cover"}}/>}
                  <span style={{color:C.text,fontSize:13,fontWeight:600}}>{meal.name}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{color:C.muted,fontSize:11}}>{Math.round(mc)} kcal</span><span style={{color:C.muted,fontSize:12,transform:isOpen?"rotate(180deg)":"none",transition:"0.2s"}}>▾</span></div>
              </button>
              {isOpen&&<div style={{padding:"0 13px 10px"}}>
                {/* Meal photo strip */}
                {(meal.photos||[]).length>0&&<div style={{display:"flex",gap:5,marginBottom:8,overflowX:"auto"}}>
                  {(meal.photos||[]).map((src,pi)=><img key={pi} src={src} alt="" style={{width:90,height:90,objectFit:"cover",borderRadius:8,flexShrink:0}}/>)}
                </div>}
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {meal.items.map((item,j)=><div key={j} style={{padding:"7px 10px",background:C.bg,borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <div><div style={{color:C.text,fontSize:13}}>{item.name}</div><div style={{color:C.muted,fontSize:11,marginTop:1}}>{item.qty} · {item.cals} kcal</div></div>
                    {item.aff&&<AffiliateBtn store={item.aff.store} url={item.aff.url}/>}
                  </div>)}
                </div>
              </div>}
            </div>;
          })}
        </div>}
      </div>
      {/* Actions */}
      <div style={{padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6}}>
        <button onClick={()=>{ setKudosed(!kudosed); onKudos(post.id,!kudosed); }}
          style={{display:"flex",alignItems:"center",gap:5,padding:"6px 13px",borderRadius:20,
            border:`1px solid ${kudosed?C.lime:C.border2}`,
            background:kudosed?`${C.lime}18`:"transparent",cursor:"pointer",transition:"0.15s",fontFamily:"Inter,sans-serif"}}>
          <span style={{fontSize:15}}>⚡</span>
          <span style={{color:kudosed?C.lime:C.muted,fontSize:13,fontWeight:kudosed?700:400}}>{post.kudos+(kudosed?1:0)} Kudos</span>
        </button>
        <button onClick={()=>setShowComments(!showComments)}
          style={{display:"flex",alignItems:"center",gap:5,padding:"6px 13px",borderRadius:20,
            border:`1px solid ${showComments?C.blue:C.border2}`,background:"transparent",
            cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
          <span style={{fontSize:15}}>💬</span>
          <span style={{color:showComments?C.blue:C.muted,fontSize:13}}>{post.comments.length}</span>
        </button>
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>onReport&&onReport(post)}
            style={{background:"none",border:"none",cursor:"pointer",color:C.muted,
              fontSize:11,fontFamily:"Inter,sans-serif",opacity:0.6,
              display:"flex",alignItems:"center",gap:3,padding:"4px 6px",
              borderRadius:6,transition:"opacity 0.15s"}}
            onMouseEnter={e=>e.target.style.opacity=1}
            onMouseLeave={e=>e.target.style.opacity=0.6}>
            ⚑ Report
          </button>
          <button style={{background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:13,fontFamily:"Inter,sans-serif"}}
            onClick={()=>onShare&&onShare(post)}>↑ Share</button>
        </div>
      </div>
      {showComments&&<CommentsSection comments={post.comments} onAddComment={t=>onComment(post.id,t)} onLikeComment={(cid,add)=>onLikeComment(post.id,cid,add)}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PEOPLE SEARCH MODAL
// ═══════════════════════════════════════════════════════

// ─── Creator tier logic ──────────────────────────────────────────────────────
const isCreator = (u) => u.tier === "CREATOR" || u.tier === "ELITE" || u.followers >= 5000;

function PeopleSearch({ users, following, onFollow, onViewProfile, onClose }) {
  const C = getC();
  const [q, setQ]     = useState("");
  const [tab, setTab] = useState("all"); // all | creators | athletes
  const ref = useRef();
  useEffect(()=>ref.current?.focus(),[]);

  const base = tab==="creators"
    ? users.filter(u=>isCreator(u))
    : tab==="athletes"
    ? users.filter(u=>!isCreator(u))
    : users;

  const results = q
    ? base.filter(u=>u.name.toLowerCase().includes(q.toLowerCase())||u.handle.toLowerCase().includes(q.toLowerCase())||u.sport.toLowerCase().includes(q.toLowerCase()))
    : base;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:2500,
      display:"flex",alignItems:"flex-start",justifyContent:"center",
      padding:"50px 16px",fontFamily:"Inter,sans-serif"}}>
      <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border2}`,
        width:"100%",maxWidth:500,maxHeight:"85vh",display:"flex",flexDirection:"column"}}>

        <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:C.text,fontWeight:800,fontSize:16,fontFamily:"Space Grotesk,sans-serif"}}>
            Find Athletes
          </span>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer"}}>×</button>
        </div>

        {/* Search */}
        <div style={{padding:"10px 18px 0",borderBottom:`1px solid ${C.border}`}}>
          <input ref={ref} value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Search by name, handle, or sport…"
            style={{width:"100%",padding:"9px 13px",background:C.bg,border:`1px solid ${C.border2}`,
              borderRadius:9,color:C.text,fontSize:14,outline:"none",
              boxSizing:"border-box",fontFamily:"Inter,sans-serif",marginBottom:10}}/>
          {/* Tabs */}
          <div style={{display:"flex",gap:0}}>
            {[["all","Everyone"],["creators","Creators & Athletes"],["athletes","Community"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{padding:"7px 13px",background:"none",border:"none",cursor:"pointer",
                  fontFamily:"Space Grotesk,sans-serif",fontWeight:700,fontSize:11,
                  color:tab===t?C.lime:C.muted,whiteSpace:"nowrap",
                  borderBottom:tab===t?`2px solid ${C.lime}`:"2px solid transparent",
                  marginBottom:-1,transition:"0.15s"}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{overflowY:"auto",flex:1}}>
          {results.map(u=>{
            const subscribed = following.includes(u.id);
            const creator    = isCreator(u);
            return (
              <div key={u.id} style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,
                display:"flex",alignItems:"center",gap:12}}>
                <div style={{position:"relative",flexShrink:0}}>
                  <Avatar user={u} size={46} onClick={()=>{ onViewProfile(u); onClose(); }}/>
                  {/* Creator verified badge */}
                  {creator&&<div style={{position:"absolute",bottom:-1,right:-1,width:16,height:16,
                    borderRadius:"50%",background:C.lime,border:`2px solid ${C.card}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:8,fontWeight:900,color:C.deep}}>✓</div>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                    <button onClick={()=>{ onViewProfile(u); onClose(); }}
                      style={{background:"none",border:"none",cursor:"pointer",padding:0,
                        color:C.text,fontWeight:700,fontSize:14,fontFamily:"Inter,sans-serif"}}>
                      {u.name}
                    </button>
                    <TierBadge tier={u.tier}/>
                  </div>
                  <div style={{color:C.muted,fontSize:11,marginTop:2}}>
                    {u.handle} · {u.sport}
                  </div>
                  <div style={{color:C.muted,fontSize:11,marginTop:1}}>
                    <span style={{color:creator?C.lime:C.muted,fontWeight:creator?700:400}}>
                      {u.followers.toLocaleString()} {creator?"subscribers":"followers"}
                    </span>
                    {" · "}{getRank(u.points).icon} {getRank(u.points).name}
                  </div>
                </div>
                <button onClick={()=>onFollow(u.id)}
                  style={{padding:"7px 14px",borderRadius:20,flexShrink:0,
                    border:`1px solid ${subscribed?C.border2:creator?C.lime:C.border2}`,
                    background:subscribed?C.surface:creator?`${C.lime}18`:"transparent",
                    color:subscribed?C.muted:creator?C.lime:C.muted,
                    fontSize:12,fontWeight:700,cursor:"pointer",
                    fontFamily:"Space Grotesk,sans-serif",whiteSpace:"nowrap"}}>
                  {subscribed
                    ? (creator?"Subscribed":"Following")
                    : (creator?"Subscribe":"+ Follow")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PROFILE VIEW  — with Mon–Sun day bubble picker
// ═══════════════════════════════════════════════════════

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function postDay(post) {
  if (post.postedAt) {
    const d = new Date(post.postedAt).getDay(); // 0=Sun
    return DAYS[d === 0 ? 6 : d - 1];
  }
  if (post.date === "Today")      { const d = new Date().getDay(); return DAYS[d===0?6:d-1]; }
  if (post.date === "Yesterday")  { const d = (new Date().getDay()-1+7)%7; return DAYS[d===0?6:d-1]; }
  if (post.date === "2 days ago") { const d = (new Date().getDay()-2+7)%7; return DAYS[d===0?6:d-1]; }
  if (post.date === "Just now")   { const d = new Date().getDay(); return DAYS[d===0?6:d-1]; }
  const id = typeof post.id === "number" ? post.id : 0;
  return DAYS[id % 7];
}

function ProfileView({ user, posts, isMe, following, onFollow, onBack, onKudos, onComment, onLikeComment }) {
  const C = getC();
  const [activeDay, setActiveDay] = useState(null);
  const rank = getRank(user.points);
  const nextRank = RANKS.find(r=>r.min>user.points);
  const progress = nextRank ? Math.min(100,((user.points-rank.min)/(nextRank.min-rank.min))*100) : 100;
  const isFollowing = following.includes(user.id);
  const userPosts = posts.filter(p=>p.userId===user.id || (isMe&&p.userId==="me"));

  // Which days actually have posts — to show dots
  const daysWithPosts = new Set(userPosts.map(postDay));

  const visiblePosts = activeDay
    ? userPosts.filter(p => postDay(p) === activeDay)
    : userPosts;

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"Inter,sans-serif"}}>
      {/* Top bar */}
      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"13px 18px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:50}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.muted,fontSize:14,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>← Feed</button>
        <span style={{color:C.text,fontWeight:800,fontSize:15,fontFamily:"Space Grotesk,sans-serif"}}>{user.handle}</span>
        <span style={{marginLeft:"auto",color:C.lime,fontSize:12,fontWeight:700,fontFamily:"Space Grotesk,sans-serif",letterSpacing:"-0.01em"}}>Fork<span style={{opacity:0.6,color:C.accent}}>Step</span></span>
      </div>

      <div style={{maxWidth:660,margin:"0 auto",padding:"0 18px 80px"}}>

        {/* ── Profile header ── */}
        <div style={{padding:"24px 0 20px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>
          <Avatar user={user} size={80}/>
          <div style={{marginTop:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,marginBottom:4}}>
              <span style={{color:C.text,fontWeight:800,fontSize:20,fontFamily:"Space Grotesk,sans-serif"}}>{user.name}</span>
              <TierBadge tier={user.tier}/>
            </div>
            <div style={{color:C.muted,fontSize:13}}>{user.handle} · {user.sport}</div>
            {user.bio&&<div style={{color:C.text,fontSize:13,marginTop:8,maxWidth:340,lineHeight:1.5}}>{user.bio}</div>}
            <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:6}}>
              <span style={{color:C.lime,fontWeight:700,fontSize:12,fontFamily:"Space Grotesk,sans-serif"}}>🔥 {user.streak}-day streak</span>
            </div>
          </div>

          {/* Rank pill */}
          <div style={{marginTop:14,padding:"10px 20px",background:C.surface,borderRadius:12,display:"flex",alignItems:"center",gap:14}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:24}}>{rank.icon}</div>
              <div style={{color:rank.color,fontSize:12,fontWeight:700,fontFamily:"Space Grotesk,sans-serif"}}>{rank.name}</div>
            </div>
            <div>
              <div style={{color:C.lime,fontSize:22,fontWeight:900,fontFamily:"Space Grotesk,sans-serif"}}>{user.points.toLocaleString()} pts</div>
              {nextRank&&<div style={{width:140,height:4,background:C.border,borderRadius:2,marginTop:4,overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:C.lime,borderRadius:2}}/></div>}
              {nextRank&&<div style={{color:C.muted,fontSize:10,marginTop:3}}>{nextRank.min-user.points} pts to {nextRank.name}</div>}
            </div>
          </div>

          {/* Stats */}
          <div style={{display:"flex",gap:28,marginTop:14}}>
            {[{v:userPosts.length,l:"Posts"},{v:user.followers.toLocaleString(),l:"Followers"},{v:user.following.toLocaleString(),l:"Following"}].map(s=>(
              <div key={s.l} style={{textAlign:"center"}}>
                <div style={{color:C.text,fontWeight:800,fontSize:17,fontFamily:"Space Grotesk,sans-serif"}}>{s.v}</div>
                <div style={{color:C.muted,fontSize:11,marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>

          {!isMe&&(
            <button onClick={()=>onFollow(user.id)}
              style={{marginTop:14,padding:"9px 28px",borderRadius:20,
                border:`1px solid ${isFollowing?C.border2:C.lime}`,
                background:isFollowing?C.surface:`${C.lime}18`,
                color:isFollowing?C.muted:C.lime,
                fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"Space Grotesk,sans-serif"}}>
              {isFollowing
                ? (isCreator(user)?"✓ Subscribed":"✓ Following")
                : (isCreator(user)?"Subscribe to see every log →":"+ Follow")}
            </button>
          )}
        </div>

        {/* ── Mon–Sun day bubble strip ── */}
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:16,marginBottom:16}}>
          <div style={{color:C.muted,fontSize:10,fontWeight:700,letterSpacing:"0.08em",fontFamily:"Space Grotesk,sans-serif",marginBottom:10}}>BROWSE BY DAY</div>
          <div style={{display:"flex",gap:8,justifyContent:"space-between"}}>
            {DAYS.map(day=>{
              const hasLog = daysWithPosts.has(day);
              const isActive = activeDay===day;
              return (
                <button key={day} onClick={()=>setActiveDay(isActive?null:day)}
                  style={{
                    flex:1, display:"flex", flexDirection:"column", alignItems:"center",
                    gap:5, padding:"10px 4px", borderRadius:14,
                    border:`1px solid ${isActive?C.lime:hasLog?C.border2:C.border}`,
                    background:isActive?C.lime:hasLog?`${C.lime}10`:"transparent",
                    cursor:"pointer", transition:"all 0.15s",
                  }}>
                  <span style={{
                    fontSize:11, fontWeight:800, fontFamily:"Space Grotesk,sans-serif",
                    color:isActive?C.deep:hasLog?C.lime:C.muted,
                    letterSpacing:"0.02em"
                  }}>{day}</span>
                  {/* Dot indicator — filled if logged, empty if not */}
                  <div style={{
                    width:6, height:6, borderRadius:"50%",
                    background:isActive?C.deep:hasLog?C.lime:"transparent",
                    border:hasLog?`none`:`1px solid ${C.border2}`,
                    transition:"all 0.15s"
                  }}/>
                </button>
              );
            })}
          </div>
          {activeDay&&(
            <div style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{color:C.muted,fontSize:12,fontFamily:"Inter,sans-serif"}}>
                {visiblePosts.length} log{visiblePosts.length!==1?"s":""} on {activeDay}
              </span>
              <button onClick={()=>setActiveDay(null)}
                style={{background:"none",border:"none",color:C.muted,fontSize:11,cursor:"pointer",fontFamily:"Inter,sans-serif",textDecoration:"underline"}}>
                Show all
              </button>
            </div>
          )}
        </div>

        {/* ── Posts filtered by selected day ── */}
        {visiblePosts.length===0?(
          <div style={{textAlign:"center",padding:"40px 0",color:C.muted}}>
            <div style={{fontSize:32,marginBottom:10}}>📅</div>
            <div style={{fontSize:14}}>No logs for {activeDay}.</div>
            <div style={{fontSize:12,marginTop:4,color:C.border2}}>
              {user.name.split(" ")[0]} hasn't posted on {activeDay} yet.
            </div>
          </div>
        ):(
          visiblePosts.map(post=>(
            <PostCard key={post.id} post={post} onKudos={onKudos}
              onComment={onComment} onLikeComment={onLikeComment} onViewProfile={()=>{}}/>
          ))
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// NOTIFICATIONS PANEL
// ═══════════════════════════════════════════════════════

function NotificationsPanel({ notifs, onClose, onViewProfile, users }) {
  const C = getC();

  const typeConfig = {
    streak:       { icon:"🔥", label:"Streak",      color:C.orange },
    creator_post: { icon:"📸", label:"New log",     color:C.lime },
    kudos:        { icon:"⚡", label:"Kudos",       color:"#FFD700" },
    follow:       { icon:"👤", label:"Subscriber",  color:C.blue },
    aspire:       { icon:"💡", label:"Inspiration", color:C.lime },
    rank:         { icon:"🏆", label:"Rank",        color:"#FFD700" },
    comment:      { icon:"💬", label:"Comment",     color:C.blue },
    leaderboard:  { icon:"📊", label:"Leaderboard", color:C.lime },
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:2500,
      display:"flex",alignItems:"flex-start",justifyContent:"flex-end",fontFamily:"Inter,sans-serif"}}>
      <div style={{background:C.card,borderLeft:`1px solid ${C.border2}`,
        width:"100%",maxWidth:380,height:"100vh",display:"flex",flexDirection:"column"}}>

        <div style={{padding:"16px 18px",borderBottom:`1px solid ${C.border}`,
          display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <span style={{color:C.text,fontWeight:800,fontSize:16,fontFamily:"Space Grotesk,sans-serif"}}>Notifications</span>
            {notifs.filter(n=>n.unread).length>0&&(
              <span style={{marginLeft:8,background:C.lime,color:C.deep,fontSize:10,fontWeight:900,
                padding:"2px 7px",borderRadius:20,fontFamily:"Space Grotesk,sans-serif"}}>
                {notifs.filter(n=>n.unread).length} new
              </span>
            )}
          </div>
          <button onClick={onClose}
            style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer"}}>×</button>
        </div>

        <div style={{overflowY:"auto",flex:1}}>
          {notifs.length===0
            ? <div style={{padding:"40px 20px",textAlign:"center",color:C.muted}}>
                Nothing yet. Follow athletes to see activity here.
              </div>
            : notifs.map((n,i)=>{
                const u = users.find(u=>u.id===n.userId) || SEED_USERS[0];
                const cfg = typeConfig[n.type] || { icon:"🔔", label:"Update", color:C.muted };
                return (
                  <div key={i} style={{padding:"13px 18px",borderBottom:`1px solid ${C.border}`,
                    display:"flex",gap:10,alignItems:"flex-start",
                    background:n.unread?`${C.lime}08`:"transparent",transition:"background 0.2s"}}>

                    <div style={{position:"relative",flexShrink:0}}>
                      <Avatar user={u} size={38}/>
                      <div style={{position:"absolute",bottom:-2,right:-2,width:16,height:16,
                        borderRadius:"50%",background:C.card,display:"flex",alignItems:"center",
                        justifyContent:"center",fontSize:10}}>{cfg.icon}</div>
                    </div>

                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                        <span style={{fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:20,
                          background:`${cfg.color}20`,color:cfg.color,
                          fontFamily:"Space Grotesk,sans-serif",letterSpacing:"0.06em"}}>
                          {cfg.label.toUpperCase()}
                        </span>
                        <span style={{color:C.muted,fontSize:10}}>{n.time}</span>
                        {n.unread&&<div style={{width:6,height:6,borderRadius:"50%",
                          background:C.lime,flexShrink:0,marginLeft:"auto"}}/>}
                      </div>
                      <div style={{color:C.text,fontSize:13,lineHeight:1.5}}>{n.text}</div>
                      {n.cta&&(
                        <button style={{marginTop:7,padding:"5px 12px",borderRadius:20,
                          border:`1px solid ${cfg.color}`,background:"transparent",
                          color:cfg.color,fontSize:11,fontWeight:700,cursor:"pointer",
                          fontFamily:"Space Grotesk,sans-serif"}}>
                          {n.cta} →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
          }
        </div>

        {/* Push notification opt-in banner */}
        <div style={{padding:"14px 18px",borderTop:`1px solid ${C.border}`,
          background:C.surface,flexShrink:0}}>
          <div style={{color:C.text,fontSize:13,fontWeight:600,
            fontFamily:"Space Grotesk,sans-serif",marginBottom:4}}>
            Enable push notifications
          </div>
          <div style={{color:C.muted,fontSize:12,marginBottom:10,lineHeight:1.5}}>
            Get streak reminders, creator post alerts, and leaderboard updates before they push you off the podium.
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={{flex:1,padding:"9px",background:C.lime,border:"none",
              borderRadius:8,color:C.deep,fontWeight:800,fontSize:13,cursor:"pointer",
              fontFamily:"Space Grotesk,sans-serif"}}>
              Turn on
            </button>
            <button style={{padding:"9px 14px",background:"none",border:`1px solid ${C.border2}`,
              borderRadius:8,color:C.muted,fontSize:13,cursor:"pointer",
              fontFamily:"Inter,sans-serif"}}>
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// POINTS DASHBOARD
// ═══════════════════════════════════════════════════════

function PointsDashboard({ stats, onClose }) {
  const C = getC();
  const rank = getRank(stats.points); const nextRank = RANKS.find(r=>r.min>stats.points);
  const progress = nextRank?Math.min(100,((stats.points-rank.min)/(nextRank.min-rank.min))*100):100;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:2500,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"Inter,sans-serif"}}>
      <div style={{background:C.card,borderRadius:20,border:`1px solid ${C.border2}`,width:"100%",maxWidth:380,padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{color:C.text,fontWeight:800,fontSize:17,fontFamily:"Space Grotesk,sans-serif"}}>Your StrideScore</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer"}}>×</button>
        </div>
        <div style={{textAlign:"center",padding:"18px",background:C.deep,borderRadius:12,marginBottom:16}}>
          <div style={{fontSize:44,lineHeight:1}}>{rank.icon}</div>
          <div style={{color:rank.color,fontWeight:900,fontSize:22,fontFamily:"Space Grotesk,sans-serif",marginTop:6}}>{rank.name}</div>
          <div style={{color:C.lime,fontSize:34,fontWeight:900,fontFamily:"Space Grotesk,sans-serif",marginTop:2}}>{stats.points.toLocaleString()}</div>
          <div style={{color:C.muted,fontSize:11,marginTop:1}}>Strides</div>
        </div>
        {nextRank&&<div style={{marginBottom:16}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:C.muted,fontSize:12}}>{rank.name}</span><span style={{color:C.muted,fontSize:12}}>{nextRank.name} at {nextRank.min.toLocaleString()} pts</span></div><div style={{height:5,background:C.border,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${C.lime},${C.blue})`,borderRadius:3}}/></div><div style={{color:C.muted,fontSize:11,marginTop:4,textAlign:"right"}}>{nextRank.min-stats.points} pts to {nextRank.name}</div></div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          {[{l:"Days Logged",v:stats.daysLogged,i:"📅"},{l:"Streak",v:`${stats.streak}🔥`,i:""},{l:"Meals Logged",v:stats.mealsLogged,i:"🍽️"},{l:"Posts Shared",v:stats.postsShared,i:"📢"}].map(s=>(
            <div key={s.l} style={{background:C.bg,borderRadius:9,padding:"11px 13px"}}><div style={{color:C.text,fontSize:17,fontWeight:800,fontFamily:"Space Grotesk,sans-serif"}}>{s.i} {s.v}</div><div style={{color:C.muted,fontSize:11,marginTop:2}}>{s.l}</div></div>
          ))}
        </div>
        <div style={{background:C.bg,borderRadius:9,padding:"12px 13px"}}>
          <div style={{color:C.muted,fontSize:10,fontWeight:700,letterSpacing:"0.07em",marginBottom:8,fontFamily:"Space Grotesk,sans-serif"}}>HOW TO EARN</div>
          {[["Log a meal","10 pts"],["Complete a full day","50 pts"],["3-day streak","30 pts"],["7-day streak","100 pts"],["Post to community","25 pts"],["Get kudos","5 pts each"]].map(([a,b])=>(
            <div key={a} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:"#D0D0D8",fontSize:12}}>{a}</span>
              <span style={{color:C.lime,fontSize:12,fontWeight:700}}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// AUTO-MODERATION — keyword pre-filter
// ═══════════════════════════════════════════════════════

const BLOCK_TERMS = ["spam","scam","[buy now]","click here","free followers","dm for promo"];
const WARN_TERMS  = ["hate","fake","fraud","mislead"];

function autoModerate(text) {
  const t = text.toLowerCase();
  if (BLOCK_TERMS.some(w=>t.includes(w))) return { action:"block",  reason:"Automatically blocked: spam/promotional content" };
  if (WARN_TERMS.some(w=>t.includes(w)))  return { action:"flag",   reason:"Flagged for review: potentially harmful language" };
  return { action:"allow" };
}

// ═══════════════════════════════════════════════════════
// VIRAL SHARE CARD
// ═══════════════════════════════════════════════════════

function ShareCard({ post, onClose }) {
  const C = getC();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard?.writeText(`https://forkstep.com/log/${post.id}`).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:5000,
      display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"Inter,sans-serif"}}>
      <div style={{background:C.card,borderRadius:20,border:`1px solid ${C.border2}`,
        width:"100%",maxWidth:400,overflow:"hidden"}}>

        {/* Card preview — this is what gets shared */}
        <div style={{background:"#1B3A2A",padding:"20px",position:"relative"}}>
          {post.coverPhotos?.[0] && (
            <img src={post.coverPhotos[0]} alt="" style={{position:"absolute",inset:0,width:"100%",
              height:"100%",objectFit:"cover",opacity:0.25}}/>
          )}
          <div style={{position:"relative"}}>
            {/* Logo watermark */}
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:16}}>
              <div style={{width:22,height:22,background:"rgba(255,255,255,0.15)",
                borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="12" height="12" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="7" fill="#0A0A0A"/>
            <rect x="8" y="7" width="4.5" height="18" rx="2.25" fill="#FAFAF8"/>
            <rect x="12.5" y="7" width="13" height="4.5" rx="2.25" fill="#FAFAF8"/>
            <rect x="12.5" y="15" width="8.5" height="4.5" rx="2.25" fill="#FAFAF8"/>
          </svg>
              </div>
              <span style={{color:"rgba(255,255,255,0.7)",fontSize:11,fontWeight:700,
                fontFamily:"Space Grotesk,sans-serif"}}>ForkStep</span>
            </div>

            {/* User */}
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14}}>
              <Avatar user={post.user} size={38}/>
              <div>
                <div style={{color:"#F7F6F1",fontWeight:700,fontSize:14,fontFamily:"Space Grotesk,sans-serif"}}>{post.user.name}</div>
                <div style={{color:"rgba(255,255,255,0.55)",fontSize:11}}>{post.user.handle} · {post.user.sport}</div>
              </div>
            </div>

            {/* Title */}
            <div style={{color:"#F7F6F1",fontSize:16,fontWeight:700,fontFamily:"Space Grotesk,sans-serif",
              marginBottom:14,lineHeight:1.3}}>{post.title}</div>

            {/* Macro pills */}
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {[
                {l:"PROTEIN", v:post.macros.protein, u:"g", bg:"rgba(95,207,122,0.25)", c:"#5FCF7A"},
                {l:"CARBS",   v:post.macros.carbs,   u:"g", bg:"rgba(79,195,247,0.25)", c:"#4FC3F7"},
                {l:"FAT",     v:post.macros.fat,     u:"g", bg:"rgba(255,138,101,0.25)",c:"#FF8A65"},
                {l:"KCAL",    v:post.macros.calories,u:"",  bg:"rgba(255,255,255,0.1)",  c:"#fff"},
              ].map(m=>(
                <div key={m.l} style={{flex:1,background:m.bg,borderRadius:8,padding:"8px 4px",textAlign:"center"}}>
                  <div style={{color:m.c,fontSize:15,fontWeight:900,fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>{m.v}</div>
                  <div style={{color:m.c,fontSize:8,opacity:0.7,marginTop:2,letterSpacing:"0.07em"}}>{m.l}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{color:"rgba(255,255,255,0.5)",fontSize:10,letterSpacing:"0.06em",
              fontFamily:"Space Grotesk,sans-serif"}}>
              forkstep.com · what we eat in a day
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{padding:"16px 18px"}}>
          <div style={{color:C.text,fontWeight:700,fontSize:14,fontFamily:"Space Grotesk,sans-serif",marginBottom:4}}>
            Share this food log
          </div>
          <div style={{color:C.muted,fontSize:12,marginBottom:14,lineHeight:1.5}}>
            Share to Instagram Stories, Twitter/X, or copy the link. Every share brings new athletes to ForkStep.
          </div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {[
              { label:"Instagram", icon:"📸", color:"#E1306C" },
              { label:"Twitter/X", icon:"✕", color:C.text },
              { label:"WhatsApp", icon:"💬", color:"#25D366" },
            ].map(s=>(
              <button key={s.label}
                style={{flex:1,padding:"10px 8px",borderRadius:10,
                  border:`1px solid ${C.border2}`,background:C.surface,
                  color:C.text,fontSize:11,fontWeight:600,cursor:"pointer",
                  fontFamily:"Space Grotesk,sans-serif",display:"flex",
                  flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:18}}>{s.icon}</span>
                <span style={{fontSize:10,color:C.muted}}>{s.label}</span>
              </button>
            ))}
          </div>
          <button onClick={copyLink}
            style={{width:"100%",padding:"11px",borderRadius:10,
              border:`1px solid ${copied?C.lime:C.border2}`,
              background:copied?`${C.lime}18`:C.surface,
              color:copied?C.lime:C.muted,fontSize:13,fontWeight:700,
              cursor:"pointer",fontFamily:"Space Grotesk,sans-serif",
              transition:"all 0.2s",marginBottom:8}}>
            {copied ? "✓ Link copied!" : "⎘ Copy link"}
          </button>
          <button onClick={onClose}
            style={{width:"100%",background:"none",border:"none",color:C.muted,
              fontSize:13,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
// SPORT LEADERBOARD — with Consistency tab + Hall of Fame
// ═══════════════════════════════════════════════════════

// Streak flame size — bigger the longer the streak
function StreakFlame({ days }) {
  const size = days >= 30 ? 28 : days >= 14 ? 24 : days >= 7 ? 20 : 16;
  const glow  = days >= 30 ? "#FF4500" : days >= 14 ? "#FF6B00" : days >= 7 ? "#FF8C00" : "#FFA500";
  return (
    <span style={{fontSize:size, filter:`drop-shadow(0 0 ${days>=14?6:3}px ${glow})`,
      lineHeight:1, display:"inline-block"}}>🔥</span>
  );
}

// Consistency leaderboard — sorted by streak desc, then total logs
const CONSISTENCY_BOARD = [
  { user:SEED_USERS[1], streak:31, bestStreak:45, totalLogs:89, thisWeek:7, badge:"🔥 On fire" },
  { user:SEED_USERS[2], streak:22, bestStreak:38, totalLogs:74, thisWeek:7, badge:"⚡ Relentless" },
  { user:SEED_USERS[4], streak:19, bestStreak:26, totalLogs:61, thisWeek:6, badge:"💪 Consistent" },
  { user:SEED_USERS[0], streak:14, bestStreak:21, totalLogs:52, thisWeek:6, badge:"🎯 Dialed in" },
  { user:SEED_USERS[6], streak:11, bestStreak:14, totalLogs:38, thisWeek:5, badge:"📈 Building" },
  { user:SEED_USERS[5], streak:5,  bestStreak:12, totalLogs:29, thisWeek:4, badge:"🌱 Getting there" },
  { user:SEED_USERS[3], streak:7,  bestStreak:9,  totalLogs:24, thisWeek:5, badge:"🔄 Back at it" },
  { user:SEED_USERS[7], streak:3,  bestStreak:8,  totalLogs:18, thisWeek:3, badge:"👟 Starting out" },
];

const HALL_OF_FAME_THRESHOLD = 7; // 7+ days = hall of fame

function LeaderboardPanel({ onClose, userSport }) {
  const C = getC();
  const [activeTab, setActiveTab]   = useState("weekly");   // weekly | consistency
  const [activeSport, setActiveSport] = useState(userSport || "Powerlifting");
  const sports  = Object.keys(LEADERBOARD);
  const board   = LEADERBOARD[activeSport] || [];
  const hallOfFame = CONSISTENCY_BOARD.filter(e => e.streak >= HALL_OF_FAME_THRESHOLD);
  const medals = ["🥇","🥈","🥉"];
  const medalColors = ["#FFD700","#A8A9AD","#CD7F32"];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:4000,
      display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"Inter,sans-serif"}}>
      <div style={{background:C.card,borderRadius:"20px 20px 0 0",border:`1px solid ${C.border2}`,
        width:"100%",maxWidth:560,maxHeight:"88vh",display:"flex",flexDirection:"column"}}>

        {/* Header */}
        <div style={{padding:"16px 20px 0",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{color:C.text,fontWeight:800,fontSize:17,fontFamily:"Space Grotesk,sans-serif"}}>
                Leaderboard
              </div>
              <div style={{color:C.muted,fontSize:12,marginTop:2}}>
                {activeTab==="weekly" ? "Top loggers this week by sport" : "Longest active streaks in the community"}
              </div>
            </div>
            <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:22,cursor:"pointer"}}>×</button>
          </div>

          {/* Main tabs */}
          <div style={{display:"flex",gap:0,borderBottom:`1px solid ${C.border}`}}>
            {[["weekly","📊 Weekly"],["consistency","🔥 Consistency"]].map(([t,l])=>(
              <button key={t} onClick={()=>setActiveTab(t)}
                style={{padding:"8px 16px",background:"none",border:"none",cursor:"pointer",
                  fontFamily:"Space Grotesk,sans-serif",fontWeight:700,fontSize:12,
                  color:activeTab===t?C.lime:C.muted,
                  borderBottom:activeTab===t?`2px solid ${C.lime}`:"2px solid transparent",
                  marginBottom:-1,transition:"0.15s",whiteSpace:"nowrap"}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* ── WEEKLY TAB ── */}
        {activeTab==="weekly" && (<>
          <div style={{display:"flex",gap:0,padding:"10px 20px",borderBottom:`1px solid ${C.border}`,
            overflowX:"auto",flexShrink:0}}>
            {sports.map(s=>(
              <button key={s} onClick={()=>setActiveSport(s)}
                style={{padding:"5px 12px",borderRadius:20,border:"none",
                  background:activeSport===s?C.lime:"transparent",
                  color:activeSport===s?C.deep:C.muted,
                  fontSize:11,fontWeight:activeSport===s?800:500,
                  cursor:"pointer",fontFamily:"Space Grotesk,sans-serif",
                  whiteSpace:"nowrap",transition:"all 0.15s",flexShrink:0}}>
                {s}
              </button>
            ))}
          </div>
          <div style={{overflowY:"auto",flex:1,padding:"12px 20px 30px"}}>
            {/* Podium */}
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",
              gap:12,marginBottom:20,paddingTop:8}}>
              {[board[1],board[0],board[2]].filter(Boolean).map((entry,i)=>{
                const rank = i===0?2:i===1?1:3;
                const h = rank===1?90:rank===2?70:60;
                return (
                  <div key={rank} style={{display:"flex",flexDirection:"column",
                    alignItems:"center",gap:5,flex:rank===1?"0 0 110px":"0 0 88px"}}>
                    <Avatar user={entry.user} size={rank===1?48:36}/>
                    <div style={{fontSize:11,fontWeight:700,color:C.text,
                      fontFamily:"Space Grotesk,sans-serif",textAlign:"center",
                      maxWidth:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {entry.user.name.split(" ")[0]}
                    </div>
                    <div style={{fontSize:10,color:C.muted}}>{entry.logs} logs</div>
                    <div style={{width:"100%",height:h,borderRadius:"8px 8px 0 0",
                      background:rank===1?C.lime:rank===2?C.surface:C.border,
                      display:"flex",alignItems:"flex-start",justifyContent:"center",
                      paddingTop:8,fontSize:rank===1?24:18}}>
                      {medals[rank-1]}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden"}}>
              {board.map((entry,i)=>(
                <div key={i} style={{padding:"11px 14px",
                  borderBottom:i<board.length-1?`1px solid ${C.border}`:"none",
                  display:"flex",alignItems:"center",gap:10,
                  background:i===0?`${C.lime}08`:"transparent"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,
                    background:medalColors[i]||C.border,display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:i<3?13:10,fontWeight:800,
                    color:i<3?"#fff":C.muted,fontFamily:"Space Grotesk,sans-serif"}}>
                    {i<3?medals[i]:i+1}
                  </div>
                  <Avatar user={entry.user} size={34}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{color:C.text,fontSize:13,fontWeight:600}}>{entry.user.name}</div>
                    <div style={{color:C.muted,fontSize:11,marginTop:1}}>
                      {entry.user.handle} · <StreakFlame days={entry.user.streak}/> {entry.user.streak}d
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{color:C.lime,fontSize:14,fontWeight:800,
                      fontFamily:"Space Grotesk,sans-serif"}}>{entry.logs} logs</div>
                    <div style={{color:C.muted,fontSize:10,marginTop:1}}>
                      ⚡ {entry.topKudos.toLocaleString()} kudos
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{textAlign:"center",color:C.muted,fontSize:11,marginTop:10}}>
              Resets every Monday at midnight UTC
            </div>
          </div>
        </>)}

        {/* ── CONSISTENCY TAB ── */}
        {activeTab==="consistency" && (
          <div style={{overflowY:"auto",flex:1,padding:"16px 20px 30px"}}>

            {/* Hall of Fame */}
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{fontSize:20}}>🏛️</span>
                <div>
                  <div style={{color:C.text,fontWeight:800,fontSize:14,fontFamily:"Space Grotesk,sans-serif"}}>
                    Streak Hall of Fame
                  </div>
                  <div style={{color:C.muted,fontSize:11,marginTop:1}}>
                    Active streaks of {HALL_OF_FAME_THRESHOLD}+ days
                  </div>
                </div>
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {hallOfFame.map((entry,i)=>(
                  <div key={i} style={{padding:"12px 14px",borderRadius:12,
                    background:i===0?`${C.lime}12`:C.surface,
                    border:`1px solid ${i===0?C.lime:C.border}`,
                    display:"flex",alignItems:"center",gap:10}}>
                    <Avatar user={entry.user} size={40}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                        <span style={{color:C.text,fontSize:13,fontWeight:700}}>{entry.user.name}</span>
                        <span style={{background:`${C.orange}20`,color:C.orange,fontSize:9,
                          fontWeight:800,padding:"2px 7px",borderRadius:20,
                          fontFamily:"Space Grotesk,sans-serif"}}>{entry.badge}</span>
                      </div>
                      <div style={{color:C.muted,fontSize:11}}>
                        {entry.user.handle} · Best: {entry.bestStreak}d · {entry.totalLogs} total logs
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,justifyContent:"flex-end",marginBottom:2}}>
                        <StreakFlame days={entry.streak}/>
                        <span style={{color:C.text,fontSize:18,fontWeight:900,
                          fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>{entry.streak}</span>
                      </div>
                      <div style={{color:C.muted,fontSize:10}}>day streak</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full consistency ranking */}
            <div style={{color:C.muted,fontSize:10,fontWeight:700,letterSpacing:"0.08em",
              fontFamily:"Space Grotesk,sans-serif",marginBottom:10}}>
              FULL RANKING — THIS WEEK
            </div>
            <div style={{borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:14}}>
              {/* Header row */}
              <div style={{padding:"8px 14px",background:C.surface,display:"grid",
                gridTemplateColumns:"28px 36px 1fr 52px 52px",gap:8,alignItems:"center"}}>
                {["#","","Athlete","Streak","Logs"].map((h,i)=>(
                  <div key={i} style={{color:C.muted,fontSize:9,fontWeight:700,
                    letterSpacing:"0.07em",fontFamily:"Space Grotesk,sans-serif",
                    textAlign:i>2?"center":"left"}}>{h}</div>
                ))}
              </div>
              {CONSISTENCY_BOARD.map((entry,i)=>(
                <div key={i} style={{padding:"10px 14px",
                  borderTop:`1px solid ${C.border}`,display:"grid",
                  gridTemplateColumns:"28px 36px 1fr 52px 52px",gap:8,alignItems:"center",
                  background:i===0?`${C.lime}06`:"transparent"}}>
                  <div style={{color:i<3?medalColors[i]:C.muted,fontSize:i<3?13:11,
                    fontWeight:800,fontFamily:"Space Grotesk,sans-serif"}}>
                    {i<3?medals[i]:i+1}
                  </div>
                  <Avatar user={entry.user} size={32}/>
                  <div>
                    <div style={{color:C.text,fontSize:12,fontWeight:600,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {entry.user.name}
                    </div>
                    <div style={{color:C.muted,fontSize:10,marginTop:1}}>{entry.user.sport}</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:3}}>
                      <StreakFlame days={entry.streak}/>
                      <span style={{color:C.text,fontSize:12,fontWeight:700,
                        fontFamily:"Space Grotesk,sans-serif"}}>{entry.streak}d</span>
                    </div>
                  </div>
                  <div style={{textAlign:"center",color:C.lime,fontSize:12,fontWeight:700,
                    fontFamily:"Space Grotesk,sans-serif"}}>{entry.thisWeek}</div>
                </div>
              ))}
            </div>

            {/* How streaks are scored */}
            <div style={{background:C.surface,borderRadius:10,padding:"12px 14px"}}>
              <div style={{color:C.muted,fontSize:10,fontWeight:700,letterSpacing:"0.07em",
                fontFamily:"Space Grotesk,sans-serif",marginBottom:8}}>HOW STREAKS EARN STRIDES</div>
              {[["3-day streak bonus","30 Strides"],["7-day streak bonus","100 Strides"],
                ["14-day streak bonus","250 Strides"],["30-day streak bonus","600 Strides"],
                ["Hall of Fame entry","Permanent badge"]].map(([l,r])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{color:C.text,fontSize:12}}>{l}</span>
                  <span style={{color:C.lime,fontSize:12,fontWeight:700}}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// BRAND DASHBOARD
// ═══════════════════════════════════════════════════════

function BrandDashboard({ onClose }) {
  const C = getC();
  const [activeTab, setActiveTab] = useState("overview");

  const mockData = {
    impressions: "284K",
    clicks:      "18.4K",
    ctr:         "6.5%",
    conversions: "1,240",
    revenue:     "$14,880",
    topProducts: [
      { name:"Whey Protein Isolate", mentions:847, clicks:3200, aff:"Amazon",    revenue:"$3,840" },
      { name:"ButcherBox Chicken",   mentions:612, clicks:2100, aff:"ButcherBox", revenue:"$2,940" },
      { name:"GU Energy Gels",       mentions:441, clicks:1800, aff:"GU Energy",  revenue:"$1,620" },
      { name:"Maurten 320",          mentions:334, clicks:1200, aff:"Maurten",    revenue:"$2,160" },
      { name:"Vega Sport Protein",   mentions:289, clicks:980,  aff:"Amazon",    revenue:"$1,470" },
    ],
    topAthletes: [
      { user:SEED_USERS[2], reach:"89.2K", posts:7, revenue:"$4,200" },
      { user:SEED_USERS[1], reach:"12.4K", posts:5, revenue:"$1,860" },
      { user:SEED_USERS[0], reach:"4.8K",  posts:4, revenue:"$1,140" },
    ],
    sponsored: [
      { brand:"GNC", sport:"All",          budget:"$2,000/mo", impressions:"42K",  status:"active"  },
      { brand:"RXBAR", sport:"CrossFit",   budget:"$800/mo",   impressions:"18K",  status:"active"  },
      { brand:"Nike Fuel", sport:"Marathon",budget:"$1,500/mo", impressions:"31K", status:"pending" },
    ],
  };

  return (
    <div style={{position:"fixed",inset:0,background:C.bg,zIndex:4000,
      display:"flex",flexDirection:"column",fontFamily:"Inter,sans-serif",overflowY:"auto"}}>
      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"14px 20px",
        display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div>
          <div style={{color:C.text,fontWeight:800,fontSize:16,fontFamily:"Space Grotesk,sans-serif"}}>
            Brand Dashboard
          </div>
          <div style={{color:C.muted,fontSize:11,marginTop:2}}>Last 30 days · All sports</div>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:22,cursor:"pointer"}}>×</button>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,padding:"0 20px",
        background:C.card,overflowX:"auto",flexShrink:0}}>
        {[["overview","Overview"],["products","Products"],["athletes","Athletes"],["sponsored","Sponsored"]].map(([t,l])=>(
          <button key={t} onClick={()=>setActiveTab(t)}
            style={{padding:"10px 16px",background:"none",border:"none",cursor:"pointer",
              fontFamily:"Space Grotesk,sans-serif",fontWeight:700,fontSize:12,whiteSpace:"nowrap",
              color:activeTab===t?C.lime:C.muted,
              borderBottom:activeTab===t?`2px solid ${C.lime}`:"2px solid transparent",
              marginBottom:-1,transition:"0.15s"}}>
            {l}
          </button>
        ))}
      </div>

      <div style={{flex:1,padding:"18px 20px",maxWidth:680,width:"100%",margin:"0 auto"}}>

        {activeTab==="overview"&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
              {[
                {l:"Impressions",    v:mockData.impressions, icon:"👁️"},
                {l:"Link Clicks",    v:mockData.clicks,      icon:"🔗"},
                {l:"Click Rate",     v:mockData.ctr,         icon:"📊"},
                {l:"Conversions",    v:mockData.conversions, icon:"🛒"},
                {l:"Revenue Generated",v:mockData.revenue,  icon:"💰"},
                {l:"Athlete Partners",v:"8 active",          icon:"⚡"},
              ].map(s=>(
                <div key={s.l} style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,
                  padding:"13px 14px"}}>
                  <div style={{fontSize:18,marginBottom:5}}>{s.icon}</div>
                  <div style={{color:C.lime,fontSize:20,fontWeight:900,fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>{s.v}</div>
                  <div style={{color:C.muted,fontSize:11,marginTop:3}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:"14px 16px"}}>
              <div style={{color:C.text,fontWeight:700,fontSize:14,fontFamily:"Space Grotesk,sans-serif",marginBottom:10}}>Revenue by affiliate partner</div>
              {[
                {name:"Amazon",     pct:58, rev:"$8,630"},
                {name:"ButcherBox", pct:20, rev:"$2,940"},
                {name:"Maurten",    pct:15, rev:"$2,160"},
                {name:"GU Energy",  pct:7,  rev:"$1,150"},
              ].map(p=>(
                <div key={p.name} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{color:C.text,fontSize:13}}>{p.name}</span>
                    <span style={{color:C.lime,fontSize:13,fontWeight:700}}>{p.rev}</span>
                  </div>
                  <div style={{height:6,background:C.border,borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${p.pct}%`,background:C.lime,borderRadius:3,transition:"width 0.5s"}}/>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab==="products"&&(
          <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",background:C.surface,display:"grid",
              gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8}}>
              {["Product","Mentions","Clicks","Revenue"].map(h=>(
                <div key={h} style={{color:C.muted,fontSize:10,fontWeight:700,
                  letterSpacing:"0.07em",fontFamily:"Space Grotesk,sans-serif"}}>{h}</div>
              ))}
            </div>
            {mockData.topProducts.map((p,i)=>(
              <div key={i} style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`,
                display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8,alignItems:"center"}}>
                <div>
                  <div style={{color:C.text,fontSize:13,fontWeight:500}}>{p.name}</div>
                  <div style={{color:C.muted,fontSize:11,marginTop:1}}>via {p.aff}</div>
                </div>
                <div style={{color:C.text,fontSize:13}}>{p.mentions.toLocaleString()}</div>
                <div style={{color:C.text,fontSize:13}}>{p.clicks.toLocaleString()}</div>
                <div style={{color:C.lime,fontSize:13,fontWeight:700}}>{p.revenue}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab==="athletes"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {mockData.topAthletes.map((a,i)=>(
              <div key={i} style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,
                padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                <Avatar user={a.user} size={44}/>
                <div style={{flex:1}}>
                  <div style={{color:C.text,fontWeight:700,fontSize:14}}>{a.user.name}</div>
                  <div style={{color:C.muted,fontSize:11,marginTop:2}}>
                    {a.user.handle} · {a.user.sport} · {a.reach} reach
                  </div>
                  <div style={{display:"flex",gap:12,marginTop:6}}>
                    <span style={{color:C.muted,fontSize:11}}>{a.posts} posts this month</span>
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{color:C.lime,fontSize:17,fontWeight:900,fontFamily:"Space Grotesk,sans-serif"}}>{a.revenue}</div>
                  <div style={{color:C.muted,fontSize:10,marginTop:2}}>generated</div>
                </div>
              </div>
            ))}
            <div style={{padding:"14px 16px",background:C.surface,borderRadius:12,
              border:`1px dashed ${C.border2}`,textAlign:"center"}}>
              <div style={{color:C.lime,fontSize:14,fontWeight:700,fontFamily:"Space Grotesk,sans-serif",marginBottom:4}}>
                + Invite an athlete
              </div>
              <div style={{color:C.muted,fontSize:12}}>
                Partner with creators to sponsor their food logs and reach their audience directly.
              </div>
            </div>
          </div>
        )}

        {activeTab==="sponsored"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{background:C.surface,borderRadius:10,padding:"12px 14px",
              border:`1px solid ${C.lime}30`,marginBottom:4}}>
              <div style={{color:C.lime,fontSize:12,fontWeight:700,fontFamily:"Space Grotesk,sans-serif",marginBottom:4}}>
                How sponsored placements work
              </div>
              <div style={{color:C.muted,fontSize:12,lineHeight:1.6}}>
                Your product appears as the "featured item" when athletes in your target sport log foods from your category. You pay a flat monthly fee — no auction, no bidding.
              </div>
            </div>
            {mockData.sponsored.map((s,i)=>(
              <div key={i} style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,
                padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:10,background:C.surface,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontWeight:800,fontSize:11,color:C.lime,fontFamily:"Space Grotesk,sans-serif",flexShrink:0}}>
                  {s.brand.slice(0,2).toUpperCase()}
                </div>
                <div style={{flex:1}}>
                  <div style={{color:C.text,fontWeight:700,fontSize:14}}>{s.brand}</div>
                  <div style={{color:C.muted,fontSize:11,marginTop:2}}>
                    {s.sport} · {s.budget}
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,
                    background:s.status==="active"?`${C.lime}20`:C.surface,
                    color:s.status==="active"?C.lime:C.muted,fontFamily:"Space Grotesk,sans-serif",
                    marginBottom:4}}>{s.status}</div>
                  <div style={{color:C.muted,fontSize:10}}>{s.impressions} impr.</div>
                </div>
              </div>
            ))}
            <button style={{padding:"12px",background:C.lime,border:"none",borderRadius:10,
              color:C.deep,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"Space Grotesk,sans-serif"}}>
              + Create sponsored placement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// FIRST MEAL ONBOARDING PROMPT (shown on day 1 in feed)
// ═══════════════════════════════════════════════════════

function FirstMealPrompt({ userGoal, userSport, onLog, onDismiss }) {
  const C = getC();
  const goalLabel = { muscle:"Build muscle", lose:"Lose weight", endurance:"Endurance", maintain:"Maintain", recomp:"Body recomp" };
  return (
    <div style={{margin:"0 0 16px",borderRadius:16,border:`2px solid ${C.lime}`,
      background:`${C.lime}08`,padding:"18px 18px",fontFamily:"Inter,sans-serif"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <div style={{fontSize:28}}>🍴</div>
        <div>
          <div style={{color:C.text,fontWeight:800,fontSize:15,fontFamily:"Space Grotesk,sans-serif"}}>
            Log your first meal
          </div>
          <div style={{color:C.muted,fontSize:12,marginTop:1}}>
            See your macros update live — it takes 30 seconds
          </div>
        </div>
        <button onClick={onDismiss} style={{marginLeft:"auto",background:"none",border:"none",
          color:C.muted,fontSize:18,cursor:"pointer",lineHeight:1}}>×</button>
      </div>
      <div style={{background:C.surface,borderRadius:10,padding:"10px 14px",marginBottom:12,
        display:"flex",gap:12,alignItems:"center"}}>
        <div style={{flex:1}}>
          <div style={{color:C.muted,fontSize:10,fontWeight:700,letterSpacing:"0.07em",
            fontFamily:"Space Grotesk,sans-serif",marginBottom:2}}>YOUR GOAL</div>
          <div style={{color:C.text,fontSize:13,fontWeight:600}}>{goalLabel[userGoal] || "Get started"}</div>
        </div>
        {userSport&&<div style={{flex:1}}>
          <div style={{color:C.muted,fontSize:10,fontWeight:700,letterSpacing:"0.07em",
            fontFamily:"Space Grotesk,sans-serif",marginBottom:2}}>YOUR SPORT</div>
          <div style={{color:C.text,fontSize:13,fontWeight:600}}>{userSport}</div>
        </div>}
      </div>
      <button onClick={onLog}
        style={{width:"100%",padding:"12px",background:C.lime,border:"none",borderRadius:10,
          color:C.deep,fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"Space Grotesk,sans-serif"}}>
        Log my first meal now →
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════
// SIGNUP FLOW — multi-step onboarding
// ═══════════════════════════════════════════════════════

const SPORTS_LIST = [
  "Bodybuilding","Powerlifting","CrossFit","Weightlifting","Olympic Lifting",
  "Marathon","Trail Running","Cycling","Triathlon","Swimming","Rowing",
  "Pilates","Yoga","HIIT","Calisthenics","Boxing","MMA","Football",
  "Basketball","Soccer","Tennis","Baseball","Hockey","Golf","Other",
];

const GOALS_LIST = [
  { id:"muscle",    icon:"💪", label:"Build lean muscle",   desc:"Increase lean mass, stay lean" },
  { id:"bulk",      icon:"📈", label:"Bulk",                desc:"Aggressive muscle gain" },
  { id:"lose",      icon:"🔥", label:"Fat loss",            desc:"Reduce body fat percentage" },
  { id:"cut",       icon:"✂️", label:"Cutting",             desc:"Lean out while preserving muscle" },
  { id:"recomp",    icon:"🔄", label:"Body recomposition",  desc:"Lose fat and gain muscle simultaneously" },
  { id:"endurance", icon:"🏃", label:"Endurance",           desc:"Fuel for performance and distance" },
  { id:"maintain",  icon:"⚖️", label:"Maintenance",         desc:"Stay exactly where I am" },
];

function StepIndicator({ step, total }) {
  const C = getC();
  return (
    <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:28}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{height:4,borderRadius:2,transition:"all 0.3s",
          width: i===step ? 28 : 14,
          background: i<=step ? C.lime : C.border2}}/>
      ))}
    </div>
  );
}

function SignupFlow({ onComplete, authError }) {
  const C = getC();
  const [step, setStep]           = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]           = useState({
    firstName:"", lastName:"", email:"", password:"",
    username:"", dob:"", sport:"", goal:"",
    weight:"", weightUnit:"lbs", units:"imperial",
    agreedTerms:false, agreedPrivacy:false,
  });
  const [errors, setErrors]       = useState({});
  const [showPass, setShowPass]   = useState(false);
  const [sportSearch, setSportSearch] = useState("");

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const clearErr = (k) => setErrors(e=>{const n={...e};delete n[k];return n;});

  const inputStyle = (key) => ({
    width:"100%", padding:"12px 14px",
    background:C.surface, border:`1.5px solid ${errors[key]?C.orange:C.border2}`,
    borderRadius:10, color:C.text, fontSize:15, outline:"none",
    boxSizing:"border-box", fontFamily:"Inter,sans-serif", transition:"border-color 0.15s",
  });

  const labelStyle = {
    color:C.muted, fontSize:11, fontWeight:700,
    letterSpacing:"0.07em", fontFamily:"Space Grotesk,sans-serif",
    display:"block", marginBottom:5,
  };

  const validateStep = () => {
    const e = {};
    if (step===0) {
      if (!form.firstName.trim())    e.firstName = "Required";
      if (!form.lastName.trim())     e.lastName  = "Required";
      if (!form.email.includes("@")) e.email     = "Valid email required";
      if (form.password.length < 8)  e.password  = "Min 8 characters";
    }
    if (step===1) {
      if (!form.username.trim()) e.username = "Required";
      const dob = new Date(form.dob);
      const age = (Date.now()-dob)/(1000*60*60*24*365.25);
      if (!form.dob || age < 13) e.dob = "Must be 13 or older";
      if (!form.agreedTerms || !form.agreedPrivacy) e.legal = "Please agree to continue";
    }
    if (step===2) {
      if (!form.sport) e.sport = "Please select a sport";
      if (!form.goal)  e.goal  = "Please select a goal";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s=>s+1); };
  const back = () => { setErrors({}); setStep(s=>s-1); };

  const filteredSports = sportSearch
    ? SPORTS_LIST.filter(s=>s.toLowerCase().includes(sportSearch.toLowerCase()))
    : SPORTS_LIST;

  // Mifflin-St Jeor calorie estimate
  const suggestedCalories = () => {
    if (!form.goal) return null;
    const wKg = form.units==="imperial" ? (+form.weight||175)*0.453592 : (+form.weight||80);
    const dob  = new Date(form.dob);
    const age  = form.dob ? Math.floor((Date.now()-dob)/(1000*60*60*24*365.25)) : 30;
    const bmr  = wKg*10 + 170*6.25 - age*5 + 5; // male assumption; neutral offset
    const tdee = Math.round(bmr * 1.55); // moderate activity
    const offsets = { muscle:+300, lose:-400, endurance:+100, maintain:0, recomp:0 };
    return Math.max(1400, tdee + (offsets[form.goal]||0));
  };

  const cals = suggestedCalories();
  const macros = cals ? {
    protein: Math.round(cals*0.30/4),
    carbs:   Math.round(cals*0.45/4),
    fat:     Math.round(cals*0.25/9),
  } : null;

  const Field = ({label, name, type="text", placeholder, autoComplete}) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={form[name]} placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={e=>{set(name,e.target.value);clearErr(name);}}
        style={inputStyle(name)}/>
      {errors[name]&&<div style={{color:C.orange,fontSize:11,marginTop:4,fontFamily:"Inter,sans-serif"}}>{errors[name]}</div>}
    </div>
  );

  const TOTAL_STEPS = 4;

  return (
    <div style={{position:"fixed",inset:0,background:C.bg,zIndex:4000,
      display:"flex",flexDirection:"column",fontFamily:"Inter,sans-serif",overflowY:"auto"}}>

      {/* Header */}
      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,
        padding:"14px 20px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        {step>0&&<button onClick={back} style={{background:"none",border:"none",
          color:C.muted,fontSize:15,cursor:"pointer",padding:0}}>←</button>}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="7" fill="#0A0A0A"/>
            <rect x="8" y="7" width="4.5" height="18" rx="2.25" fill="#FAFAF8"/>
            <rect x="12.5" y="7" width="13" height="4.5" rx="2.25" fill="#FAFAF8"/>
            <rect x="12.5" y="15" width="8.5" height="4.5" rx="2.25" fill="#FAFAF8"/>
          </svg>
          <span style={{fontWeight:800,fontSize:16,fontFamily:"Space Grotesk,sans-serif"}}>
            <span style={{color:C.text}}>Fork</span><span style={{color:C.lime}}>Step</span>
          </span>
        </div>
        <span style={{marginLeft:"auto",color:C.muted,fontSize:12}}>Step {step+1} of {TOTAL_STEPS}</span>
      </div>

      <div style={{flex:1,maxWidth:480,margin:"0 auto",padding:"28px 24px 40px",width:"100%"}}>
        <StepIndicator step={step} total={TOTAL_STEPS}/>

        {/* ── STEP 0: Name + Email + Password ── */}
        {step===0&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div>
              <h2 style={{color:C.text,fontSize:24,fontWeight:900,fontFamily:"Space Grotesk,sans-serif",
                letterSpacing:"-0.02em",marginBottom:4}}>Create your account</h2>
              <p style={{color:C.muted,fontSize:14,lineHeight:1.5}}>
                Join 12,400+ athletes logging what they eat every day.
              </p>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="FIRST NAME" name="firstName" placeholder="Alex" autoComplete="given-name"/>
              <Field label="LAST NAME"  name="lastName"  placeholder="Johnson" autoComplete="family-name"/>
            </div>

            <Field label="EMAIL" name="email" type="email" placeholder="you@example.com" autoComplete="email"/>

            <div>
              <label style={labelStyle}>PASSWORD</label>
              <div style={{position:"relative"}}>
                <input type={showPass?"text":"password"} value={form.password}
                  placeholder="At least 8 characters" autoComplete="new-password"
                  onChange={e=>{set("password",e.target.value);clearErr("password");}}
                  style={{...inputStyle("password"),paddingRight:44}}/>
                <button onClick={()=>setShowPass(v=>!v)}
                  style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:13}}>
                  {showPass?"Hide":"Show"}
                </button>
              </div>
              {errors.password&&<div style={{color:C.orange,fontSize:11,marginTop:4}}>{errors.password}</div>}
              {form.password.length>0&&(()=>{
                const str = form.password.length<6?1:form.password.length<10?2:3;
                const cols = ["#E24B4A","#EF9F27",C.lime];
                return <div style={{display:"flex",gap:4,marginTop:6}}>
                  {[1,2,3].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,
                    background:i<=str?cols[str-1]:C.border,transition:"background 0.2s"}}/>)}
                </div>;
              })()}
            </div>

            <button onClick={next}
              style={{padding:"14px",background:C.lime,border:"none",borderRadius:10,
                color:C.deep,fontWeight:800,fontSize:15,cursor:"pointer",
                fontFamily:"Space Grotesk,sans-serif",marginTop:4}}>
              Continue →
            </button>

            <div style={{textAlign:"center",color:C.muted,fontSize:13}}>
              Already have an account?{" "}
              <button onClick={()=>onComplete(form)}
                style={{background:"none",border:"none",color:C.lime,fontWeight:700,
                  cursor:"pointer",fontSize:13,fontFamily:"Inter,sans-serif"}}>
                Sign in
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: Username + DOB + Legal ── */}
        {step===1&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div>
              <h2 style={{color:C.text,fontSize:22,fontWeight:900,fontFamily:"Space Grotesk,sans-serif",
                letterSpacing:"-0.02em",marginBottom:4}}>Set up your profile</h2>
              <p style={{color:C.muted,fontSize:14,lineHeight:1.5}}>
                Choose your public handle and confirm you're 13 or older.
              </p>
            </div>

            <Field label="USERNAME (your public handle)" name="username" placeholder="@yourusername" autoComplete="username"/>

            <div>
              <label style={labelStyle}>DATE OF BIRTH</label>
              <input type="date" value={form.dob}
                onChange={e=>{set("dob",e.target.value);clearErr("dob");}}
                style={inputStyle("dob")} max={new Date().toISOString().split("T")[0]}/>
              {errors.dob&&<div style={{color:C.orange,fontSize:11,marginTop:4}}>{errors.dob}</div>}
              <div style={{color:C.muted,fontSize:11,marginTop:4,fontFamily:"Inter,sans-serif"}}>
                Must be 13 or older. Required for COPPA compliance.
              </div>
            </div>

            {/* Legal checkboxes */}
            <div style={{background:C.surface,borderRadius:10,padding:"14px",
              border:errors.legal?`1.5px solid ${C.orange}`:`1px solid ${C.border}`}}>
              {[
                { key:"agreedTerms",   label:"I agree to the Terms of Service" },
                { key:"agreedPrivacy", label:"I agree to the Privacy Policy and understand my data personalizes my experience" },
              ].map(({key,label})=>(
                <label key={key} style={{display:"flex",gap:10,alignItems:"flex-start",
                  cursor:"pointer",marginBottom:key==="agreedTerms"?10:0}}>
                  <div onClick={()=>{set(key,!form[key]);clearErr("legal");}}
                    style={{width:18,height:18,borderRadius:4,flexShrink:0,marginTop:1,
                      background:form[key]?C.lime:C.surface,
                      border:`1.5px solid ${form[key]?C.lime:C.border2}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      cursor:"pointer",transition:"all 0.15s"}}>
                    {form[key]&&<span style={{fontSize:11,color:C.deep,fontWeight:900}}>✓</span>}
                  </div>
                  <span style={{color:C.muted,fontSize:13,lineHeight:1.5}}>{label}</span>
                </label>
              ))}
              {errors.legal&&<div style={{color:C.orange,fontSize:11,marginTop:8}}>{errors.legal}</div>}
            </div>

            <button onClick={next}
              style={{padding:"14px",background:C.lime,border:"none",borderRadius:10,
                color:C.deep,fontWeight:800,fontSize:15,cursor:"pointer",
                fontFamily:"Space Grotesk,sans-serif"}}>
              Continue →
            </button>
          </div>
        )}

        {/* ── STEP 2: Sport + Goal ── */}
        {step===2&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div>
              <h2 style={{color:C.text,fontSize:22,fontWeight:900,fontFamily:"Space Grotesk,sans-serif",
                letterSpacing:"-0.02em",marginBottom:4}}>Your sport & goal</h2>
              <p style={{color:C.muted,fontSize:14}}>
                This personalizes your feed, macro targets, and athlete connections.
              </p>
            </div>

            <div>
              <label style={labelStyle}>PRIMARY SPORT OR ACTIVITY</label>
              <input value={sportSearch} onChange={e=>setSportSearch(e.target.value)}
                placeholder="Search or scroll…" style={{...inputStyle("sport"),marginBottom:10}}/>
              {errors.sport&&<div style={{color:C.orange,fontSize:11,marginBottom:6}}>{errors.sport}</div>}
              <div style={{display:"flex",flexWrap:"wrap",gap:6,maxHeight:200,overflowY:"auto"}}>
                {filteredSports.map(s=>(
                  <button key={s} onClick={()=>{set("sport",s);clearErr("sport");setSportSearch("");}}
                    style={{padding:"7px 14px",borderRadius:20,border:"1px solid",
                      borderColor:form.sport===s?C.lime:C.border2,
                      background:form.sport===s?C.lime:C.surface,
                      color:form.sport===s?C.deep:C.text,
                      fontSize:13,cursor:"pointer",fontFamily:"Inter,sans-serif",
                      fontWeight:form.sport===s?700:400,transition:"all 0.15s"}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>FITNESS GOAL</label>
              {errors.goal&&<div style={{color:C.orange,fontSize:11,marginBottom:6}}>{errors.goal}</div>}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {GOALS_LIST.map(g=>(
                  <button key={g.id} onClick={()=>{set("goal",g.id);clearErr("goal");}}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                      borderRadius:10,border:`1.5px solid ${form.goal===g.id?C.lime:C.border2}`,
                      background:form.goal===g.id?`${C.lime}18`:C.surface,
                      cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
                    <span style={{fontSize:20}}>{g.icon}</span>
                    <div>
                      <div style={{color:C.text,fontSize:14,fontWeight:600,fontFamily:"Space Grotesk,sans-serif"}}>{g.label}</div>
                      <div style={{color:C.muted,fontSize:12}}>{g.desc}</div>
                    </div>
                    {form.goal===g.id&&(
                      <div style={{marginLeft:"auto",width:18,height:18,borderRadius:"50%",
                        background:C.lime,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{fontSize:11,color:C.deep,fontWeight:900}}>✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={next}
              style={{padding:"14px",background:C.lime,border:"none",borderRadius:10,
                color:C.deep,fontWeight:800,fontSize:15,cursor:"pointer",
                fontFamily:"Space Grotesk,sans-serif"}}>
              Continue →
            </button>
          </div>
        )}

        {/* ── STEP 3: Body + Units (was step 2) ── */}
        {step===3&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div>
              <h2 style={{color:C.text,fontSize:22,fontWeight:900,fontFamily:"Space Grotesk,sans-serif",
                letterSpacing:"-0.02em",marginBottom:4}}>Almost there 🎉</h2>
              <p style={{color:C.muted,fontSize:14,lineHeight:1.5}}>
                Your body weight lets us calculate real macro targets using the Mifflin-St Jeor equation — the same formula dietitians use.
              </p>
            </div>

            <div>
              <label style={labelStyle}>PREFERRED UNITS</label>
              <div style={{display:"flex",gap:0,background:C.surface,borderRadius:10,
                border:`1px solid ${C.border2}`,padding:4}}>
                {[["imperial","lbs / oz / miles"],["metric","kg / g / km"]].map(([val,label])=>(
                  <button key={val} onClick={()=>{set("units",val);set("weightUnit",val==="imperial"?"lbs":"kg");}}
                    style={{flex:1,padding:"9px",borderRadius:8,border:"none",cursor:"pointer",
                      background:form.units===val?C.lime:"transparent",
                      color:form.units===val?C.deep:C.muted,
                      fontWeight:form.units===val?700:400,fontSize:13,
                      fontFamily:"Space Grotesk,sans-serif",transition:"all 0.15s"}}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                BODY WEIGHT
                <span style={{color:C.lime,fontSize:10,marginLeft:6,fontWeight:500}}>
                  — helps personalize your macro targets
                </span>
              </label>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="number" value={form.weight}
                  onChange={e=>set("weight",e.target.value)}
                  placeholder={form.units==="imperial"?"e.g. 175":"e.g. 80"}
                  style={{...inputStyle("weight"),flex:1}}/>
                <div style={{background:C.surface,border:`1px solid ${C.border2}`,
                  borderRadius:10,padding:"12px 14px",color:C.muted,fontSize:14,
                  fontFamily:"Space Grotesk,sans-serif",fontWeight:700,flexShrink:0}}>
                  {form.weightUnit}
                </div>
              </div>
            </div>

            {/* Mifflin-St Jeor macro preview */}
            {form.goal && cals && (
              <div style={{background:C.surface,borderRadius:12,padding:"14px 16px",
                border:`1px solid ${C.lime}30`}}>
                <div style={{color:C.muted,fontSize:10,fontWeight:700,letterSpacing:"0.08em",
                  fontFamily:"Space Grotesk,sans-serif",marginBottom:8}}>
                  YOUR ESTIMATED DAILY TARGETS
                  {form.weight&&<span style={{color:C.lime,marginLeft:6,fontWeight:500}}>
                    · based on {form.weight} {form.weightUnit}
                  </span>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:8}}>
                  {[
                    {l:"Calories", v:cals,           u:"kcal", c:C.lime},
                    {l:"Protein",  v:macros.protein, u:"g",    c:C.lime},
                    {l:"Carbs",    v:macros.carbs,   u:"g",    c:C.blue},
                    {l:"Fat",      v:macros.fat,     u:"g",    c:C.orange},
                  ].map(m=>(
                    <div key={m.l} style={{textAlign:"center",background:C.card,borderRadius:8,padding:"8px 4px"}}>
                      <div style={{color:m.c,fontSize:16,fontWeight:900,fontFamily:"Space Grotesk,sans-serif"}}>{m.v}</div>
                      <div style={{color:C.muted,fontSize:9,marginTop:1}}>{m.u}</div>
                      <div style={{color:C.muted,fontSize:9}}>{m.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{color:C.muted,fontSize:11,fontFamily:"Inter,sans-serif"}}>
                  Goal: <strong style={{color:C.text}}>{GOALS_LIST.find(g=>g.id===form.goal)?.label}</strong>
                  {" · "}Adjust anytime from your profile.
                </div>
              </div>
            )}

            <button onClick={()=>onComplete(form)}
              style={{padding:"14px",background:C.lime,border:"none",borderRadius:10,
                color:C.deep,fontWeight:800,fontSize:15,cursor:"pointer",
                fontFamily:"Space Grotesk,sans-serif"}}>
              Start logging 🍴
            </button>
            <button onClick={()=>onComplete(form)}
              style={{background:"none",border:"none",color:C.muted,fontSize:13,
                cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"center"}}>
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
// ═══════════════════════════════════════════════════════
// REPORT SYSTEM — report button, modal, moderation queue
// ═══════════════════════════════════════════════════════

const REPORT_REASONS = [
  "Spam or misleading information",
  "Dangerous or harmful content",
  "Harassment or hate speech",
  "False nutritional claims",
  "Inappropriate content",
  "Impersonation",
  "Other",
];

function ReportModal({ target, targetType, onClose, onSubmit }) {
  const C = getC();
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!reason) return;
    onSubmit({ target, targetType, reason, detail, time: new Date().toISOString() });
    setSubmitted(true);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:5000,
      display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border2}`,
        width:"100%",maxWidth:400,padding:24}}>
        {submitted ? (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:40,marginBottom:12}}>✓</div>
            <div style={{color:C.text,fontWeight:800,fontSize:18,fontFamily:"Space Grotesk,sans-serif",marginBottom:8}}>
              Report submitted
            </div>
            <div style={{color:C.muted,fontSize:14,lineHeight:1.5,marginBottom:20}}>
              Thank you. Our team reviews all reports within 24 hours. We take community safety seriously.
            </div>
            <button onClick={onClose}
              style={{padding:"10px 24px",background:C.lime,border:"none",borderRadius:8,
                color:C.deep,fontWeight:800,cursor:"pointer",fontFamily:"Space Grotesk,sans-serif"}}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <span style={{color:C.text,fontWeight:800,fontSize:16,fontFamily:"Space Grotesk,sans-serif"}}>
                Report {targetType}
              </span>
              <button onClick={onClose}
                style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer"}}>×</button>
            </div>
            <div style={{color:C.muted,fontSize:13,marginBottom:16,lineHeight:1.5}}>
              Help us keep ForkStep safe. Reports are anonymous and reviewed by our team.
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              {REPORT_REASONS.map(r=>(
                <button key={r} onClick={()=>setReason(r)}
                  style={{padding:"10px 14px",borderRadius:8,border:`1.5px solid ${reason===r?C.lime:C.border2}`,
                    background:reason===r?`${C.lime}18`:C.surface,
                    color:reason===r?C.lime:C.text,fontSize:13,cursor:"pointer",
                    textAlign:"left",fontFamily:"Inter,sans-serif",transition:"all 0.15s"}}>
                  {r}
                </button>
              ))}
            </div>
            {reason==="Other"&&(
              <textarea value={detail} onChange={e=>setDetail(e.target.value)}
                placeholder="Tell us more…" rows={3}
                style={{width:"100%",padding:"10px 12px",background:C.surface,
                  border:`1px solid ${C.border2}`,borderRadius:8,color:C.text,
                  fontSize:13,outline:"none",boxSizing:"border-box",
                  fontFamily:"Inter,sans-serif",resize:"none",marginBottom:12}}/>
            )}
            <button onClick={handleSubmit} disabled={!reason}
              style={{width:"100%",padding:"12px",background:reason?C.orange:C.border2,
                border:"none",borderRadius:8,color:"#fff",fontWeight:800,fontSize:14,
                cursor:reason?"pointer":"default",fontFamily:"Space Grotesk,sans-serif"}}>
              Submit Report
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ModerationQueue({ reports, onClose, onDismiss, onRemove }) {
  const C = getC();
  return (
    <div style={{position:"fixed",inset:0,background:C.bg,zIndex:5000,
      display:"flex",flexDirection:"column",fontFamily:"Inter,sans-serif"}}>
      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,
        padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{color:C.text,fontWeight:800,fontSize:16,fontFamily:"Space Grotesk,sans-serif"}}>
          Moderation Queue
        </span>
        <button onClick={onClose}
          style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer"}}>×</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 18px"}}>
        {reports.length===0?(
          <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
            <div style={{fontSize:32,marginBottom:10}}>✅</div>
            <div>No pending reports. Community is clean.</div>
          </div>
        ):reports.map((r,i)=>(
          <div key={i} style={{background:C.card,borderRadius:12,border:`1px solid ${C.border2}`,
            padding:"14px 16px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div>
                <span style={{background:C.orange,color:"#fff",fontSize:9,fontWeight:800,
                  padding:"2px 6px",borderRadius:4,fontFamily:"Space Grotesk,sans-serif",marginRight:6}}>
                  {r.targetType?.toUpperCase()}
                </span>
                <span style={{color:C.muted,fontSize:11}}>{new Date(r.time).toLocaleString()}</span>
              </div>
            </div>
            <div style={{color:C.text,fontSize:14,fontWeight:600,marginBottom:4}}>{r.reason}</div>
            {r.detail&&<div style={{color:C.muted,fontSize:12,marginBottom:8}}>{r.detail}</div>}
            <div style={{color:C.muted,fontSize:12,marginBottom:12,fontStyle:"italic"}}>
              Reported content: "{r.target?.title || r.target?.text || "(post)"}"
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>onDismiss(i)}
                style={{flex:1,padding:"8px",background:C.surface,border:`1px solid ${C.border2}`,
                  borderRadius:8,color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"Space Grotesk,sans-serif"}}>
                Dismiss
              </button>
              <button onClick={()=>onRemove(i)}
                style={{flex:1,padding:"8px",background:`${C.orange}20`,border:`1px solid ${C.orange}`,
                  borderRadius:8,color:C.orange,fontSize:13,fontWeight:700,cursor:"pointer",
                  fontFamily:"Space Grotesk,sans-serif"}}>
                Remove Content
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PRIVACY POLICY MODAL
// ═══════════════════════════════════════════════════════

function PrivacyPolicyModal({ onClose }) {
  const C = getC();
  const sections = [
    { title:"Who we are", body:"ForkStep is a community platform for athletes and fitness enthusiasts to log, share, and discover food and nutrition information. We are operated by ForkStep Inc." },
    { title:"What we collect", body:"We collect information you provide at signup: name, email address, date of birth, username, sport, fitness goal, body weight (optional), and unit preferences. We also collect content you post (food logs, photos, comments), interactions (kudos, follows), and standard usage data (device type, app version, session duration)." },
    { title:"How we use your data", body:"Your data is used to: provide and personalize the ForkStep service; calculate suggested macro targets; match you with relevant athletes in your sport; send notifications you request; improve the platform; and comply with legal obligations. We do not sell your personal data to third parties." },
    { title:"Affiliate links", body:"Some food items in the app contain affiliate links to third-party retailers (Amazon, ButcherBox, etc.). When you click these links and make a purchase, ForkStep or the athlete who posted the content may earn a commission. This does not affect the price you pay." },
    { title:"Data sharing", body:"We share data only with: service providers who help us operate the platform (hosting, analytics, email delivery) under strict data processing agreements; law enforcement when legally required; and other users, for content you choose to post publicly. We never sell your data to advertisers." },
    { title:"Health and fitness data", body:"Body weight, macro targets, and fitness goals are treated as sensitive health-adjacent data. This information is used solely to personalize your experience and is never shared with third parties for advertising purposes." },
    { title:"Data retention", body:"We retain your account data for as long as your account is active. You may delete your account at any time from Settings. Deleted account data is permanently removed within 30 days, except where retention is required by law." },
    { title:"Your rights", body:"Depending on your location, you may have rights to access, correct, export, or delete your personal data. To exercise these rights, contact privacy@forkstep.com. EU/UK users have additional rights under GDPR." },
    { title:"Children's privacy", body:"ForkStep is not intended for users under 13. We do not knowingly collect data from children under 13. If we discover such data has been collected, we will delete it immediately. Users must confirm their date of birth at signup." },
    { title:"Changes to this policy", body:"We will notify users of material changes to this Privacy Policy via email and in-app notification at least 30 days before changes take effect." },
    { title:"Contact us", body:"Questions about this policy? Contact us at privacy@forkstep.com or write to ForkStep Inc., Privacy Team, [Address]." },
  ];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:5000,
      display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px"}}>
      <div style={{background:C.card,borderRadius:16,border:`1px solid ${C.border2}`,
        width:"100%",maxWidth:580,maxHeight:"85vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,
          display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{color:C.text,fontWeight:800,fontSize:16,fontFamily:"Space Grotesk,sans-serif"}}>Privacy Policy</div>
            <div style={{color:C.muted,fontSize:11,marginTop:2}}>Last updated: {new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
          </div>
          <button onClick={onClose}
            style={{background:"none",border:"none",color:C.muted,fontSize:22,cursor:"pointer"}}>×</button>
        </div>
        <div style={{overflowY:"auto",flex:1,padding:"20px"}}>
          <div style={{color:C.muted,fontSize:13,lineHeight:1.6,marginBottom:20,
            padding:"12px 14px",background:C.surface,borderRadius:8,
            borderLeft:`3px solid ${C.lime}`}}>
            This is a summary privacy policy for prototype purposes. Before launching ForkStep, have a qualified attorney draft a full legally compliant Privacy Policy specific to your jurisdiction.
          </div>
          {sections.map((s,i)=>(
            <div key={i} style={{marginBottom:20}}>
              <div style={{color:C.text,fontWeight:700,fontSize:14,fontFamily:"Space Grotesk,sans-serif",marginBottom:6}}>
                {i+1}. {s.title}
              </div>
              <div style={{color:C.muted,fontSize:13,lineHeight:1.7}}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Forkstep() {
  const [darkMode, setDarkMode] = useState(false);
  ThemeCtx.current = darkMode ? DARK : LIGHT;
  const C = getC();

  // Auth + modals
  const [authed, setAuthed]           = useState(false);
  const [authChecking, setAuthChecking] = useState(true); // true while we check for existing session
  const [currentUser, setCurrentUser] = useState(null);    // real Supabase profile row
  const [authError, setAuthError]     = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reports, setReports]         = useState([]);
  const [showModQueue, setShowModQueue] = useState(false);
  const [shareTarget, setShareTarget]   = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBrandDash, setShowBrandDash]     = useState(false);
  const [signupForm, setSignupForm]           = useState({});
  const [showFirstMeal, setShowFirstMeal]     = useState(false);

  // ── On mount: check if a session already exists (returning user) ──
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (profile) {
          setCurrentUser(profile);
          setAuthed(true);
        }
      }
      setAuthChecking(false);
    });

    // Listen for auth changes (login/logout from another tab, token refresh, etc)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setAuthed(false);
        setCurrentUser(null);
      }
    });

    return () => { mounted = false; listener?.subscription?.unsubscribe(); };
  }, []);

  // Feed state
  const [posts, setPosts]             = useState(SEED_POSTS);
  const [users] = useState(SEED_USERS);
  const [following, setFollowing] = useState(["u1","u3"]); // IDs me follows
  const [view, setView] = useState("feed"); // feed | profile
  const [profileUser, setProfileUser] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [notifs, setNotifs] = useState(null); // null = not yet built
  const [userStats, setUserStats] = useState({ points:340, daysLogged:4, streak:3, mealsLogged:17, postsShared:2 });

  // Build smart notifications after auth
  useEffect(()=>{
    if (!authed || notifs !== null) return;
    const n = [];
    if (userStats.streak > 0) n.push({ userId:"u2", type:"streak",
      text:`Your ${userStats.streak}-day streak is on the line. Log before midnight to keep it 🔥`,
      time:"12 min ago", unread:true, cta:"Log now" });
    n.push({ userId:"u1", type:"creator_post",
      text:"Simone V. just logged her comp prep day — see exactly what an 8-week-out powerlifter eats",
      time:"2h ago", unread:true, cta:"See her log" });
    n.push({ userId:"u1", type:"kudos",
      text:"Simone V. gave your post kudos ⚡ — 5 Strides earned",
      time:"3h ago", unread:true, cta:null });
    n.push({ userId:"u2", type:"follow",
      text:"Marcus Chen subscribed to your logs — they'll see everything you eat",
      time:"1d ago", unread:false, cta:"View their profile" });
    n.push({ userId:"u3", type:"aspire",
      text:"Leila Osei hit 160g protein on a fully plant-based day. See how she did it",
      time:"1d ago", unread:false, cta:"See her log" });
    if (userStats.points > 200) n.push({ userId:"u5", type:"rank",
      text:`You're ${1000-userStats.points} Strides from Elite rank — log 2 more days this week`,
      time:"2d ago", unread:false, cta:"View StrideScore" });
    n.push({ userId:"u3", type:"comment",
      text:"Leila replied to your comment: 'Consistency first — the macros follow'",
      time:"2d ago", unread:false, cta:null });
    n.push({ userId:"u4", type:"leaderboard",
      text:`Tyler Brooks is leading ${userStats.streak>0?"your":"the"} Bodybuilding leaderboard this week with 6 logs. You could top it.`,
      time:"3d ago", unread:false, cta:"See leaderboard" });
    setNotifs(n);
  }, [authed]);

  const activeNotifs = notifs || [];
  const unreadCount = activeNotifs.filter(n=>n.unread).length;

  // Moderation handlers
  const handleReport = (r) => { setReports(prev=>[...prev,r]); setReportTarget(null); };
  const dismissReport = (i) => setReports(prev=>prev.filter((_,j)=>j!==i));
  const removeReportedContent = (i) => {
    const r = reports[i];
    if (r?.target?.id) setPosts(prev=>prev.filter(p=>p.id!==r.target.id));
    setReports(prev=>prev.filter((_,j)=>j!==i));
  };

  // Still checking for an existing session — show nothing/spinner briefly
  if (authChecking) return (
    <div style={{position:"fixed",inset:0,background:"#0A0A0A",display:"flex",
      alignItems:"center",justifyContent:"center"}}>
      <div style={{width:32,height:32,border:"3px solid #1E3328",borderTopColor:"#5FCF7A",
        borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // Real Supabase signup — called when SignupFlow completes
  const handleRealSignup = async (form) => {
    setAuthError(null);
    try {
      // 1. Create the auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Signup did not return a user.");

      // 2. Insert their profile row with all the signup data we collected
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          first_name: form.firstName,
          last_name: form.lastName,
          username: form.username,
          date_of_birth: form.dob,
          sport: form.sport,
          goal: form.goal,
          weight: form.weight ? +form.weight : null,
          weight_unit: form.weightUnit,
          units: form.units,
          avatar_initials: (form.firstName?.[0]||"")+(form.lastName?.[0]||""),
        })
        .select()
        .single();
      if (profileError) throw profileError;

      setSignupForm(form);
      setCurrentUser(profile);
      setAuthed(true);
      setShowFirstMeal(true);
    } catch (err) {
      setAuthError(err.message || "Something went wrong creating your account.");
    }
  };

  // Show signup screen until authed
  if (!authed) return (
    <>
      <SignupFlow onComplete={handleRealSignup} authError={authError}/>
      {showPrivacy&&<PrivacyPolicyModal onClose={()=>setShowPrivacy(false)}/>}
    </>
  );

  const showToast = (msg) => setToast(msg);

  const handleFollow = (uid) => {
    setFollowing(f => f.includes(uid) ? f.filter(x=>x!==uid) : [...f,uid]);
    const u = users.find(u=>u.id===uid);
    if(!following.includes(uid)) showToast(`Following ${u?.name} ⚡`);
  };

  const handleKudos = (postId, add) => {
    setPosts(p=>p.map(post=>post.id===postId?{...post,kudos:post.kudos+(add?1:-1)}:post));
    if(add){ setUserStats(s=>({...s,points:s.points+5})); showToast("+5 Strides for giving kudos! ⚡"); }
  };

  const handleComment = (postId, text) => {
    const mod = autoModerate(text);
    if (mod.action === "block") { showToast(`Comment blocked: ${mod.reason}`); return; }
    const newComment = { id:`c${Date.now()}`, userId:"me", user:ME, text,
      time:"Just now", likes:0, _flagged: mod.action==="flag" };
    setPosts(p=>p.map(post=>post.id===postId?{...post,comments:[...post.comments,newComment]}:post));
    setUserStats(s=>({...s,points:s.points+2}));
    if (mod.action==="flag") {
      setReports(r=>[...r,{target:{text},targetType:"comment",reason:"Auto-flagged: "+mod.reason,time:new Date().toISOString()}]);
      showToast("Comment posted — flagged for review");
    } else {
      showToast("+2 Strides for engaging!");
    }
  };

  const handleLikeComment = (postId, commentId, add) => {
    setPosts(p=>p.map(post=>post.id===postId?{...post,comments:post.comments.map(c=>c.id===commentId?{...c,likes:c.likes+(add?1:-1)}:c)}:post));
  };

  const handleSubmit = ({title, meals, coverPhotos, macros, tags}) => {
    const totalItems = meals.reduce((a,m)=>a+m.items.length,0);
    const pts = totalItems*10 + 50 + 25 + (userStats.streak>=6?100:userStats.streak>=2?30:0);
    setPosts(p=>[{id:Date.now(),userId:"me",user:ME,date:"Just now",title,meals,coverPhotos:coverPhotos||[],macros,kudos:0,comments:[],tags,postedAt:new Date().toISOString()},...p]);
    setUserStats(s=>({points:s.points+pts,daysLogged:s.daysLogged+1,streak:s.streak+1,mealsLogged:s.mealsLogged+totalItems,postsShared:s.postsShared+1}));
    setShowLogModal(false);
    showToast(`+${pts} Strides earned! 🔥`);
  };

  const handleViewProfile = (user) => { setProfileUser(user); setView("profile"); };

  const rank = getRank(userStats.points);
  const nextRank = RANKS.find(r=>r.min>userStats.points);
  const progress = nextRank?Math.min(100,((userStats.points-rank.min)/(nextRank.min-rank.min))*100):100;

  const feedFilter = filter==="following"
    ? posts.filter(p=>following.includes(p.userId)||p.userId==="me")
    : filter==="all" ? posts : posts.filter(p=>p.user.tier===filter);

  const userSport = signupForm.sport || ME.sport;

  // Apply ranking — sort by score descending
  const ranked = [...feedFilter].sort((a,b)=>
    scorePost(b, userSport, following) - scorePost(a, userSport, following)
  );

  const filtered = ranked.filter(p=>{
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.tags||[]).some(t=>t.toLowerCase().includes(q)) ||
      p.user.sport?.toLowerCase().includes(q) ||
      p.user.name?.toLowerCase().includes(q) ||
      p.user.handle?.toLowerCase().includes(q) ||
      p.meals?.some(m=>m.items?.some(i=>i.name?.toLowerCase().includes(q))) ||
      // Match goal-based search terms against post tags and title
      (q.includes("lean muscle") && (p.title.toLowerCase().includes("lean") || (p.tags||[]).some(t=>t.toLowerCase().includes("lean")))) ||
      (q.includes("fat loss") && (p.title.toLowerCase().includes("cut") || p.title.toLowerCase().includes("fat") || (p.tags||[]).some(t=>t.toLowerCase().includes("cut")))) ||
      (q.includes("bulking") && (p.title.toLowerCase().includes("bulk") || p.macros?.calories > 3000)) ||
      (q.includes("cutting") && (p.title.toLowerCase().includes("cut") || p.macros?.calories < 2000)) ||
      (q.includes("high protein") && p.macros?.protein > 150)
    );
  });

  if(view==="profile"&&profileUser) return (
    <ProfileView user={profileUser} posts={posts} isMe={profileUser.id==="me"} following={following}
      onFollow={handleFollow} onBack={()=>setView("feed")} onKudos={handleKudos}
      onComment={handleComment} onLikeComment={handleLikeComment}/>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"Inter,sans-serif",transition:"background 0.3s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:${C.bg};}::-webkit-scrollbar-thumb{background:${C.border2};border-radius:2px;}
        input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        select option{background:${C.surface};color:${C.text};}
        button:focus-visible{outline:2px solid ${C.lime};outline-offset:2px;}
      `}</style>

      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
      {showLogModal&&<LogDayModal onClose={()=>setShowLogModal(false)} onSubmit={handleSubmit}/>}
      {showPoints&&<PointsDashboard stats={userStats} onClose={()=>setShowPoints(false)}/>}
      {showPeople&&<PeopleSearch users={users} following={following} onFollow={handleFollow} onViewProfile={handleViewProfile} onClose={()=>setShowPeople(false)}/>}
      {showNotifs&&<NotificationsPanel notifs={activeNotifs} onClose={()=>{ setShowNotifs(false); setNotifs(n=>(n||[]).map(x=>({...x,unread:false}))); }} onViewProfile={handleViewProfile} users={users}/>}
      {reportTarget&&<ReportModal target={reportTarget} targetType="post" onClose={()=>setReportTarget(null)} onSubmit={handleReport}/>}
      {showModQueue&&<ModerationQueue reports={reports} onClose={()=>setShowModQueue(false)} onDismiss={dismissReport} onRemove={removeReportedContent}/>}
      {showPrivacy&&<PrivacyPolicyModal onClose={()=>setShowPrivacy(false)}/>}
      {shareTarget&&<ShareCard post={shareTarget} onClose={()=>setShareTarget(null)}/>}
      {showLeaderboard&&<LeaderboardPanel onClose={()=>setShowLeaderboard(false)} userSport={userSport}/>}
      {showBrandDash&&<BrandDashboard onClose={()=>setShowBrandDash(false)}/>}

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:C.navBg,backdropFilter:"blur(12px)",borderBottom:`1px solid ${C.border}`,padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54,gap:12,transition:"background 0.3s"}}>

        {/* LEFT — logo + wordmark */}
        <div style={{display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="7" fill="#0A0A0A"/>
            <rect x="8" y="7" width="4.5" height="18" rx="2.25" fill="#FAFAF8"/>
            <rect x="12.5" y="7" width="13" height="4.5" rx="2.25" fill="#FAFAF8"/>
            <rect x="12.5" y="15" width="8.5" height="4.5" rx="2.25" fill="#FAFAF8"/>
          </svg>
          <span style={{fontWeight:700,fontSize:16,fontFamily:"Space Grotesk,sans-serif",letterSpacing:"-0.03em",lineHeight:1}}>
            <span style={{color:C.text}}>Fork</span><span style={{color:C.lime}}>Step</span>
          </span>
        </div>

        {/* CENTER — search */}
        <div style={{flex:1,maxWidth:260,position:"relative"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:13,pointerEvents:"none"}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search posts…"
            style={{width:"100%",padding:"7px 10px 7px 30px",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:20,color:C.text,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"Inter,sans-serif"}}/>
        </div>

        {/* RIGHT — actions */}
        <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
          <button onClick={()=>setShowLeaderboard(true)} title="Weekly leaderboard"
            style={{width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:8,fontSize:15,cursor:"pointer",color:C.muted}}>🏆</button>

          <button onClick={()=>setShowPeople(true)} title="Find athletes"
            style={{width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:8,fontSize:15,cursor:"pointer",color:C.muted}}>👥</button>

          <button onClick={()=>setShowNotifs(true)}
            style={{position:"relative",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:8,fontSize:15,cursor:"pointer",color:C.muted}}>
            🔔
            {unreadCount>0&&<span style={{position:"absolute",top:-3,right:-3,background:C.lime,color:C.deep,fontSize:8,fontWeight:900,width:15,height:15,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>{unreadCount}</span>}
          </button>

          {/* Moderation queue — shown when reports exist */}
          {reports.length>0&&(
            <button onClick={()=>setShowModQueue(true)} title="Moderation queue"
              style={{position:"relative",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",background:`${C.orange}18`,border:`1px solid ${C.orange}`,borderRadius:8,fontSize:15,cursor:"pointer"}}>
              ⚑
              <span style={{position:"absolute",top:-3,right:-3,background:C.orange,color:"#fff",fontSize:8,fontWeight:900,width:15,height:15,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>{reports.length}</span>
            </button>
          )}

          <button onClick={()=>setDarkMode(d=>!d)} title={darkMode?"Light mode":"Dark mode"}
            style={{width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",
              background:darkMode?C.lime:C.surface,border:`1px solid ${darkMode?C.lime:C.border2}`,
              borderRadius:8,fontSize:15,cursor:"pointer",transition:"all 0.2s"}}>
            {darkMode?"☀️":"🌙"}
          </button>

          <button onClick={()=>setShowPoints(true)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",background:C.surface,border:`1px solid ${C.lime}30`,borderRadius:16,cursor:"pointer",fontFamily:"Space Grotesk,sans-serif",height:34}}>
            <span style={{fontSize:12}}>{rank.icon}</span>
            <span style={{color:C.lime,fontSize:11,fontWeight:800}}>{userStats.points.toLocaleString()}</span>
          </button>

          <button onClick={()=>handleViewProfile(ME)} style={{border:`2px solid ${C.border2}`,borderRadius:"50%",padding:0,cursor:"pointer",background:"none",flexShrink:0}}>
            <Avatar user={ME} size={30}/>
          </button>

          <button onClick={()=>setShowLogModal(true)} style={{background:C.lime,color:C.deep,border:"none",borderRadius:8,padding:"7px 14px",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"Space Grotesk,sans-serif",whiteSpace:"nowrap",height:34,display:"flex",alignItems:"center"}}>+ Log</button>
        </div>
      </nav>

      {/* COMPACT AUTHENTICATED HEADER */}
      <div style={{maxWidth:660,margin:"0 auto",padding:"14px 18px 10px",
        display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          <div style={{color:C.text,fontSize:16,fontWeight:800,fontFamily:"Space Grotesk,sans-serif",letterSpacing:"-0.01em"}}>
            {new Date().getHours()<12?"Morning":"Good"} {signupForm.firstName||ME.name.split(" ")[0]} 👋
          </div>
          {userStats.streak>0?(
            <div style={{display:"inline-flex",alignItems:"center",gap:5}}>
              <span style={{fontSize:13}}>🔥</span>
              <span style={{color:C.streakText,fontWeight:700,fontSize:12,fontFamily:"Space Grotesk,sans-serif"}}>
                {userStats.streak}-day streak
              </span>
              <span style={{color:C.muted,fontSize:11}}>· keep going</span>
            </div>
          ):(
            <div style={{color:C.muted,fontSize:12}}>
              See what {userSport} athletes eat today
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:16,flexShrink:0}}>
          {[{v:"12.4K",l:"Athletes"},{v:"89K",l:"Logs"},{v:"$2.1M",l:"Ordered"}].map(s=>(
            <div key={s.l} style={{textAlign:"center"}}>
              <div style={{color:C.lime,fontWeight:800,fontSize:14,fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>{s.v}</div>
              <div style={{color:C.muted,fontSize:10,marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* UNIFIED FILTER BAR */}
      <div style={{maxWidth:660,margin:"0 auto",padding:"0 18px 14px"}}>
        {/* Row 1: audience + sport filter icon + post count */}
        <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:8,flexWrap:"wrap"}}>
          {[["all","All"],["following","Following"]].map(([val,label])=>(
            <button key={val} onClick={()=>setFilter(val)}
              style={{padding:"5px 13px",borderRadius:20,border:`1px solid ${filter===val?C.lime:C.border2}`,
                background:filter===val?`${C.lime}18`:"transparent",
                color:filter===val?C.lime:C.muted,
                fontSize:12,fontWeight:700,cursor:"pointer",
                fontFamily:"Space Grotesk,sans-serif",transition:"0.15s"}}>
              {label}
            </button>
          ))}
          <div style={{width:"1px",height:16,background:C.border,margin:"0 2px"}}/>
          {[["PRO","PRO"],["ELITE","ELITE"],["CREATOR","Creator"]].map(([val,label])=>(
            <button key={val} onClick={()=>setFilter(filter===val?"all":val)}
              style={{padding:"5px 13px",borderRadius:20,border:`1px solid ${filter===val?C.lime:C.border2}`,
                background:filter===val?`${C.lime}18`:"transparent",
                color:filter===val?C.lime:C.muted,
                fontSize:12,fontWeight:700,cursor:"pointer",
                fontFamily:"Space Grotesk,sans-serif",transition:"0.15s"}}>
              {label}
            </button>
          ))}
          <span style={{marginLeft:"auto",color:C.muted,fontSize:12,flexShrink:0}}>
            {filtered.length} post{filtered.length!==1?"s":""}
          </span>
        </div>

        {/* Row 2: sport + goal quick-pick pills (horizontally scrollable) */}
        <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:4,
          scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>
          <style>{`.sport-scroll::-webkit-scrollbar{display:none;}`}</style>
          <div className="sport-scroll" style={{display:"flex",gap:5,flexShrink:0}}>
            {search && ![
              "Lean Muscle","Fat Loss","Bulking","Cutting","Recomposition","Maintenance","Weight Loss","High Protein",
              "Bodybuilding","Marathon","CrossFit","Cycling","Powerlifting","Triathlon",
              "Swimming","Pilates","Weightlifting","HIIT","Yoga","Rowing","Boxing",
              "Football","Basketball","Tennis","Running","Olympic Lifting"
            ].map(s=>s.toLowerCase()).includes(search.toLowerCase()) && (
              <button onClick={()=>setSearch("")}
                style={{padding:"4px 11px",borderRadius:20,border:`1px solid ${C.orange}`,
                  background:`${C.orange}18`,color:C.orange,fontSize:11,fontWeight:700,
                  cursor:"pointer",fontFamily:"Inter,sans-serif",whiteSpace:"nowrap",flexShrink:0}}>
                ✕ "{search}"
              </button>
            )}

            {/* Goal-based categories — visually separated with a subtle divider */}
            {[
              { label:"🎯 Lean Muscle",    q:"Lean Muscle" },
              { label:"🔥 Fat Loss",       q:"Fat Loss" },
              { label:"💪 Bulking",        q:"Bulking" },
              { label:"✂️ Cutting",        q:"Cutting" },
              { label:"🔄 Recomposition",  q:"Recomposition" },
              { label:"⚖️ Maintenance",    q:"Maintenance" },
              { label:"📉 Weight Loss",    q:"Weight Loss" },
              { label:"🥩 High Protein",   q:"High Protein" },
            ].map(({label,q})=>{
              const active = search.toLowerCase()===q.toLowerCase();
              return (
                <button key={q} onClick={()=>setSearch(active?"":q)}
                  style={{padding:"4px 11px",borderRadius:20,
                    border:`1px solid ${active?C.orange:C.border}`,
                    background:active?`${C.orange}20`:"transparent",
                    color:active?C.orange:C.muted,
                    fontSize:11,fontWeight:active?700:400,cursor:"pointer",
                    fontFamily:"Inter,sans-serif",transition:"all 0.15s",
                    whiteSpace:"nowrap",flexShrink:0}}>
                  {label}
                </button>
              );
            })}

            {/* Divider pill */}
            <div style={{width:1,height:22,background:C.border,flexShrink:0,
              alignSelf:"center",margin:"0 4px"}}/>

            {/* Sport categories */}
            {["Bodybuilding","Marathon","CrossFit","Cycling","Powerlifting","Triathlon",
              "Swimming","Pilates","Weightlifting","HIIT","Yoga","Rowing","Boxing",
              "Football","Basketball","Tennis","Running","Olympic Lifting"].map(sport=>{
              const active = search.toLowerCase()===sport.toLowerCase();
              return (
                <button key={sport} onClick={()=>setSearch(active?"":sport)}
                  style={{padding:"4px 11px",borderRadius:20,
                    border:`1px solid ${active?C.lime:C.border}`,
                    background:active?C.lime:"transparent",
                    color:active?C.deep:C.muted,
                    fontSize:11,fontWeight:active?700:400,cursor:"pointer",
                    fontFamily:"Inter,sans-serif",transition:"all 0.15s",
                    whiteSpace:"nowrap",flexShrink:0}}>
                  {sport}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FEED */}
      <div style={{maxWidth:660,margin:"0 auto",padding:"0 18px 80px"}}>

        {showFirstMeal&&(
          <FirstMealPrompt userGoal={signupForm.goal} userSport={signupForm.sport}
            onLog={()=>{ setShowFirstMeal(false); setShowLogModal(true); }}
            onDismiss={()=>setShowFirstMeal(false)}/>
        )}

        {!showFirstMeal && LEADERBOARD[userSport]?.[0] && (
          <button onClick={()=>setShowLeaderboard(true)}
            style={{width:"100%",marginBottom:14,padding:"12px 16px",background:C.card,
              border:`1px solid ${C.border}`,borderRadius:14,cursor:"pointer",
              fontFamily:"Inter,sans-serif",textAlign:"left",display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:22}}>🏆</div>
            <div style={{flex:1}}>
              <div style={{color:C.text,fontWeight:700,fontSize:13,fontFamily:"Space Grotesk,sans-serif"}}>
                This week in {userSport}
              </div>
              <div style={{color:C.muted,fontSize:11,marginTop:2}}>
                {LEADERBOARD[userSport][0].user.name} is leading with {LEADERBOARD[userSport][0].logs} logs
              </div>
            </div>
            <div style={{color:C.lime,fontSize:12,fontWeight:700,fontFamily:"Space Grotesk,sans-serif",flexShrink:0}}>
              View board →
            </div>
          </button>
        )}

        {filtered.length===0
          ? <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}><div style={{fontSize:32,marginBottom:10}}>🔍</div><div>{filter==="following"?"Follow some athletes to see their posts here.":"No posts match your search."}</div></div>
          : filtered.map(post=>(
              <div key={post.id} style={{animation:"fadeUp 0.3s ease"}}>
                <PostCard post={post} onKudos={handleKudos} onComment={handleComment}
                  onLikeComment={handleLikeComment} onViewProfile={handleViewProfile}
                  onReport={setReportTarget} onShare={setShareTarget}/>
              </div>
            ))
        }
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.card,borderTop:`1px solid ${C.border}`,padding:"8px 18px",display:"flex",alignItems:"center",justifyContent:"center",gap:10,fontSize:12}}>
        <span style={{color:C.muted}}>🛒 Tap any food item to shop it directly</span>
        <span style={{color:C.border2}}>|</span>
        <span style={{color:C.lime,fontSize:11,fontWeight:700}}>Athletes earn affiliate commissions on ForkStep</span>
        <span style={{color:C.border2}}>|</span>
        <button onClick={()=>setShowBrandDash(true)}
          style={{background:"none",border:"none",color:C.muted,fontSize:11,cursor:"pointer",fontFamily:"Inter,sans-serif",textDecoration:"underline",padding:0}}>
          Brand Dashboard
        </button>
        <span style={{color:C.border2}}>|</span>
        <button onClick={()=>setShowPrivacy(true)}
          style={{background:"none",border:"none",color:C.muted,fontSize:11,cursor:"pointer",fontFamily:"Inter,sans-serif",textDecoration:"underline",padding:0}}>
          Privacy Policy
        </button>
      </div>
    </div>
  );
}
