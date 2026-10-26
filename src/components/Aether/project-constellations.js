/* Retained legacy constellation implementation.
import * as THREE from "three";

export const PROJECTS=[
  {id:'01',title:'Student Record System',tech:'Python · Tkinter · MySQL'},
  {id:'02',title:'3D Portfolio Platform',tech:'React · Three.js · WebGL'},
  {id:'03',title:'Machine Learning Project',tech:'Python · Pandas · NumPy'},
];

const patterns=[
  [[-.72,.1],[-.42,.58],[-.05,.34],[.25,.72],[.7,.24],[.4,-.25],[.68,-.65],[.05,-.48],[-.52,-.58]],
  [[-.7,.5],[-.2,.72],[.15,.32],[.65,.6],[.72,.02],[.28,-.18],[.52,-.68],[-.05,-.52],[-.62,-.25]],
  [[-.68,.65],[-.18,.45],[.12,.75],[.62,.38],[.4,-.02],[.72,-.45],[.08,-.7],[-.25,-.28],[-.72,-.48]],
];
const edges=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,0],[2,5],[1,7]];

function layout(width,height){
  if(width<760)return [{x:0,y:2.05,s:.5},{x:0,y:.05,s:.5},{x:0,y:-1.95,s:.5}];
  const spread=Math.min(3.45,7.8*Math.tan(22*Math.PI/180)*width/height*.27);
  return [{x:-spread,y:.35,s:.82},{x:0,y:-.08,s:.9},{x:spread,y:.35,s:.82}];
}

export function createProjectTargets(count,width,height){
  const targets=new Float32Array(count*3),centers=layout(width,height);
  for(let i=0;i<count;i++){
    const project=i%3,center=centers[project],pattern=patterns[project];
    const edge=edges[Math.floor(((i*.61803398875)%1)*edges.length)],a=pattern[edge[0]],b=pattern[edge[1]];
    const t=(i*.754877666)%1,jitter=((i*12.9898)%1-.5)*.055;
    targets[i*3]=center.x+(a[0]+(b[0]-a[0])*t+jitter)*center.s;
    targets[i*3+1]=center.y+(a[1]+(b[1]-a[1])*t+Math.sin(i*4.17)*.025)*center.s;
    targets[i*3+2]=Math.sin(i*8.31)*.04;
  }
  return {targets,centers};
}

function labelTexture(project){
  const canvas=document.createElement('canvas');canvas.width=900;canvas.height=190;
  const ctx=canvas.getContext('2d');ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle='#76d9df';ctx.font='500 20px "DM Sans", Arial';ctx.fillText(`PROJECT / ${project.id}`,450,28);
  ctx.fillStyle='#e9f7f8';ctx.font='500 42px "Space Grotesk", Arial';ctx.fillText(project.title,450,86);
  ctx.fillStyle='#8da8b3';ctx.font='400 22px "DM Sans", Arial';ctx.fillText(project.tech,450,140);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;texture.generateMipmaps=false;return texture;
}

export function createProjectConstellations(scene){
  const root=new THREE.Group();root.renderOrder=7;scene.add(root);
  const items=PROJECTS.map((project,index)=>{
    const group=new THREE.Group(),pattern=patterns[index],positions=[];
    for(const [a,b] of edges)positions.push(pattern[a][0],pattern[a][1],0,pattern[b][0],pattern[b][1],0);
    const lineGeometry=new THREE.BufferGeometry();lineGeometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
    const lineMaterial=new THREE.LineBasicMaterial({color:0x62c9d1,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});
    const lines=new THREE.LineSegments(lineGeometry,lineMaterial);group.add(lines);
    const nodeGeometry=new THREE.BufferGeometry();nodeGeometry.setAttribute('position',new THREE.Float32BufferAttribute(pattern.flatMap(([x,y])=>[x,y,0]),3));
    const nodeMaterial=new THREE.PointsMaterial({color:0xc7ffff,size:.055,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});
    const nodes=new THREE.Points(nodeGeometry,nodeMaterial);group.add(nodes);
    const texture=labelTexture(project),labelMaterial=new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity:0,depthTest:false,depthWrite:false,color:new THREE.Color(.72,.72,.72)});
    const label=new THREE.Mesh(new THREE.PlaneGeometry(2.75,.58),labelMaterial);label.position.y=-1.35;label.renderOrder=9;group.add(label);
    root.add(group);return {group,lineGeometry,lineMaterial,nodeGeometry,nodeMaterial,label,labelMaterial,texture};
  });
  let centers=layout(innerWidth,innerHeight),hovered=-1;
  function resize(width,height){centers=layout(width,height);items.forEach((item,i)=>{const c=centers[i];item.group.position.set(c.x,c.y,0);item.group.scale.setScalar(c.s);item.label.scale.setScalar(width<760?1.4:1);});}
  function update(progress,time,ray){
    hovered=-1;
    if(progress>.7&&ray){let closest=.8;centers.forEach((c,i)=>{const point=new THREE.Vector3(c.x,c.y,0),d=ray.distanceToPoint(point);if(d<closest){closest=d;hovered=i;}});}
    items.forEach((item,i)=>{
      const active=hovered===i,appear=THREE.MathUtils.smoothstep(progress,.2+i*.06,.7+i*.04);
      item.lineMaterial.opacity=appear*(active?.9:.34);item.nodeMaterial.opacity=appear*(active?1:.62);item.labelMaterial.opacity=appear*(active?1:.72);
      const pulse=1+(active?.07:.018)*Math.sin(time*(active?4:1.6)+i);item.group.scale.setScalar(centers[i].s*pulse);
    });
    root.visible=progress>.001;return hovered;
  }
  resize(innerWidth,innerHeight);
  return {resize,update,get hovered(){return hovered;},dispose(){items.forEach(item=>{item.lineGeometry.dispose();item.lineMaterial.dispose();item.nodeGeometry.dispose();item.nodeMaterial.dispose();item.label.geometry.dispose();item.labelMaterial.dispose();item.texture.dispose();});scene.remove(root);}};
}
*/
import * as THREE from 'three';

