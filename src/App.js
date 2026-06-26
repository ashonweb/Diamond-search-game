import React, { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';

// ── Config ────────────────────────────────────────────────────────────────────
const CONFIGS = {
  easy:   { size: 6,  diamonds: 5,  mines: 0, time: null, lives: 0 },
  normal: { size: 8,  diamonds: 8,  mines: 0, time: 180,  lives: 0 },
  hard:   { size: 10, diamonds: 10, mines: 6, time: 120,  lives: 3 },
  daily:  { size: 8,  diamonds: 8,  mines: 0, time: 180,  lives: 0 },
};

const DIFF_INFO = {
  easy:   { label: 'Easy',   sub: '6×6 · 5 diamonds · no timer',           accent: '#4ade80' },
  normal: { label: 'Normal', sub: '8×8 · 8 diamonds · 3 min',              accent: '#facc15' },
  hard:   { label: 'Hard',   sub: '10×10 · 10 diamonds · 6 mines · 2 min', accent: '#f87171' },
};

const ARROWS = {
  '-1,-1':'↖','-1,0':'↑','-1,1':'↗',
   '0,-1':'←', '0,0':'·', '0,1':'→',
   '1,-1':'↙', '1,0':'↓', '1,1':'↘',
};

// ── PRNG ──────────────────────────────────────────────────────────────────────
function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function shuffleWith(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function placePieces(size, dCount, mCount, rng = Math.random, exclude = new Set()) {
  const eligible = Array.from({ length: size * size }, (_, i) => i).filter(i => !exclude.has(i));
  const shuffled = shuffleWith(eligible, rng);
  return { diamonds: new Set(shuffled.slice(0, dCount)), mines: new Set(shuffled.slice(dCount, dCount + mCount)) };
}

function chebyshev(a, b, size) {
  return Math.max(Math.abs(Math.floor(a / size) - Math.floor(b / size)), Math.abs((a % size) - (b % size)));
}

function nearestDist(idx, diamonds, size) {
  let min = Infinity;
  for (const d of diamonds) min = Math.min(min, chebyshev(idx, d, size));
  return min;
}

function directionTo(idx, diamonds, size) {
  const r = Math.floor(idx / size), c = idx % size;
  let best = Infinity, br = 0, bc = 0;
  for (const d of diamonds) {
    const dr = Math.floor(d / size), dc = d % size;
    const dist = Math.max(Math.abs(r - dr), Math.abs(c - dc));
    if (dist < best) { best = dist; br = dr - r; bc = dc - c; }
  }
  return best === 0 ? '' : (ARROWS[`${Math.sign(br)},${Math.sign(bc)}`] || '·');
}

function heatClass(dist) { return `h${Math.min(dist, 5)}`; }
function fmtTime(s) {
  if (s === null || s === undefined) return '--:--';
  return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
}

// ── Daily ─────────────────────────────────────────────────────────────────────
function dailyNumber() {
  const now = new Date();
  return Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(2024, 0, 1)) / 86400000) + 1;
}

