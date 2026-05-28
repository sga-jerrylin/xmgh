import * as THREE from 'three';
import './styles.css';

const scenes = [
  {
    id: 'public',
    order: '01',
    title: '公共服务空间',
    area: '600㎡架空层',
    note: '休息、文创、水吧、研学配套',
    x: 84,
    y: 63,
    startYaw: -0.3,
    views: [
      { label: '休息区', src: '/assets/scenes/public-lounge.jpg' },
      { label: '文创区', src: '/assets/scenes/public-shop.jpg' },
    ],
  },
  {
    id: 'outer',
    order: '02',
    title: '外序厅',
    area: '入口形象区',
    note: '进入主题馆前序列',
    x: 69,
    y: 75,
    startYaw: 0,
    views: [{ label: '外序厅', src: '/assets/scenes/outer-lobby.jpg' }],
  },
  {
    id: 'inner',
    order: '03',
    title: '内序厅',
    area: '序厅',
    note: '主题精神与视觉总领',
    x: 58,
    y: 75,
    startYaw: 0.15,
    views: [{ label: '内序厅', src: '/assets/scenes/inner-lobby.jpg' }],
  },
  {
    id: 'xinghuo',
    order: '04',
    title: '星火的黎明',
    area: '主题展馆',
    note: '觉醒斗争、烽火工运',
    x: 51,
    y: 62,
    startYaw: -0.1,
    views: [
      { label: '烽火工运', src: '/assets/scenes/xinghuo-main.jpg' },
      { label: '觉醒斗争', src: '/assets/scenes/xinghuo-entry.jpg' },
    ],
  },
  {
    id: 'huohong',
    order: '05',
    title: '火红的年代',
    area: '主题展馆',
    note: '固本强基、奋进图强',
    x: 45,
    y: 31,
    startYaw: 0.25,
    views: [
      { label: '奋进图强', src: '/assets/scenes/huohong-main.jpg' },
      { label: '重整前行', src: '/assets/scenes/huohong-end.jpg' },
    ],
  },
  {
    id: 'chuntian',
    order: '06',
    title: '春天的故事',
    area: '主题展馆',
    note: '春潮涌动、跨越发展',
    x: 24,
    y: 45,
    startYaw: -0.2,
    views: [
      { label: '春潮涌动', src: '/assets/scenes/chuntian-main.jpg' },
      { label: '跨越发展', src: '/assets/scenes/chuntian-cross.jpg' },
    ],
  },
  {
    id: 'zhumeng',
    order: '07',
    title: '筑梦新征程',
    area: '主题展馆',
    note: '群星闪耀、未来服务',
    x: 11,
    y: 45,
    startYaw: 0.2,
    views: [
      { label: '育新通道', src: '/assets/scenes/zhumeng-corridor.png' },
      { label: '情暖职工', src: '/assets/scenes/zhumeng-final.jpg' },
    ],
  },
];

const app = document.querySelector('#app');
app.innerHTML = `
  <main class="shell">
    <section class="viewer-panel">
      <div class="topbar">
        <div class="brand">
          <span class="mark"></span>
          <div>
            <h1>厦门工运主题展馆</h1>
            <p>效果视频 + 360°全景空间漫游演示</p>
          </div>
        </div>
        <div class="tabs" role="tablist">
          <button class="tab active" data-mode="tour" type="button">360漫游</button>
          <button class="tab" data-mode="video" type="button">效果视频</button>
        </div>
      </div>

      <div class="stage">
        <canvas id="panorama"></canvas>
        <div id="stripViewer" class="strip-viewer">
          <img id="stripImage" alt="展区2.5D横向漫游画卷" />
        </div>
        <video id="walkthrough" class="walkthrough" controls preload="metadata" src="/assets/video/walkthrough-60s.mp4"></video>
        <div class="loading" id="loading">加载场景</div>
        <div class="scene-card">
          <span id="sceneOrder">01</span>
          <div>
            <h2 id="sceneTitle">公共服务空间</h2>
            <p id="sceneMeta">600㎡架空层</p>
          </div>
        </div>
        <div class="hud">
          <button class="icon-btn" id="prevScene" type="button" aria-label="上一场景">
            <svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button class="icon-btn" id="toggleSpin" type="button" aria-label="自动旋转">
            <svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>
          </button>
          <button class="icon-btn" id="resetView" type="button" aria-label="复位视角">
            <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 15-6.7"/><path d="M3 3v6h6"/><path d="M21 12a9 9 0 0 1-15 6.7"/><path d="M21 21v-6h-6"/></svg>
          </button>
          <button class="icon-btn" id="fullscreen" type="button" aria-label="全屏">
            <svg viewBox="0 0 24 24"><path d="M8 3H3v5"/><path d="M16 3h5v5"/><path d="M21 16v5h-5"/><path d="M8 21H3v-5"/></svg>
          </button>
          <button class="icon-btn" id="nextScene" type="button" aria-label="下一场景">
            <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div class="filmstrip" id="filmstrip"></div>
    </section>

    <aside class="map-panel">
      <div class="map-header">
        <div>
          <h2>空间动线</h2>
          <p>600㎡架空层 / 1520㎡主题馆</p>
        </div>
        <button class="map-toggle" id="mapToggle" type="button">流线图</button>
      </div>
      <div class="map-wrap">
        <img id="mapImage" src="/assets/maps/route-map.png" alt="厦门工运主题展馆平面流线图" />
        <div class="hotspots" id="hotspots"></div>
      </div>
      <div class="route-list" id="routeList"></div>
    </aside>
  </main>
`;

