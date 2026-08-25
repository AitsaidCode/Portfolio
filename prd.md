# Product Requirements Document (PRD)

## 1. Executive Summary
**Product**: `devsurmesure` — Professional Portfolio & High-Conversion Client Acquisition Platform for Hicham Aitsaid (Senior Fullstack Engineer & Biomedical Health-Tech Consultant).  
**Objective**: Present dual-expertise engineering capabilities (modern web engineering + biomedical/health-tech domain mastery), showcase production projects, build trust, and convert inbound enterprise/startup leads with zero friction.

---

## 2. Target Personas & Stakeholders
1. **Health-Tech & MedTech Founders / CTOs**: Looking for engineers who understand regulatory rigor, clinical data flow, medical device interfaces, and secure fullstack architecture.
2. **E-Commerce & Scale-Up Executives**: Seeking performance optimization, custom API integrations, robust database architecture, and frictionless checkout flows.
3. **Agile Tech Teams & Recruiters**: Seeking senior freelance talent with deep technical rigor, transparent pricing models, and verifiable case studies.

---

## 3. Core Features & User Stories

### 3.1. Value Proposition & Authority Framing (Hero)
- **User Story**: As a prospective client, I want to immediately understand Hicham's unique specialization within 5 seconds of landing on the site.
- **Acceptance Criteria**:
  - Clear, commanding headline emphasizing custom software engineering and biomedical/health-tech synergy.
  - Live availability badge (`Disponible`).
  - Direct dual CTA (View Work / Book Consultation).

### 3.2. Project Showcase & Technical Case Studies (`#work`)
- **User Story**: As a technical decision-maker, I want to review realistic, production-grade projects with stack details, architectural challenges, and measurable results.
- **Acceptance Criteria**:
  - Minimum of 3–5 comprehensive project cards (e.g., MedTech platform, E-Commerce performance engine, SaaS platform).
  - Clear categorization tags (React, Node.js, Supabase, PrestaShop, Python/Biomedical).
  - Direct links to live demos or repository showcases where applicable.

### 3.3. Engineering Methodology & Quality Assurance (`#method`)
- **User Story**: As a project manager or CTO, I want to know the delivery process before hiring to ensure risk mitigation and code maintainability.
- **Acceptance Criteria**:
  - 4-phase structured delivery model: 1. Audit & Specifications, 2. Architecture & Data Design, 3. Implementation & Strict Testing, 4. Security & Deployment.

### 3.4. Transparent Pricing & Engagement Models (`#pricing`)
- **User Story**: As a prospective client, I want clarity on costs and collaboration scopes (Fixed vs. TJM) to quickly assess budget fit.
- **Acceptance Criteria**:
  - Clear service tiers (Full Project, TJM Consulting, Express Performance & Security Audit).
  - Explicit deliverables, turnaround estimates, and included guarantees.

### 3.5. Omnichannel Lead Capture & Conversion Engine (`#contact`)
- **User Story**: As a prospect ready to initiate a project, I want to submit my requirements and be connected immediately via WhatsApp or Email.
- **Acceptance Criteria**:
  - Client-side validated form (Name, Email, Phone, Project Type, Description).
  - Guard clauses preventing incomplete or malformed submissions.
  - Dual persistence: Secure insertion into Supabase PostgreSQL DB + dynamic pre-filled WhatsApp conversation bridge.

---

## 4. Non-Functional Requirements & Performance Metrics
- **Performance**: Lighthouse score > 95 on Desktop and Mobile.
- **Load Time**: Initial DOM load < 1.0s, First Contentful Paint < 0.6s.
- **Responsiveness**: 100% responsive across mobile (375px+), tablet (768px+), desktop (1024px+), and ultra-wide (1440px+).
- **SEO & Social Sharing**: Complete OpenGraph, Twitter Cards, and schema.org Person/ProfessionalService structured data.
- **Reliability**: Graceful fallback when network fails or external BaaS is unreachable.
