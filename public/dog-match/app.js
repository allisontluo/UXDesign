import {breeds,defaults,normalizeProfile,needsCarePlan,rankBreeds,restoreState} from './engine.mjs';
const $=id=>document.getElementById(id);
const key='uxdesign-pawfect-match-v1';
let state={version:1,profile:{...defaults},step:0,completed:false,favorites:[],compare:[]};
let storageOK=true,toastTimer;
try{const saved=localStorage.getItem(key);if(saved)state=restoreState(JSON.parse(saved));}catch{storageOK=false;$('save-status').textContent='Saved data unavailable · session only';}
const form=$('match-form');
for(const [name,value] of Object.entries(state.profile))form.elements.namedItem(name).value=value;
function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,3500);}
function persist(){try{localStorage.setItem(key,JSON.stringify(state));storageOK=true;$('save-status').textContent='Saved on this device';}catch{if(storageOK)toast('Browser storage is unavailable. Your quiz still works for this visit.');storageOK=false;$('save-status').textContent='Session only · storage unavailable';}}
function showStep(focus=false){document.querySelectorAll('[data-step]').forEach(el=>el.hidden=Number(el.dataset.step)!==state.step);document.querySelectorAll('.steps li').forEach((el,i)=>{el.classList.toggle('active',i===state.step);if(i===state.step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});$('back').hidden=state.step===0;$('next').hidden=state.step===2;$('finish').hidden=state.step!==2;$('step-label').textContent=`Step ${state.step+1} of 3`;if(focus)document.querySelector(`[data-step="${state.step}"] select, [data-step="${state.step}"] input`).focus();}
function updateProfile(){state.profile=normalizeProfile(Object.fromEntries(new FormData(form)));persist();render();}
function render(){const p=state.profile;const ranked=rankBreeds(p);$('exercise-value').textContent=`${p.exercise} minutes`;$('alone-value').textContent=`${p.alone} hours`;$('care-branch').hidden=p.alone<=5;
 $('live-preview').innerHTML=ranked.slice(0,3).map(({breed:b,score})=>`<div class="live-row"><div class="live-label"><span>${b.name}</span><strong>${score}% fit</strong></div><div class="track" aria-hidden="true"><div class="bar" style="width:${score}%"></div></div></div>`).join('');
 $('results-placeholder').hidden=state.completed;$('results-content').hidden=!state.completed;
 $('results-subtitle').textContent=state.completed?'Made for your routine. Updated with every answer.':'Finish the quiz to reveal your personalized matches.';
 $('care-message').hidden=!needsCarePlan(p);$('care-message').textContent='Care plan needed: you’re away more than 5 hours without support. Scores are capped at 55 until you add a plan. Discuss the individual dog’s needs with a shelter or care professional.';
 const visible=$('only-saved').checked?ranked.filter(x=>state.favorites.includes(x.breed.id)):ranked;
 $('breed-cards').innerHTML=visible.length?visible.map(({breed:b,score,fit})=>`<article class="breed-card"><button class="favorite" data-save="${b.id}" aria-label="Save ${b.name}" aria-pressed="${state.favorites.includes(b.id)}">${state.favorites.includes(b.id)?'♥':'♡'}</button><span class="score">${score}% lifestyle fit</span><h3>${b.name}</h3><p class="tags">${b.size} · ${b.exercise} min activity target</p><p>${b.description}</p><ul><li>${fit.activity===100?'Your activity time meets this profile’s target.':'This profile needs more activity than you planned.'}</li><li>${fit.grooming===100?'Coat care fits your commitment.':'Coat care exceeds your grooming preference.'}</li>${fit.training<100?'<li>Needs more enrichment time than you selected.</li>':''}${fit.size<100?'<li>Outside your preferred size.</li>':''}</ul><p><strong>Think about:</strong> ${b.watch}</p><a href="${b.url}">Read the AKC breed profile ↗</a><label class="check-label"><input type="checkbox" data-compare="${b.id}" ${state.compare.includes(b.id)?'checked':''}> Compare ${b.name}</label></article>`).join(''):'<div class="empty"><h3>Your shortlist is empty.</h3><p>Uncheck “Show saved dogs only” and tap a heart to save a dog.</p></div>';
 renderChart(ranked);
}
function renderChart(ranked=rankBreeds(state.profile)){
 $('comparison').hidden=!state.completed||state.compare.length===0;
 const metric=$('metric').value;const max={score:100,exercise:150,grooming:3,training:3}[metric];
 $('chart').innerHTML=state.compare.map(id=>ranked.find(x=>x.breed.id===id)).filter(Boolean).map(({breed:b,score})=>{const value=metric==='score'?score:b[metric];const suffix=metric==='score'?'%':metric==='exercise'?' min':' / 3';return `<div class="chart-row"><strong>${b.name}</strong><div class="track" aria-hidden="true"><div class="bar" style="width:${value/max*100}%"></div></div><span>${value}${suffix}</span></div>`;}).join('');
}
form.addEventListener('input',updateProfile);
$('next').addEventListener('click',()=>{state.step=Math.min(2,state.step+1);persist();showStep(true);});
$('back').addEventListener('click',()=>{state.step=Math.max(0,state.step-1);persist();showStep(true);});
// Enter on an earlier step advances instead of bypassing the quiz.
form.addEventListener('submit',event=>{event.preventDefault();if(state.step<2){state.step++;persist();showStep(true);return;}state.completed=true;state.compare=state.compare.length?state.compare:rankBreeds(state.profile).slice(0,2).map(x=>x.breed.id);persist();render();$('matches').scrollIntoView({behavior:'smooth'});$('results-title').tabIndex=-1;$('results-title').focus({preventScroll:true});toast('Your matches are ready. Save a favorite or compare your options.');});
$('breed-cards').addEventListener('click',event=>{const button=event.target.closest('[data-save]');if(!button)return;const id=button.dataset.save;const saved=state.favorites.includes(id);state.favorites=saved?state.favorites.filter(x=>x!==id):[...state.favorites,id];persist();render();const replacement=document.querySelector(`[data-save="${id}"]`);if(replacement)replacement.focus();else $('only-saved').focus();toast(saved?'Removed from your shortlist.':'Saved to your shortlist.');});
$('breed-cards').addEventListener('change',event=>{const input=event.target;if(!input.matches('[data-compare]'))return;const id=input.dataset.compare;if(input.checked&&state.compare.length>=3){input.checked=false;toast('Choose up to 3 dogs. Uncheck one before adding another.');return;}state.compare=input.checked?[...state.compare,id]:state.compare.filter(x=>x!==id);persist();renderChart();});
$('metric').addEventListener('change',()=>renderChart());$('only-saved').addEventListener('change',()=>render());
$('edit').addEventListener('click',()=>{state.step=0;persist();showStep();$('quiz').scrollIntoView({behavior:'smooth'});form.elements.home.focus({preventScroll:true});});
$('reset').addEventListener('click',()=>{try{localStorage.removeItem(key);}catch{}state={version:1,profile:{...defaults},step:0,completed:false,favorites:[],compare:[]};for(const [name,value] of Object.entries(state.profile))form.elements.namedItem(name).value=value;$('only-saved').checked=false;$('metric').value='score';showStep();render();$('save-status').textContent='Saved data cleared';toast('Your answers and shortlist have been cleared.');});
showStep();render();