export const PROJECTS = [
  {
    id: '01',
    title: 'Machine Learning Project',
    summary: 'Data pipelines and predictive models',
    tech: 'PYTHON  ·  PANDAS  ·  NUMPY',
    color: '#78a8ff',
  },
  {
    id: '02',
    title: 'Student Management System',
    summary: 'CRUD records and relational storage',
    tech: 'PYTHON  ·  TKINTER  ·  MYSQL',
    color: '#72f4ff',
  },
  {
    id: '03',
    title: 'Portfolio Website',
    summary: 'Immersive interactions in the browser',
    tech: 'REACT  ·  THREE.JS  ·  WEBGL',
    color: '#bffcff',
  },
];

const point = (x, y, z = 0) => new THREE.Vector3(x, y, z);

function databaseShape() {
  const points = [];
  const steps = 18;
  const ys = [0.54, 0.05, -0.44];
  for (const y of ys) {
    for (let i = 0; i < steps; i += 1) {
      const a = (i / steps) * Math.PI * 2;
      const b = ((i + 1) / steps) * Math.PI * 2;
      points.push(point(Math.cos(a), y + Math.sin(a) * 0.22, Math.sin(a) * 0.12));
      points.push(point(Math.cos(b), y + Math.sin(b) * 0.22, Math.sin(b) * 0.12));
    }
  }
  [-1, 1].forEach((x) => {
    points.push(point(x, 0.54), point(x, -0.44));
  });
  return points;
}

function cubeShape() {
  const v = [
    point(-0.78, -0.62, 0.2), point(0.42, -0.62, 0.2), point(0.42, 0.55, 0.2), point(-0.78, 0.55, 0.2),
    point(-0.35, -0.28, -0.2), point(0.85, -0.28, -0.2), point(0.85, 0.89, -0.2), point(-0.35, 0.89, -0.2),
  ];
  const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  return edges.flatMap(([a, b]) => [v[a], v[b]]);
}

function neuralShape() {
  const layers = [
    [-0.72, [-0.62, 0, 0.62], 0.34],
    [0, [-0.78, -0.26, 0.26, 0.78], -0.28],
    [0.72, [-0.38, 0.38], 0.3],
  ];
  const points = [];
  const connect = (from, to) => {
    from[1].forEach((fy) => to[1].forEach((ty) => points.push(point(from[0], fy, from[2]), point(to[0], ty, to[2]))));
  };
  connect(layers[0], layers[1]);
  connect(layers[1], layers[2]);
  return { lines: points, nodes: layers.flatMap(([x, ys, z]) => ys.map((y) => point(x, y, z))) };
}

