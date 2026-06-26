import React, { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';

// ── config ────────────────────────────────────────────────────────────────────
const CONFIGS = {
  easy:   { size: 6,  diamonds: 5,  mines: 0, time: null, lives: 0 },
  normal: { size: 8,  diamonds: 8,  mines: 0, time: 180,  lives: 0 },
  hard:   { size: 10, diamonds: 10, mines: 6, time: 120,  lives: 3 },
};

const DIFF_INFO = {
  easy:   { emoji: '◈', label: 'Easy',   sub: '6×6 · 5 diamonds · no timer',            accent: '#4ade80' },
  normal: { emoji: '◈', label: 'Normal', sub: '8×8 · 8 diamonds · 3 min',               accent: '#facc15' },
  hard:   { emoji: '◈', label: 'Hard',   sub: '10×10 · 10 diamonds · 6 mines · 2 min',  accent: '#f87171' },
};

const ARROW_MAP = {
  '-1,-1':'↖', '-1,0':'↑', '-1,1':'↗',
   '0,-1':'←',  '0,0':'·',  '0,1':'→',
   '1,-1':'↙',  '1,0':'↓',  '1,1':'↘',
};

// ── helpers ───────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function placePieces(size, dCount, mCount) {
  const all = shuffle(Array.from({ length: size * size }, (_, i) => i));
  return {
    diamonds: new Set(all.slice(0, dCount)),
    mines:    new Set(all.slice(dCount, dCount + mCount)),
  };
}

function chebyshev(idx, target, size) {
  return Math.max(
    Math.abs(Math.floor(idx / size) - Math.floor(target / size)),
    Math.abs((idx % size) - (target % size))
  );
}

function nearestDist(idx, diamonds, size) {
  let min = Infinity;
  for (const d of diamonds) min = Math.min(min, chebyshev(idx, d, size));
  return min;
}

function directionTo(idx, diamonds, size) {
  const r = Math.floor(idx / size), c = idx % size;
  let bestDist = Infinity, br = 0, bc = 0;
  for (const d of diamonds) {
    const dr = Math.floor(d / size), dc = d % size;
    const dist = Math.max(Math.abs(r - dr), Math.abs(c - dc));
    if (dist < bestDist) { bestDist = dist; br = dr - r; bc = dc - c; }
  }
  if (bestDist === 0) return '';
  return ARROW_MAP[`${Math.sign(br)},${Math.sign(bc)}`] || '·';
}

function heatClass(dist) {
  return `h${Math.min(dist, 5)}`;
}

function newGame(difficulty) {
  const cfg = CONFIGS[difficulty];
  const { diamonds, mines } = placePieces(cfg.size, cfg.diamonds, cfg.mines);
  return { difficulty, diamonds, mines, revealed: new Set(), found: 0, wrongClicks: 0, minesHit: 0, lives: cfg.lives, timeLeft: cfg.time, won: false, lost: false, lostReason: null };
}

function calcScore(game) {
  const cfg = CONFIGS[game.difficulty];
  let s = game.found * 100 - game.wrongClicks * 20;
  if (cfg.time && game.timeLeft > 0) s += game.timeLeft * 2;
  if (cfg.lives) s += game.lives * 50;
  return Math.max(0, s);
}

function getBest(diff) {
  const v = localStorage.getItem(`dsearch-best-${diff}`);
  return v ? parseInt(v) : null;
}

function saveBest(diff, score) {
  const prev = getBest(diff);
  if (prev === null || score > prev) { localStorage.setItem(`dsearch-best-${diff}`, score); return true; }
  return false;
}

