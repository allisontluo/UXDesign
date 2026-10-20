import {breeds,defaults,normalizeProfile,needsCarePlan,rankBreeds,restoreState,discoveryQueue,fluffLevels} from './engine.mjs?v=7';
const $=id=>document.getElementById(id);
const key='uxdesign-pawfect-match-v1';
let state={version:1,profile:{...defaults},step:0,completed:false,favorites:[],compare:[],history:[]};
let storageOK=true,toastTimer;
try{const saved=localStorage.getItem(key);if(saved)state=restoreState(JSON.parse(saved));}catch{storageOK=false;$('save-status').textContent='Saved data unavailable · session only';}
const form=$('match-form');
for(const [name,value] of Object.entries(state.profile))form.elements.namedItem(name).value=value;
function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,3500);}
function persist(){try{localStorage.setItem(key,JSON.stringify(state));storageOK=true;$('save-status').textContent='Saved on this device';}catch{if(storageOK)toast('Browser storage is unavailable. Your quiz still works for this visit.');storageOK=false;$('save-status').textContent='Session only · storage unavailable';}}
function showStep(focus=false){document.querySelectorAll('[data-step]').forEach(el=>el.hidden=Number(el.dataset.step)!==state.step);document.querySelectorAll('.steps li').forEach((el,i)=>{el.classList.toggle('active',i===state.step);if(i===state.step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});$('back').hidden=state.step===0;$('next').hidden=state.step===2;$('finish').hidden=state.step!==2;$('step-label').textContent=`Step ${state.step+1} of 3`;if(focus)document.querySelector(`[data-step="${state.step}"] select, [data-step="${state.step}"] input`).focus();}
function updateProfile(){state.profile=normalizeProfile(Object.fromEntries(new FormData(form)));persist();render();}
function render(){$('browse-label').textContent=`Browse all ${breeds.length} dog types`;const p=state.profile;const ranked=rankBreeds(p);$('exercise-value').textContent=`${p.exercise} minutes`;$('alone-value').textContent=`${p.alone} hours`;$('care-branch').hidden=p.alone<=5;
 $('live-preview').innerHTML=ranked.slice(0,3).map(({breed:b,score})=>`<div class="live-row"><div class="live-label"><span>${b.name}</span><strong>${score}% fit</strong></div><div class="track" aria-hidden="true"><div class="bar" style="width:${score}%"></div></div></div>`).join('');
 $('matches').hidden=!state.completed;
 $('discover').hidden=!state.completed;
 $('discover-nav').hidden=!state.completed;
 $('discover-locked').hidden=state.completed;
 $('results-placeholder').hidden=state.completed;$('results-content').hidden=!state.completed;
 $('results-subtitle').textContent=state.completed?'Made for your routine. Updated with every answer.':'Finish the quiz to reveal your personalized matches.';
 $('care-message').hidden=!needsCarePlan(p);$('care-message').textContent='Care plan needed: you’re away more than 5 hours without support. Scores are capped at 55 until you add a plan. Discuss the individual dog’s needs with a shelter or care professional.';
 const visible=$('only-saved').checked?ranked.filter(x=>state.favorites.includes(x.breed.id)):ranked;
 $('breed-cards').innerHTML=visible.length?visible.map(({breed:b,score,fit})=>`<article class="breed-card"><img class="breed-photo" src="photos/${b.id}.jpg?v=7" alt="${b.name} breed example" loading="lazy" width="600" height="400"><button class="favorite" data-save="${b.id}" aria-label="Save ${b.name}" aria-pressed="${state.favorites.includes(b.id)}">${state.favorites.includes(b.id)?'♥':'♡'}</button><span class="score">${score}% lifestyle fit</span><h3>${b.name}</h3><p class="tags">${b.size} · ${b.exercise} min activity target</p><p>${b.description}</p><ul><li>${fit.activity===100?'Your activity time meets this profile’s target.':'This profile needs more activity than you planned.'}</li><li>${fit.grooming===100?'Coat care fits your commitment.':'Coat care exceeds your grooming preference.'}</li>${fit.training<100?'<li>Needs more enrichment time than you selected.</li>':''}${fit.size<100?'<li>Outside your preferred size.</li>':''}</ul><p><strong>Think about:</strong> ${b.watch}</p><a href="${b.url}">Read the breed or mix profile ↗</a><label class="check-label"><input type="checkbox" data-compare="${b.id}" ${state.compare.includes(b.id)?'checked':''}> Compare ${b.name}</label></article>`).join(''):'<div class="empty"><h3>Your shortlist is empty.</h3><p>Uncheck “Show saved dogs only” and tap a heart to save a dog.</p></div>';
 renderChart(ranked);
 renderDiscovery();
}
function renderChart(ranked=rankBreeds(state.profile)){
 $('comparison').hidden=!state.completed||state.compare.length===0;
 const metric=$('metric').value;const max={score:100,exercise:150,grooming:3,training:3}[metric];
 $('chart').innerHTML=state.compare.map(id=>ranked.find(x=>x.breed.id===id)).filter(Boolean).map(({breed:b,score})=>{const value=metric==='score'?score:b[metric];const suffix=metric==='score'?'%':metric==='exercise'?' min':' / 3';return `<div class="chart-row"><div class="chart-dog"><div class="chart-photo photo-${b.id}"><img src="photos/${b.id}.jpg?v=7" alt="${b.name} breed example" width="360" height="280"></div><strong>${b.name}</strong></div><div class="track" aria-hidden="true"><div class="bar" style="width:${value/max*100}%"></div></div><span>${value}${suffix}</span></div>`;}).join('');
}
form.addEventListener('input',updateProfile);
$('next').addEventListener('click',()=>{state.step=Math.min(2,state.step+1);persist();showStep(true);});
$('back').addEventListener('click',()=>{state.step=Math.max(0,state.step-1);persist();showStep(true);});
// Enter on an earlier step advances instead of bypassing the quiz.
form.addEventListener('submit',event=>{event.preventDefault();if(state.step<2){state.step++;persist();showStep(true);return;}state.completed=true;persist();render();$('discover').scrollIntoView({behavior:'smooth'});$('discovery-title').tabIndex=-1;$('discovery-title').focus({preventScroll:true});toast('Your matches are ready. Swipe right to like or left to pass.');});
$('breed-cards').addEventListener('click',event=>{const button=event.target.closest('[data-save]');if(!button)return;const id=button.dataset.save;const saved=state.favorites.includes(id);state.favorites=saved?state.favorites.filter(x=>x!==id):[...state.favorites,id];persist();render();const replacement=document.querySelector(`[data-save="${id}"]`);if(replacement)replacement.focus();else $('only-saved').focus();toast(saved?'Removed from your shortlist.':'Saved to your shortlist.');});
$('breed-cards').addEventListener('change',event=>{const input=event.target;if(!input.matches('[data-compare]'))return;const id=input.dataset.compare;if(input.checked&&state.compare.length>=3){input.checked=false;toast('Choose up to 3 dogs. Uncheck one before adding another.');return;}state.compare=input.checked?[...state.compare,id]:state.compare.filter(x=>x!==id);persist();renderChart();});
$('metric').addEventListener('change',()=>renderChart());$('only-saved').addEventListener('change',()=>render());
$('edit').addEventListener('click',()=>{state.step=0;persist();showStep();$('quiz').scrollIntoView({behavior:'smooth'});form.elements.home.focus({preventScroll:true});});
$('reset').addEventListener('click',()=>{try{localStorage.removeItem(key);}catch{}state={version:1,profile:{...defaults},step:0,completed:false,favorites:[],compare:[],history:[]};for(const [name,value] of Object.entries(state.profile))form.elements.namedItem(name).value=value;$('only-saved').checked=false;$('metric').value='score';showStep();render();$('save-status').textContent='Saved data cleared';toast('Your answers and shortlist have been cleared.');});

// Pointer gestures, keyboard arrows, and buttons all use the same decision handler.
function renderDiscovery() {
 const queue=discoveryQueue(state.profile,state.history),current=queue[0];
 $('discover-fluff').value=state.profile.fluff;
 const likes=state.history.filter(d=>d.choice==='like').length;
 $('learning-status').textContent=state.history.length?`${state.history.length} of ${breeds.length} explored · ${likes} liked. Next picks blend your coat, size, and activity choices.`:'Your first pick starts with lifestyle fit and coat preference. Every like or pass helps shape the next one.';
 $('undo-swipe').disabled=state.history.length===0;
 $('restart-swipes').disabled=state.history.length===0;
 $('like-dog').disabled=!current;$('pass-dog').disabled=!current;
 $('swipe-card').classList.toggle('deck-empty',!current);
 $('swipe-card').style.transform='';
 if(!current){$('swipe-card').innerHTML=`<div class="deck-finished"><span>✿</span><h3>You’ve met the whole pack.</h3><p>${likes} liked out of ${breeds.length}. Your favorites are saved. Restart to try a new direction or change your lifestyle answers below.</p><a href="#matches">View your matches ↓</a></div>`;return;}
 const {breed:b,score}=current;
 const coat=b.coatLabel||(fluffLevels[b.id]>=2?'Fluffy coat':'Sleek coat');
 $('swipe-card').innerHTML=`<img src="photos/${b.id}.jpg?v=7" alt="${b.name} breed example" draggable="false" width="900" height="650"><div class="swipe-overlay"><span class="swipe-count">${state.history.length+1} / ${breeds.length}</span><span class="swipe-fit">${score}% lifestyle fit</span><h3>${b.name}</h3><p>${coat} · ${b.size} · ${b.exercise} min activity target</p></div><div class="swipe-feedback" aria-hidden="true"></div>`;
}
function decide(choice) {
 const current=discoveryQueue(state.profile,state.history)[0];if(!current)return;
 const id=current.breed.id,wasSaved=state.favorites.includes(id);
 state.history.push({id,choice,wasSaved});
 state.favorites=choice==='like'?[...new Set([...state.favorites,id])]:state.favorites.filter(x=>x!==id);
 persist();render();toast(`${choice==='like'?'Liked':'Passed'} ${current.breed.name}. ${state.history.length===breeds.length?'You’ve met the whole pack.':'Your next pick is updated.'}`);
}
$('like-dog').addEventListener('click',()=>decide('like'));
$('pass-dog').addEventListener('click',()=>decide('pass'));
$('discover-fluff').addEventListener('change',()=>{form.elements.fluff.value=$('discover-fluff').value;updateProfile();});
$('undo-swipe').addEventListener('click',()=>{const last=state.history.pop();if(!last)return;state.favorites=last.wasSaved?[...new Set([...state.favorites,last.id])]:state.favorites.filter(id=>id!==last.id);persist();render();toast('Last choice undone.');});
$('restart-swipes').addEventListener('click',()=>{state.history=[];persist();render();toast('New round started. Saved favorites kept.');});
$('swipe-card').addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();decide(event.key==='ArrowRight'?'like':'pass');}});
let gesture=null;
$('swipe-card').addEventListener('pointerdown',event=>{if(event.button!==0||!event.target.closest('img'))return;gesture={x:event.clientX,y:event.clientY,id:event.pointerId};$('swipe-card').setPointerCapture(event.pointerId);});
$('swipe-card').addEventListener('pointermove',event=>{if(!gesture||event.pointerId!==gesture.id)return;const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>20){cancelGesture();return;}const card=$('swipe-card');card.style.transform=`translateX(${Math.max(-120,Math.min(120,dx))}px) rotate(${dx/25}deg)`;const feedback=card.querySelector('.swipe-feedback');if(feedback){feedback.textContent=Math.abs(dx)>35?(dx>0?'LIKE ♡':'PASS ✕'):'';feedback.classList.toggle('passing',dx<0);}});
function cancelGesture(){gesture=null;$('swipe-card').style.transform='';const feedback=$('swipe-card').querySelector('.swipe-feedback');if(feedback)feedback.textContent='';}
$('swipe-card').addEventListener('pointerup',event=>{if(!gesture)return;const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;cancelGesture();if(Math.abs(dx)>=70&&Math.abs(dx)>Math.abs(dy)*1.2)decide(dx>0?'like':'pass');});
$('swipe-card').addEventListener('pointercancel',cancelGesture);

showStep();render();
if(location.hash==='#discover'&&!state.completed){history.replaceState(null,'','#quiz');$('quiz').scrollIntoView();}
