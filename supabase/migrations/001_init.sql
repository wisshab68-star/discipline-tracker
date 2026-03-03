-- Discipline Tracker - Schema initial
-- Row Level Security : chaque trader ne voit QUE ses propres données

CREATE TABLE sessions (
    session_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at      TIMESTAMPTZ,
    broker        TEXT,
    status        TEXT NOT NULL DEFAULT 'active',
    total_trades  INTEGER DEFAULT 0,
    avg_score     REAL DEFAULT 100.0
);

CREATE TABLE trades (
    trade_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id    UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    symbol        TEXT NOT NULL,
    side          TEXT NOT NULL CHECK (side IN ('LONG', 'SHORT')),
    lot_size      REAL NOT NULL,
    open_price    REAL NOT NULL,
    close_price   REAL,
    stop_loss     REAL,
    take_profit   REAL,
    pnl           REAL,
    status        TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    opened_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at     TIMESTAMPTZ
);

CREATE TABLE checklists (
    checklist_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id           UUID NOT NULL REFERENCES trades(trade_id) ON DELETE CASCADE,
    user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_respected     BOOLEAN NOT NULL,
    setup_identified   BOOLEAN NOT NULL,
    emotional_state    TEXT NOT NULL CHECK (emotional_state IN ('CALM','STRESSED','FRUSTRATED','FOMO')),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE discipline_scores (
    score_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id         UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    trade_id           UUID REFERENCES trades(trade_id),
    user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_score         REAL NOT NULL DEFAULT 0,
    risk_score         REAL NOT NULL DEFAULT 0,
    emotion_score      REAL NOT NULL DEFAULT 0,
    post_loss_score    REAL NOT NULL DEFAULT 0,
    total_score        REAL NOT NULL DEFAULT 100,
    color              TEXT NOT NULL DEFAULT 'GREEN',
    computed_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE alerts (
    alert_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id    UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    alert_type    TEXT NOT NULL,
    severity      TEXT NOT NULL CHECK (severity IN ('CRITICAL','WARNING','INFO')),
    message       TEXT NOT NULL,
    acknowledged  BOOLEAN DEFAULT FALSE,
    triggered_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE baselines (
    baseline_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    avg_lot_size     REAL NOT NULL DEFAULT 0.01,
    avg_trades_day   REAL NOT NULL DEFAULT 5,
    avg_win_rate     REAL NOT NULL DEFAULT 0.5,
    sessions_count   INTEGER NOT NULL DEFAULT 0,
    computed_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index critiques
CREATE INDEX idx_trades_session ON trades(session_id, opened_at DESC);
CREATE INDEX idx_scores_session ON discipline_scores(session_id, computed_at DESC);
CREATE INDEX idx_alerts_session ON alerts(session_id, severity, triggered_at DESC);
CREATE INDEX idx_sessions_user  ON sessions(user_id, started_at DESC);

-- Row Level Security
ALTER TABLE sessions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades            ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists        ENABLE ROW LEVEL SECURITY;
ALTER TABLE discipline_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE baselines         ENABLE ROW LEVEL SECURITY;

-- Policies : chaque user voit uniquement ses données
CREATE POLICY "users_own_sessions"   ON sessions          FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_trades"     ON trades            FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_checks"     ON checklists        FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_scores"     ON discipline_scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_alerts"     ON alerts            FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_baselines"  ON baselines         FOR ALL USING (auth.uid() = user_id);