function fmtTime(s) {
  if (s === null || s === undefined) return '--:--';
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

// ── Logo SVG ──────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <svg className="logo-icon" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#160a28"/>
      <polygon points="20,6 32,16 20,34 8,16" fill="none" stroke="url(#dg)" strokeWidth="1.5"/>
      <polygon points="20,6 32,16 20,19 8,16" fill="rgba(192,132,252,0.15)" stroke="url(#dg)" strokeWidth="1"/>
      <line x1="8" y1="16" x2="32" y2="16" stroke="rgba(192,132,252,0.3)" strokeWidth="0.8"/>
      <line x1="20" y1="6"  x2="20" y2="34" stroke="rgba(103,232,249,0.2)" strokeWidth="0.8"/>
      <circle cx="20" cy="6"  r="1.5" fill="#c084fc"/>
      <circle cx="32" cy="16" r="1.5" fill="#818cf8"/>
      <circle cx="8"  cy="16" r="1.5" fill="#818cf8"/>
      <circle cx="20" cy="34" r="1.5" fill="#67e8f9"/>
      <defs>
        <linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#c084fc"/>
          <stop offset="50%"  stopColor="#818cf8"/>
          <stop offset="100%" stopColor="#67e8f9"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Difficulty select screen ───────────────────────────────────────────────────
function DifficultyScreen({ onSelect }) {
  return (
    <div className="app">
      <header className="header">
        <div className="header-logo"><Logo /><div className="header-title">Diamond Search</div></div>
        <div className="header-sub">Find all diamonds hidden in the grid</div>
      </header>

      <div className="diff-grid">
        {['easy', 'normal', 'hard'].map(d => {
          const info = DIFF_INFO[d];
          const best = getBest(d);
          return (
            <button key={d} className="diff-card" style={{ '--accent': info.accent }} onClick={() => onSelect(d)}>
              <div className="diff-emoji" style={{ color: info.accent }}>{info.emoji}</div>
              <div className="diff-label">{info.label}</div>
              <div className="diff-sub">{info.sub}</div>
              {best !== null
                ? <div className="diff-best">Best&nbsp;<span>{best} pts</span></div>
                : <div className="diff-best no-score">No score yet</div>}
            </button>
          );
        })}
      </div>

      <div className="legend-row">
        <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(239,68,68,0.7)' }}/>Burning</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(249,115,22,0.7)' }}/>Hot</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(234,179,8,0.7)' }}/>Warm</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(132,204,22,0.7)' }}/>Cool</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(99,102,241,0.7)' }}/>Cold</div>
        <div className="legend-item"><span style={{ fontSize:12, marginRight: 4 }}>↗</span>Direction</div>
      </div>
    </div>
  );
}

