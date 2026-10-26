// Sample real letter shapes once, then reuse each particle's target on every frame.
export function createNameTargets(count, viewportWidth, viewportHeight) {
  const mobile=viewportWidth<760;
  const canvas=document.createElement('canvas');
  canvas.width=mobile?900:1800;canvas.height=mobile?600:320;
  const context=canvas.getContext('2d',{willReadFrequently:true});
  if(!context)throw new Error('Canvas text sampling is unavailable');
  context.fillStyle='#fff';context.textAlign='center';context.textBaseline='middle';
  context.font=`600 ${mobile?205:205}px "Space Grotesk", Arial, sans-serif`;
  if(mobile){context.fillText('NIRAJ',450,165);context.fillText('KUMAR',450,420);}
  else context.fillText('NIRAJ KUMAR',900,160);
  const pixels=context.getImageData(0,0,canvas.width,canvas.height).data,samples=[];
  for(let y=0;y<canvas.height;y+=2)for(let x=0;x<canvas.width;x+=2){if(pixels[(y*canvas.width+x)*4+3]>160)samples.push([x,y]);}
  if(!samples.length)throw new Error('No particle lettering could be generated');
  const viewHeight=2*7.8*Math.tan(22*Math.PI/180);
  const width=Math.min(mobile?3.5:11,viewHeight*viewportWidth/viewportHeight*.9);
  const height=width*canvas.height/canvas.width;
  const result=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const fraction=(i*.618033988749895)%1;
    const [x,y]=samples[Math.floor(fraction*samples.length)];
    result[i*3]=(x/canvas.width-.5)*width;
    result[i*3+1]=(.5-y/canvas.height)*height+viewHeight*(mobile?.145:.13);
    result[i*3+2]=Math.sin(i*12.9898)*.015;
  }
  return result;
}
