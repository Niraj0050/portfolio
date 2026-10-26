import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { createNetwork } from './electricity.js';

function sphere(count=8500){return Array.from({length:count},(_,i)=>{const y=1-2*i/(count-1),r=Math.sqrt(1-y*y),a=i*Math.PI*(3-Math.sqrt(5));return new Vector3(Math.cos(a)*r,y,Math.sin(a)*r).multiplyScalar(1.59);});}

test('a release reaches every particle, fades, and can be replayed',()=>{
 const points=sphere(),network=createNetwork(points),charges=new Float32Array(points.length),visited=new Set();
 assert.equal(network.release(points[0],0),true);
 for(let t=0;t<7;t+=1/60){network.update(t,1/60,points[0],false,charges,true);charges.forEach((charge,i)=>{assert.ok(Number.isFinite(charge));if(charge>.1)visited.add(i);});}
 assert.equal(visited.size,points.length,'the current must reach the back and both poles');
 assert.ok(Math.max(...charges)<.01,'the sphere returns to its idle state');
 assert.equal(network.release(points[100],8),true);
 network.reset();network.update(8,1/60,points[0],false,charges,true);
 assert.equal(network.lines.geometry.drawRange.count,0);
 network.dispose();
});

test('hover current stays near the pointer and produces finite moving segments',()=>{
 const points=sphere(),network=createNetwork(points),charges=new Float32Array(points.length);
 for(let t=0;t<1.6;t+=1/60)network.update(t,1/60,points[0],true,charges,true);
 assert.ok(charges.some(c=>c>.1));
 assert.equal(charges[points.length-1],0,'hover should not energize the opposite pole');
 const geometry=network.lines.geometry;
 assert.ok(geometry.drawRange.count>0);
 assert.ok(geometry.attributes.position.array.slice(0,geometry.drawRange.count*3).every(Number.isFinite));
 network.dispose();
});

test('a second tap starts immediately while the previous discharge continues',()=>{
 const points=sphere(),network=createNetwork(points),charges=new Float32Array(points.length);
 assert.equal(network.release(points[0],0),true);
 network.update(.1,.1,points[0],false,charges,true);
 assert.equal(network.release(points[points.length-1],.1),true);
 charges.fill(0);
 network.update(.12,.02,points[0],false,charges,true);
 assert.ok(charges[0]>.5,'the first discharge must still be active');
 assert.ok(charges[points.length-1]>.5,'the second tap must energize its origin immediately');
 network.dispose();
});