function getDailyRecord() {
  try { return JSON.parse(localStorage.getItem('dsearch-daily') || '{}'); } catch { return {}; }
}
function getTodayRecord() { return getDailyRecord()[dailyNumber()] || null; }
function saveTodayRecord(data) {
  const r = getDailyRecord(); r[dailyNumber()] = data;
  localStorage.setItem('dsearch-daily', JSON.stringify(r));
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function getStats(diff) {
  try { return JSON.parse(localStorage.getItem(`dsearch-stats-${diff}`)) || { played: 0, won: 0, streak: 0, bestStreak: 0 }; }
  catch { return { played: 0, won: 0, streak: 0, bestStreak: 0 }; }
}
function updateStats(diff, won) {
  const s = getStats(diff);
  s.played++; if (won) { s.won++; s.streak++; s.bestStreak = Math.max(s.bestStreak, s.streak); } else s.streak = 0;
  localStorage.setItem(`dsearch-stats-${diff}`, JSON.stringify(s));
}

// ── Score ─────────────────────────────────────────────────────────────────────
function getBest(diff) { const v = localStorage.getItem(`dsearch-best-${diff}`); return v ? parseInt(v) : null; }
function saveBest(diff, score) {
  const prev = getBest(diff);
  if (prev === null || score > prev) { localStorage.setItem(`dsearch-best-${diff}`, score); return true; }
  return false;
}
function calcScore(game) {
  const cfg = CONFIGS[game.difficulty];
  let s = game.found * 100 - game.wrongClicks * 20 - game.hintsUsed * 100;
  if (cfg.time && game.timeLeft > 0) s += game.timeLeft * 2;
  if (cfg.lives) s += game.lives * 50;
  return Math.max(0, s);
}

// ── Game state ─────────────────────────────────────────────────────────────────
function newGame(difficulty) {
  const cfg = CONFIGS[difficulty];
  const rng = difficulty === 'daily' ? mulberry32(dailyNumber() * 1000003 + 7) : Math.random;
  const { diamonds, mines } = placePieces(cfg.size, cfg.diamonds, cfg.mines, rng);
  return { id: Date.now(), difficulty, dailyNum: dailyNumber(), diamonds, mines, revealed: new Set(), flags: new Map(), found: 0, wrongClicks: 0, minesHit: 0, lives: cfg.lives, timeLeft: cfg.time, hintsUsed: 0, lastFoundIdx: null, won: false, lost: false, lostReason: null };
}

function applyReveal(state, idx) {
  const cfg = CONFIGS[state.difficulty];
  const revealed = new Set(state.revealed).add(idx);
  if (state.mines.has(idx)) {
    const minesHit = state.minesHit + 1, lives = state.lives - 1;
    if (lives <= 0) return { ...state, revealed, minesHit, lives: 0, lost: true, lostReason: 'mines' };
    return { ...state, revealed, minesHit, lives };
  }
  if (state.diamonds.has(idx)) {
    const found = state.found + 1;
    return { ...state, revealed, found, lastFoundIdx: idx, won: found === cfg.diamonds };
  }
  return { ...state, revealed, wrongClicks: state.wrongClicks + 1 };
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <svg className="logo-icon" viewBox="0 0 40 40">
      <rect width="40" height="40" rx="8" fill="#160a28"/>
      <polygon points="20,6 32,16 20,34 8,16" fill="none" stroke="url(#dg)" strokeWidth="1.5"/>
      <polygon points="20,6 32,16 20,19 8,16" fill="rgba(192,132,252,0.15)" stroke="url(#dg)" strokeWidth="1"/>
      <line x1="8" y1="16" x2="32" y2="16" stroke="rgba(192,132,252,0.3)" strokeWidth="0.8"/>
      <line x1="20" y1="6"  x2="20" y2="34" stroke="rgba(103,232,249,0.2)" strokeWidth="0.8"/>
      <circle cx="20" cy="6"  r="1.5" fill="#c084fc"/>
      <circle cx="32" cy="16" r="1.5" fill="#818cf8"/>
      <circle cx="8"  cy="16" r="1.5" fill="#818cf8"/>
      <circle cx="20" cy="34" r="1.5" fill="#67e8f9"/>
      <defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stopColor="#c084fc"/>
        <stop offset="50%"  stopColor="#818cf8"/>
        <stop offset="100%" stopColor="#67e8f9"/>
      </linearGradient></defs>
    </svg>
  );
}

// ── Share ─────────────────────────────────────────────────────────────────────
function ShareButton({ num, record }) {
  const [copied, setCopied] = useState(false);
  function buildText() {
    return [
      `💎 Diamond Search · Daily #${num}`,
      record.won ? `Found all 8 · ${record.score} pts` : `Didn't finish · ${record.score} pts`,
      record.timeLeft != null ? `⏱️ ${fmtTime(record.timeLeft)} remaining` : '',
      `🖱️ ${record.wrongClicks ?? '?'} wrong clicks${record.hintsUsed ? ' · hint used' : ''}`,
    ].filter(Boolean).join('\n');
  }
  function handle(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(buildText())
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => window.prompt('Copy your result:', buildText()));
  }
  return <button className="btn-share" onClick={handle}>{copied ? '✓ Copied!' : '↗ Share'}</button>;
}