const canvas = document.querySelector('#panorama');
const stripViewer = document.querySelector('#stripViewer');
const stripImage = document.querySelector('#stripImage');
const loading = document.querySelector('#loading');
const sceneOrder = document.querySelector('#sceneOrder');
const sceneTitle = document.querySelector('#sceneTitle');
const sceneMeta = document.querySelector('#sceneMeta');
const filmstrip = document.querySelector('#filmstrip');
const routeList = document.querySelector('#routeList');
const hotspots = document.querySelector('#hotspots');
const mapImage = document.querySelector('#mapImage');
const mapToggle = document.querySelector('#mapToggle');
const walkthrough = document.querySelector('#walkthrough');

let currentSceneIndex = 0;
let currentViewIndex = 0;
let mode = 'tour';
let yaw = scenes[0].startYaw;
let pitch = 0;
let targetYaw = yaw;
let targetPitch = pitch;
let autoSpin = false;
let activeTextures = [];
let stripPan = 0.5;
let stripTilt = 0;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(72, 1, 0.1, 1200);
camera.position.set(0, 0, 0.1);

const room = new THREE.Group();
const frontMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const backMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const leftMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const rightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });

const frontPanel = new THREE.Mesh(new THREE.PlaneGeometry(900, 506), frontMaterial);
frontPanel.position.set(0, 64, 0);
room.add(frontPanel);

const backWall = new THREE.Mesh(new THREE.PlaneGeometry(720, 405), backMaterial);
backWall.position.set(0, 74, -170);
backWall.scale.set(0.92, 0.92, 1);
backWall.visible = false;
room.add(backWall);

const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(520, 330), leftMaterial);
leftWall.position.set(-448, 32, 72);
leftWall.rotation.y = 0.42;
room.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(520, 330), rightMaterial);
rightWall.position.set(448, 32, 72);
rightWall.rotation.y = -0.42;
room.add(rightWall);

const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(900, 180), ceilingMaterial);
ceiling.position.set(0, 344, 42);
ceiling.rotation.x = 0.28;
ceiling.visible = false;
room.add(ceiling);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(1120, 720), floorMaterial);
floor.position.set(0, -232, 190);
floor.rotation.x = -Math.PI / 2;
room.add(floor);

room.visible = false;
scene.add(room);

const panoGeometry = new THREE.SphereGeometry(500, 96, 48);
panoGeometry.scale(-1, 1, 1);
const panoMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const panoSphere = new THREE.Mesh(panoGeometry, panoMaterial);
scene.add(panoSphere);

const cache = new Map();

function loadImage(src) {
  if (cache.has(src)) return cache.get(src);
  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
  cache.set(src, promise);
  return promise;
}

