import * as THREE from 'three';

// Fixed spatial connections let energy follow the same paths from frame to frame.
export function createNetwork(points) {
  const key = (x,y,z) => `${x},${y},${z}`;
  function buildNeighbors(vertices,cell=.16){
    const buckets=new Map(),coord=v=>[Math.floor(v.x/cell),Math.floor(v.y/cell),Math.floor(v.z/cell)];
    vertices.forEach((v,i)=>{const k=key(...coord(v));if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push(i);});
    const graph=vertices.map((v,i)=>{
      const [x,y,z]=coord(v),found=[];
      for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let c=-1;c<=1;c++){
        for(const j of buckets.get(key(x+a,y+b,z+c))||[])if(j!==i)found.push({i:j,d:v.distanceTo(vertices[j])});
      }
      return found.sort((a,b)=>a.d-b.d).slice(0,7);
    });
    graph.forEach((list,i)=>list.slice().forEach(n=>{if(!graph[n.i].some(v=>v.i===i))graph[n.i].push({i,d:n.d});}));
    return graph;
  }
  const sphereNeighbors=buildNeighbors(points);
  let targetPoints=null,targetNeighbors=null,shapeProgress=0;
  let resolveDisplayPoint=(index,out)=>out.copy(points[index]);
  function nearest(v,vertices=points){let best=0,d=Infinity;vertices.forEach((p,i)=>{const n=p.distanceToSquared(v);if(n<d){d=n;best=i;}});return best;}
  function packet(origin, now, global=false){
    const useTarget=shapeProgress>.08&&targetNeighbors;
    const graph=useTarget?targetNeighbors:sphereNeighbors;
    const vertices=useTarget?targetPoints:points;
    const root=Number.isInteger(origin)?origin:nearest(origin,vertices);
    const distances=new Float32Array(points.length).fill(Infinity), parents=new Int32Array(points.length).fill(-1);
    const heap=[];
    function push(i,d){let k=heap.length;heap.push({i,d});while(k){const p=(k-1)>>1;if(heap[p].d<=d)break;heap[k]=heap[p];k=p;}heap[k]={i,d};}
    function pop(){const top=heap[0],last=heap.pop();if(heap.length){let k=0;while(k*2+1<heap.length){let c=k*2+1;if(c+1<heap.length&&heap[c+1].d<heap[c].d)c++;if(heap[c].d>=last.d)break;heap[k]=heap[c];k=c;}heap[k]=last;}return top;}
    let max=0;
    if(global&&useTarget){
      // Text glyphs are intentionally separated in space, so their particle graphs
      // form multiple components. Seed every component from the point nearest the
      // click, with a tiny spatial delay, so one tap sweeps across the complete name.
      const visited=new Uint8Array(graph.length),rootPoint=vertices[root];
      for(let startNode=0;startNode<graph.length;startNode++){
        if(visited[startNode])continue;
        const component=[],stack=[startNode];visited[startNode]=1;
        while(stack.length){const node=stack.pop();component.push(node);for(const edge of graph[node])if(!visited[edge.i]){visited[edge.i]=1;stack.push(edge.i);}}
        let componentRoot=component[0],best=Infinity;
        for(const node of component){const d=vertices[node].distanceToSquared(rootPoint);if(d<best){best=d;componentRoot=node;}}
        const delay=Math.min(.62,Math.sqrt(best)*.075);
        distances[componentRoot]=delay;push(componentRoot,delay);max=Math.max(max,delay);
      }
      let minX=Infinity,maxX=-Infinity;
      for(const vertex of vertices){minX=Math.min(minX,vertex.x);maxX=Math.max(maxX,vertex.x);}
      for(let anchor=0;anchor<14;anchor++){
        const x=THREE.MathUtils.lerp(minX,maxX,anchor/13);let node=0,best=Infinity;
        for(let i=0;i<vertices.length;i++){const score=Math.abs(vertices[i].x-x)+Math.abs(vertices[i].y)*.035;if(score<best){best=score;node=i;}}
        const delay=Math.abs(vertices[node].x-rootPoint.x)*.012;
        if(delay<distances[node]){distances[node]=delay;parents[node]=-1;push(node,delay);max=Math.max(max,delay);}
      }
    }else{distances[root]=0;push(root,0);}
    while(heap.length){const current=pop();if(current.d!==distances[current.i]&&Math.abs(current.d-distances[current.i])>.00001)continue;
      for(const edge of graph[current.i]){
        const roughness=1+.18*Math.sin(current.i*12.989+edge.i*7.13);
        const d=current.d+edge.d*roughness;
        if(d<(global?Infinity:.88)&&d<distances[edge.i]){distances[edge.i]=d;parents[edge.i]=current.i;push(edge.i,distances[edge.i]);max=Math.max(max,d);}
      }
    }
    const nodes=[];distances.forEach((d,i)=>{if(Number.isFinite(d))nodes.push(i);});
    return {root,distances,parents,nodes,start:now,speed:global?2.5:1.15,duration:max/(global?2.5:1.15)+1.2,global};
  }
  const geometry=new THREE.BufferGeometry(), buffer=new Float32Array(7000*6), colors=new Float32Array(7000*6);
  geometry.setAttribute('position',new THREE.BufferAttribute(buffer,3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('color',new THREE.BufferAttribute(colors,3).setUsage(THREE.DynamicDrawUsage));
  geometry.setDrawRange(0,0);
  const material=new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.92,depthWrite:false,blending:THREE.AdditiveBlending});
  const lines=new THREE.LineSegments(geometry,material);lines.frustumCulled=false;
  let packets=[],lastHover=-10,globalEnd=-10;
  function release(origin,now){
    const p=packet(origin,now,true);
    // Successive taps overlap; keep the most recent eight to bound rendering work.
    packets=packets.filter(previous=>previous.global&&now-previous.start<previous.duration).slice(-7);
    packets.push(p);
    globalEnd=Math.max(...packets.map(active=>active.start+active.duration));
    return true;
  }
  function update(now,dt,origin,hovering,charges,ready){
    const global=now<globalEnd;
    if(ready&&hovering&&!global&&now-lastHover>.4){packets.push(packet(origin,now));lastHover=now;}
    packets=packets.filter(p=>now-p.start<p.duration);
    let segments=0;
    function segment(a,b,power){if(segments>=7000)return;const o=segments++*6;a.toArray(buffer,o);b.toArray(buffer,o+3);colors.set([power*.55,power*.9,power,power*.55,power*.9,power],o);}
    const decay=Math.exp(-dt*3.1);for(let i=0;i<charges.length;i++)charges[i]*=decay;
    const tmp=new THREE.Vector3(),mid=new THREE.Vector3(),aDisplay=new THREE.Vector3(),bDisplay=new THREE.Vector3();
    for(const p of packets){const age=now-p.start;
      for(const i of p.nodes){const arrival=p.distances[i]/p.speed,elapsed=age-arrival;
        if(elapsed>=0&&elapsed<.85)charges[i]=Math.max(charges[i],Math.exp(-elapsed*4));
        const parent=p.parents[i];if(parent<0)continue;
        const start=p.distances[parent]/p.speed,travel=Math.max(arrival-start,.025);
        if(age<start||age>arrival+.13)continue;
        const a=resolveDisplayPoint(parent,aDisplay),b=resolveDisplayPoint(i,bDisplay);
        // During a morph, formerly adjacent particles can temporarily move far apart.
        // Never turn those stretched graph edges into screen-spanning lightning.
        if(a.distanceToSquared(b)>.075)continue;
        const head=THREE.MathUtils.clamp((age-start)/travel,0,1),tail=THREE.MathUtils.clamp((age-start-.13)/travel,0,1);
        tmp.copy(a).lerp(b,tail);const end=a.clone().lerp(b,head);
        mid.copy(tmp).lerp(end,.5).addScaledVector(a.clone().normalize(),Math.sin(i*23.17)*.018);
        const power=Math.min(1,(arrival+.13-age)/.1);segment(tmp,mid,power);segment(mid,end,power);
      }
    }
    geometry.setDrawRange(0,segments*2);geometry.attributes.position.needsUpdate=true;geometry.attributes.color.needsUpdate=true;
    return global;
  }
  return {lines,release,update,setShapeProgress(value){shapeProgress=value;},setDisplayResolver(resolver){resolveDisplayPoint=resolver;},setTargetPoints(array){
    targetPoints=Array.from({length:points.length},(_,i)=>new THREE.Vector3(array[i*3],array[i*3+1],array[i*3+2]));
    targetNeighbors=buildNeighbors(targetPoints,.12);
  },reset(){packets=[];globalEnd=-10;lastHover=-10;geometry.setDrawRange(0,0);},dispose(){geometry.dispose();material.dispose();}};
}
