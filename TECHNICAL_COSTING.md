# Technical Costing Analysis: Nutritionist CRM & Meal Planner
**Projected Infrastructure Costs (2026-2029)**

This document outlines the technical infrastructure costs for the Nutritionist CRM project, utilizing **Vercel** for hosting and **Supabase** for the database, authentication, and storage.

---

## 1. Growth Phase Projections (INR)
Costs are calculated based on an estimated exchange rate of **₹95 per 1 USD**.

| Cost Component | Phase 1 (0-100 Clients) | Phase 2 (100-1,000 Clients) | Phase 3 (1,000-10,000 Clients) |
| :--- | :--- | :--- | :--- |
| **Vercel Hosting** | ₹0 (Hobby Tier) | ₹1,900 (Pro Tier) | ₹1,900 (Pro Tier) |
| **Supabase (DB + Auth)** | ₹0 (Free Tier) | ₹2,375 (Pro Tier) | ₹2,375 (Pro Tier) |
| **Storage Overage** | ₹0 | ₹0 | ₹0 - ₹200* |
| **Total Monthly Recurring** | **₹0** | **₹4,275** | **₹4,475** |

*\*Phase 3 assumes storage might grow if lifetime retention of high-resolution bills or receipts is added.*

---

## 2. One-Time / Fixed Setup Costs
These costs cover essential brand assets and identity for a 3-year period.

| Item | Description | Estimated Cost (3 Years) |
| :--- | :--- | :--- |
| **Domain Name** | `.com` or `.in` Registration + Privacy | ₹3,800 |
| **SSL Certificate** | Security encryption (Standard) | ₹0 (Included) |
| **Transactional Email** | Welcome/OTP Emails (up to 3k/mo) | ₹0 (Free Tier) |
| **Total One-Time** | | **₹3,800** |

---

## 3. Technical Rationale

### A. Authentication (Supabase Auth)
The application handles user login and security via Supabase.
*   **Limit:** Up to 50,000 Monthly Active Users (MAU).
*   **Cost:** Included in the base tiers (₹0 extra).
*   **Capacity:** Easily supports 10 internal staff and 10,000+ client accounts.

### B. PDF Generation & Compute
Diet plans are generated as PDFs (100KB–200KB each).
*   **Storage:** Supabase Pro includes **100GB** of file storage. At 50 PDFs per client, this covers 10,000 clients comfortably for the lifetime of the application.
*   **Processing:** Vercel Pro provides high-performance serverless execution, ensuring that generating large PDFs for multiple consultants simultaneously does not cause application slowdowns or timeouts.

### C. Database Scaling
The system is built on PostgreSQL (Supabase).
*   **Phase 1-2:** Fits within standard limits.
*   **Phase 3:** Even with 10,000 clients, the structured data (profiles, medical history, diet plans) will occupy less than 4GB. Supabase Pro provides **8GB**, ensuring room for another 10,000+ clients without tier upgrades.

### D. Lifetime Data Retention
The infrastructure is selected specifically for "Always-On" availability. Unlike free tiers that may pause during inactivity, the **Pro Tier** selections ensure that client medical records and historical diet plans are accessible 24/7/365 without risk of deletion or archival.

---
**Disclaimer:** *Exchange rates and third-party pricing are subject to market changes. Current analysis is based on early 2026 pricing models.*
