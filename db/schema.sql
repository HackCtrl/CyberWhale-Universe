-- PostgreSQL schema for CyberWhale Universe MVP

-- users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(320) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  display_name varchar(120),
  role varchar(32) DEFAULT 'student',
  created_at timestamptz DEFAULT now()
);

-- courses
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(140) UNIQUE NOT NULL,
  title varchar(255) NOT NULL,
  description text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- lessons
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  content text,
  position integer DEFAULT 0
);

-- enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  progress numeric DEFAULT 0
);

-- ctf challenges
CREATE TABLE IF NOT EXISTS ctf_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(255) NOT NULL,
  description text,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ctf submissions
CREATE TABLE IF NOT EXISTS ctf_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES ctf_challenges(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  flag text,
  correct boolean DEFAULT false,
  submitted_at timestamptz DEFAULT now()
);

-- ai agents (simple model)
CREATE TABLE IF NOT EXISTS ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  name varchar(140),
  config jsonb,
  created_at timestamptz DEFAULT now()
);
