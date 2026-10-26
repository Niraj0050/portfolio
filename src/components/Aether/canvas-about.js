import * as THREE from 'three';

// This text is a texture in the same WebGL scene as the sphere and particle name.
// An offscreen canvas only rasterizes glyphs; no second canvas is added to the page.
export function createCanvasAbout(scene,camera){
  const canvas=document.createElement('canvas');
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.generateMipmaps=false;
  texture.minFilter=THREE.LinearFilter;
  const geometry=new THREE.PlaneGeometry(1,1);
  const material=new THREE.MeshBasicMaterial({map:texture,color:new THREE.Color(.7,.7,.7),transparent:true,opacity:0,depthTest:false,depthWrite:false});
  const mesh=new THREE.Mesh(geometry,material);mesh.renderOrder=10;mesh.visible=false;scene.add(mesh);
  let viewportWidth=1,viewportHeight=1;
  function resize(width,height){
    viewportWidth=width;viewportHeight=height;
    const mobile=width<760,short=height<650;
    const cssWidth=Math.min(640,width*.86),cssHeight=240,ratio=2;
    canvas.width=Math.ceil(cssWidth*ratio);canvas.height=cssHeight*ratio;
    const ctx=canvas.getContext('2d');ctx.scale(ratio,ratio);ctx.textAlign='center';ctx.textBaseline='top';
    const center=cssWidth/2;
    let y=0;
    function tracked(text,size,spacing,color){
      ctx.font=`500 ${size}px "DM Sans", Arial, sans-serif`;ctx.fillStyle=color;
      const lengths=[...text].map(char=>ctx.measureText(char).width);
      let x=(cssWidth-lengths.reduce((a,b)=>a+b,0)-spacing*(text.length-1))/2;
      ctx.textAlign='left';[...text].forEach((char,i)=>{ctx.fillText(char,x,y);x+=lengths[i]+spacing;});ctx.textAlign='center';
    }
    if(!short){tracked('THE PERSON BEHIND THE PARTICLES',mobile?8:9,mobile?1.6:2.5,'#7fc5ce');y+=mobile?28:36;}
    let titleSize=short?24:mobile?25:Math.min(40,Math.max(24,width*.03));
    const title='Full Stack Web Developer';
    do{ctx.font=`400 ${titleSize}px "Space Grotesk", Arial, sans-serif`;if(ctx.measureText(title).width<=cssWidth)break;titleSize-=.5;}while(titleSize>18);
    ctx.fillStyle='#eaf6f9';ctx.fillText(title,center,y);y+=titleSize+(short?16:mobile?22:28);
    const bodySize=short?12:mobile?13:15,lineHeight=bodySize*(short?1.65:1.85),maxWidth=Math.min(cssWidth,490);
    ctx.font=`400 ${bodySize}px "DM Sans", Arial, sans-serif`;ctx.fillStyle='#a2b5c2';
    const words='I build modern web experiences—from responsive interfaces to robust backend systems.'.split(' ');
    let line='';
    for(const word of words){const next=line?`${line} ${word}`:word;if(line&&ctx.measureText(next).width>maxWidth){ctx.fillText(line,center,y);y+=lineHeight;line=word;}else line=next;}
    ctx.fillText(line,center,y);y+=lineHeight+(short?16:mobile?22:28);
    const skills=['React','PHP','JavaScript','Python','MySQL'];
    ctx.font=`500 ${mobile?9:10}px "DM Sans", Arial, sans-serif`;ctx.fillStyle='#bcd5dc';
    const gap=mobile?16:22,skillWidth=skills.reduce((sum,skill)=>sum+ctx.measureText(skill).width,0)+gap*(skills.length-1);
    let x=(cssWidth-skillWidth)/2;ctx.textAlign='left';
    for(const skill of skills){ctx.fillText(skill,x,y);x+=ctx.measureText(skill).width+gap;}
    texture.needsUpdate=true;
    const z=.1,worldHeight=2*(camera.position.z-z)*Math.tan(THREE.MathUtils.degToRad(camera.fov*.5));
    const top=height*(short?.52:mobile?.54:.53);
    mesh.scale.set(cssWidth/height*worldHeight,cssHeight/height*worldHeight,1);
    mesh.position.set(0,worldHeight*(.5-top/height)-mesh.scale.y/2,z);
  }
  return {resize,refresh(){resize(viewportWidth,viewportHeight);},update(progress,projects=0){const opacity=THREE.MathUtils.smoothstep(progress,.78,.96)*(1-THREE.MathUtils.smoothstep(projects,.05,.55));material.opacity=opacity;mesh.visible=opacity>.001;},dispose(){geometry.dispose();material.dispose();texture.dispose();scene.remove(mesh);}};
}
