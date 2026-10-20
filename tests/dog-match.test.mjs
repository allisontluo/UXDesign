import test from 'node:test';
import assert from 'node:assert/strict';
import {breeds,defaults,rankBreeds,normalizeProfile,restoreState} from '../public/dog-match/engine.mjs';
test('every score stays finite and in range across preference combinations',()=>{
 for(const exercise of [15,60,150])for(const grooming of [1,2,3])for(const priority of ['balanced','activity','coat','size'])for(const alone of [0,10]){
  const rows=rankBreeds({...defaults,exercise,grooming,priority,alone});
  assert.equal(rows.length,6);assert(rows.every(x=>Number.isInteger(x.score)&&x.score>=0&&x.score<=100));
  assert(rows.every((x,i)=>i===0||rows[i-1].score>=x.score));
 }
});
test('exercise and coat choices change relative matches',()=>{
 const low=rankBreeds({...defaults,exercise:15});const high=rankBreeds({...defaults,exercise:150,training:3,experience:'experienced'});
 assert(high.find(x=>x.breed.id==='collie').score>low.find(x=>x.breed.id==='collie').score);
 const coats=rankBreeds({...defaults,grooming:3,shedding:'low',priority:'coat'});
 assert(coats.find(x=>x.breed.id==='poodle').score>rankBreeds(defaults).find(x=>x.breed.id==='poodle').score);
});
test('long unsupervised days cap all results; care support clears the cap',()=>{
 assert(rankBreeds({...defaults,alone:9}).every(x=>x.score<=55));
 assert.equal(rankBreeds({...defaults,alone:9})[0].breed.id,rankBreeds(defaults)[0].breed.id);
 assert(rankBreeds({...defaults,alone:9,support:'yes'})[0].score>55);
 // A hidden prior care selection must not affect ordinary short days.
 assert.deepEqual(rankBreeds({...defaults,alone:4,support:'yes'}),rankBreeds(defaults));
});
test('corrupt persisted lists and numerical values cannot break charts or scores',()=>{
 const state=restoreState({version:1,profile:{exercise:'NaN',grooming:500,size:'invalid'},favorites:['bogus','poodle','poodle'],compare:['bogus',...breeds.map(x=>x.id)]});
 assert.equal(state.profile.exercise,60);assert.equal(state.profile.grooming,1);assert.deepEqual(state.favorites,['poodle']);assert.equal(state.compare.length,3);
 assert.throws(()=>restoreState({version:2}));
 assert.deepEqual(normalizeProfile(null),defaults);
});
