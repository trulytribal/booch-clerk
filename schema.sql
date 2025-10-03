-- Booch: Kombucha Tracker Database Schema
-- PostgreSQL Database Schema for Neon

-- Users table linked to Clerk
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  first_name VARCHAR(255),
  is_pro BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- First Fermentation Batches
CREATE TABLE batches (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  start_date_f1 DATE NOT NULL,
  end_date_f1 DATE,
  tea_type VARCHAR(100),
  sugar_grams INTEGER,
  status VARCHAR(50) DEFAULT 'F1' NOT NULL, -- F1, F2, Completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Second Fermentation Bottles
CREATE TABLE bottles (
  id SERIAL PRIMARY KEY,
  batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
  bottling_date DATE NOT NULL,
  flavor_ingredients TEXT,
  status VARCHAR(50) DEFAULT 'F2' NOT NULL, -- F2, Consumed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasting Notes for each bottle
CREATE TABLE tasting_notes (
  id SERIAL PRIMARY KEY,
  bottle_id INTEGER REFERENCES bottles(id) ON DELETE CASCADE,
  tasting_date DATE NOT NULL,
  fizz_rating INTEGER CHECK (fizz_rating >= 1 AND fizz_rating <= 5),
  sweetness_rating INTEGER CHECK (sweetness_rating >= 1 AND sweetness_rating <= 5),
  tartness_rating INTEGER CHECK (tartness_rating >= 1 AND tartness_rating <= 5),
  notes TEXT,
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_batches_user_id ON batches(user_id);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_bottles_batch_id ON bottles(batch_id);
CREATE INDEX idx_tasting_notes_bottle_id ON tasting_notes(bottle_id);