function makeImageTexture(image) {
  const texture = new THREE.Texture(image);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function drawCover(ctx, image, width, height, biasX = 0.5, biasY = 0.5) {
  const scale = Math.max(width / image.width, height / image.height);
  const sourceW = width / scale;
  const sourceH = height / scale;
  const sourceX = Math.max(0, Math.min(image.width - sourceW, (image.width - sourceW) * biasX));
  const sourceY = Math.max(0, Math.min(image.height - sourceH, (image.height - sourceH) * biasY));
  ctx.drawImage(image, sourceX, sourceY, sourceW, sourceH, 0, 0, width, height);
}

function makeMockTexture(image, face) {
  const canvas2d = document.createElement('canvas');
  const square = face === 'floor' || face === 'ceiling';
  canvas2d.width = square ? 2048 : 2048;
  canvas2d.height = square ? 2048 : 1152;
  const ctx = canvas2d.getContext('2d');

  const bias = {
    left: [0.18, 0.52],
    right: [0.82, 0.52],
    back: [0.5, 0.52],
    ceiling: [0.5, 0.12],
    floor: [0.5, 0.88],
  }[face] || [0.5, 0.5];

  drawCover(ctx, image, canvas2d.width, canvas2d.height, bias[0], bias[1]);

  if (face === 'left' || face === 'back') {
    ctx.save();
    ctx.globalAlpha = 0.32;
    ctx.scale(-1, 1);
    drawCover(ctx, image, canvas2d.width, canvas2d.height, 1 - bias[0], bias[1]);
    ctx.restore();
  }

  const shade = ctx.createLinearGradient(0, 0, canvas2d.width, canvas2d.height);
  shade.addColorStop(0, face === 'floor' ? 'rgba(0,0,0,.42)' : 'rgba(0,0,0,.18)');
  shade.addColorStop(0.5, face === 'ceiling' ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,.05)');
  shade.addColorStop(1, 'rgba(0,0,0,.34)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, canvas2d.width, canvas2d.height);

  const texture = new THREE.CanvasTexture(canvas2d);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function viewSource(selected, index) {
  return selected.views[(index + selected.views.length) % selected.views.length].src;
}

async function setView(sceneIndex, viewIndex = 0) {
  currentSceneIndex = (sceneIndex + scenes.length) % scenes.length;
  currentViewIndex = viewIndex;
  const selected = scenes[currentSceneIndex];
  const view = selected.views[currentViewIndex];

  loading.classList.add('show');
  stripPan = 0.5;
  stripTilt = 0;
  sceneOrder.textContent = selected.order;
  sceneTitle.textContent = selected.title;
  sceneMeta.textContent = `${selected.area} · ${view.label}`;
  targetYaw = selected.startYaw;
  targetPitch = 0;

  document.querySelectorAll('[data-scene-id]').forEach((node) => {
    node.classList.toggle('active', node.dataset.sceneId === selected.id);
  });
  document.querySelectorAll('[data-hotspot-id]').forEach((node) => {
    node.classList.toggle('active', node.dataset.hotspotId === selected.id);
  });
  renderFilmstrip();
  stripImage.src = `/assets/strips/${selected.id}.jpg`;
  stripImage.onload = () => {
    updateStripTransform();
    loading.classList.remove('show');
  };

  const panoImage = await loadImage(`/assets/panos/${selected.id}.jpg`);
  const panoTexture = makeImageTexture(panoImage);
  activeTextures.forEach((item) => item.dispose());
  activeTextures = [panoTexture];
  panoMaterial.map = panoTexture;
  panoMaterial.needsUpdate = true;
  loading.classList.remove('show');
  return;

  const faceSources = {
    front: view.src,
    right: viewSource(selected, currentViewIndex + 1),
    back: scenes[(currentSceneIndex + 1) % scenes.length].views[0].src,
    left: viewSource(selected, currentViewIndex - 1),
    ceiling: view.src,
    floor: viewSource(selected, currentViewIndex + 1),
  };
  const images = Object.fromEntries(await Promise.all(
    Object.entries(faceSources).map(async ([face, src]) => [face, await loadImage(src)]),
  ));

  const texture = makeImageTexture(images.front);
  const rightTexture = makeMockTexture(images.right, 'right');
  const backTexture = makeMockTexture(images.back, 'back');
  const leftTexture = makeMockTexture(images.left, 'left');
  const ceilingTexture = makeMockTexture(images.ceiling, 'ceiling');
  const floorTexture = makeMockTexture(images.floor, 'floor');
  activeTextures.forEach((item) => item.dispose());
  activeTextures = [texture, rightTexture, backTexture, leftTexture, ceilingTexture, floorTexture];
  frontMaterial.map = texture;
  rightMaterial.map = rightTexture;
  backMaterial.map = backTexture;
  leftMaterial.map = leftTexture;
  ceilingMaterial.map = ceilingTexture;
  floorMaterial.map = floorTexture;
  frontMaterial.needsUpdate = true;
  rightMaterial.needsUpdate = true;
  backMaterial.needsUpdate = true;
  leftMaterial.needsUpdate = true;
  ceilingMaterial.needsUpdate = true;
  floorMaterial.needsUpdate = true;
  loading.classList.remove('show');
}

function updateStripTransform() {
  const maxX = Math.max(0, stripImage.clientWidth - stripViewer.clientWidth);
  const y = Math.round(stripTilt * 28);
  stripImage.style.transform = `translate3d(${-maxX * stripPan}px, ${y}px, 0)`;
}

function renderFilmstrip() {
  const selected = scenes[currentSceneIndex];
  filmstrip.innerHTML = selected.views.map((view, index) => `
    <button class="thumb ${index === currentViewIndex ? 'active' : ''}" type="button" data-view="${index}">
      <img src="${view.src}" alt="${selected.title}${view.label}" />
      <span>${view.label}</span>
    </button>
  `).join('');
  filmstrip.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => setView(currentSceneIndex, Number(button.dataset.view)));
  });
}

