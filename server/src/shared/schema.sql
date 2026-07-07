-- TTEarn 数据库结构(幂等,可重复执行)

CREATE TABLE IF NOT EXISTS app_config (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admins (
  username      text PRIMARY KEY,
  password_hash text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS games (
  id         text PRIMARY KEY,
  name       text NOT NULL,
  cover      text DEFAULT '',
  url        text DEFAULT '',
  category   text DEFAULT '',
  sort       int  DEFAULT 0,
  enabled    boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 任务配置(含签到/看广告/玩游戏/邀请;reward=奖励积分,icon=图标)
CREATE TABLE IF NOT EXISTS tasks (
  id       text PRIMARY KEY,
  type     text NOT NULL,          -- checkin | watch_ad | play_game | invite | custom
  title    text NOT NULL,
  reward   bigint DEFAULT 0,
  icon     text DEFAULT '',
  total    int,                    -- 每日上限(次数/封顶),可空
  enabled  boolean DEFAULT true,
  sort     int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS users (
  id               text PRIMARY KEY,
  platform         text DEFAULT 'web',
  name             text DEFAULT '',
  username         text DEFAULT '',
  avatar           text DEFAULT '',
  is_anonymous     boolean DEFAULT true,
  balance          bigint DEFAULT 0,
  streak           int DEFAULT 0,
  last_checkin_date text DEFAULT '',
  daily            jsonb DEFAULT '{}'::jsonb,   -- { date, adCount, gameCoins }
  invite_code      text UNIQUE,
  referrer_id      text,
  referral_earned  bigint DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_referrer ON users(referrer_id);
CREATE INDEX IF NOT EXISTS idx_users_invite ON users(invite_code);

CREATE TABLE IF NOT EXISTS ledger (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    text NOT NULL,
  source     text NOT NULL,
  amount     bigint NOT NULL,
  meta       jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ledger_user ON ledger(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS withdrawals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     text NOT NULL,
  amount_ton  numeric(20,9) NOT NULL,
  coins       bigint NOT NULL,          -- 扣的积分
  address     text NOT NULL,
  fee         numeric(20,9) DEFAULT 0,
  status      text NOT NULL DEFAULT 'pending', -- pending | approved | done | rejected
  tx_hash     text,
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_wd_status ON withdrawals(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wd_user ON withdrawals(user_id, created_at DESC);

-- 发币幂等
CREATE TABLE IF NOT EXISTS idempotency (
  key        text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 增量列(幂等)
ALTER TABLE users ADD COLUMN IF NOT EXISTS banned boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_reason text;