function skillsShape() {
  const diamond = [];
  const ring1Lines = [];
  const ring2Lines = [];
  const ring3Lines = [];
  const nodes = [];
  const segments = 8;
  const radius = 0.72;
  const topY = radius * 1.45;
  const bottomY = -radius * 1.45;

  // Build equator vertices for the diamond
  const equator = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2 + Math.PI / segments;
    equator.push(point(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }

  // Diamond wireframe edges
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    diamond.push(point(0, topY, 0), equator[i]);
    diamond.push(equator[i], equator[next]);
    diamond.push(point(0, bottomY, 0), equator[i]);
  }
  nodes.push(point(0, topY, 0), point(0, bottomY, 0));

  // Inner chevron / cross structure
  const cx = 0.28, cy = 0.38, cz = 0.18;
  diamond.push(point(-cx, cy, cz), point(0, 0, cz * 1.5));
  diamond.push(point(cx, cy, cz), point(0, 0, cz * 1.5));
  diamond.push(point(-cx, -cy, cz), point(0, 0, cz * 1.5));
  diamond.push(point(cx, -cy, cz), point(0, 0, cz * 1.5));
  diamond.push(point(-cx, cy, -cz), point(0, 0, -cz * 1.5));
  diamond.push(point(cx, cy, -cz), point(0, 0, -cz * 1.5));
  diamond.push(point(-cx, -cy, -cz), point(0, 0, -cz * 1.5));
  diamond.push(point(cx, -cy, -cz), point(0, 0, -cz * 1.5));

  // Ring 1: Equatorial ring (slight tilt)
  const r1 = 1.02, r1Seg = 48, r1Tilt = 0.12;
  for (let i = 0; i < r1Seg; i++) {
    const a = (i / r1Seg) * Math.PI * 2;
    const b = ((i + 1) / r1Seg) * Math.PI * 2;
    ring1Lines.push(
      point(Math.cos(a) * r1, Math.sin(a) * r1 * Math.sin(r1Tilt), Math.sin(a) * r1),
      point(Math.cos(b) * r1, Math.sin(b) * r1 * Math.sin(r1Tilt), Math.sin(b) * r1),
    );
  }

  // Ring 2: Diagonal ring
  const r2 = 1.14, r2Seg = 42;
  const tX2 = -0.28 * Math.PI, tY2 = 0.36;
  const cX2 = Math.cos(tX2), sX2 = Math.sin(tX2), cY2 = Math.cos(tY2), sY2 = Math.sin(tY2);
  for (let i = 0; i < r2Seg; i++) {
    const a = (i / r2Seg) * Math.PI * 2;
    const b = ((i + 1) / r2Seg) * Math.PI * 2;
    const pts = [a, b].map(t => {
      const x = Math.cos(t) * r2, z = Math.sin(t) * r2;
      const y1 = -z * sX2, z1 = z * cX2;
      return point(x * cY2 + z1 * sY2, y1, -x * sY2 + z1 * cY2);
    });
    ring2Lines.push(pts[0], pts[1]);
  }

  // Ring 3: Outer trajectory ring
  const r3 = 1.34, r3Seg = 48;
  const tX3 = 0.26, tZ3 = -0.18;
  const cX3 = Math.cos(tX3), sX3 = Math.sin(tX3), cZ3 = Math.cos(tZ3), sZ3 = Math.sin(tZ3);
  for (let i = 0; i < r3Seg; i++) {
    const a = (i / r3Seg) * Math.PI * 2;
    const b = ((i + 1) / r3Seg) * Math.PI * 2;
    const pts = [a, b].map(t => {
      const x = Math.cos(t) * r3, z = Math.sin(t) * r3;
      const y1 = -z * sX3, z1 = z * cX3;
      return point(x * cZ3 - y1 * sZ3, x * sZ3 + y1 * cZ3, z1);
    });
    ring3Lines.push(pts[0], pts[1]);
  }

  const lines = [...diamond, ...ring1Lines, ...ring2Lines, ...ring3Lines];
  // Store part boundaries for independent rotation
  const parts = {
    diamond: { start: 0, end: diamond.length },
    ring1: { start: diamond.length, end: diamond.length + ring1Lines.length },
    ring2: { start: diamond.length + ring1Lines.length, end: diamond.length + ring1Lines.length + ring2Lines.length },
    ring3: { start: diamond.length + ring1Lines.length + ring2Lines.length, end: lines.length },
  };
  return { lines, nodes, parts };
}

