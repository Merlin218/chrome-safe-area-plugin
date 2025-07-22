(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();try{}catch(r){console.error("[wxt] Failed to initialize plugins",r)}const c={none:{name:"None (Default)",safeAreaInsets:{top:0,bottom:0,left:0,right:0},appearance:{width:0,height:0,screenWidth:0,screenHeight:0,borderRadius:0,screenRadius:0,notch:{type:"none"},homeIndicator:null,colors:[],brand:"custom",show:!1}},iphone14:{name:"iPhone 14",safeAreaInsets:{top:47,bottom:34,left:0,right:0},appearance:{width:146.7,height:284,screenWidth:390,screenHeight:844,borderRadius:20,screenRadius:16,notch:{type:"dynamic-island",width:30,height:8,radius:4},homeIndicator:{width:36,height:2,radius:1},colors:["#1f1f1f","#2d2d2d","#3a3a3a"],brand:"apple"}},iphone14Pro:{name:"iPhone 14 Pro",safeAreaInsets:{top:59,bottom:34,left:0,right:0},appearance:{width:147.5,height:285,screenWidth:393,screenHeight:852,borderRadius:20,screenRadius:16,notch:{type:"dynamic-island",width:32,height:8,radius:4,color:"#000000",shadow:!0,borderRadius:"4px"},homeIndicator:{width:36,height:2,radius:1},colors:["#2c2c2e","#3a3a3c","#48484a"],brand:"apple",frameImage:{light:"iphone14-pro-light.png",dark:"iphone14-pro-dark.png",hasDynamicIsland:!0,hasHomeIndicator:!0,screenOffset:{x:8.25,y:12,width:131,height:261}},hardwareRegions:[{type:"dynamic-island",position:{x:133,y:10,width:126,height:30},style:{backgroundColor:"#000000",borderRadius:"15px",boxShadow:"inset 0 1px 3px rgba(255,255,255,0.1), 0 1px 6px rgba(0,0,0,0.4)",opacity:.98,zIndex:1000001},content:{type:"sensors",elements:[{type:"circle",x:35,y:15,radius:5,color:"#1a1a1a"},{type:"circle",x:55,y:15,radius:3,color:"#2a2a2a"},{type:"rect",x:70,y:12,width:20,height:6,color:"#333333"}]}},{type:"status-bar",position:{x:8,y:5,width:50,height:20},style:{opacity:0,zIndex:1e6},content:{elements:[{type:"circle",x:10,y:10,radius:2,color:"#ffffff"},{type:"circle",x:18,y:10,radius:2,color:"#ffffff"},{type:"circle",x:26,y:10,radius:2,color:"#ffffff"}]}},{type:"status-bar",position:{x:190,y:5,width:50,height:20},style:{opacity:0,zIndex:1e6},content:{elements:[{type:"rect",x:25,y:8,width:20,height:10,color:"rgba(255,255,255,0.8)"}]}},{type:"home-indicator",position:{x:0,y:0,width:134,height:5},style:{backgroundColor:"rgba(255, 255, 255, 0.6)",borderRadius:"2.5px",opacity:.8,zIndex:1000001}}]}},iphone14ProMax:{name:"iPhone 14 Pro Max",safeAreaInsets:{top:59,bottom:34,left:0,right:0},appearance:{width:160.7,height:310,screenWidth:430,screenHeight:932,borderRadius:22,screenRadius:18,notch:{type:"dynamic-island",width:34,height:8,radius:4},homeIndicator:{width:40,height:2,radius:1},colors:["#2c2c2e","#3a3a3c","#48484a"],brand:"apple"}},iphoneX:{name:"iPhone X/XS",safeAreaInsets:{top:44,bottom:34,left:0,right:0},appearance:{width:143.6,height:280,screenWidth:127,screenHeight:256,borderRadius:18,screenRadius:14,notch:{type:"notch",width:40,height:8,radius:4},homeIndicator:{width:36,height:2,radius:1},colors:["#1f1f1f","#2d2d2d","#3a3a3a"],brand:"apple"}},iphoneXR:{name:"iPhone XR/11",safeAreaInsets:{top:48,bottom:34,left:0,right:0},appearance:{width:150.9,height:290,screenWidth:134,screenHeight:266,borderRadius:20,screenRadius:16,notch:{type:"notch",width:42,height:8,radius:4},homeIndicator:{width:38,height:2,radius:1},colors:["#ff6b6b","#ff8e8e","#ffb3b3"],brand:"apple"}},iphone12:{name:"iPhone 12/12 Pro",safeAreaInsets:{top:47,bottom:34,left:0,right:0},appearance:{width:146.7,height:284,screenWidth:390,screenHeight:844,borderRadius:19,screenRadius:15,notch:{type:"notch",width:38,height:8,radius:4},homeIndicator:{width:36,height:2,radius:1},colors:["#4a90e2","#5ba0f2","#6cb0ff"],brand:"apple"}},iphone12Mini:{name:"iPhone 12 Mini",safeAreaInsets:{top:50,bottom:34,left:0,right:0},appearance:{width:131.5,height:255,screenWidth:375,screenHeight:812,borderRadius:17,screenRadius:13,notch:{type:"notch",width:34,height:7,radius:3},homeIndicator:{width:32,height:2,radius:1},colors:["#50e3c2","#70f3d2","#90ffe2"],brand:"apple"}},iphone12ProMax:{name:"iPhone 12 Pro Max",safeAreaInsets:{top:47,bottom:34,left:0,right:0},appearance:{width:160.8,height:310,screenWidth:428,screenHeight:926,borderRadius:22,screenRadius:18,notch:{type:"notch",width:42,height:8,radius:4},homeIndicator:{width:40,height:2,radius:1},colors:["#c9b037","#d4c547","#dfda57"],brand:"apple"}},iphone13:{name:"iPhone 13",safeAreaInsets:{top:47,bottom:34,left:0,right:0},appearance:{width:146.7,height:284,screenWidth:390,screenHeight:844,borderRadius:19,screenRadius:15,notch:{type:"small-notch",width:32,height:6,radius:3},homeIndicator:{width:36,height:2,radius:1},colors:["#ffc0cb","#ffd0db","#ffe0eb"],brand:"apple"}},iphone13Mini:{name:"iPhone 13 Mini",safeAreaInsets:{top:50,bottom:34,left:0,right:0},appearance:{width:131.5,height:255,screenWidth:375,screenHeight:812,borderRadius:17,screenRadius:13,notch:{type:"small-notch",width:28,height:6,radius:3},homeIndicator:{width:32,height:2,radius:1},colors:["#4169e1","#5179f1","#6189ff"],brand:"apple"}},iphone13Pro:{name:"iPhone 13 Pro",safeAreaInsets:{top:47,bottom:34,left:0,right:0},appearance:{width:147.5,height:285,screenWidth:390,screenHeight:844,borderRadius:20,screenRadius:16,notch:{type:"small-notch",width:32,height:6,radius:3},homeIndicator:{width:36,height:2,radius:1},colors:["#2c2c2e","#3a3a3c","#48484a"],brand:"apple"}},iphone13ProMax:{name:"iPhone 13 Pro Max",safeAreaInsets:{top:47,bottom:34,left:0,right:0},appearance:{width:160.8,height:310,screenWidth:428,screenHeight:926,borderRadius:22,screenRadius:18,notch:{type:"small-notch",width:34,height:6,radius:3},homeIndicator:{width:40,height:2,radius:1},colors:["#a7c0cd","#b7d0dd","#c7e0ed"],brand:"apple"}},iphone15:{name:"iPhone 15",safeAreaInsets:{top:59,bottom:34,left:0,right:0},appearance:{width:147.6,height:285,screenWidth:390,screenHeight:844,borderRadius:20,screenRadius:16,notch:{type:"dynamic-island",width:30,height:8,radius:4},homeIndicator:{width:36,height:2,radius:1},colors:["#ffb3d9","#ffc3e3","#ffd3ed"],brand:"apple"}},iphone15Pro:{name:"iPhone 15 Pro",safeAreaInsets:{top:59,bottom:34,left:0,right:0},appearance:{width:146.6,height:284,screenWidth:393,screenHeight:852,borderRadius:20,screenRadius:16,notch:{type:"dynamic-island",width:32,height:8,radius:4},homeIndicator:{width:36,height:2,radius:1},colors:["#d4af37","#e4bf47","#f4cf57"],brand:"apple"}},iphone15ProMax:{name:"iPhone 15 Pro Max",safeAreaInsets:{top:59,bottom:34,left:0,right:0},appearance:{width:159.9,height:309,screenWidth:430,screenHeight:932,borderRadius:22,screenRadius:18,notch:{type:"dynamic-island",width:34,height:8,radius:4},homeIndicator:{width:40,height:2,radius:1},colors:["#708090","#8090a0","#90a0b0"],brand:"apple",frameImage:{light:"iphone15-promax-light.png",dark:"iphone15-promax-dark.png",hasDynamicIsland:!0,hasHomeIndicator:!0,screenOffset:{x:8.5,y:12,width:143,height:285}}}},pixelXL:{name:"Google Pixel XL",safeAreaInsets:{top:24,bottom:0,left:0,right:0},appearance:{width:154.7,height:295,screenWidth:138,screenHeight:271,borderRadius:8,screenRadius:4,notch:{type:"none"},homeIndicator:null,colors:["#34495e","#4a6275","#607a8c"],brand:"google"}},pixel3XL:{name:"Google Pixel 3 XL",safeAreaInsets:{top:28,bottom:0,left:0,right:0},appearance:{width:158,height:300,screenWidth:142,screenHeight:276,borderRadius:12,screenRadius:8,notch:{type:"notch",width:36,height:6,radius:3},homeIndicator:null,colors:["#1a1a1a","#2a2a2a","#3a3a3a"],brand:"google"}},pixel4:{name:"Google Pixel 4",safeAreaInsets:{top:28,bottom:0,left:0,right:0},appearance:{width:147.1,height:280,screenWidth:131,screenHeight:256,borderRadius:10,screenRadius:6,notch:{type:"forehead",width:131,height:6,radius:0},homeIndicator:null,colors:["#ffffff","#f5f5f5","#ebebeb"],brand:"google"}},samsungS21:{name:"Samsung Galaxy S21",safeAreaInsets:{top:28,bottom:0,left:0,right:0},appearance:{width:151.7,height:290,screenWidth:135,screenHeight:266,borderRadius:16,screenRadius:12,notch:{type:"punch-hole",width:8,height:8,radius:4,position:"center-top"},homeIndicator:null,colors:["#9b59b6","#ae6fc6","#c185d6"],brand:"samsung"}},samsungS22:{name:"Samsung Galaxy S22",safeAreaInsets:{top:32,bottom:0,left:0,right:0},appearance:{width:146,height:285,screenWidth:360,screenHeight:780,borderRadius:16,screenRadius:12,notch:{type:"punch-hole",width:8,height:8,radius:4,position:"center-top",color:"#000000",shadow:!0},homeIndicator:null,colors:["#2ecc71","#4ed681","#6ee091"],brand:"samsung",frameImage:{light:"samsung-s22-light.png",dark:"samsung-s22-dark.png",hasDynamicIsland:!1,hasHomeIndicator:!1,screenOffset:{x:8,y:12,width:130,height:261}},hardwareRegions:[{type:"camera-cutout",position:{x:168,y:15,width:24,height:24},style:{backgroundColor:"#000000",borderRadius:"50%",boxShadow:"0 0 8px rgba(0,0,0,0.6), inset 0 1px 3px rgba(255,255,255,0.1)",opacity:.98,zIndex:1000001},content:{type:"camera",elements:[{type:"circle",x:12,y:12,radius:8,color:"#1a1a1a"},{type:"circle",x:12,y:12,radius:4,color:"#333333"}]}},{type:"status-bar",position:{x:8,y:5,width:110,height:20},style:{opacity:0,zIndex:1e6},content:{elements:[{type:"circle",x:10,y:10,radius:2,color:"#ffffff"},{type:"circle",x:18,y:10,radius:2,color:"#ffffff"},{type:"circle",x:26,y:10,radius:2,color:"#ffffff"}]}},{type:"status-bar",position:{x:150,y:5,width:80,height:20},style:{opacity:0,zIndex:1e6},content:{elements:[{type:"rect",x:50,y:8,width:20,height:10,color:"rgba(255,255,255,0.8)"}]}},{type:"navigation-bar",position:{x:0,y:0,width:130,height:48},style:{backgroundColor:"rgba(0, 0, 0, 0.1)",opacity:.6,zIndex:1e6},content:{elements:[{type:"circle",x:32,y:24,radius:6,color:"rgba(255,255,255,0.7)"},{type:"circle",x:65,y:24,radius:8,color:"rgba(255,255,255,0.7)"},{type:"rect",x:90,y:20,width:16,height:8,color:"rgba(255,255,255,0.7)"}]}}]}},iphone14Landscape:{name:"iPhone 14 (Landscape)",safeAreaInsets:{top:0,bottom:21,left:47,right:47},appearance:{width:284,height:146.7,screenWidth:260,screenHeight:130,borderRadius:20,screenRadius:16,notch:{type:"dynamic-island",width:8,height:30,radius:4,position:"left"},homeIndicator:{width:2,height:36,radius:1,position:"bottom"},colors:["#1f1f1f","#2d2d2d","#3a3a3a"],brand:"apple",orientation:"landscape"}},iphone14ProLandscape:{name:"iPhone 14 Pro (Landscape)",safeAreaInsets:{top:0,bottom:21,left:59,right:59},appearance:{width:285,height:147.5,screenWidth:261,screenHeight:131,borderRadius:20,screenRadius:16,notch:{type:"dynamic-island",width:8,height:32,radius:4,position:"left"},homeIndicator:{width:2,height:36,radius:1,position:"bottom"},colors:["#2c2c2e","#3a3a3c","#48484a"],brand:"apple",orientation:"landscape"}}};function g(r){return r?!r.startsWith("chrome://")&&!r.startsWith("chrome-extension://")&&!r.startsWith("moz-extension://"):!1}class p{constructor(e,t={}){this.currentDevice=null,this.mockupElement=null,this.container=e,this.options={scale:.4,showSafeArea:!0,showContent:!0,...t},this.init()}init(){this.createMockupContainer()}createMockupContainer(){this.mockupElement=document.createElement("div"),this.mockupElement.className="phone-mockup",this.mockupElement.style.cssText=`
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px auto;
      transform-origin: center;
    `,this.container.appendChild(this.mockupElement)}updateDevice(e,t){const o=c[e];if(!o||!o.appearance){this.showPlaceholder();return}this.currentDevice=o,this.renderPhone(t)}showPlaceholder(){this.mockupElement&&(this.mockupElement.innerHTML=`
      <div style="
        width: 120px;
        height: 200px;
        background: linear-gradient(145deg, #f0f0f0, #d0d0d0);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 12px;
        text-align: center;
        border: 2px solid #e0e0e0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      ">
        Select Device<br>to Preview
      </div>
    `)}renderPhone(e){if(!this.currentDevice||!this.mockupElement)return;const{appearance:t}=this.currentDevice,o=this.options.scale,i=t.width*o,n=t.height*o,s=t.screenWidth*o,a=t.screenHeight*o,h=this.createGradient(t.colors);this.mockupElement.innerHTML=`
      <div class="phone-container" style="
        position: relative;
        width: ${i}px;
        height: ${n}px;
        background: ${h};
        border-radius: ${t.borderRadius*o}px;
        box-shadow: 
          0 8px 32px rgba(0,0,0,0.3),
          0 4px 16px rgba(0,0,0,0.2),
          inset 0 1px 2px rgba(255,255,255,0.1);
        padding: ${(t.width-t.screenWidth)*o/2}px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        ${this.renderNotchOrCutout(t,o)}
        
        <div class="phone-screen" style="
          position: relative;
          width: ${s}px;
          height: ${a}px;
          background: #000;
          border-radius: ${t.screenRadius*o}px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        ">
          ${this.renderSafeAreas(e,s,a,o)}
          ${this.renderContent(s,a)}
        </div>
        
        ${this.renderHomeIndicator(t,o)}
        ${this.renderBrandElements(t,o)}
      </div>
    `}createGradient(e){return!e||!Array.isArray(e)||e.length===0?"#667eea":e.length===1?e[0]||"#667eea":`linear-gradient(145deg, ${e.join(", ")})`}renderNotchOrCutout(e,t){if(!e.notch||e.notch.type==="none")return"";const{notch:o}=e,i=(o.width||30)*t,n=(o.height||8)*t,s=(o.radius||4)*t;let a=`
      position: absolute;
      background: #000;
      z-index: 10;
    `;switch(o.type){case"notch":a+=`
          width: ${i}px;
          height: ${n}px;
          border-radius: 0 0 ${s}px ${s}px;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        `;break;case"dynamic-island":a+=`
          width: ${i}px;
          height: ${n}px;
          border-radius: ${s}px;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a1a;
          border: 1px solid #333;
        `;break;case"small-notch":a+=`
          width: ${i}px;
          height: ${n}px;
          border-radius: 0 0 ${s}px ${s}px;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        `;break;case"punch-hole":(o.position||"center-top")==="center-top"&&(a+=`
            width: ${i}px;
            height: ${n}px;
            border-radius: 50%;
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
          `);break;case"forehead":a+=`
          width: 100%;
          height: ${n}px;
          top: 0;
          left: 0;
          border-radius: 0;
        `;break}return`<div class="phone-notch" style="${a}"></div>`}renderSafeAreas(e,t,o,i){if(!this.options.showSafeArea)return"";let n="";return e.top>0&&(n+=`
        <div class="safe-area-top" style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: ${e.top*i}px;
          background: rgba(255, 59, 48, 0.3);
          border-bottom: 1px solid rgba(255, 59, 48, 0.6);
          z-index: 5;
        "></div>
      `),e.bottom>0&&(n+=`
        <div class="safe-area-bottom" style="
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: ${e.bottom*i}px;
          background: rgba(255, 59, 48, 0.3);
          border-top: 1px solid rgba(255, 59, 48, 0.6);
          z-index: 5;
        "></div>
      `),e.left>0&&(n+=`
        <div class="safe-area-left" style="
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: ${e.left*i}px;
          background: rgba(255, 59, 48, 0.3);
          border-right: 1px solid rgba(255, 59, 48, 0.6);
          z-index: 5;
        "></div>
      `),e.right>0&&(n+=`
        <div class="safe-area-right" style="
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          width: ${e.right*i}px;
          background: rgba(255, 59, 48, 0.3);
          border-left: 1px solid rgba(255, 59, 48, 0.6);
          z-index: 5;
        "></div>
      `),n}renderContent(e,t){return this.options.showContent?`
      <div class="phone-content" style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        text-align: center;
        font-size: 10px;
        opacity: 0.7;
        pointer-events: none;
        z-index: 3;
      ">
        <div style="margin-bottom: 8px;">📱 Safe Area</div>
        <div style="font-size: 8px; opacity: 0.8;">Preview</div>
      </div>
    `:""}renderHomeIndicator(e,t){if(!e.homeIndicator)return"";const{homeIndicator:o}=e,i=o.position||"bottom";let n=`
      position: absolute;
      background: rgba(255, 255, 255, 0.8);
      border-radius: ${o.radius*t}px;
    `;return i==="bottom"&&(n+=`
        width: ${o.width*t}px;
        height: ${o.height*t}px;
        bottom: 6px;
        left: 50%;
        transform: translateX(-50%);
      `),`<div class="home-indicator" style="${n}"></div>`}renderBrandElements(e,t){let o="";switch(e.brand){case"apple":o+=`
          <div class="brand-element apple-logo" style="
            position: absolute;
            top: 50%;
            left: ${e.width*t/2-6}px;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            opacity: 0.3;
          "></div>
        `;break;case"samsung":o+=`
          <div class="brand-element samsung-logo" style="
            position: absolute;
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 6px;
            color: rgba(255,255,255,0.2);
            opacity: 0.5;
          ">SAMSUNG</div>
        `;break;case"google":o+=`
          <div class="brand-element google-logo" style="
            position: absolute;
            bottom: 4px;
            right: 8px;
            font-size: 6px;
            color: rgba(255,255,255,0.2);
            opacity: 0.5;
          ">G</div>
        `;break}return o}setOptions(e){this.options={...this.options,...e},this.currentDevice&&this.renderPhone({top:0,bottom:0,left:0,right:0})}}class u{constructor(){this.currentDevice="none",this.isEnabled=!1,this.customInsets={top:0,bottom:0,left:0,right:0},this.phoneMockup=null,this.mockupOptions={showSafeArea:!0,showContent:!0},this.showDeviceFrame=!1,this.showHardwareRegions=!0,this.init()}async init(){await this.loadState(),this.initPhoneMockup(),this.bindEvents(),this.updateUI(),this.updatePreview()}async loadState(){try{const e=await chrome.storage.sync.get(["device","enabled","customInsets","mockupOptions","showDeviceFrame","showHardwareRegions"]);this.currentDevice=e.device||"none",this.isEnabled=e.enabled||!1,this.customInsets=e.customInsets||{top:0,bottom:0,left:0,right:0},this.mockupOptions=e.mockupOptions||{showSafeArea:!0,showContent:!0},this.showDeviceFrame=e.showDeviceFrame||!1,this.showHardwareRegions=e.showHardwareRegions!==!1}catch(e){console.error("Error loading state:",e)}}async saveState(){try{await chrome.storage.sync.set({device:this.currentDevice,enabled:this.isEnabled,customInsets:this.customInsets,mockupOptions:this.mockupOptions,showDeviceFrame:this.showDeviceFrame,showHardwareRegions:this.showHardwareRegions})}catch(e){console.error("Error saving state:",e)}}initPhoneMockup(){try{const e=document.getElementById("phoneMockupContainer");if(!e){console.error("[Safe Area Simulator] Phone mockup container not found");return}if(typeof p>"u"){console.error("[Safe Area Simulator] PhoneMockup class not available");return}this.phoneMockup=new p(e,{scale:.5,showSafeArea:this.mockupOptions.showSafeArea,showContent:this.mockupOptions.showContent})}catch(e){console.error("[Safe Area Simulator] Error initializing phone mockup:",e)}}bindEvents(){const e=document.getElementById("enablePlugin");e&&e.addEventListener("change",this.handleToggle.bind(this));const t=document.getElementById("deviceSelect");t&&t.addEventListener("change",this.handleDeviceChange.bind(this)),["customTop","customBottom","customLeft","customRight"].forEach(l=>{const d=document.getElementById(l);d&&d.addEventListener("input",this.handleCustomInput.bind(this))});const i=document.getElementById("applyCustom");i&&i.addEventListener("click",this.handleApplyCustom.bind(this));const n=document.getElementById("toggleSafeArea"),s=document.getElementById("toggleContent"),a=document.getElementById("toggleDeviceFrame"),h=document.getElementById("toggleHardwareRegions");n&&n.addEventListener("click",this.handleToggleSafeArea.bind(this)),s&&s.addEventListener("click",this.handleToggleContent.bind(this)),a&&a.addEventListener("click",this.handleToggleDeviceFrame.bind(this)),h&&h.addEventListener("click",this.handleToggleHardwareRegions.bind(this)),this.updateMockupControls()}async handleToggle(e){const t=e.target;this.isEnabled=t.checked,await this.saveState(),this.updateUI(),this.updatePhoneMockup(),this.sendMessageToContentScript()}async handleDeviceChange(e){const t=e.target;this.currentDevice=t.value,await this.saveState(),this.updatePreview(),this.updatePhoneMockup(),this.isEnabled&&this.sendMessageToContentScript()}handleCustomInput(e){const t=e.target,o=t.id.replace("custom","").toLowerCase();this.customInsets[o]=parseInt(t.value)||0}async handleApplyCustom(){const e={name:"Custom",safeAreaInsets:{...this.customInsets},appearance:{width:146.7,height:284,screenWidth:130,screenHeight:260,borderRadius:20,screenRadius:16,notch:{type:"none"},homeIndicator:{width:36,height:2,radius:1},colors:["#667eea","#764ba2","#8b7bc7"],brand:"custom"}};c.custom=e,this.currentDevice="custom";const t=document.getElementById("deviceSelect");let o=t.querySelector('option[value="custom"]');o||(o=document.createElement("option"),o.value="custom",o.textContent="Custom",t.appendChild(o)),t.value="custom",await this.saveState(),this.updatePreview(),this.updatePhoneMockup(),this.isEnabled&&this.sendMessageToContentScript()}async handleToggleSafeArea(){this.mockupOptions.showSafeArea=!this.mockupOptions.showSafeArea,await this.saveState(),this.updateMockupControls(),this.phoneMockup&&(this.phoneMockup.setOptions({showSafeArea:this.mockupOptions.showSafeArea}),this.updatePhoneMockup())}async handleToggleContent(){this.mockupOptions.showContent=!this.mockupOptions.showContent,await this.saveState(),this.updateMockupControls(),this.phoneMockup&&(this.phoneMockup.setOptions({showContent:this.mockupOptions.showContent}),this.updatePhoneMockup())}async handleToggleDeviceFrame(){this.showDeviceFrame=!this.showDeviceFrame,await this.saveState(),this.updateMockupControls(),this.sendMessageToContentScript()}async handleToggleHardwareRegions(){this.showHardwareRegions=!this.showHardwareRegions,await this.saveState(),this.updateMockupControls(),this.sendMessageToContentScript()}updateMockupControls(){const e=document.getElementById("toggleSafeArea"),t=document.getElementById("toggleContent"),o=document.getElementById("toggleDeviceFrame"),i=document.getElementById("toggleHardwareRegions");e&&(e.classList.toggle("active",this.mockupOptions.showSafeArea),e.title=this.mockupOptions.showSafeArea?"Hide Safe Area":"Show Safe Area"),t&&(t.classList.toggle("active",this.mockupOptions.showContent),t.title=this.mockupOptions.showContent?"Hide Content":"Show Content"),o&&(o.classList.toggle("active",this.showDeviceFrame),o.title=this.showDeviceFrame?"Hide Device Frame":"Show Device Frame"),i&&(i.classList.toggle("active",this.showHardwareRegions),i.title=this.showHardwareRegions?"Hide Hardware Regions":"Show Hardware Regions")}updateUI(){const e=document.getElementById("enablePlugin"),t=document.querySelector(".popup-content"),o=document.getElementById("deviceSelect");e.checked=this.isEnabled,o.value=this.currentDevice,this.isEnabled?(t.classList.remove("disabled"),o.disabled=!1):(t.classList.add("disabled"),o.disabled=!0)}updatePreview(){const e=c[this.currentDevice];if(!e)return;const{safeAreaInsets:t}=e,o=document.getElementById("topValue"),i=document.getElementById("bottomValue"),n=document.getElementById("leftValue"),s=document.getElementById("rightValue");if(o.textContent=`${t.top}px`,i.textContent=`${t.bottom}px`,n.textContent=`${t.left}px`,s.textContent=`${t.right}px`,this.currentDevice==="custom"){const a=document.getElementById("customTop"),h=document.getElementById("customBottom"),l=document.getElementById("customLeft"),d=document.getElementById("customRight");a.value=t.top.toString(),h.value=t.bottom.toString(),l.value=t.left.toString(),d.value=t.right.toString()}}updatePhoneMockup(){if(!this.phoneMockup)return;const e=c[this.currentDevice];if(!e){this.phoneMockup.showPlaceholder();return}const t=this.isEnabled?e.safeAreaInsets:{top:0,bottom:0,left:0,right:0};this.phoneMockup.updateDevice(this.currentDevice,t)}async sendMessageToContentScript(){try{const[e]=await chrome.tabs.query({active:!0,currentWindow:!0});if(!e||!e.id){console.log("[Safe Area Simulator] No active tab found");return}if(!g(e.url)){console.log("[Safe Area Simulator] Cannot inject into browser internal pages");return}const t={action:"updateSafeArea",enabled:this.isEnabled,device:this.currentDevice,showDeviceFrame:this.showDeviceFrame,settings:{enabled:this.isEnabled,device:this.currentDevice,customInsets:this.customInsets,showDebugOverlay:!0,showDeviceFrame:this.showDeviceFrame,showHardwareRegions:this.showHardwareRegions,mockupOptions:this.mockupOptions},insets:this.isEnabled&&this.currentDevice&&c[this.currentDevice]?c[this.currentDevice].safeAreaInsets:{top:0,bottom:0,left:0,right:0}};await chrome.tabs.sendMessage(e.id,t)}catch(e){e instanceof Error&&e.message&&e.message.includes("Could not establish connection")?console.log("[Safe Area Simulator] Content script not ready yet"):console.error("Error sending message to content script:",e)}}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{new u}):new u;
//# sourceMappingURL=popup-CKqZcdK6.js.map
