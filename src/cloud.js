/* ---------- 雲端同步（Firebase）：Google 登入後，把「已完成的章節」存到 Firestore ----------
   只在正式網站（GitHub Pages，HEAD 帶 app-site meta）啟用；Artifact 與本機檔案不載入 SDK。
   位置：users/{uid}/settings/biostatLadder ＝ { done: {章節id: 1}, lang, updated } */
const CLOUD = (() => {
  const CFG = { apiKey: 'AIzaSyD8oEe02SY2PCDe3d40NtTprrApqW_DhB8', authDomain: 'test-5dbba.firebaseapp.com', projectId: 'test-5dbba' };
  const SDK = 'https://www.gstatic.com/firebasejs/10.12.0/firebase-';
  let auth = null, db = null, user = null, timer = 0;
  const on = () => !!document.querySelector('meta[name="app-site"]') && /^https?:$/.test(location.protocol);
  const load = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  const ref = () => db.collection('users').doc(user.uid).collection('settings').doc('biostatLadder');
  const btn = () => document.getElementById('cloudBtn');
  const T = (zh, en) => (isZh() ? zh : en);

  function render(msg) {
    const b = btn(); if (!b) return;
    b.textContent = user ? T('☁ 登出', '☁ Sign out') : T('☁ 登入同步', '☁ Sign in to sync');
    b.title = msg || (user ? T(`已登入：${user.email || ''}，學習進度會同步到雲端`, `Signed in as ${user.email || ''}; progress syncs to the cloud`) : T('用 Google 帳號登入，在不同裝置同步學習進度', 'Sign in with Google to sync progress across devices'));
  }
  function push() {
    if (!user) return;
    clearTimeout(timer);
    timer = setTimeout(() => ref().set({ done: state.done, lang: I18N.lang, updated: Date.now() }).catch(e => render(T('同步失敗：', 'Sync failed: ') + e.code)), 800);
  }
  async function pull() {
    try {
      const snap = await ref().get(), remote = (snap.exists && snap.data().done) || {};
      const added = Object.keys(remote).filter(k => !state.done[k] && CH.some(c => c.id === k));
      added.forEach(k => { state.done[k] = 1; });
      store.set('done', state.done);
      if (added.length) { updateProgress(); route(location.hash.slice(1)); }
      if (Object.keys(state.done).some(k => !remote[k])) push();
      render();
    } catch (e) { render(T('同步失敗：', 'Sync failed: ') + e.code); }
  }
  async function start() {
    if (!on()) return;
    const top = document.querySelector('.top-in');
    if (top) top.insertAdjacentHTML('beforeend', '<button class="btn cloud" type="button" id="cloudBtn" data-notr></button>');
    render();
    try {
      await load(SDK + 'app-compat.js');
      await Promise.all([load(SDK + 'auth-compat.js'), load(SDK + 'firestore-compat.js')]);
    } catch (e) { btn().remove(); return; }
    firebase.initializeApp(CFG);
    auth = firebase.auth(); db = firebase.firestore();
    btn().onclick = () => user ? auth.signOut() : auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(e => render(T('登入失敗：', 'Sign-in failed: ') + e.code));
    auth.onAuthStateChanged(u => { user = u; render(); if (u) pull(); });
    render();
  }
  return { start, push };
})();
