-- PostgreSQL DDL for CyberWhale Universe (MVP)
-- Date: 2026-01-24
-- Purpose: schema for Users, Courses, Lessons, CTFChallenges, UserProgress

-- Enable extensions (for UUID generation)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ENUMs
CREATE TYPE user_role AS ENUM ('student','instructor','admin');
CREATE TYPE enrollment_status AS ENUM ('enrolled','completed','cancelled');
CREATE TYPE lesson_status AS ENUM ('not_started','in_progress','completed');

-- USERS
CREATE TABLE IF NOT EXISTS "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name VARCHAR(120),
  role user_role NOT NULL DEFAULT 'student',
  bio TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_email ON "user" (email);

-- COURSES
CREATE TABLE IF NOT EXISTS course (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  short_description TEXT,
  description TEXT,
  price NUMERIC(10,2) DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  author_id UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_course_slug ON course (slug);

-- LESSONS (one-to-many: course -> lessons)
CREATE TABLE IF NOT EXISTS lesson (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES course(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT, -- markdown or HTML
  position INTEGER NOT NULL DEFAULT 0, -- ordering within course
  duration_minutes INTEGER DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lesson_course_pos ON lesson (course_id, position);

-- ENROLLMENTS (many-to-many: users <-> courses)
CREATE TABLE IF NOT EXISTS course_enrollment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES course(id) ON DELETE CASCADE,
  status enrollment_status NOT NULL DEFAULT 'enrolled',
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE NULL,
  UNIQUE (user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_enrollment_user ON course_enrollment (user_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_course ON course_enrollment (course_id);

-- USER LESSON PROGRESS (tracks per-lesson progress)
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lesson(id) ON DELETE CASCADE,
  status lesson_status NOT NULL DEFAULT 'not_started',
  progress_percent SMALLINT NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_accessed TIMESTAMP WITH TIME ZONE NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_userlesson_user ON user_lesson_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_userlesson_lesson ON user_lesson_progress (lesson_id);

-- CTF EVENTS and CHALLENGES
CREATE TABLE IF NOT EXISTS ctf_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  start_at TIMESTAMP WITH TIME ZONE,
  end_at TIMESTAMP WITH TIME ZONE,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ctf_challenge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES ctf_event(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(80),
  points INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ctf_event ON ctf_challenge (event_id);

-- User submissions / attempts for CTF challenges
CREATE TABLE IF NOT EXISTS user_ctf_submission (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES ctf_challenge(id) ON DELETE CASCADE,
  submitted_value TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  attempts INTEGER NOT NULL DEFAULT 1,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id, submitted_value)
);
CREATE INDEX IF NOT EXISTS idx_ctf_sub_user ON user_ctf_submission (user_id);
CREATE INDEX IF NOT EXISTS idx_ctf_sub_challenge ON user_ctf_submission (challenge_id);

-- USER PROGRESS SUMMARY per-course (denormalized view to speed up dashboard)
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES course(id) ON DELETE CASCADE,
  progress_percent SMALLINT NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_usercourse_user ON user_course_progress (user_id);

-- Optional: course tags (many-to-many) and challenge tags
CREATE TABLE IF NOT EXISTS tag (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS course_tag (
  course_id UUID REFERENCES course(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tag(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, tag_id)
);
CREATE TABLE IF NOT EXISTS challenge_tag (
  challenge_id UUID REFERENCES ctf_challenge(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tag(id) ON DELETE CASCADE,
  PRIMARY KEY (challenge_id, tag_id)
);

-- Helpful views (examples)
CREATE OR REPLACE VIEW vw_course_progress AS
SELECT c.id AS course_id, c.title, e.user_id, u.display_name, u.email,
  COALESCE(ucp.progress_percent, 0) AS progress_percent
FROM course c
LEFT JOIN course_enrollment e ON e.course_id = c.id
LEFT JOIN "user" u ON u.id = e.user_id
LEFT JOIN user_course_progress ucp ON ucp.course_id = c.id AND ucp.user_id = e.user_id;

-- Notes:
-- - Use transactions when applying schema changes in production.
-- - Add FK ON DELETE behavior according to business rules (SET NULL vs CASCADE).
-- - Consider partitioning large tables (user_ctf_submission) if high volume is expected.