function journeyShape() {
  const lines = [];
  const nodes = [];
  const steps = 64;
  for (let i = 0; i < steps; i += 1) {
    const x1 = -1.75 + i / steps * 3.5;
    const x2 = -1.75 + (i + 1) / steps * 3.5;
    lines.push(point(x1, Math.sin(x1 * 2.15) * .42, Math.cos(x1 * 1.4) * .16));
    lines.push(point(x2, Math.sin(x2 * 2.15) * .42, Math.cos(x2 * 1.4) * .16));
  }
  [-1.45, -.48, .5, 1.45].forEach((x) => {
    const node = point(x, Math.sin(x * 2.15) * .42, Math.cos(x * 1.4) * .16);
    nodes.push(node);
    for (let i = 0; i < 14; i += 1) {
      const a = i / 14 * Math.PI * 2;
      const b = (i + 1) / 14 * Math.PI * 2;
      lines.push(point(node.x + Math.cos(a) * .15, node.y + Math.sin(a) * .15, node.z));
      lines.push(point(node.x + Math.cos(b) * .15, node.y + Math.sin(b) * .15, node.z));
    }
  });
  return { lines, nodes };
}

function contactShape() {
  const lines = [];
  const nodes = [point(-1.18, -.18), point(0, 1.02), point(1.18, -.18)];
  for (let ring = 0; ring < 3; ring += 1) {
    const radius = .68 + ring * .34;
    for (let i = 0; i < 42; i += 1) {
      const a = i / 42 * Math.PI * 2;
      const b = (i + 1) / 42 * Math.PI * 2;
      lines.push(point(Math.cos(a) * radius, Math.sin(a) * radius, Math.sin(a * 3 + ring) * .1));
      lines.push(point(Math.cos(b) * radius, Math.sin(b) * radius, Math.sin(b * 3 + ring) * .1));
    }
  }
  nodes.forEach((node) => { lines.push(point(0, 0, .1), node); });
  return { lines, nodes };
}

const SHAPES = [
  neuralShape(),
  { lines: databaseShape(), nodes: [point(-1, 0.54), point(1, 0.54), point(-1, -0.44), point(1, -0.44)] },
  { lines: cubeShape(), nodes: [point(-0.78,-0.62), point(0.42,-0.62), point(0.42,0.55), point(-0.78,0.55)] },
  skillsShape(),
  journeyShape(),
  contactShape(),
];

function layout(isMobile) {
  if (isMobile) return [
    { x: 0, y: 2.28, scale: 0.54 },
    { x: 0, y: 0.02, scale: 0.58 },
    { x: 0, y: -2.26, scale: 0.57 },
  ];
  return [
    { x: -3.35, y: 0.4, scale: 0.78 },
    { x: 0, y: 0.4, scale: 0.86 },
    { x: 3.35, y: 0.4, scale: 0.8 },
  ];
}

function sampleEdges(shape, amount) {
  const out = [];
  const lines = shape.lines;
  for (let i = 0; i < amount; i += 1) {
    const edge = (i * 2) % lines.length;
    const a = lines[edge];
    const b = lines[edge + 1];
    const t = ((i * 0.61803398875) % 1);
    out.push(a.clone().lerp(b, t));
  }
  return out;
}