function renderNavigation() {
  routeList.innerHTML = scenes.map((item, index) => `
    <button class="route-item ${index === currentSceneIndex ? 'active' : ''}" type="button" data-scene-id="${item.id}" data-index="${index}">
      <span>${item.order}</span>
      <strong>${item.title}</strong>
      <small>${item.note}</small>
    </button>
  `).join('');
  routeList.querySelectorAll('[data-index]').forEach((button) => {
    button.addEventListener('click', () => setView(Number(button.dataset.index), 0));
  });

  hotspots.innerHTML = scenes.map((item, index) => `
    <button class="hotspot" type="button" style="left:${item.x}%;top:${item.y}%;" data-hotspot-id="${item.id}" data-index="${index}" aria-label="${item.title}">
      <span>${item.order}</span>
    </button>
  `).join('');
  hotspots.querySelectorAll('[data-index]').forEach((button) => {
    button.addEventListener('click', () => setView(Number(button.dataset.index), 0));
  });
}

function resize() {
  const rect = canvas.parentElement.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
  updateStripTransform();
}

function animate() {
  requestAnimationFrame(animate);
  if (autoSpin && mode === 'tour') targetYaw += 0.0018;
  yaw += (targetYaw - yaw) * 0.12;
  pitch += (targetPitch - pitch) * 0.12;
  camera.rotation.order = 'YXZ';
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
  renderer.render(scene, camera);
}

let dragging = false;
let lastX = 0;
let lastY = 0;

stripViewer.addEventListener('pointerdown', (event) => {
  dragging = true;
  autoSpin = false;
  stripViewer.setPointerCapture(event.pointerId);
  lastX = event.clientX;
  lastY = event.clientY;
});

stripViewer.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;
  lastX = event.clientX;
  lastY = event.clientY;
  const maxX = Math.max(1, stripImage.clientWidth - stripViewer.clientWidth);
  stripPan = Math.max(0, Math.min(1, stripPan - dx / maxX));
  stripTilt = Math.max(-1, Math.min(1, stripTilt + dy / 220));
  updateStripTransform();
});

stripViewer.addEventListener('pointerup', () => {
  dragging = false;
});

canvas.addEventListener('pointerdown', (event) => {
  dragging = true;
  autoSpin = false;
  canvas.setPointerCapture(event.pointerId);
  lastX = event.clientX;
  lastY = event.clientY;
});

canvas.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;
  lastX = event.clientX;
  lastY = event.clientY;
  targetYaw -= dx * 0.0042;
  targetPitch = Math.max(-1.15, Math.min(1.15, targetPitch - dy * 0.0038));
});

canvas.addEventListener('pointerup', () => {
  dragging = false;
});

canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  camera.fov = Math.max(42, Math.min(82, camera.fov + event.deltaY * 0.03));
  camera.updateProjectionMatrix();
}, { passive: false });

document.querySelector('#prevScene').addEventListener('click', () => setView(currentSceneIndex - 1, 0));
document.querySelector('#nextScene').addEventListener('click', () => setView(currentSceneIndex + 1, 0));
document.querySelector('#toggleSpin').addEventListener('click', () => {
  autoSpin = !autoSpin;
  document.querySelector('#toggleSpin').classList.toggle('active', autoSpin);
});
document.querySelector('#resetView').addEventListener('click', () => {
  targetYaw = scenes[currentSceneIndex].startYaw;
  targetPitch = 0;
  camera.fov = 72;
  camera.updateProjectionMatrix();
  stripPan = 0.5;
  stripTilt = 0;
  updateStripTransform();
});
document.querySelector('#fullscreen').addEventListener('click', () => {
  document.querySelector('.stage').requestFullscreen?.();
});

document.querySelectorAll('.tab').forEach((button) => {
  button.addEventListener('click', () => {
    mode = button.dataset.mode;
    document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('active', tab === button));
    document.body.classList.toggle('video-mode', mode === 'video');
    if (mode === 'video') {
      walkthrough.currentTime = 0;
      walkthrough.play().catch(() => {});
    } else {
      walkthrough.pause();
      resize();
    }
  });
});

mapToggle.addEventListener('click', () => {
  const route = mapImage.src.includes('route-map');
  mapImage.src = route ? '/assets/maps/zoning-map.png' : '/assets/maps/route-map.png';
  mapToggle.textContent = route ? '分区图' : '流线图';
});

window.addEventListener('resize', resize);
renderNavigation();
renderFilmstrip();
resize();
setView(0, 0);
animate();
