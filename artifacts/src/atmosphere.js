import * as THREE from 'three';

// Layered density fields give the background depth without flat image textures.
export function createAtmosphere(scene) {
  const geometry=new THREE.PlaneGeometry(100,65);
  const material=new THREE.ShaderMaterial({
    depthWrite:false,depthTest:false,
    uniforms:{time:{value:0},focus:{value:new THREE.Vector3(0,0,.6)},aspect:{value:1},story:{value:0}},
    vertexShader:'varying vec2 st;varying vec4 clipPosition;void main(){st=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);clipPosition=gl_Position;}',
    fragmentShader:`
      varying vec2 st;varying vec4 clipPosition;uniform float time;uniform vec3 focus;uniform float aspect;uniform float story;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;mat2 rot=mat2(.8,-.6,.6,.8);
        for(int i=0;i<5;i++){v+=a*noise(p);p=rot*p*2.07+17.3;a*=.5;}return v;}
      void main(){
        vec2 p=(st-.5)*vec2(5.,3.25);
        vec2 q=vec2(fbm(p*1.3),fbm(p*1.3+vec2(8.1,2.7)));
        float clouds=fbm(p*2.1+q*3.+vec2(time*.001,0.));
        float band=exp(-pow((p.y+p.x*.38+.2)*1.8,2.));
        float density=smoothstep(.25,.85,clouds)*band;
        float filaments=pow(fbm(p*7.+q*4.),3.)*band;
        float dust=smoothstep(.42,.68,fbm(p*3.8+q*2.));
        vec3 gas=mix(vec3(.018,.033,.065),vec3(.035,.085,.105),q.x);
        vec3 color=vec3(.0015,.0025,.006)+gas*density*.8+vec3(.025,.045,.065)*filaments;
        color*=1.-dust*.65;
        vec2 screen=clipPosition.xy/clipPosition.w;
        float distanceToSphere=length((screen-focus.xy)*vec2(aspect,1.));
        color*=mix(.2,.72,smoothstep(focus.z*.6,focus.z*1.5,distanceToSphere));
        color=mix(color,vec3(.001,.002,.0045),smoothstep(.08,.85,story)*.94);
        gl_FragColor=vec4(color,1.);
      }`
  });
  const mesh=new THREE.Mesh(geometry,material);mesh.position.z=-35;mesh.renderOrder=-10;scene.add(mesh);
  return {update(time,focus,aspect,story=0){material.uniforms.time.value=time;material.uniforms.focus.value.copy(focus);material.uniforms.aspect.value=aspect;material.uniforms.story.value=story;},dispose(){geometry.dispose();material.dispose();}};
}
