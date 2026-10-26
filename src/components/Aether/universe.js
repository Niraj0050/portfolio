import * as THREE from 'three';
import { createNetwork } from './electricity.js';
import { createAtmosphere } from './atmosphere.js';
import { createNameTargets } from './name-targets.js';
import { createCanvasAbout } from './canvas-about.js';
import { createProjectConstellations,createProjectTargets } from './project-constellations.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const vertex = `
attribute vec3 start; attribute float seed; attribute float charge;
attribute vec3 nameTarget;attribute vec3 projectTarget;
uniform float time; uniform float formation; uniform float pixelRatio;uniform float story;uniform float projects;uniform float reducedMotion;uniform float idleTorus;uniform float idleInfinity;
varying float energy; varying float alpha; varying float rim; varying float nameAmount;
void main(){
 float p=smoothstep(seed*.25, .75+seed*.25, formation);
 vec3 pos=mix(start,position,p);
 float twist=(1.-p)*2.4;
 pos.xz=mat2(cos(twist),-sin(twist),sin(twist),cos(twist))*pos.xz;
 pos.y+=sin(p*3.14159)*sin(seed*60.)*1.2;
 pos+=normalize(position)*sin(time*.8+seed*80.)*.014*p;
 float radius=max(length(position),.001);
 float u=atan(position.z,position.x);
 float v=acos(clamp(position.y/radius,-1.,1.))*2.;
 vec3 torus=vec3((1.45+.62*cos(v))*cos(u),1.50*sin(v),(1.45+.62*cos(v))*sin(u));
 vec3 infinity=vec3(2.30*sin(u),1.55*sin(u)*cos(u)*2.,.30*cos(u*2.));
 infinity+=normalize(position)*.105;
 pos=mix(pos,torus,idleTorus);
 pos=mix(pos,infinity,idleInfinity);
 float morph=smoothstep(.08+seed*.08,.74+seed*.06,story);
 nameAmount=morph*(1.-projects);
 energy=charge;
 vec3 world=(modelMatrix*vec4(pos,1.)).xyz;
 world=mix(world,nameTarget,morph);
 world+=sin(morph*3.14159)*(1.-reducedMotion)*vec3(sin(seed*35.)*.8,cos(seed*23.)*.55,sin(seed*17.)*.8);
 world=mix(world,projectTarget,projects);
 world+=sin(projects*3.14159)*(1.-reducedMotion)*vec3(sin(seed*41.)*.38,cos(seed*29.)*.28,sin(seed*19.)*.4);
 vec4 mv=viewMatrix*vec4(world,1.);
 gl_Position=projectionMatrix*mv;
 float facing=dot(normalize(normalMatrix*normalize(position)),normalize(-mv.xyz));
 rim=pow(1.-abs(facing),2.5);
 gl_PointSize=min(24.,mix(2.9+seed*1.3+rim*.7+energy*4.2,3.25+seed,morph)*pixelRatio*4.5/-mv.z);
 alpha=(.45+seed*.55)*(.45+.55*p)*(.25+.75*smoothstep(-.3,.55,facing));
 alpha+=rim*.16*p;
 alpha=mix(alpha,.8+seed*.2,morph);alpha=mix(alpha,.5+seed*.42,projects);rim*=1.-morph;
}`;
const fragment = `
varying float energy; varying float alpha; varying float rim; varying float nameAmount;
void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;
 vec3 base=mix(vec3(.12,.34,.48),vec3(.3,.7,.76),alpha)+vec3(.04,.09,.1)*rim;
 vec3 color=mix(base,mix(vec3(.12,.8,1.),vec3(.85,1.,.98),smoothstep(.3,1.,energy)),min(energy*1.6,1.))+vec3(.035,.11,.13)*nameAmount;
 float glow=exp(-d*d*7.)*(.52+energy*2.)+exp(-d*d*36.)*.48+nameAmount*exp(-d*d*2.8)*.14;
 gl_FragColor=vec4(color,glow*alpha);
}`;

export function createUniverse(host, onStatus, onStoryProgress=()=>{}) {
  const reduced = false;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(44, 1, .1, 100);
  camera.position.z = 7.8;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x03060b, 0);
  host.appendChild(renderer.domElement);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.15;
  const atmosphere=createAtmosphere(scene);
  const canvasAbout=createCanvasAbout(scene,camera);
  const projectConstellations=createProjectConstellations(scene);
  const composer=new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene,camera));
  const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.7,.65,.72);
  composer.addPass(bloom);
  const output=new OutputPass();composer.addPass(output);
  const group = new THREE.Group(); scene.add(group);
  const count = innerWidth < 760 ? 4800 : 8500;
  const positions = new Float32Array(count * 3), starts = new Float32Array(count * 3), seeds = new Float32Array(count);
  const vectors = [];
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y), a = i * Math.PI * (3 - Math.sqrt(5));
    const uneven=.018*Math.sin(a*2.+y*9.)+.012*Math.cos(a*5.-y*7.);
    const v = new THREE.Vector3(Math.cos(a)*r, y, Math.sin(a)*r).multiplyScalar(1.79+uneven+(Math.random()-.5)*.045);
    v.toArray(positions, i*3); vectors.push(v);
    v.clone().multiplyScalar(5+Math.random()*9).toArray(starts,i*3); seeds[i]=Math.random();
  }
  const charges = new Float32Array(count);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  geometry.setAttribute('start',new THREE.BufferAttribute(starts,3));
  geometry.setAttribute('seed',new THREE.BufferAttribute(seeds,1));
  geometry.setAttribute('charge',new THREE.BufferAttribute(charges,1).setUsage(THREE.DynamicDrawUsage));
  const nameTargets=new Float32Array(count*3);
  const projectTargets=new Float32Array(count*3);
  const projectTargetGoal=new Float32Array(count*3);
  geometry.setAttribute('nameTarget',new THREE.BufferAttribute(nameTargets,3));
  geometry.setAttribute('projectTarget',new THREE.BufferAttribute(projectTargets,3));
  const story={value:0},projects={value:0};
  const uniforms = { story,projects,reducedMotion:{value:reduced?1:0},idleTorus:{value:0},idleInfinity:{value:0},time:{value:0}, formation:{value:0}, pixelRatio:{value:renderer.getPixelRatio()}, hit:{value:new THREE.Vector3(0,0,1.8)}, hover:{value:0}, wave:{value:-1}, origin:{value:new THREE.Vector3(0,0,1)} };
  const material = new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  const points = new THREE.Points(geometry,material); points.frustumCulled=false; group.add(points);
  const network=createNetwork(vectors);group.add(network.lines);
  const inverseGroup=new THREE.Matrix4(),displayTarget=new THREE.Vector3(),displayOffset=new THREE.Vector3(),idleTarget=new THREE.Vector3();
  const morphNetworkTargets=new Float32Array(count*3);
  let currentTime=0;
  const morphAmount=(index)=>THREE.MathUtils.smoothstep(story.value,.08+seeds[index]*.08,.74+seeds[index]*.06);
  const resolveDisplayPoint=(index,out)=>{
    const seed=seeds[index],morph=morphAmount(index);
    out.copy(vectors[index]);
    const radius=Math.max(out.length(),.001),u=Math.atan2(out.z,out.x),v=Math.acos(THREE.MathUtils.clamp(out.y/radius,-1,1))*2;
    idleTarget.set((1.45+.62*Math.cos(v))*Math.cos(u),1.50*Math.sin(v),(1.45+.62*Math.cos(v))*Math.sin(u));
    out.lerp(idleTarget,uniforms.idleTorus.value);
    idleTarget.set(2.30*Math.sin(u),1.55*Math.sin(u)*Math.cos(u)*2,.30*Math.cos(u*2)).addScaledVector(vectors[index].clone().normalize(),.105);
    out.lerp(idleTarget,uniforms.idleInfinity.value);
    displayOffset.copy(vectors[index]).normalize().multiplyScalar(Math.sin(currentTime*.8+seed*80)*.014);
    out.add(displayOffset).applyMatrix4(group.matrixWorld);
    displayTarget.set(nameTargets[index*3],nameTargets[index*3+1],nameTargets[index*3+2]);
    out.lerp(displayTarget,morph);
    if(!reduced)out.add(displayOffset.set(Math.sin(seed*35)*.8,Math.cos(seed*23)*.55,Math.sin(seed*17)*.8).multiplyScalar(Math.sin(morph*Math.PI)));
    displayTarget.set(projectTargets[index*3],projectTargets[index*3+1],projectTargets[index*3+2]);
    out.lerp(displayTarget,projects.value);
    if(!reduced)out.add(displayOffset.set(Math.sin(seed*41)*.38,Math.cos(seed*29)*.28,Math.sin(seed*19)*.4).multiplyScalar(Math.sin(projects.value*Math.PI)));
    return out.applyMatrix4(inverseGroup);
  };
  network.setDisplayResolver(resolveDisplayPoint);
  const dustGeometry=new THREE.BufferGeometry(),dustPositions=new Float32Array(900*3);
  for(let i=0;i<900;i++)new THREE.Vector3().randomDirection().multiplyScalar(i<600?.25+Math.random()*1.25:1.7+Math.random()*.5).toArray(dustPositions,i*3);
  dustGeometry.setAttribute('position',new THREE.BufferAttribute(dustPositions,3));
  const dustMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{opacity:{value:0},ratio:{value:renderer.getPixelRatio()}},vertexShader:'uniform float ratio;varying float depth;void main(){vec4 p=modelViewMatrix*vec4(position,1.);depth=clamp((p.z+10.)/5.,0.,1.);gl_Position=projectionMatrix*p;gl_PointSize=(1.5+depth*2.)*ratio;}',fragmentShader:'uniform float opacity;varying float depth;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;gl_FragColor=vec4(.25,.49,.64,exp(-d*d*5.)*opacity*(.2+depth*.8));}'});
  const dust=new THREE.Points(dustGeometry,dustMaterial);group.add(dust);
  const starGeometry = new THREE.BufferGeometry();
  const stars = new Float32Array(2400*3), starColors = new Float32Array(2400*3);
  for(let i=0;i<2400;i++){
    stars[i*3]=(Math.random()-.5)*38; stars[i*3+1]=(Math.random()-.5)*26; stars[i*3+2]=-2-Math.random()*24;
    const brightness=.2+Math.random()*.65; starColors.set([brightness*.7,brightness*.85,brightness],i*3);
  }
  starGeometry.setAttribute('position',new THREE.BufferAttribute(stars,3)); starGeometry.setAttribute('color',new THREE.BufferAttribute(starColors,3));
  const starSeeds=new Float32Array(2400);for(let i=0;i<2400;i++)starSeeds[i]=Math.random();
  starGeometry.setAttribute('seed',new THREE.BufferAttribute(starSeeds,1));
  starGeometry.setAttribute('nameTarget',new THREE.BufferAttribute(new Float32Array(2400*3),3));
  const focus={value:new THREE.Vector3(0,0,.6)};
  const starMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{story,projects,reducedMotion:{value:reduced?1:0},time:{value:0},ratio:{value:renderer.getPixelRatio()},aspect:{value:1},focus},
    vertexShader:`attribute float seed;attribute vec3 nameTarget;uniform float story;uniform float projects;uniform float reducedMotion;uniform float time;uniform float ratio;uniform float aspect;uniform vec3 focus;
      varying float light;varying float tint;varying float morphAmount;
      void main(){vec3 pos=position;pos.x+=sin(time*.035+seed*80.)*.18;pos.y+=cos(time*.025+seed*60.)*.12;
        float join=1.-step(.82,seed);
        float morph=smoothstep(.04+seed*.1,.71+seed*.1,story)*join;
        vec3 world=(modelMatrix*vec4(pos,1.)).xyz;
        world=mix(world,nameTarget,morph);
        world+=sin(morph*3.14159)*(1.-reducedMotion)*vec3(sin(seed*45.)*2.,cos(seed*33.)*1.2,sin(seed*61.));
        vec4 p=viewMatrix*vec4(world,1.);gl_Position=projectionMatrix*p;
        vec2 screen=gl_Position.xy/gl_Position.w;
        float distanceToSphere=length((screen-focus.xy)*vec2(aspect,1.));
        float separation=mix(.18,1.,smoothstep(focus.z*.65,focus.z*1.35,distanceToSphere));
        gl_PointSize=mix(1.3+seed*1.8+step(.985,seed)*1.4,1.8+seed*.5,morph)*ratio;
        light=(.35+seed*.45)*(.9+.1*sin(time*(.3+seed)+seed*90.))*separation;
        light=mix(light*(1.-story*.45),.65,morph)*(1.-projects*morph);tint=seed;morphAmount=morph;}`,
    fragmentShader:'varying float light;varying float tint;varying float morphAmount;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;float core=1.-smoothstep(.08,.48,d);float halo=exp(-d*d*4.)*.25;vec3 color=mix(mix(vec3(.62,.78,1.),vec3(1.,.93,.8),tint),vec3(.3,.7,.76),morphAmount);gl_FragColor=vec4(color,(core+halo)*light);}'});
  const starfield = new THREE.Points(starGeometry,starMaterial);starfield.frustumCulled=false;scene.add(starfield);
  // A soft atmospheric halo remains behind the individual particles.
  const haloGeometry=new THREE.PlaneGeometry(6.35,6.35);
  const haloMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexShader:'varying vec2 uvv;void main(){uvv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 uvv;void main(){float d=length(uvv-.5)*2.;float a=exp(-d*d*7.)*.045;gl_FragColor=vec4(.05,.55,.68,a);}'});
  const halo=new THREE.Mesh(haloGeometry,haloMaterial);scene.add(halo);
  const sparkGeometry=new THREE.BufferGeometry();sparkGeometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0],3));
  const sparkMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{strength:{value:0},ratio:{value:renderer.getPixelRatio()}},vertexShader:'uniform float ratio;void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=75.*ratio;}',fragmentShader:'uniform float strength;void main(){vec2 p=gl_PointCoord-.5;float d=length(p);float g=exp(-d*28.)+exp(-d*8.)*.12;float cross=exp(-abs(p.x)*160.)*exp(-abs(p.y)*22.)+exp(-abs(p.y)*160.)*exp(-abs(p.x)*22.);gl_FragColor=vec4(.6,.95,1.,(g+cross*.15)*strength);}'});
  const spark=new THREE.Points(sparkGeometry,sparkMaterial);group.add(spark);
  const parallax=new THREE.Vector2();
  const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2(9,9), sphere=new THREE.Sphere(new THREE.Vector3(),1.82), localRay=new THREE.Ray(), hit=new THREE.Vector3(), inverse=new THREE.Matrix4(),pickLocal=new THREE.Vector3(),pickWorld=new THREE.Vector3();
  let hovering=false,hoveredIndex=-1,lastPick=-1,networkPhase=0,activeProject=0,networkRefreshTimer=0,idleElapsed=0,start=performance.now(),lastFrame=performance.now(),raf,disposed=false,lastStatus='',targetStory=0,targetProjects=0,targetPage=0,pageProgress=0,lastReported=-1;
  function status(value){if(lastStatus!==value){lastStatus=value;onStatus(value);}}
  function updateName(){const targets=createNameTargets(count+2400,host.clientWidth,host.clientHeight);nameTargets.set(targets.subarray(0,count*3));starGeometry.attributes.nameTarget.array.set(targets.subarray(count*3));geometry.attributes.nameTarget.needsUpdate=true;starGeometry.attributes.nameTarget.needsUpdate=true;network.setTargetPoints(nameTargets);}
  function updateProjects(time=0){const result=createProjectTargets(count,host.clientWidth,host.clientHeight,activeProject,time);projectTargetGoal.set(result.targets);projectConstellations.resize(host.clientWidth,host.clientHeight);}
  function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);composer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();const mobile=w<760;group.position.set(0,0,0);group.scale.setScalar(mobile?Math.min(.86,w/h*1.65):1.13);halo.position.copy(group.position);starMaterial.uniforms.aspect.value=camera.aspect;updateName();updateProjects();canvasAbout.resize(w,h);}
  function move(event){const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);parallax.copy(pointer);}
  function currentOrigin(){return hoveredIndex>=0?hoveredIndex:uniforms.hit.value;}
  function pulse(){if(uniforms.formation.value<1)return;network.release(hovering?currentOrigin():new THREE.Vector3(0,0,1.8),performance.now()/1000);}
  function down(event){move(event);updateHit(performance.now()/1000,true);if(hovering)pulse();}
  function leave(){pointer.set(9,9);parallax.set(0,0);hovering=false;hoveredIndex=-1;}
  function updateHit(now,force=false){
    if(pointer.x>2){hovering=false;hoveredIndex=-1;return;}
    raycaster.setFromCamera(pointer,camera);
    if(story.value<.08&&uniforms.idleTorus.value+uniforms.idleInfinity.value<.04){
      inverse.copy(group.matrixWorld).invert();localRay.copy(raycaster.ray).applyMatrix4(inverse);
      hovering=!!localRay.intersectSphere(sphere,hit);hoveredIndex=-1;if(hovering)uniforms.hit.value.copy(hit);return;
    }
    if(!force&&now-lastPick<.045)return;lastPick=now;
    let best=-1,bestDistance=.02;
    for(let i=0;i<count;i+=2){
      resolveDisplayPoint(i,pickLocal);pickWorld.copy(pickLocal).applyMatrix4(group.matrixWorld);
      const distance=raycaster.ray.distanceSqToPoint(pickWorld);
      if(distance<bestDistance){bestDistance=distance;best=i;}
    }
    hoveredIndex=best;hovering=best>=0;
    if(hovering){uniforms.hit.value.copy(vectors[best]);resolveDisplayPoint(best,pickLocal);spark.position.copy(pickLocal);}
  }
  function animate(now){if(disposed)return;raf=requestAnimationFrame(animate);const t=(now-start)/1000;const dt=Math.min((now-lastFrame)/1000,.05);lastFrame=now;
    uniforms.time.value=t;uniforms.formation.value=reduced?1:Math.min(1,t/4.4);
    if(uniforms.formation.value>=1&&targetStory<.015)idleElapsed+=dt;
    const cycle=idleElapsed%10.5;
    const idleEnabled=!reduced&&targetStory<.015;
    const torusTarget=idleEnabled?THREE.MathUtils.smoothstep(cycle,1.5,2.8)*(1-THREE.MathUtils.smoothstep(cycle,4,5.3)):0;
    const infinityTarget=idleEnabled?THREE.MathUtils.smoothstep(cycle,4,5.3)*(1-THREE.MathUtils.smoothstep(cycle,6.5,8)):0;
    const idleEase=1-Math.exp(-dt*6);
    uniforms.idleTorus.value=THREE.MathUtils.lerp(uniforms.idleTorus.value,torusTarget,idleEase);
    uniforms.idleInfinity.value=THREE.MathUtils.lerp(uniforms.idleInfinity.value,infinityTarget,idleEase);
    story.value=reduced?targetStory:THREE.MathUtils.lerp(story.value,targetStory,1-Math.exp(-dt*9));
    projects.value=reduced?targetProjects:THREE.MathUtils.lerp(projects.value,targetProjects,1-Math.exp(-dt*8));
    const projectMorph=1-Math.exp(-dt*5.5);
    // Continuously update rotation for the hero/skills shape (activeProject 3)
    if(activeProject===3&&projects.value>0.01){const rotResult=createProjectTargets(count,host.clientWidth,host.clientHeight,3,t);projectTargetGoal.set(rotResult.targets);}
    for(let i=0;i<projectTargets.length;i++)projectTargets[i]=THREE.MathUtils.lerp(projectTargets[i],projectTargetGoal[i],projectMorph);geometry.attributes.projectTarget.needsUpdate=true;
    pageProgress=reduced?targetPage:THREE.MathUtils.lerp(pageProgress,targetPage,1-Math.exp(-dt*10));
    if(Math.abs(story.value-targetStory)<.0001)story.value=targetStory;
    const nextNetworkPhase=projects.value>.72?8:projects.value>.48?7:projects.value>.2?6:projects.value>.03?5:story.value<.08?0:story.value<.28?1:story.value<.5?2:story.value<.7?3:4;
    if(nextNetworkPhase!==networkPhase){
      network.reset();networkPhase=nextNetworkPhase;
      if(networkPhase>0){
        group.updateMatrixWorld();inverseGroup.copy(group.matrixWorld).invert();
        for(let i=0;i<count;i++)resolveDisplayPoint(i,pickLocal).toArray(morphNetworkTargets,i*3);
        network.setTargetPoints(morphNetworkTargets);
      }
    }
    canvasAbout.update(story.value,projects.value);
    if(Math.abs(pageProgress-lastReported)>.0001){onStoryProgress(pageProgress);lastReported=pageProgress;}
    currentTime=t;
    if(!reduced){group.rotation.y=t*.035;camera.position.x=THREE.MathUtils.lerp(camera.position.x,parallax.x*.18,.025);camera.position.y=THREE.MathUtils.lerp(camera.position.y,parallax.y*.12,.025);camera.lookAt(0,0,0);dust.rotation.y=-t*.07;}
    group.updateMatrixWorld();inverseGroup.copy(group.matrixWorld).invert();network.setShapeProgress(story.value);
    updateHit(now/1000);const pulsing=network.update(now/1000,dt,currentOrigin(),hovering,charges,uniforms.formation.value>=1);
    uniforms.hover.value=THREE.MathUtils.lerp(uniforms.hover.value,hovering&&!pulsing?1:0,.13);
    uniforms.wave.value=-1;
    if(hoveredIndex<0)spark.position.copy(uniforms.hit.value);
    sparkMaterial.uniforms.strength.value=uniforms.hover.value*(.8+Math.sin(t*27.)*.2);
    geometry.attributes.charge.needsUpdate=true;
    network.lines.visible=true;
    network.lines.material.opacity=.78;
    spark.visible=true;
    halo.visible=story.value<.5;
    dustMaterial.uniforms.opacity.value=THREE.MathUtils.smoothstep(uniforms.formation.value,.65,1)*.45*(1-THREE.MathUtils.smoothstep(story.value,.04,.6));
    const projected=group.position.clone().project(camera);
    const radius=1.82*group.scale.x;
    focus.value.set(projected.x,projected.y,radius/Math.sqrt(camera.position.distanceToSquared(group.position)-radius*radius)/Math.tan(THREE.MathUtils.degToRad(camera.fov*.5)));
    atmosphere.update(reduced?0:t,focus.value,camera.aspect,story.value);
    bloom.strength=THREE.MathUtils.lerp(bloom.strength,THREE.MathUtils.lerp(pulsing?.95:hovering?.8:.6,.35,story.value),.035);
    starMaterial.uniforms.time.value=reduced?0:t;
    raycaster.setFromCamera(pointer,camera);
    // Projects chapter temporarily hidden. Restore this call with its scroll mapping when needed.
    // projectConstellations.update(projects.value,t,projects.value>.05?raycaster.ray:null);
    if(uniforms.formation.value<1)status('Gathering particles');else if(pulsing)status('Energy travelling');else status(hovering?'Connection established':'Awaiting connection');
    starfield.rotation.z=reduced?0:Math.sin(t*.02)*.01;composer.render();
  }
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  document.fonts.ready.then(()=>{if(!disposed){updateName();updateProjects();canvasAbout.refresh();}});
  renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointerleave',leave);
  raf=requestAnimationFrame(animate);
  return {pulse,setScrollProgress(value){targetPage=THREE.MathUtils.clamp(value,0,1);targetStory=THREE.MathUtils.clamp(targetPage/.24,0,1);targetProjects=THREE.MathUtils.smoothstep(targetPage,.26,.3);const nextProject=targetPage<.52?3:targetPage<.75?4:5;if(nextProject!==activeProject){activeProject=nextProject;updateProjects();network.reset();clearTimeout(networkRefreshTimer);networkRefreshTimer=setTimeout(()=>{if(!disposed){network.setTargetPoints(projectTargetGoal);network.reset();}},450);}},replay(){start=performance.now();idleElapsed=0;network.reset();charges.fill(0);},dispose(){disposed=true;clearTimeout(networkRefreshTimer);cancelAnimationFrame(raf);observer.disconnect();renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointerleave',leave);network.dispose();atmosphere.dispose();canvasAbout.dispose();projectConstellations.dispose();bloom.dispose();output.dispose();composer.dispose();[geometry,material,starGeometry,starMaterial,haloGeometry,haloMaterial,sparkGeometry,sparkMaterial,dustGeometry,dustMaterial].forEach(x=>x.dispose());renderer.dispose();renderer.domElement.remove();}};
}
