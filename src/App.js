import React, { useState, useCallback, useEffect } from 'react';
import './App.css';

const SIZE        = 8;
const TOTAL_CELLS = SIZE * SIZE;
const DIAMONDS    = 8;

// Chebyshev distance (king moves) to nearest diamond
function nearestDist(idx, diamondSet) {
  const r = Math.floor(idx / SIZE), c = idx % SIZE;
  let min = Infinity;
  for (const d of diamondSet) {
    const dr = Math.floor(d / SIZE), dc = d % SIZE;
    min = Math.min(min, Math.max(Math.abs(r - dr), Math.abs(c - dc)));
  }
  return min;
}

function hintClass(dist) {
  if (dist === 1) return 'hot-1';
  if (dist === 2) return 'hot-2';
  if (dist === 3) return 'hot-3';
  if (dist === 4) return 'hot-4';
  return 'cold';
}

function hintLabel(dist) {
  if (dist === 1) return 'HOT';
  if (dist === 2) return 'WARM';
  if (dist === 3) return 'MILD';
  if (dist === 4) return 'COOL';
  return 'COLD';
}

function placeDiamonds() {
  const positions = new Set();
  while (positions.size < DIAMONDS) {
    positions.add(Math.floor(Math.random() * TOTAL_CELLS));
  }
  return positions;
}

function newGame() {
  return {
    diamonds: placeDiamonds(),
    revealed: new Set(),
    clicks:   0,
    found:    0,
    won:      false,
  };
}

function getBestScore() {
  const v = localStorage.getItem('diamond-best');
  return v ? parseInt(v) : null;
}

function saveBestScore(clicks) {
  const prev = getBestScore();
  if (prev === null || clicks < prev) {
    localStorage.setItem('diamond-best', clicks);
    return clicks;
  }
  return prev;
}

// SVG logo
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

export default function App() {
  const [game, setGame]       = useState(newGame);
  const [best, setBest]       = useState(getBestScore);

  const reveal = useCallback((idx) => {
    setGame(prev => {
      if (prev.won || prev.revealed.has(idx)) return prev;
      const revealed = new Set(prev.revealed).add(idx);
      const isDiamond = prev.diamonds.has(idx);
      const found     = isDiamond ? prev.found + 1 : prev.found;
      const clicks    = prev.clicks + 1;
      const won       = found === DIAMONDS;
      return { ...prev, revealed, clicks, found, won };
    });
  }, []);

  // save best score when won
  useEffect(() => {
    if (game.won) {
      const b = saveBestScore(game.clicks);
      setBest(b);
    }
  }, [game.won, game.clicks]);

  const restart = useCallback(() => setGame(newGame()), []);

  const remaining = DIAMONDS - game.found;

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">
          <Logo />
          <div className="header-title">Diamond Search</div>
        </div>
        <div className="header-sub">Find all {DIAMONDS} diamonds hidden in the grid</div>
      </header>

      <div className="stats">
        <div className="stat">
          <div className="stat-value purple">{game.found}</div>
          <div className="stat-label">Found</div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <div className="stat-value">{remaining}</div>
          <div className="stat-label">Remaining</div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <div className="stat-value cyan">{game.clicks}</div>
          <div className="stat-label">Clicks</div>
        </div>
        {best !== null && (
          <>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-value" style={{ color: '#67e8f9', fontSize: 20 }}>{best}</div>
              <div className="stat-label">Best</div>
            </div>
          </>
        )}
      </div>

      <div className="legend">
        <div className="legend-item"><div className="legend-dot" style={{ background:'rgba(239,68,68,0.6)' }} />Hot</div>
        <div className="legend-item"><div className="legend-dot" style={{ background:'rgba(249,115,22,0.6)' }} />Warm</div>
        <div className="legend-item"><div className="legend-dot" style={{ background:'rgba(234,179,8,0.6)' }} />Mild</div>
        <div className="legend-item"><div className="legend-dot" style={{ background:'rgba(132,204,22,0.6)' }} />Cool</div>
        <div className="legend-item"><div className="legend-dot" style={{ background:'rgba(99,102,241,0.6)' }} />Cold</div>
      </div>

      <div className="grid-wrap">
        <div className="grid">
          {Array.from({ length: TOTAL_CELLS }, (_, i) => {
            const isRevealed  = game.revealed.has(i);
            const isDiamond   = game.diamonds.has(i);
            const dist        = isRevealed && !isDiamond ? nearestDist(i, game.diamonds) : null;

            let cls = 'cell';
            if (!isRevealed)            cls += ' unrevealed';
            else if (isDiamond)         cls += ' revealed diamond';
            else                        cls += ` revealed ${hintClass(dist)}`;

            return (
              <div key={i} className={cls} onClick={() => reveal(i)}>
                {!isRevealed && <span className="cell-inner">◆</span>}
                {isRevealed && isDiamond && <span className="diamond-gem">💎</span>}
                {isRevealed && !isDiamond && <span className="cell-hint">{hintLabel(dist)}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <button className="btn-restart" onClick={restart}>↺ New Game</button>

      {game.won && (
        <div className="win-overlay" onClick={restart}>
          <div className="win-card" onClick={e => e.stopPropagation()}>
            <div className="win-gems">💎💎💎</div>
            <div className="win-title">All Found!</div>
            <div className="win-score">Solved in <span>{game.clicks}</span> clicks</div>
            {best !== null && best === game.clicks && (
              <div className="win-best">★ New best score!</div>
            )}
            {best !== null && best < game.clicks && (
              <div className="win-best">Best: <span>{best} clicks</span></div>
            )}
            <button className="btn-restart" onClick={restart}>↺ Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}