// Sample edges and also track which part each sample belongs to (for shapes with parts)
function sampleEdgesWithParts(shape, amount) {
  const out = [];
  const partIndices = [];
  const lines = shape.lines;
  const parts = shape.parts;
  for (let i = 0; i < amount; i += 1) {
    const edge = (i * 2) % lines.length;
    const a = lines[edge];
    const b = lines[edge + 1];
    const t = ((i * 0.61803398875) % 1);
    out.push(a.clone().lerp(b, t));
    // Determine which part this edge belongs to
    if (parts) {
      if (edge < parts.ring1.start) partIndices.push(0);       // diamond
      else if (edge < parts.ring2.start) partIndices.push(1);   // ring1
      else if (edge < parts.ring3.start) partIndices.push(2);   // ring2
      else partIndices.push(3);                                  // ring3
    } else {
      partIndices.push(0);
    }
  }
  return { samples: out, partIndices };
}

// Rotate a point around Y axis
function rotY(p, cos, sin) {
  return { x: p.x * cos + p.z * sin, y: p.y, z: -p.x * sin + p.z * cos };
}
// Rotate a point around X axis
function rotX(p, cos, sin) {
  return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos };
}
// Rotate a point around Z axis
function rotZ(p, cos, sin) {
  return { x: p.x * cos - p.y * sin, y: p.x * sin + p.y * cos, z: p.z };
}

function particlesAlongSegments(segments, spacing = 0.035) {
  const particles = [];
  for (let i = 0; i < segments.length; i += 2) {
    const a = segments[i];
    const b = segments[i + 1];
    const steps = Math.max(2, Math.ceil(a.distanceTo(b) / spacing));
    for (let step = 0; step <= steps; step += 1) {
      particles.push(a.clone().lerp(b, step / steps));
    }
  }
  return particles;
}

// Cached samples for the skills (hero) shape to avoid regeneration
let _skillsSamples = null;
let _skillsCount = 0;

export function createProjectTargets(count, width = innerWidth, height = innerHeight, activeIndex = 0, time = 0) {
  const isMobile = width < 700;
  const project = THREE.MathUtils.clamp(activeIndex, 0, SHAPES.length - 1);
  const postProject = project > 2;
  const place = { 
    x: 0, 
    y: postProject ? 0 : (isMobile ? 0.52 : 0.48), 
    scale: project === 3 
      ? (isMobile ? 1.25 : 1.75) 
      : (isMobile ? (postProject ? .82 : .9) : (postProject ? 1.18 : 1.28)) 
  };
  const targets = new Float32Array(count * 3);

  // For skills shape (index 3) with parts, apply independent rotation
  if (project === 3 && SHAPES[3].parts) {
    // Cache samples once
    if (!_skillsSamples || _skillsCount !== count) {
      _skillsSamples = sampleEdgesWithParts(SHAPES[3], count);
      _skillsCount = count;
    }
    const { samples, partIndices } = _skillsSamples;

    // Gyroscope rotation angles:
    // 0: Diamond -> Y-axis spin
    const a0 = 0.15 * time;
    const cos0 = Math.cos(a0), sin0 = Math.sin(a0);

    // 1: Ring 1 (Inner ring) -> X-axis gimbal rotation
    const a1 = 0.35 * time;
    const cos1 = Math.cos(a1), sin1 = Math.sin(a1);

    // 2: Ring 2 (Middle ring) -> Y-axis & tilt
    const a2 = -0.42 * time;
    const cos2 = Math.cos(a2), sin2 = Math.sin(a2);

    // 3: Ring 3 (Outer ring) -> Z-axis rolling gimbal
    const a3 = 0.28 * time;
    const cos3 = Math.cos(a3), sin3 = Math.sin(a3);

    for (let i = 0; i < count; i += 1) {
      const s = samples[i % samples.length];
      const part = partIndices[i % partIndices.length];
      let r;
      if (part === 0) {
        // Diamond rotates on Y axis
        r = rotY(s, cos0, sin0);
      } else if (part === 1) {
        // Ring 1 rotates on X axis (gimbal pitch)
        r = rotX(s, cos1, sin1);
      } else if (part === 2) {
        // Ring 2 rotates on Y axis (gimbal yaw)
        r = rotY(s, cos2, sin2);
      } else {
        // Ring 3 rotates on Z axis (gimbal roll)
        r = rotZ(s, cos3, sin3);
      }

      targets[i * 3] = place.x + r.x * place.scale + (Math.random() - 0.5) * 0.012;
      targets[i * 3 + 1] = place.y + r.y * place.scale + (Math.random() - 0.5) * 0.012;
      targets[i * 3 + 2] = r.z * place.scale + (Math.random() - 0.5) * 0.02;
    }
  } else {
    const samples = sampleEdges(SHAPES[project], count);
    for (let i = 0; i < count; i += 1) {
      const p = samples[i % samples.length];
      targets[i * 3] = place.x + p.x * place.scale + (Math.random() - 0.5) * 0.025;
      targets[i * 3 + 1] = place.y + p.y * place.scale + (Math.random() - 0.5) * 0.025;
      targets[i * 3 + 2] = p.z * place.scale + (Math.random() - 0.5) * 0.04;
    }
  }

  targets.positions = targets;
  targets.targets = targets;
  targets.points = targets;
  targets.data = targets;
  targets.array = targets;
  targets.projectTargets = targets;
  return targets;
}

