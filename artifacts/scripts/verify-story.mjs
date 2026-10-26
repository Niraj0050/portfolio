import { chromium } from '@playwright/test';
import { existsSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const executablePath=[
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find(existsSync);
const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{}),args:['--enable-unsafe-swiftshader']});
mkdirSync('artifacts',{recursive:true});
const errors=[];
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5189','--strictPort'],{windowsHide:true,stdio:['ignore','pipe','pipe']});
const url='http://127.0.0.1:5189/';
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
page.on('pageerror',error=>errors.push(error.message));
page.on('console',message=>{if(message.type()==='error'&&/THREE|GLSL|Shader|WebGL|Uncaught/.test(message.text()))errors.push(message.text());});
try{
  await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('Preview server did not start')),15000);
    server.stdout.on('data',chunk=>{if(chunk.toString().includes('Local:')){clearTimeout(timer);resolve();}});
    server.on('error',error=>{clearTimeout(timer);reject(error);});
    server.on('exit',code=>{if(code){clearTimeout(timer);reject(new Error(`Preview server exited ${code}`));}});
  });
  await page.goto(url,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('.status')?.textContent.includes('Awaiting connection'),{},{timeout:30000});
  assert.equal(await page.locator('canvas').count(),1);
  await page.screenshot({path:'artifacts/story-desktop-universe.png'});
  await page.evaluate(()=>window.scrollTo(0,(document.querySelector('main').offsetHeight-innerHeight)*.23));
  await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('main')).getPropertyValue('--story-progress'))>.22);
  await page.mouse.move(720,450);
  await page.waitForFunction(()=>document.querySelector('.status')?.textContent.includes('Connection established'));
  await page.waitForTimeout(700);
  await page.screenshot({path:'artifacts/story-desktop-transition.png'});
  await page.evaluate(()=>window.scrollTo(0,(document.querySelector('main').offsetHeight-innerHeight)*.46));
  await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('main')).getPropertyValue('--about-opacity'))>.99);
  assert.equal(await page.getByRole('heading',{name:'Full Stack Web Developer',exact:true}).isVisible(),true);
  assert.equal(await page.locator('canvas').count(),1,'all visible scene content uses one WebGL canvas');
  assert.ok(await page.locator('.about-accessibility').evaluate(el=>el.getBoundingClientRect().width<=1),'HTML about copy is only a screen-reader alternative');
  await page.screenshot({path:'artifacts/story-desktop-about.png'});
  await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  await page.waitForFunction(()=>document.querySelector('.live')?.textContent.includes('03 / SELECTED WORK'));
  await page.mouse.move(720,450);
  await page.waitForFunction(()=>!/Awaiting connection/.test(document.querySelector('.status')?.textContent||''));
  await page.waitForTimeout(700);
  await page.screenshot({path:'artifacts/story-desktop-projects.png'});
  await page.getByRole('button',{name:'Return to the universe'}).click();
  await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('main')).getPropertyValue('--story-progress'))<.001,{},{timeout:15000});
  await page.mouse.move(720,450);
  await page.waitForFunction(()=>document.querySelector('.status')?.textContent.includes('Connection established'));
  await page.mouse.click(720,450);await page.mouse.click(750,450);
  await page.waitForFunction(()=>document.querySelector('.status')?.textContent.includes('Energy travelling'));
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const [width,height] of [[390,844],[320,640]]){
    await page.setViewportSize({width,height});await page.reload({waitUntil:'networkidle'});
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('main')).getPropertyValue('--story-progress'))<.001);
    assert.equal(await page.locator('canvas').evaluate(el=>getComputedStyle(el).touchAction),'pan-y');
    await page.getByRole('button',{name:'SCROLL TO DISCOVER ME'}).click();
    await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('main')).getPropertyValue('--about-opacity'))>.99);
    const fits=await page.evaluate(()=>{const canvas=document.querySelector('canvas').getBoundingClientRect();return canvas.left>=0&&canvas.right<=innerWidth&&document.documentElement.scrollWidth<=innerWidth&&document.querySelectorAll('canvas').length===1;});
    assert.ok(fits,`About content fits ${width}px viewport`);
    await page.screenshot({path:`artifacts/story-mobile-about-${width}.png`});
    await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
    await page.waitForFunction(()=>document.querySelector('.live')?.textContent.includes('03 / SELECTED WORK'));
    await page.waitForTimeout(500);
    await page.screenshot({path:`artifacts/story-mobile-projects-${width}.png`});
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: desktop morph, about reveal, reverse scroll, sphere interaction, mobile 390/320 layouts, reduced motion, no WebGL errors.');
}finally{await browser.close();server.kill();}
