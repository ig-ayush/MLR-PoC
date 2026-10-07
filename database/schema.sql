CREATE DATABASE IF NOT EXISTS meta_lead_poc
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE meta_lead_poc;

CREATE TABLE IF NOT EXISTS leads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  meta_lead_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NULL,
  email VARCHAR(320) NULL,
  phone VARCHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_leads_meta_lead_id (meta_lead_id),
  KEY idx_leads_created_at (created_at),
  KEY idx_leads_email (email)
) ENGINE=InnoDB;
