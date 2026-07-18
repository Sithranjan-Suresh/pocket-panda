// Renders a shareable PNG card of the user's bamboo grove — pure canvas, no
// dependencies. Reuses the brand palette from the scroll film / submission
// thumbnail so the artifact feels like it belongs to the same product.

export async function renderGroveCard(groveCount) {
  const W = 1200;
  const H = 675;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#7fae78');
  grad.addColorStop(1, '#3a6443');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = 'rgba(255,233,163,0.55)';
  for (let i = 0; i < 26; i++) {
    const x = (i * 137) % W;
    const y = (i * 91) % (H - 120) + 16;
    const r = 2 + (i % 3);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // font loading state unavailable — draw with whatever's ready
    }
  }

  try {
    const img = new Image();
    img.src = '/film/panda-icon.webp';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    const size = 130;
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, 118, size / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, W / 2 - size / 2, 118 - size / 2, size, size);
    ctx.restore();
  } catch {
    // icon failed to load — the card still works without it
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#faf7ef';
  ctx.font = '700 42px Fraunces, Georgia, serif';
  ctx.fillText('My PocketPanda Grove', W / 2, 240);

  ctx.font = 'italic 22px Nunito, sans-serif';
  ctx.fillStyle = 'rgba(250,247,239,0.88)';
  const label = groveCount === 1 ? 'mission' : 'missions';
  ctx.fillText(`${groveCount} ${label} completed — one tiny step at a time.`, W / 2, 278);

  const cols = 14;
  const stalkSize = 32;
  const displayCount = Math.min(groveCount, cols * 4);
  const gridW = cols * stalkSize;
  const startX = W / 2 - gridW / 2 + stalkSize / 2;
  const startY = 340;
  ctx.textBaseline = 'middle';
  ctx.font = `${stalkSize}px serif`;
  for (let i = 0; i < displayCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    ctx.fillText('🎋', startX + col * stalkSize, startY + row * (stalkSize + 6));
  }

  const lastRow = Math.ceil(displayCount / cols) || 1;
  let footerY = startY + lastRow * (stalkSize + 6) + 30;

  if (groveCount > displayCount) {
    ctx.font = '600 20px Nunito, sans-serif';
    ctx.fillStyle = '#faf7ef';
    ctx.fillText(`+ ${groveCount - displayCount} more`, W / 2, footerY);
    footerY += 34;
  }

  if (groveCount === 0) {
    ctx.font = 'italic 20px Nunito, sans-serif';
    ctx.fillStyle = 'rgba(250,247,239,0.8)';
    ctx.fillText("Nothing here yet — that's alright too.", W / 2, startY + 20);
  }

  ctx.font = '600 18px Nunito, sans-serif';
  ctx.fillStyle = 'rgba(250,247,239,0.75)';
  ctx.fillText('pocketpanda — the AI that knows when to say no', W / 2, H - 28);

  return canvas;
}

export async function downloadGroveCard(groveCount, filename = 'pocketpanda-grove.png') {
  const canvas = await renderGroveCard(groveCount);
  await new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      resolve();
    }, 'image/png');
  });
}