function makeLabel(project) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.fillStyle = project.color;
  ctx.font = '600 25px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(`PROJECT ${project.id}`, 512, 48);
  ctx.fillStyle = '#d9f1f5';
  ctx.font = '500 44px Inter, Arial, sans-serif';
  ctx.fillText(project.title, 512, 116);
  ctx.fillStyle = 'rgba(205,231,240,.82)';
  ctx.font = '400 23px Inter, Arial, sans-serif';
  ctx.fillText(project.summary, 512, 169);
  ctx.fillStyle = 'rgba(111,223,237,.78)';
  ctx.font = '500 20px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(project.tech, 512, 220);
  ctx.fillStyle = 'rgba(115,235,248,.48)';
  for (let x = 355; x <= 669; x += 14) ctx.fillRect(x, 252, 3, 3);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 1.02), material);
  mesh.userData.texture = texture;
  return mesh;
}

function makeCardFrame(project) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  const glow = ctx.createRadialGradient(512, 420, 40, 512, 470, 500);
  glow.addColorStop(0, 'rgba(48,190,210,.10)');
  glow.addColorStop(0.55, 'rgba(7,36,48,.22)');
  glow.addColorStop(1, 'rgba(1,8,14,.58)');
  ctx.fillStyle = glow;
  ctx.fillRect(28, 28, 968, 968);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.38, 3.62), material);
  mesh.userData.texture = texture;
  return mesh;
}

