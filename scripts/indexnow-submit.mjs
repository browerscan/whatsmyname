#!/usr/bin/env node
// Tell IndexNow search engines (Bing, which also feeds Copilot and ChatGPT
// search, plus Yandex, Seznam and Naver) that pages changed. Run after a
// release, with the changed page URLs:
//   node scripts/indexnow-submit.mjs https://whatismyname.org/ https://whatismyname.org/de
// The key file public/<KEY>.txt must already be live.

const KEY = "4e07bd1ed7bdfc1a44bbc34248dc43e7";
const ORIGIN = "https://whatismyname.org";

const urls = process.argv.slice(2);
if (urls.length === 0 || urls.some((url) => new URL(url).origin !== ORIGIN)) {
  console.error(`usage: node scripts/indexnow-submit.mjs ${ORIGIN}/<path> ...`);
  process.exit(2);
}

const keyLocation = `${ORIGIN}/${KEY}.txt`;
const live = await fetch(keyLocation).then((response) => (response.ok ? response.text() : ""));
if (live.trim() !== KEY) {
  console.error(`IndexNow key is not live at ${keyLocation}; deploy public/${KEY}.txt first.`);
  process.exit(1);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(ORIGIN).host, key: KEY, keyLocation, urlList: urls }),
});
console.log(`IndexNow ${response.status} ${response.statusText} for ${urls.length} URL(s)`);
process.exit(response.ok ? 0 : 1);
