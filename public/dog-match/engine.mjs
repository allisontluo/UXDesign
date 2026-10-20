// Values are simplified project estimates for adult dogs, not veterinary advice.
export const breeds = [
 {id:'havanese',name:'Havanese',size:'small',exercise:45,training:1,grooming:3,shedding:1,space:1,experience:1,description:'A small, sociable companion with a cheerful outlook.',watch:'A long coat needs consistent grooming; plan for company and coat care.',url:'https://www.akc.org/dog-breeds/havanese/'},
 {id:'whippet',name:'Whippet',size:'medium',exercise:60,training:1,grooming:1,shedding:2,space:1,experience:1,description:'A graceful sprinter with a soft spot for home comforts.',watch:'Secure exercise areas matter. Discuss prey drive around smaller pets.',url:'https://www.akc.org/dog-breeds/whippet/'},
 {id:'labrador',name:'Labrador Retriever',size:'large',exercise:90,training:2,grooming:2,shedding:3,space:2,experience:1,description:'An energetic, outgoing companion for an active routine.',watch:'Make room for daily exercise, training, and a shedding coat.',url:'https://www.akc.org/dog-breeds/Labrador-retriever/'},
 {id:'poodle',name:'Standard Poodle',size:'large',exercise:90,training:2,grooming:3,shedding:1,space:2,experience:1,description:'A bright, active partner with a lower-shedding curly coat.',watch:'Budget time and resources for brushing and professional coat care.',url:'https://www.akc.org/dog-breeds/poodle-standard/'},
 {id:'collie',name:'Border Collie',size:'medium',exercise:120,training:3,grooming:2,shedding:3,space:2,experience:2,description:'A focused working partner who thrives with a job to do.',watch:'Needs substantial mental enrichment as well as physical activity.',url:'https://www.akc.org/dog-breeds/border-collie/'},
 {id:'greyhound',name:'Greyhound',size:'large',exercise:60,training:1,grooming:1,shedding:2,space:1,experience:1,description:'A gentle, independent hound with a sprinter’s spirit.',watch:'Ask about safe off-leash areas and compatibility with small animals.',url:'https://www.akc.org/dog-breeds/greyhound/'}
];
export const defaults = {home:'apartment',size:'any',experience:'new',exercise:60,alone:4,support:'none',training:2,grooming:1,shedding:'any',priority:'balanced',fluff:'any'};
const choices={fluff:['any','fluffy','sleek'],home:['apartment','house'],size:['any','small','medium','large'],experience:['new','experienced'],support:['none','yes'],shedding:['any','low'],priority:['balanced','activity','coat','size']};
export function normalizeProfile(raw={}) {
 if(!raw || typeof raw!=="object") raw={};
 const p={...defaults};
 for(const [key,values] of Object.entries(choices)) if(values.includes(raw[key])) p[key]=raw[key];
 for(const [key,min,max,step] of [['exercise',15,150,15],['alone',0,10,1],['training',1,3,1],['grooming',1,3,1]]) {
  const n=Number(raw[key]); if(raw[key]!==undefined&&Number.isFinite(n)&&n>=min&&n<=max&&n%step===0) p[key]=n;
 }
 return p;
}
export function needsCarePlan(p){return p.alone>5&&p.support!=='yes';}
export function scoreBreed(b,raw) {
 const p=normalizeProfile(raw);
 const fit={activity:Math.min(100,p.exercise/b.exercise*100),training:Math.min(100,p.training/b.training*100),space:p.home==='house'||b.space===1?100:65,size:p.size==='any'||p.size===b.size?100:30,grooming:Math.min(100,p.grooming/b.grooming*100),shedding:p.shedding==='any'?100:(4-b.shedding)/3*100,experience:p.experience==='experienced'||b.experience===1?100:45};
 const weights={activity:25,training:15,space:10,size:15,grooming:15,shedding:10,experience:10};
 if(p.priority==='activity'){weights.activity*=2;weights.training*=2;}
 if(p.priority==='coat'){weights.grooming*=2;weights.shedding*=2;}
 if(p.priority==='size')weights.size*=2;
 const weighted=Object.entries(weights).reduce((sum,[k,w])=>sum+w*fit[k],0)/Object.values(weights).reduce((a,b)=>a+b,0);
 return {breed:b,score:Math.min(needsCarePlan(p)?55:100,Math.round(weighted)),fit,uncappedScore:weighted};
}
export function rankBreeds(p){return breeds.map(b=>scoreBreed(b,p)).sort((a,b)=>b.score-a.score||b.uncappedScore-a.uncappedScore||a.breed.name.localeCompare(b.breed.name));}
export function restoreState(raw) {
 if(!raw||typeof raw!=='object'||raw.version!==1)throw new Error('Unrecognized saved data');
 const ids=new Set(breeds.map(b=>b.id));
 const list=value=>Array.isArray(value)?[...new Set(value.filter(id=>ids.has(id)))]:[];
 return {version:1,profile:normalizeProfile(raw.profile),step:Number.isInteger(raw.step)&&raw.step>=0&&raw.step<=2?raw.step:0,completed:raw.completed===true,favorites:list(raw.favorites),compare:list(raw.compare).slice(0,3),history:normalizeHistory(raw.history)};
}

// Coat appearance is separate from grooming and shedding. A fluffy dog may shed little.
export const fluffLevels = {havanese:3,whippet:0,labrador:0,poodle:3,collie:2,greyhound:0};
export function normalizeHistory(raw) {
 if(!Array.isArray(raw))return [];
 const seen=new Set();
 return raw.filter(item=>item&&breeds.some(b=>b.id===item.id)&&['like','pass'].includes(item.choice)&&!seen.has(item.id)&&seen.add(item.id))
  .map(item=>({id:item.id,choice:item.choice,wasSaved:item.wasSaved===true}));
}
function similarity(a,b) {
 const sizes={small:0,medium:1,large:2};
 return ((1-Math.abs(fluffLevels[a.id]-fluffLevels[b.id])/3)*0.5+
  (1-Math.abs(sizes[a.size]-sizes[b.size])/2)*0.25+
  (1-Math.abs(a.exercise-b.exercise)/105)*0.25)*100;
}
export function discoveryQueue(profile,history=[]) {
 const p=normalizeProfile(profile), decisions=normalizeHistory(history);
 const seen=new Set(decisions.map(d=>d.id));
 return rankBreeds(p).filter(row=>!seen.has(row.breed.id)).map(row=>{
  const coat=p.fluff==='any'?50:p.fluff==='fluffy'?fluffLevels[row.breed.id]/3*100:(3-fluffLevels[row.breed.id])/3*100;
  // Likes favor similar traits; passes favor different ones. Each vote has equal weight.
  const learned=decisions.length?decisions.reduce((sum,d)=>{
   const prior=breeds.find(b=>b.id===d.id), match=similarity(row.breed,prior);
   return sum+(d.choice==='like'?match:100-match);
  },0)/decisions.length:50;
  const confidence=Math.min(decisions.length/3,1);
  const discoveryScore=row.uncappedScore*0.65+coat*0.2+(learned*confidence+50*(1-confidence))*0.15;
  return {...row,discoveryScore};
 }).sort((a,b)=>b.discoveryScore-a.discoveryScore||a.breed.name.localeCompare(b.breed.name));
}