function makeParticleFrame(project) {
  const x = 1.66;
  const y = 1.78;
  const segments = [
    point(-x, -y), point(x, -y),
    point(x, -y), point(x, y),
    point(x, y), point(-x, y),
    point(-x, y), point(-x, -y),
  ];
  const geometry = new THREE.BufferGeometry().setFromPoints(particlesAlongSegments(segments, 0.045));
  const material = new THREE.PointsMaterial({
    color: project.color,
    size: 0.024,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geometry, material);
}

export function createProjectConstellations(scene, isMobile = false) {
  const root = new THREE.Group();
  root.visible = false;
  scene.add(root);
  const places = layout(isMobile);
  const groups = [];
  const hitTargets = [];
  let progress = 0;
  let hovered = -1;

  PROJECTS.forEach((project, index) => {
    const place = places[index];
    const group = new THREE.Group();
    group.position.set(place.x, place.y, 0.05);
    group.scale.setScalar(place.scale);

    const geometry = new THREE.BufferGeometry().setFromPoints(particlesAlongSegments(SHAPES[index].lines, 0.02));
    const material = new THREE.PointsMaterial({
      color: project.color,
      size: 0.028,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.Points(geometry, material);
    group.add(lines);

    const nodeGeometry = new THREE.SphereGeometry(0.055, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: '#dffcff', transparent: true, opacity: 0 });
    SHAPES[index].nodes.forEach((position) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.copy(position);
      group.add(node);
    });

    const frame = makeCardFrame(project);
    frame.position.set(place.x, place.y - 0.38, -0.1);
    root.add(frame);
    const frameParticles = makeParticleFrame(project);
    frameParticles.position.set(place.x, place.y - 0.38, -0.02);
    root.add(frameParticles);
    root.add(group);
    const label = makeLabel(project);
    label.position.set(place.x, place.y - (isMobile ? 0.78 : 1.45), 0.18);
    root.add(label);

    const hit = new THREE.Mesh(
      new THREE.PlaneGeometry(isMobile ? 3.5 : 2.7, isMobile ? 1.8 : 3.1),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
    );
    hit.position.set(place.x, place.y - (isMobile ? 0.25 : 0.38), 0.2);
    hit.userData.projectIndex = index;
    root.add(hit);
    hitTargets.push(hit);
    groups.push({ group, lines, material, nodeMaterial, label, frame, frameParticles });
  });

  const setProgress = (value) => {
    progress = THREE.MathUtils.clamp(value, 0, 1);
    root.visible = progress > 0.01;
    groups.forEach((item, index) => {
      const stagger = THREE.MathUtils.smoothstep(progress, index * 0.08, 0.58 + index * 0.08);
      const focus = hovered < 0 || hovered === index ? 1 : 0.18;
      item.material.opacity = stagger * 0.62 * focus;
      item.nodeMaterial.opacity = stagger * 0.72 * focus;
      item.label.material.opacity = THREE.MathUtils.smoothstep(progress, 0.35 + index * 0.08, 0.86) * focus;
      item.frame.material.opacity = THREE.MathUtils.smoothstep(progress, 0.18 + index * 0.06, 0.72) * (hovered < 0 || hovered === index ? 0.82 : 0.18);
      item.frameParticles.material.opacity = THREE.MathUtils.smoothstep(progress, 0.18 + index * 0.06, 0.72) * focus * 0.42;
      const scale = 0.82 + stagger * 0.18 + (hovered === index ? 0.055 : 0);
      item.group.scale.setScalar(places[index].scale * scale);
    });
  };

  const update = (_progress = 0, time = 0) => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const page = window.scrollY / maxScroll;
    const boundaries = [[0.31, 0.43], [0.43, 0.54], [0.54, 0.65]];
    root.visible = page > 0.30 && page < 0.67;
    groups.forEach((item, index) => {
      const [start, end] = boundaries[index];
      const enter = THREE.MathUtils.smoothstep(page, start, start + 0.012);
      const exit = index === 2 ? 1 : 1 - THREE.MathUtils.smoothstep(page, end - 0.012, end);
      const alpha = enter * exit;
      item.group.visible = false;
      item.group.position.set(0, 0.6, 0.05);
      item.group.scale.setScalar((innerWidth < 700 ? 0.9 : 1.28) * (0.94 + alpha * 0.06));
      item.frame.position.set(0, 0.02, -0.1);
      item.frame.scale.set(innerWidth < 700 ? 1.08 : 1.56, innerWidth < 700 ? 1.1 : 1.16, 1);
      item.frameParticles.position.set(0, 0.02, -0.02);
      item.frameParticles.scale.copy(item.frame.scale);
      item.label.position.set(0, innerWidth < 700 ? -1.28 : -1.5, 0.18);
      item.label.scale.setScalar(innerWidth < 700 ? 0.92 : 1.18);
      item.material.opacity = 0;
      item.nodeMaterial.opacity = 0;
      item.label.material.opacity = alpha;
      item.frame.material.opacity = alpha * 0.76;
      item.frameParticles.material.opacity = alpha * 0.38;
      item.group.rotation.y = Math.sin(time * 0.00032 + index) * 0.14;
      item.group.rotation.x = Math.cos(time * 0.00025 + index) * 0.035;
    });
  };

  const setHovered = (index = -1) => {
    hovered = Number.isInteger(index) ? index : -1;
    setProgress(progress);
  };

  const dispose = () => {
    groups.forEach((item) => {
      item.lines.geometry.dispose();
      item.material.dispose();
      item.nodeMaterial.dispose();
      item.label.geometry.dispose();
      item.label.material.map?.dispose();
      item.label.material.dispose();
      item.frame.geometry.dispose();
      item.frame.material.map?.dispose();
      item.frame.material.dispose();
      item.frameParticles.geometry.dispose();
      item.frameParticles.material.dispose();
    });
    hitTargets.forEach((hit) => { hit.geometry.dispose(); hit.material.dispose(); });
    scene.remove(root);
  };

  const resize = () => {};
  return {
    group: root,
    root,
    hitTargets,
    setProgress: () => {},
    setHovered,
    setHover: setHovered,
    update,
    resize,
    dispose,
  };
}