// ── Difficulty screen ─────────────────────────────────────────────────────────
function DifficultyScreen({ onSelect }) {
  const num         = dailyNumber();
  const todayRecord = getTodayRecord();

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo"><Logo /><div className="header-title">Diamond Search</div></div>
        <div className="header-sub">Find all hidden diamonds in the grid</div>
      </header>

      <div className="diff-grid">
        {['easy', 'normal', 'hard'].map(d => {
          const info  = DIFF_INFO[d];
          const best  = getBest(d);
          const stats = getStats(d);
          const rate  = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : null;
          return (
            <button key={d} className="diff-card" style={{ '--accent': info.accent }} onClick={() => onSelect(d)}>
              <div className="diff-label" style={{ color: info.accent }}>{info.label}</div>
              <div className="diff-sub">{info.sub}</div>
              <div className="diff-meta">
                {best !== null && <span>{best} pts best</span>}
                {rate !== null && <span>{rate}% wins</span>}
              </div>
              {stats.streak >= 2 && <div className="diff-streak">🔥 {stats.streak} win streak</div>}
            </button>
          );
        })}
      </div>

      <div className={`daily-card${todayRecord ? ' played' : ''}`}
        onClick={!todayRecord ? () => onSelect('daily') : undefined}
        style={{ cursor: todayRecord ? 'default' : 'pointer' }}>
        <div className="daily-header">
          <div className="daily-badge">Daily #{num}</div>
          <div className="daily-title">Daily Challenge</div>
        </div>
        <div className="daily-sub">Same board for everyone · resets at midnight</div>
        {todayRecord ? (
          <div className="daily-done">
            <span>{todayRecord.won ? `✓ ${todayRecord.score} pts` : '✗ Didn\'t finish'}</span>
            <ShareButton num={num} record={todayRecord} />
          </div>
        ) : (
          <div className="daily-play">Play Today's Board →</div>
        )}
      </div>

      <div className="legend-row">
        <div className="legend-item"><div className="legend-dot" style={{ background:'rgba(239,68,68,0.7)' }}/>Burning</div>
        <div className="legend-item"><div className="legend-dot" style={{ background:'rgba(249,115,22,0.7)' }}/>Hot</div>
        <div className="legend-item"><div className="legend-dot" style={{ background:'rgba(234,179,8,0.7)' }}/>Warm</div>
        <div className="legend-item"><div className="legend-dot" style={{ background:'rgba(132,204,22,0.7)' }}/>Cool</div>
        <div className="legend-item"><div className="legend-dot" style={{ background:'rgba(99,102,241,0.7)' }}/>Cold</div>
        <div className="legend-item"><span style={{ fontSize:12, marginRight:4 }}>↗</span>Direction</div>
        <div className="legend-item"><span style={{ fontSize:11, color:'#c084fc', marginRight:4 }}>◆</span>Flag</div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [game, setGame]           = useState(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [burstIdx, setBurstIdx]   = useState(null);
  const timerRef = useRef(null);
  const gameRef  = useRef(null);
  gameRef.current = game;

  const startGame = useCallback((difficulty) => {
    clearInterval(timerRef.current);
    setIsNewBest(false);
    setBurstIdx(null);
    setGame(newGame(difficulty));
  }, []);

  // Timer — deps on id/won/lost so it doesn't restart on every click
  useEffect(() => {
    clearInterval(timerRef.current);
    if (!game || game.timeLeft === null || game.won || game.lost) return;
    timerRef.current = setInterval(() => {
      setGame(prev => {
        if (!prev || prev.won || prev.lost || prev.timeLeft === null) return prev;
        const timeLeft = prev.timeLeft - 1;
        if (timeLeft <= 0) return { ...prev, timeLeft: 0, lost: true, lostReason: 'time' };
        return { ...prev, timeLeft };
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [game?.id, game?.won, game?.lost]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save stats + best + daily record on game end
  useEffect(() => {
    const g = gameRef.current;
    if (!g?.won && !g?.lost) return;
    updateStats(g.difficulty, g.won);
    if (g.won) {
      const score = calcScore(g);
      setIsNewBest(saveBest(g.difficulty, score));
      if (g.difficulty === 'daily') saveTodayRecord({ score, won: true, wrongClicks: g.wrongClicks, hintsUsed: g.hintsUsed, timeLeft: g.timeLeft });
    } else if (g.difficulty === 'daily') {
      saveTodayRecord({ score: 0, won: false, wrongClicks: g.wrongClicks, hintsUsed: g.hintsUsed, timeLeft: 0 });
    }
  }, [game?.won, game?.lost]); // eslint-disable-line react-hooks/exhaustive-deps

  // Burst animation when lastFoundIdx changes
  const prevFoundRef = useRef(null);
  useEffect(() => {
    if (!game?.lastFoundIdx || game.lastFoundIdx === prevFoundRef.current) return;
    prevFoundRef.current = game.lastFoundIdx;
    setBurstIdx(game.lastFoundIdx);
    const t = setTimeout(() => setBurstIdx(null), 700);
    return () => clearTimeout(t);
  }, [game?.lastFoundIdx]);

  const handleClick = useCallback((idx) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.revealed.has(idx)) return prev;
      if (prev.flags.has(idx)) return prev; // flagged — must unflag first
      const cfg = CONFIGS[prev.difficulty];

      // First-click protection: guarantee first cell is safe (skip for daily)
      if (prev.revealed.size === 0 && prev.difficulty !== 'daily' && (prev.mines.has(idx) || prev.diamonds.has(idx))) {
        const { diamonds, mines } = placePieces(cfg.size, cfg.diamonds, cfg.mines, Math.random, new Set([idx]));
        return applyReveal({ ...prev, diamonds, mines }, idx);
      }

      return applyReveal(prev, idx);
    });
  }, []);

  const handleRightClick = useCallback((e, idx) => {
    e.preventDefault();
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.revealed.has(idx)) return prev;
      const flags = new Map(prev.flags);
      const cur = flags.get(idx);
      if (!cur)              flags.set(idx, 'diamond');
      else if (cur === 'diamond') flags.set(idx, 'mine');
      else                   flags.delete(idx);
      return { ...prev, flags };
    });
  }, []);

  const useHint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.hintsUsed >= 1) return prev;
      const cfg = CONFIGS[prev.difficulty];
      const unfound = [...prev.diamonds].filter(d => !prev.revealed.has(d));
      if (!unfound.length) return prev;
      const idx = unfound[Math.floor(Math.random() * unfound.length)];
      const revealed = new Set(prev.revealed).add(idx);
      const found = prev.found + 1;
      return { ...prev, revealed, found, hintsUsed: prev.hintsUsed + 1, lastFoundIdx: idx, won: found === cfg.diamonds };
    });
  }, []);

  if (!game) return <DifficultyScreen onSelect={startGame} />;

  const cfg      = CONFIGS[game.difficulty];
  const score    = calcScore(game);
  const gameOver = game.won || game.lost;
  const cellPx   = cfg.size === 6 ? 66 : cfg.size === 8 ? 58 : 48;

  let timerCls = 'stat-value cyan';
  if (game.timeLeft !== null) {
    if      (game.timeLeft < 30) timerCls += ' timer-red';
    else if (game.timeLeft < 60) timerCls += ' timer-yellow';
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo"><Logo /><div className="header-title">Diamond Search</div></div>
        <div className="header-sub">
          {game.difficulty === 'daily'
            ? `Daily #${game.dailyNum} · 8×8 · 8 diamonds · 3 min`
            : `${cfg.size}×${cfg.size} · ${cfg.diamonds} diamonds${cfg.mines ? ` · ${cfg.mines} mines` : ''}`}
        </div>
      </header>

      <div className="stats">
        <div className="stat"><div className="stat-value purple">{score}</div><div className="stat-label">Score</div></div>
        <div className="stat-divider"/>
        <div className="stat">
          <div className="stat-value">{game.found}<span style={{ opacity:0.3, fontSize:14 }}>/{cfg.diamonds}</span></div>
          <div className="stat-label">Found</div>
        </div>
        {cfg.time !== null && (
          <><div className="stat-divider"/>
          <div className="stat"><div className={timerCls}>{fmtTime(game.timeLeft)}</div><div className="stat-label">Time</div></div></>
        )}
        {cfg.lives > 0 && (
          <><div className="stat-divider"/>
          <div className="stat">
            <div className="stat-value lives-row">
              {Array.from({ length: cfg.lives }, (_, i) => (
                <span key={i} className={i < game.lives ? 'life alive' : 'life dead'}>♥</span>
              ))}
            </div>
            <div className="stat-label">Lives</div>
          </div></>
        )}
      </div>

      <div className="grid-wrap" style={{ '--cell': `${cellPx}px` }}>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cfg.size}, var(--cell))` }}>
          {Array.from({ length: cfg.size * cfg.size }, (_, i) => {
            const isRevealed = game.revealed.has(i);
            const isDiamond  = game.diamonds.has(i);
            const isMine     = game.mines.has(i);
            const flag       = game.flags.get(i);
            const showMine   = !isRevealed && gameOver && isMine;
            const isBurst    = burstIdx === i;

            let cls = 'cell';
            if (showMine)            cls += ' mine-show';
            else if (!isRevealed)    cls += ' unrevealed';
            else if (isDiamond)      cls += ' revealed diamond' + (isBurst ? ' burst' : '');
            else if (isMine)         cls += ' revealed mine-hit';
            else {
              const dist = nearestDist(i, game.diamonds, cfg.size);
              cls += ` revealed ${heatClass(dist)}`;
            }

            const arrow = isRevealed && !isDiamond && !isMine
              ? directionTo(i, game.diamonds, cfg.size) : null;

            return (
              <div key={i} className={cls} onClick={() => handleClick(i)} onContextMenu={e => handleRightClick(e, i)}>
                {showMine   && <span className="cell-mine">💣</span>}
                {!isRevealed && !showMine && !flag  && <span className="cell-q">◆</span>}
                {!isRevealed && !showMine && flag === 'diamond' && <span className="cell-flag-d">◆</span>}
                {!isRevealed && !showMine && flag === 'mine'    && <span className="cell-flag-m">✕</span>}
                {isRevealed && isDiamond  && <span className="cell-gem">💎</span>}
                {isRevealed && isMine     && <span className="cell-mine">💣</span>}
                {isRevealed && !isDiamond && !isMine && <span className="cell-arrow">{arrow}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bottom-bar">
        <button className="btn-secondary" onClick={() => setGame(null)}>← Menu</button>
        {!gameOver && game.hintsUsed < 1 && (
          <button className="btn-hint" onClick={useHint}>◉ Scan<span className="hint-cost"> −100</span></button>
        )}
        {game.difficulty !== 'daily' && (
          <button className="btn-primary" onClick={() => startGame(game.difficulty)}>↺ New Game</button>
        )}
      </div>

      {/* Right-click tip */}
      {!gameOver && (
        <div className="tip">Right-click cells to flag ◆ diamonds or ✕ mines</div>
      )}

      {/* Win overlay */}
      {game.won && (
        <div className="overlay">
          <div className="overlay-card win">
            <div className="ov-icon">💎</div>
            <div className="ov-title">All Found!</div>
            <div className="ov-score">{score} points</div>
            {isNewBest && <div className="ov-best">★ New best score!</div>}
            {game.hintsUsed > 0 && <div className="ov-note">Hint used · −100 pts</div>}
            <div className="ov-actions">
              {game.difficulty === 'daily' ? (
                <>
                  <ShareButton num={game.dailyNum} record={{ won: true, score, wrongClicks: game.wrongClicks, hintsUsed: game.hintsUsed, timeLeft: game.timeLeft }} />
                  <button className="btn-secondary" onClick={() => setGame(null)}>← Menu</button>
                </>
              ) : (
                <>
                  <button className="btn-primary"   onClick={() => startGame(game.difficulty)}>↺ Play Again</button>
                  <button className="btn-secondary" onClick={() => setGame(null)}>← Menu</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loss overlay */}
      {game.lost && (
        <div className="overlay">
          <div className="overlay-card lose">
            <div className="ov-icon">{game.lostReason === 'time' ? '⏰' : '💣'}</div>
            <div className="ov-title">{game.lostReason === 'time' ? "Time's Up!" : 'Boom!'}</div>
            <div className="ov-score">{game.found} of {cfg.diamonds} found</div>
            <div className="ov-actions">
              {game.difficulty !== 'daily' && (
                <button className="btn-primary" onClick={() => startGame(game.difficulty)}>↺ Try Again</button>
              )}
              <button className="btn-secondary" onClick={() => setGame(null)}>← Menu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