// ── Main game ─────────────────────────────────────────────────────────────────
export default function App() {
  const [game, setGame]       = useState(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const timerRef = useRef(null);
  const gameRef  = useRef(null);
  gameRef.current = game;

  const startGame = useCallback((difficulty) => {
    clearInterval(timerRef.current);
    setIsNewBest(false);
    setGame(newGame(difficulty));
  }, []);

  // Timer
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
  }, [game]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save best on win
  useEffect(() => {
    const g = gameRef.current;
    if (!g?.won) return;
    const isNew = saveBest(g.difficulty, calcScore(g));
    setIsNewBest(isNew);
  }, [game?.won]); // eslint-disable-line react-hooks/exhaustive-deps

  const reveal = useCallback((idx) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.revealed.has(idx)) return prev;
      const cfg = CONFIGS[prev.difficulty];
      const revealed = new Set(prev.revealed).add(idx);

      if (prev.mines.has(idx)) {
        const minesHit = prev.minesHit + 1;
        const lives    = prev.lives - 1;
        if (lives <= 0) return { ...prev, revealed, minesHit, lives: 0, lost: true, lostReason: 'mines' };
        return { ...prev, revealed, minesHit, lives };
      }
      if (prev.diamonds.has(idx)) {
        const found = prev.found + 1;
        return { ...prev, revealed, found, won: found === cfg.diamonds };
      }
      return { ...prev, revealed, wrongClicks: prev.wrongClicks + 1 };
    });
  }, []);

  if (!game) return <DifficultyScreen onSelect={startGame} />;

  const cfg       = CONFIGS[game.difficulty];
  const score     = calcScore(game);
  const cellPx    = cfg.size === 6 ? 66 : cfg.size === 8 ? 58 : 48;
  const gameOver  = game.won || game.lost;

  let timerCls = 'stat-value cyan';
  if (game.timeLeft !== null && game.timeLeft < 30)  timerCls += ' timer-red';
  else if (game.timeLeft !== null && game.timeLeft < 60) timerCls += ' timer-yellow';

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo"><Logo /><div className="header-title">Diamond Search</div></div>
        <div className="header-sub">{cfg.size}×{cfg.size} · {cfg.diamonds} diamonds{cfg.mines ? ` · ${cfg.mines} mines` : ''}</div>
      </header>

      {/* Stats bar */}
      <div className="stats">
        <div className="stat">
          <div className="stat-value purple">{score}</div>
          <div className="stat-label">Score</div>
        </div>
        <div className="stat-divider"/>
        <div className="stat">
          <div className="stat-value">{game.found}<span style={{ opacity: 0.35, fontSize: 14 }}>/{cfg.diamonds}</span></div>
          <div className="stat-label">Found</div>
        </div>
        {cfg.time !== null && (
          <>
            <div className="stat-divider"/>
            <div className="stat">
              <div className={timerCls}>{fmtTime(game.timeLeft)}</div>
              <div className="stat-label">Time</div>
            </div>
          </>
        )}
        {cfg.lives > 0 && (
          <>
            <div className="stat-divider"/>
            <div className="stat">
              <div className="stat-value lives-row">
                {Array.from({ length: cfg.lives }, (_, i) => (
                  <span key={i} className={i < game.lives ? 'life alive' : 'life dead'}>♥</span>
                ))}
              </div>
              <div className="stat-label">Lives</div>
            </div>
          </>
        )}
      </div>

      {/* Grid */}
      <div className="grid-wrap" style={{ '--cell': `${cellPx}px` }}>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cfg.size}, var(--cell))` }}>
          {Array.from({ length: cfg.size * cfg.size }, (_, i) => {
            const isRevealed = game.revealed.has(i);
            const isDiamond  = game.diamonds.has(i);
            const isMine     = game.mines.has(i);
            const showMine   = !isRevealed && gameOver && isMine;

            let cls = 'cell';
            if (showMine)          cls += ' mine-show';
            else if (!isRevealed)  cls += ' unrevealed';
            else if (isDiamond)    cls += ' revealed diamond';
            else if (isMine)       cls += ' revealed mine-hit';
            else {
              const dist = nearestDist(i, game.diamonds, cfg.size);
              cls += ` revealed ${heatClass(dist)}`;
            }

            const arrow = isRevealed && !isDiamond && !isMine
              ? directionTo(i, game.diamonds, cfg.size)
              : null;

            return (
              <div key={i} className={cls} onClick={() => reveal(i)}>
                {showMine                           && <span className="cell-mine">💣</span>}
                {!isRevealed && !showMine           && <span className="cell-q">◆</span>}
                {isRevealed && isDiamond            && <span className="cell-gem">💎</span>}
                {isRevealed && isMine               && <span className="cell-mine">💣</span>}
                {isRevealed && !isDiamond && !isMine && <span className="cell-arrow">{arrow}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bottom-bar">
        <button className="btn-secondary" onClick={() => setGame(null)}>← Difficulty</button>
        <button className="btn-primary"   onClick={() => startGame(game.difficulty)}>↺ New Game</button>
      </div>

      {/* Win overlay */}
      {game.won && (
        <div className="overlay">
          <div className="overlay-card win">
            <div className="ov-icon">💎</div>
            <div className="ov-title">All Found!</div>
            <div className="ov-score">{score} points</div>
            {isNewBest && <div className="ov-best">★ New best score!</div>}
            <div className="ov-actions">
              <button className="btn-primary"   onClick={() => startGame(game.difficulty)}>↺ Play Again</button>
              <button className="btn-secondary" onClick={() => setGame(null)}>Change Difficulty</button>
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
              <button className="btn-primary"   onClick={() => startGame(game.difficulty)}>↺ Try Again</button>
              <button className="btn-secondary" onClick={() => setGame(null)}>Change Difficulty</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
