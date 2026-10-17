# Geo Designs & Research: Dashboard Design System & Implementation Logic

> **Authoritative Specification Document**  
> **Status:** Final / Reference Standard  
> **Target Scope:** Original Geo Designs & Research Overall Dashboard (`MainDashboardView` and associated AppShell)  
> **Target Path:** `docs/geo-dashboard-design-system.md`  
> **Verification Legend:**
>
> - `[Verified]`: Directly corroborated by inspected source code (`src/`), tokens (`tokens.css`), or styles (`globals.css`).
> - `[Inferred]`: Derived logically from implementation structure, naming conventions, or component organization.
> - `[Undocumented]`: Presumed design decisions, missing specs, or unrecorded rationale with no definitive implementation trace.

---

## Table of Contents

1. [A. Design Philosophy and Principles](#a-design-philosophy-and-principles)
2. [B. Design Tokens](#b-design-tokens)
3. [C. Typography and Content Hierarchy](#c-typography-and-content-hierarchy)
4. [D. Application Shell and Layout Architecture](#d-application-shell-and-layout-architecture)
5. [E. Original Dashboard Overview](#e-original-dashboard-overview)
6. [F. Component Design System](#f-component-design-system)
7. [G. Dashboard Information Architecture and Design Logic](#g-dashboard-information-architecture-and-design-logic)
8. [H. Functional and Interaction Logic](#h-functional-and-interaction-logic)
9. [I. Data Presentation and Component Relationships](#i-data-presentation-and-component-relationships)
10. [J. Responsive Behavior and Scrolling](#j-responsive-behavior-and-scrolling)
11. [K. Styling and Implementation Conventions](#k-styling-and-implementation-conventions)
12. [L. Rules for Future Dashboard Modules](#l-rules-for-future-dashboard-modules)
13. [M. Known Limitations and Undocumented Decisions](#m-known-limitations-and-undocumented-decisions)
14. [N. Source File Reference Index](#n-source-file-reference-index)

---

## A. Design Philosophy and Principles

### 1. Overall Visual Identity & Character `[Verified]`

The **Geo Designs & Research Overall Dashboard** is architected as an enterprise-grade geotechnical, engineering, and laboratory operational management platform. Rather than presenting a consumer-grade, sparse interface, the dashboard prioritizes:

- **Operational Density:** High signal-to-noise ratio where project engineers, department managers, and laboratory personnel can scan real-time metrics, attendance, project health, client inquiries, daily logs, and revenue recovery without excessive scrolling.
- **Deep Contrast Dual-Zone Architecture:** A distinctive split identity utilizing a high-contrast dark navy navigation rail/sidebar (`#0B101D` baseline) anchored against a crisp, clean light-mode operational canvas (`#F8FAFC` page background with pure `#FFFFFF` card surfaces).
- **Engineering Precision:** Clean hairline borders (`1px solid #E2E8F0`), subtle micro-elevations (`box-shadow: 0 1px 3px rgba(0,0,0,0.05)`), rounded pill badges, crisp monospace-aligned tabular values, and geometric SVG accents.

### 2. Core Design Principles `[Inferred]`

- **Clarity over Ornamentation:** Information is delivered via structured key-value pairings, visual progress meters, and explicit status badges. Decorative elements are restricted to subtle gradient backdrops and functional SVG iconography.
- **Immediate Contextual Awareness:** At the top of the workspace, a unified banner combines time-based greetings, personal shift/attendance tracking, leave balances, and critical quick actions to establish immediate context upon logging in.
- **Progressive Operational Depth:** High-level status is conveyed first (KPI metric cards, project stage indicators), followed by intermediate actionable data (inquiry queues, active milestones), down to granular audit trails (chronological daily logs, ledger payments).
- **Predictable Modularity:** Every dashboard section is encased in an encapsulated white card container (`.geo-card`) with a standardized header bar (`.geo-card-header`), iconography, and dedicated action triggers.

### 3. Balancing Enterprise Utility with Modern Polish `[Verified]`

- **Theme Adaptability:** The architecture natively integrates a multi-palette dynamic accent system (Blue default, Green, Neutral, Orange, Red, Rose, Violet, Yellow) driven by CSS variables in `:root[data-theme="..."]`, enabling white-labeling or personalized user focus while preserving the core engineering layout.
- **Tactile Micro-interactions:** Buttons, navigation pills, and interactive cards implement snappy cubic-bezier transitions (`120ms cubic-bezier(0.16, 1, 0.3, 1)`) with subtle hover elevation (`translateY(-1px)`) and active depressions.

---

## B. Design Tokens

Tokens are declared in `src/styles/tokens.css` and applied across components via standard CSS variables.

### 1. Brand & Shell Foundation Colors `[Verified]`

| CSS Variable       | Value     | Description / Source                                                                               |
| :----------------- | :-------- | :------------------------------------------------------------------------------------------------- |
| `--bg-left-panel`  | `#0B101D` | Deep midnight navy. The canonical dark foundation for the Sidebar shell.                           |
| `--bg-right-panel` | `#FFFFFF` | Pure white background used for light-mode header and cards.                                        |
| `--bg-page`        | `#F8FAFC` | Light slate/neutral grey canvas background (`slate-50`).                                           |
| `--bg-card`        | `#FFFFFF` | Container background for all modular content panels and cards.                                     |
| `--bg-card-hover`  | `#F8FAFC` | Subtle hover state for interactive rows, items, and secondary cards.                               |
| `--border-default` | `#E2E8F0` | Hairline border applied to all cards, header dividing lines, and panels (`slate-200`).             |
| `--border-subtle`  | `#F1F5F9` | Ultra-light separator line for nested table rows, sub-items, and dividers (`slate-100`).           |
| `--border-strong`  | `#CBD5E1` | Strong border tone used for input outlines, active focus states, and button borders (`slate-300`). |

### 2. Typography & Content Foreground Colors `[Verified]`

| CSS Variable       | Value     | Description / Usage                                                                             |
| :----------------- | :-------- | :---------------------------------------------------------------------------------------------- |
| `--text-primary`   | `#0F172A` | Deep slate-900. High-contrast primary text for headers, titles, metrics, and labels.            |
| `--text-secondary` | `#475569` | Slate-600. Secondary text for subtitles, metadata descriptions, timestamps, and active items.   |
| `--text-muted`     | `#64748B` | Slate-500. Tertiary text for muted labels, placeholders, group uppercase headers, and captions. |

### 3. Primary & Accent Palette (Default Blue Theme) `[Verified]`

The active theme defaults to the `blue` token set:
| Token Name | Hex Code | Purpose in Original Dashboard |
| :--- | :--- | :--- |
| `--color-accent-600` | `#026597` | Primary button hover state, deep brand accents. |
| `--color-accent-500` | `#0284C7` | Core brand blue. Primary CTA buttons, active sidebar pills, focus rings, progress bars. |
| `--color-accent-400` | `#0EA5E9` | Light accents, secondary progress highlights, interactive links. |
| `--color-accent-300` | `#38BDF8` | Muted accent highlights, glow borders. |
| `--color-accent-200` | `#BAE6FD` | Subtle borders for info notifications, tinted tags. |
| `--color-accent-100` | `#E0F2FE` | Background tint for active badges, info alerts, and active navigation icons. |
| `--color-accent-50` | `#F0F9FF` | Ultra-subtle background washes for greeting banners and highlight cards. |

_Alternative Theme Sets Defined in `tokens.css`:_ Green (Emerald `#059669`), Neutral (Slate `#475569`), Orange (Amber `#D97706`), Red (Rose `#E11D48`), Rose (`#E11D48`), Violet (`#7C3AED`), Yellow (`#CA8A04`).

### 4. Semantic Status Tokens `[Verified]`

| Status                          | Text / Icon Color         | Background Tint          | Border Color              | Implementation Usage                                          |
| :------------------------------ | :------------------------ | :----------------------- | :------------------------ | :------------------------------------------------------------ |
| **Success / Completed**         | `#059669` (`emerald-600`) | `#ECFDF5` (`emerald-50`) | `#A7F3D0` (`emerald-200`) | Verified attendance, complete projects, positive recovery.    |
| **Warning / In Progress**       | `#D97706` (`amber-600`)   | `#FFFBEB` (`amber-50`)   | `#FDE68A` (`amber-200`)   | In-progress milestones, pending reviews, active field tests.  |
| **Danger / Critical / Delayed** | `#DC2626` (`red-600`)     | `#FEF2F2` (`red-50`)     | `#FCA5A5` (`red-200`)     | Behind schedule projects, urgent inquiries, overdue payments. |
| **Info / Scheduled / Intake**   | `#0369A1` (`sky-700`)     | `#F0F9FF` (`sky-50`)     | `#BAE6FD` (`sky-200`)     | New inquiry entries, upcoming milestones, shift timing.       |
| **Neutral / Draft / Muted**     | `#475569` (`slate-600`)   | `#F1F5F9` (`slate-100`)  | `#E2E8F0` (`slate-200`)   | General tags, inactive badges, secondary status tags.         |

### 5. Spacing, Radii, Elevation & Motion `[Verified]`

| Token Category           | Token / Property      | Exact Implemented Value                                             | Source File Reference                                         |
| :----------------------- | :-------------------- | :------------------------------------------------------------------ | :------------------------------------------------------------ |
| **Border Radius**        | `--radius-sm`         | `6px` (`0.375rem`)                                                  | `tokens.css` (Small buttons, micro badges, tags)              |
|                          | `--radius-md`         | `8px` (`0.5rem`)                                                    | `tokens.css` (Standard buttons, inputs, dropdown items)       |
|                          | `--radius-lg`         | `12px` (`0.75rem`)                                                  | `tokens.css` (All standard dashboard cards, modal containers) |
|                          | Full Pill             | `9999px`                                                            | Inline styling across status badges and pills                 |
| **Elevation / Shadow**   | Card Shadow           | `0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)`      | `globals.css` (`.geo-card`)                                   |
|                          | Header Shadow         | `0 1px 2px 0 rgba(0, 0, 0, 0.03)`                                   | `globals.css` (`.geo-header`)                                 |
|                          | Flyout / Dropdown     | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)` | Inline styling on menus / popovers                            |
| **Transitions & Motion** | `--transition-fast`   | `120ms cubic-bezier(0.16, 1, 0.3, 1)`                               | `tokens.css` (Button hover, badge changes)                    |
|                          | `--transition-normal` | `200ms cubic-bezier(0.16, 1, 0.3, 1)`                               | `tokens.css` (Sidebar expansion, accordion panels)            |
| **Layout Heights**       | `--height-input`      | `48px`                                                              | `tokens.css` (Form controls)                                  |
|                          | Top Header Height     | `72px` (`4.5rem`)                                                   | `Header.tsx`, `AppShell.tsx`                                  |
|                          | Sidebar Expanded      | `260px`                                                             | `Sidebar.tsx`, `AppShell.tsx`                                 |
|                          | Sidebar Collapsed     | `70px`                                                              | `Sidebar.tsx`, `AppShell.tsx`                                 |
|                          | Max Layout Width      | `1600px`                                                            | `AppShell.tsx` (Main workspace limit)                         |

---

## C. Typography and Content Hierarchy

### 1. Font Family & Rendering `[Verified]`

The entire application standardizes on **Plus Jakarta Sans**, loaded via Google Fonts with complete fallback support:

```css
font-family:
  "Plus Jakarta Sans",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Roboto,
  sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### 2. Typographic Scale & Hierarchy Table `[Verified]`

| UI Element Role            | Font Size            | Weight           | Line Height | Letter Spacing  | Color Token                           | Example in Original Dashboard                       |
| :------------------------- | :------------------- | :--------------- | :---------- | :-------------- | :------------------------------------ | :-------------------------------------------------- |
| **Top Bar View Title**     | `1.1rem` (`17.6px`)  | `700` (Bold)     | `1.3`       | `-0.015em`      | `--text-primary`                      | Header: "Overall Dashboard"                         |
| **Greeting Banner Title**  | `1.35rem` (`21.6px`) | `700` (Bold)     | `1.25`      | `-0.02em`       | `--text-primary`                      | "Good afternoon, Om Parikh"                         |
| **Card / Section Header**  | `18px` (`1.125rem`)  | `600` (SemiBold) | `1.35`      | `-0.01em`       | `--text-primary`                      | "Active Project Execution", "Inquiry Channel Queue" |
| **KPI Big Numbers**        | `1.5rem` (`24px`)    | `700` (Bold)     | `1.0`       | `-0.02em`       | `--text-primary`                      | "38", "94.2%", "₹18.4L", "14"                       |
| **Primary Item Title**     | `14px` / `15px`      | `600` (SemiBold) | `1.4`       | `normal`        | `--text-primary`                      | Project names, client titles, inquiry subjects      |
| **Sidebar Navigation**     | `13.5px` (`0.84rem`) | `500` / `600`    | `1.4`       | `normal`        | Light or dark mode foreground         | "Overview", "Projects", "Internal Chat"             |
| **Sidebar Section Tag**    | `10.5px` (`0.65rem`) | `650` (Bold)     | `1.0`       | `0.06em` (caps) | Muted white (`rgba(255,255,255,0.4)`) | "OVERVIEW", "COMMUNICATION", "OPERATIONS"           |
| **Metadata / Supporting**  | `12px`–`13px`        | `400`–`500`      | `1.4`       | `normal`        | `--text-secondary`                    | "Client: Adani Infra", "Updated 12 mins ago"        |
| **Micro Badges / Tags**    | `11px`               | `600` (SemiBold) | `1.0`       | `0.02em`        | Semantic Foreground                   | "ON SCHEDULE", "FIELD TESTING", "URGENT"            |
| **Tabular Numbers / Code** | `12px`–`13px`        | `500` / `600`    | `1.0`       | `tabular-nums`  | `--text-primary` / `--text-muted`     | "GDR-GEO-2024-089", "₹3,45,000 / ₹4,20,000"         |

### 3. Readability, Truncation & Number Formatting `[Verified]`

- **Text Truncation:** Dense card items employ single-line ellipsis truncation (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`) for client names, inquiry snippet previews, and file titles to avoid layout disruption.
- **Currency Presentation:** Indian Rupee formatting is consistently applied (`₹` prefix followed by comma-grouped Lakh/Crore notation: e.g., `₹18.4L`, `₹4,20,000`).
- **Percentages:** Whole or single-decimal numbers followed by `%` (e.g., `72%`, `94.2%`), paired with colored circular gauges or horizontal progress bars.
- **Dates & Times:** 12-hour formatted time with uppercase meridiem (`09:14 AM`, `02:30 PM`) and standard Indian/UK date format (`17 Oct 2026`).

---

## D. Application Shell and Layout Architecture

The application layout is orchestrated by `AppShell.tsx` wrapping the application viewport.

### 1. Structural Overview Diagram `[Verified]`

```
+--------------------------------------------------------------------------------------------------+
|  VIEWPORT: 100vw x 100vh  (overflow: hidden)                                                     |
+----------------------+---------------------------------------------------------------------------+
| SIDEBAR              | HEADER BAR (sticky top: 0, height: 72px, z-index: 30, border-bottom: 1px) |
| Width: 260px (Exp)   | +-----------------------------------------------------------------------+ |
|        70px (Col)    | | [Toggle] [Overall Dashboard] | [Search 230px] [Theme] [Bell] [Avatar] | |
| Bg: #0B101D          | +-----------------------------------------------------------------------+ |
|                      | MAIN SCROLL CONTAINER (flex: 1, overflow-y: auto, background: #F8FAFC)     |
| [Geo Brand Header]   | +-----------------------------------------------------------------------+ |
|                      | | CONTENT WRAPPER (max-width: 1600px, padding: 1.25rem 1.5rem 2rem)      | |
| [NAV GROUPS]         | |                                                                       | |
| - OVERVIEW           | | 1. WORK SESSION & TODAY'S OVERVIEW (Unified Welcome & Metric Panel)   | |
|   * Dashboard        | |                                                                       | |
|   * Analytics        | | 2. OPERATIONAL KPI METRIC CARDS (4-Column Grid)                       | |
| - COMMUNICATION      | |                                                                       | |
|   * Internal Chat    | | 3. PRIMARY OPERATIONAL GRID (1.45fr / 1fr)                            | |
| - OPERATIONS         | |    [Active Project Execution]   |   [Inquiry Channel Queue]           | |
| - PROJECTS           | |                                                                       | |
| - FINANCE            | | 4. SECONDARY OPERATIONAL GRID (1.15fr / 1fr)                          | |
|                      | |    [Daily Activities Stream]    |   [Timeline & Milestones]           | |
| [FOOTER AREA]        | |                                                                       | |
| User Status: Online  | | 5. FULL-WIDTH FINANCIAL RECOVERY SECTION                              | |
| Quick Support        | |    [Billing Breakdown]          |   [Aging Invoice Ledger]            | |
|                      | +-----------------------------------------------------------------------+ |
+----------------------+---------------------------------------------------------------------------+
```

### 2. Layout Specifications Table `[Verified]`

| Layout Element                | Implementation Metric                 | Description & CSS Reference                                       |
| :---------------------------- | :------------------------------------ | :---------------------------------------------------------------- |
| **Sidebar Width (Expanded)**  | `260px`                               | Set in `AppShell.tsx` and `Sidebar.tsx`. Fixed desktop width.     |
| **Sidebar Width (Collapsed)** | `70px`                                | Icon-only collapsed rail mode with floating tooltips.             |
| **Sidebar Transition**        | `0.2s cubic-bezier(0.16, 1, 0.3, 1)`  | Smooth slide transition without layout jitter.                    |
| **Header Height**             | `72px` (`min-height: 72px`)           | Fixed height, border bottom `1px solid #E2E8F0`, backdrop blur.   |
| **Header Alignment**          | Left: Toggle & Title; Right: Controls | Flexbox space-between with vertical alignment center.             |
| **Workspace Max Width**       | `1600px`                              | Centered within the scrollable content canvas (`margin: 0 auto`). |
| **Workspace Padding**         | `1.25rem 1.5rem 2rem 1.5rem`          | Responsive padding (shrinks to `0.85rem` on mobile).              |
| **Standard Section Gap**      | `1.15rem` (`~18.4px`)                 | Vertical spacing between primary dashboard rows.                  |

---

## E. Original Dashboard Overview

The **original Overall Dashboard** (`MainDashboardView.tsx`) is structured into five distinct operational bands:

### 1. Section 1: Work Session Overview Bar (`WorkSessionOverviewBar.tsx`) `[Verified]`

- **Position & Grid:** Top of page, spans full 100% width of the content container.
- **Visual Design:** Premium gradient border card with a light blue wash (`#F0F9FF`) transitioning to white, accented with an organic SVG geometric watermark.
- **Displayed Information:**
  - **Greeting Header:** Time-aware greeting ("Good morning / afternoon / evening, [User Name]") + contextual status ("Shift: Morning Engineering | Geotechnical Unit").
  - **Punch & Attendance Module:** Current punching state (`09:14 AM - Logged In`), cumulative active hours counter (`05h 42m`), verified biometric status pill.
  - **Session Health Bar:** Visual duration meter showing active vs. remaining shift duration.
  - **Leave Balances:** Compact summary metrics showing `Casual: 4`, `Earned: 12`, `Comp-Off: 2`.
  - **Quick Action Triggers:** "Punch Out", "Apply Leave", "Generate Report" buttons.

### 2. Section 2: Key Operational KPI Grid (`KpiCardsGrid.tsx`) `[Verified]`

- **Position & Grid:** Second row. Built with `.geo-dashboard-grid-4col` (4 columns on desktop, 2 on tablet, 1 on mobile; gap `1.15rem`).
- **Cards Composition:**
  1. **Active Geotechnical Projects:** Count (`38`), delta (`+4 this month`), icon: `FolderCheck`, semantic color: Blue.
  2. **Lab Testing Turnaround Time:** Value (`94.2%`), delta (`+1.8% vs target`), icon: `Activity`, semantic color: Green.
  3. **Outstanding Inquiry Pipeline:** Count (`14`), status tag (`6 Urgent SLA`), icon: `Inbox`, semantic color: Amber.
  4. **Monthly Revenue Realization:** Amount (`₹18.4L`), target percentage (`82% achieved`), icon: `TrendingUp`, semantic color: Sky/Navy.

### 3. Section 3: Primary Operations Grid (1.45fr / 1fr Split) `[Verified]`

- **Position & Grid:** Two-column asymmetric grid (`1.45fr` left, `1fr` right) with `1.15rem` gap.
- **Left Panel — Active Project Execution (`ProjectProgressSection.tsx`):**
  - Displays high-priority active engineering projects (e.g., _Mumbai Coastal Road Borehole Investigation_, _Metro Line 4 Soil Analysis_).
  - Per-item structure: Project Code badge (`GDR-GEO-2024-089`), project title, lead geotechnical engineer, dual progress indicators (Site Investigation vs. Lab Testing), milestone deadline, and health status pill (`ON SCHEDULE`, `DELAYED`, `TESTING`).
- **Right Panel — Inquiry Channel Queue (`InquiryOverviewSection.tsx`):**
  - Displays incoming testing requests and commercial inquiries from infrastructure clients.
  - Per-item structure: Client organization name, inquiry scope badge (e.g., `Plate Load Test`, `Triaxial Shear`), urgency indicator, received timestamp, and direct review action button.

### 4. Section 4: Secondary Operations Grid (1.15fr / 1fr Split) `[Verified]`

- **Position & Grid:** Two-column grid (`1.15fr` left, `1fr` right) with `1.15rem` gap.
- **Left Panel — Daily Activities Stream (`DailyActivitiesSection.tsx`):**
  - Real-time audit log of team actions across site and laboratory units.
  - Chronological vertical timeline: User avatar/badge, action description (e.g., _"Core sample testing completed for BH-04"_), project tag, and relative timestamp.
- **Right Panel — Timeline & Milestones (`TimelineSummarySection.tsx`):**
  - Upcoming operational milestones, client submission deadlines, and government inspection dates.
  - Displays calendar day badge, milestone title, assigned officer, and urgency badge.

### 5. Section 5: Financial Recovery Section (`FinancialRecoverySection.tsx`) `[Verified]`

- **Position & Grid:** Bottom full-width container, internally split into a 2-column comparative layout.
- **Left Panel — Billing & Payment Status:** Visual progress bars displaying `Billed`, `Recovered`, and `Pending Retention` sums.
- **Right Panel — Aging Invoice Ledger:** Table/list of overdue client accounts, aging buckets (`0-30 Days`, `31-60 Days`, `>60 Days`), and contact escalation triggers.

---

## F. Component Design System

### 1. Card Container (`.geo-card`) `[Verified]`

- **Source:** Defined globally in `src/styles/globals.css`.
- **CSS Implementation:**
  ```css
  .geo-card {
    background-color: var(--bg-card);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg); /* 12px */
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.05),
      0 1px 2px rgba(0, 0, 0, 0.03);
    overflow: hidden;
    transition:
      box-shadow var(--transition-fast),
      border-color var(--transition-fast);
  }
  .geo-card:hover {
    border-color: var(--border-strong);
  }
  ```
- **Standard Sub-Elements:**
  - `.geo-card-header`: Height `52px`–`60px`, padding `1rem 1.25rem`, border-bottom `1px solid var(--border-subtle)`, flex space-between.
  - `.geo-card-title`: Font size `16px`–`18px`, weight `600`, color `var(--text-primary)`, flex align items center with icon gap `0.65rem`.
  - `.geo-card-actions`: Action button container (filters, view all, reload icon).
  - `.geo-card-body`: Padding `1.25rem`.

### 2. Badge Component (`Badge.tsx`) `[Verified]`

- **Source:** `src/components/common/Badge.tsx`.
- **Props:** `variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'`, `size: 'sm' | 'md'`, `children`, `dot?: boolean`.
- **Styling Rules:**
  - Height: `22px` (`sm`), `26px` (`md`).
  - Border-radius: `9999px` (Pill shape).
  - Font size: `11px` (`sm`), `12px` (`md`), `font-weight: 600`.
  - Padding: `0.2rem 0.55rem` (`sm`), `0.25rem 0.75rem` (`md`).
  - Optional Dot: `6px` circle with matching saturated background.

### 3. Button Component (`Button.tsx`) `[Verified]`

- **Source:** `src/components/common/Button.tsx`.
- **Props:** `variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'`, `size: 'sm' | 'md' | 'lg'`, `icon?: LucideIcon`, `disabled?: boolean`.
- **Styling Rules:**
  - `primary`: Background `var(--color-accent-500)`, text `#FFFFFF`, hover `var(--color-accent-600)`.
  - `secondary`: Background `var(--border-subtle)`, text `var(--text-primary)`, border `1px solid var(--border-default)`.
  - `outline`: Background transparent, border `1px solid var(--border-strong)`, text `var(--text-primary)`.
  - `ghost`: Background transparent, text `var(--text-secondary)`, hover background `var(--bg-card-hover)`.
  - Height: `32px` (`sm`), `38px` (`md`), `46px` (`lg`).
  - Radius: `var(--radius-md)` (`8px`).

### 4. Sidebar Navigation Items (`Sidebar.tsx`) `[Verified]`

- **Item States:**
  - **Default:** Height `40px`, padding `0.6rem 0.85rem`, border-radius `8px`, text `rgba(255,255,255,0.7)`, icon `18px`.
  - **Hover:** Background `rgba(255, 255, 255, 0.08)`, text `#FFFFFF`.
  - **Active:** Background `var(--color-accent-500)` or `rgba(2, 132, 199, 0.25)`, text `#FFFFFF`, font-weight `600`, active left indicator bar (`3px` thick).
  - **Collapsed Rail Tooltip:** Absolute floating popover positioned `left: 80px`, background `#1E293B`, text `#FFFFFF`, border-radius `6px`, padding `4px 8px`, shadow `md`, `z-index: 50`.

### 5. Progress Bars & Meters `[Verified]`

- **Container:** Height `6px`–`8px`, background `var(--border-subtle)` (`#F1F5F9`), border-radius `9999px`, overflow hidden.
- **Fill:** Transition `width 400ms cubic-bezier(0.16, 1, 0.3, 1)`, background `var(--color-accent-500)` (or semantic green/amber).
- **Dual Milestone Bar:** Stacked or paired progress bars indicating Field Investigation (Navy) vs. Lab Analysis (Sky Blue).

---

## G. Dashboard Information Architecture and Design Logic

### 1. Hierarchy Between High-Level Summaries and Operational Drilldowns `[Inferred]`

The dashboard layout follows a strict top-down cognitive pyramid:

1. **Personal Identity & Session Health (Band 1):** Immediate reassurance of shift log-in, attendance validity, and personal leave balances.
2. **Macro Performance Metrics (Band 2):** High-level operational totals across four core pillars (Projects, Laboratory, Inquiries, Revenue).
3. **Active Workload & Ingestion Queues (Band 3):** High-priority active engineering sites side-by-side with incoming commercial inquiries.
4. **Activity Logs & Forward Milestones (Band 4):** Granular, time-sequenced verification of daily accomplishments and immediate calendar targets.
5. **Fiscal Health & Compliance (Band 5):** Financial clearance and invoice recovery ensuring project profitability.

### 2. Grouping of Projects and Inquiries `[Verified]`

- **Project Progress Grouping:** Projects are sorted by urgency and stage of investigation. Each project card clusters geotechnical metadata (Client, Location, Soil Type) alongside progress gauges and milestone target dates.
- **Inquiry Channel Grouping:** Requests are categorized by commercial SLA urgency, allowing management to immediately spot unattended leads or overdue feasibility inquiries.

### 3. Scanning and Visual Prioritization Rules `[Inferred]`

- Colored semantic pills (`ON SCHEDULE`, `DELAYED`, `URGENT`) anchor the right-hand edge of list rows, allowing engineers to scan vertical columns for red/amber exceptions.
- Primary IDs (e.g. `GDR-GEO-2024-089`) are set in compact bold slate to facilitate telephone and radio cross-referencing during site calls.

---

## H. Functional and Interaction Logic

### 1. Implemented vs. Visual Interaction Matrix `[Verified]`

| Control / Interaction Area       | Implementation Status     | Actual Implemented Logic                                                                                                                         | Visual-Only / Stubbed Behavior                                                                   |
| :------------------------------- | :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| **Sidebar Collapse Toggle**      | **Fully Implemented**     | Clicking hamburger/chevron in header toggles state; writes `geo_sidebar_collapsed` to `localStorage`; animates width between `260px` and `70px`. | None.                                                                                            |
| **Theme Palette Selector**       | **Fully Implemented**     | Selects from 8 color themes via `ThemeToggle`; sets `data-theme` attribute on `document.documentElement`; updates all CSS variables.             | None.                                                                                            |
| **Navigation Routing**           | **Partially Implemented** | Switches `currentView` in local state between `dashboard` and `chat`.                                                                            | Non-chat sidebar items (e.g., Reports, Billing) update active state or remain placeholder views. |
| **Header Search Input**          | **Visual Only**           | Controlled input with placeholder _"Search projects, samples..."_; clearable text state.                                                         | Does not execute cross-database filtering or server querying.                                    |
| **Notifications Dropdown**       | **Partially Implemented** | Bell icon with unread badge counter (`3`); toggles dropdown popover.                                                                             | List items are static mock alerts; no backend push integration.                                  |
| **Profile Menu & Logout**        | **Fully Implemented**     | Displays user avatar, shift details, and "Sign Out" option; calls `logout()` in `AuthContext`.                                                   | Profile edit dialog is not connected.                                                            |
| **Attendance Punch Out**         | **Partially Implemented** | Button triggers confirmation or local session duration calculation.                                                                              | Does not communicate with physical biometric attendance hardware.                                |
| **Project & Inquiry Row Clicks** | **Visual / Hover Only**   | Rows highlight with background `#F8FAFC` and cursor pointer; action buttons display hover states.                                                | Modal detail drilldowns for all rows are not universally mounted.                                |

---

## I. Data Presentation and Component Relationships

### 1. Data Source Architecture `[Verified]`

- **State Layer:** React 18 local component state combined with `AuthContext` for user session and active view state.
- **Data Fixtures:** Purely local mock datasets declared in `src/data/mockDashboardData.ts` and `src/data/mockChatData.ts`.
- **Backend Connectivity:** Backend connectivity is disconnected in the current frontend development phase. No active Supabase or external REST/GraphQL requests are initiated during dashboard rendering.

### 2. Mock Data Structures `[Verified]`

- **User Session:**
  ```typescript
  interface DashboardUser {
    id: string;
    name: string;
    role: string;
    department: string;
    shift: string;
    avatarUrl?: string;
  }
  ```
- **Operational KPI Item:**
  ```typescript
  interface KpiMetric {
    id: string;
    title: string;
    value: string | number;
    change: string;
    isPositive: boolean;
    icon: string;
    statusTag?: string;
  }
  ```
- **Active Project Item:**
  ```typescript
  interface ProjectItem {
    id: string;
    code: string;
    title: string;
    client: string;
    siteInvestigationProgress: number;
    labTestingProgress: number;
    status: "On Schedule" | "Testing" | "Delayed" | "Review";
    deadline: string;
  }
  ```

---

## J. Responsive Behavior and Scrolling

### 1. Breakpoint Grid Rules `[Verified]`

Breakpoints are controlled in `globals.css` and Tailwind-compatible media queries:
| Breakpoint | Target Screen | Sidebar Behavior | Grid Column Adjustments |
| :--- | :--- | :--- | :--- |
| **Desktop (> 1200px)** | Standard Monitors | `260px` expanded or `70px` collapsed rail. | 4 columns for KPI grid; 2 columns (`1.45fr/1fr`, `1.15fr/1fr`) for operational sections. |
| **Small Desktop (1024px–1200px)**| Compact Laptops | Default collapsed to `70px` rail to preserve canvas width. | KPI grid remains 4 columns or wraps to 2; operational grids adjust to `1fr/1fr`. |
| **Tablet (768px–1023px)** | iPads / Tablets | Sidebar auto-collapses or hides into an overlay drawer. | KPI grid wraps to 2x2 matrix; operational sections stack vertically into single columns (`1fr`). |
| **Mobile (< 768px)** | Mobile Devices | Sidebar hidden off-canvas; opened via mobile hamburger menu. | All grids stack into a single column (`1fr`); padding reduces to `0.85rem`. |

### 2. Scrolling & Overflow Handling `[Verified]`

- **Root Viewport:** `html, body` have `height: 100%; overflow: hidden;` preventing browser-level double scrollbars.
- **AppShell Main Canvas:** `flex: 1; overflow-y: auto; overflow-x: hidden;` provides smooth, dedicated vertical scrolling.
- **Scrollbar Styling:** Standardized subtle scrollbar in `globals.css` (`width: 6px; background: transparent; thumb: #CBD5E1; thumb-hover: #94A3B8; border-radius: 9999px;`).

---

## K. Styling and Implementation Conventions

### 1. CSS Architecture `[Verified]`

- **Dual-Layer Architecture:**
  1. `tokens.css`: Declares raw design tokens, themes (`[data-theme="blue"]`), and system constants.
  2. `globals.css`: Declares base reset, typography rules, layout utilities (`.geo-card`, `.geo-dashboard-grid-4col`), and custom scrollbar behavior.
  3. Inline Tailwind / Modular Classes: Used within individual component TSX files for fine-grained flex layouts and micro-spacing.

### 2. Styling Extension Rules for Developers `[Inferred]`

- Never hardcode raw hex values (e.g. `#0284C7`) inside component files. Always use `var(--color-accent-500)` or standard semantic variables.
- Maintain the standardized border radius scale: tags (`6px`), controls (`8px`), containers/cards (`12px`), pills (`9999px`).
- Always structure card containers using `.geo-card`, with `.geo-card-header` containing an icon, title, and `.geo-card-actions`.

---

## L. Rules for Future Dashboard Modules

To maintain visual and architectural continuity between the original Overall Dashboard and upcoming sub-modules (e.g., Lead Management, Laboratory Information System, Equipment Calibration Tracker, Field Drilling Logs):

### 1. Mandatory Shared Constants `[Verified Requirements]`

- **Global AppShell:** All modules must render within `AppShell.tsx`, honoring the shared sidebar state (`localStorage: geo_sidebar_collapsed`) and sticky `72px` top navigation.
- **Card Enclosure:** Independent content blocks must be encased in `.geo-card` containers with uniform headers, border radii (`12px`), and border colors (`#E2E8F0`).
- **Typography Standards:** Maintain **Plus Jakarta Sans** with matching weight and size hierarchies.
- **Status Semantics:** Always map statuses to the approved semantic tokens (Success = Emerald, Warning = Amber, Critical = Red, Info = Sky).

### 2. Permitted Module-Specific Customizations `[Inferred]`

- **Domain-Specific Grids:** Specialized modules may adopt layout proportions tailored to their domain (e.g., a 3-column Kanban for Lead Management, full-width data tables with horizontal scroll for Lab Samples).
- **Specialized Filter Toolbars:** Dedicated filter bars (date pickers, dropdown facets, CSV export buttons) can be positioned directly beneath the module header or inside `.geo-card-header`.
- **Form Layouts:** Modal dialogues and multi-step forms should utilize standard `Button` variants and `48px` input heights (`--height-input`).

---

## M. Known Limitations and Undocumented Decisions

| Item                                | Status           | Detailed Description                                                                                                                                                                                                       |
| :---------------------------------- | :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Biometric Punch Integration**     | `[Undocumented]` | The Attendance Card shows simulated timestamps (`09:14 AM`) and active durations. Actual hardware SDK or biometric API specs are absent.                                                                                   |
| **Financial Ledger Reconciliation** | `[Undocumented]` | Revenue figures (`₹18.4L`) and aging buckets are statically rendered from mock fixtures. Dynamic tax calculation rules (GST, TDS) are not yet specified.                                                                   |
| **Granular Permission Model**       | `[Undocumented]` | UI elements (e.g., "Punch Out", "Review Inquiry") render uniformly regardless of whether the user is an Engineer, Lab Tech, or Admin. Role-based access control (RBAC) conditional rendering logic is not yet implemented. |
| **Global Search Scope**             | `[Undocumented]` | The top header search bar lacks a formal indexing specification (e.g., whether it queries projects, client names, sample IDs, or staff profiles).                                                                          |
| **Dark Mode Canvas Surface**        | `[Undocumented]` | While the sidebar is dark navy (`#0B101D`), the main canvas only implements light mode (`#F8FAFC`). Full dark mode surface tokens for the content canvas remain unconfigured in `tokens.css`.                              |

---

## N. Source File Reference Index

The following table indexes all authoritative source files in the project repository that define this design system:

| File Path                                               | Architecture Role           | Key Elements Defined                                                        |
| :------------------------------------------------------ | :-------------------------- | :-------------------------------------------------------------------------- |
| `src/styles/tokens.css`                                 | Design Token Engine         | CSS variables, color palettes (Blue, Green, Red, etc.), radii, transitions. |
| `src/styles/globals.css`                                | Global Layout & Reset       | Typography, `.geo-card`, grid utilities, scrollbars, responsive rules.      |
| `src/components/dashboard/AppShell.tsx`                 | App Layout Container        | Sidebar state, layout wrapper, max-width constraints, header integration.   |
| `src/components/dashboard/Header.tsx`                   | Top Navigation Bar          | View title, collapse toggle, global search, theme toggle, profile menu.     |
| `src/components/dashboard/Sidebar.tsx`                  | Main Navigation Rail        | Expanded/collapsed rail logic, brand mark, navigation groups, tooltips.     |
| `src/components/dashboard/MainDashboardView.tsx`        | Dashboard View Assembly     | Assembly of all 5 operational sections and layout grid proportions.         |
| `src/components/dashboard/WorkSessionOverviewBar.tsx`   | Operational Session Header  | Greeting banner, attendance metrics, leave balances, quick action CTAs.     |
| `src/components/dashboard/KpiCardsGrid.tsx`             | KPI Metrics Grid            | 4-column metric cards, delta tags, operational counters.                    |
| `src/components/dashboard/ProjectProgressSection.tsx`   | Engineering Project Tracker | Project items, stage indicators, milestone progress meters.                 |
| `src/components/dashboard/InquiryOverviewSection.tsx`   | Client Inquiries Queue      | Ingestion pipeline, urgency status tags, client action triggers.            |
| `src/components/dashboard/DailyActivitiesSection.tsx`   | Operational Audit Log       | Chronological timeline stream, activity tags, relative timestamps.          |
| `src/components/dashboard/TimelineSummarySection.tsx`   | Forward Milestone Calendar  | Deadlines, schedule badges, officer assignments.                            |
| `src/components/dashboard/FinancialRecoverySection.tsx` | Financial Recovery Ledger   | Billing vs. recovery breakdown, aging invoice tables.                       |
| `src/components/common/Badge.tsx`                       | Universal Badge Primitive   | Semantic status pills, color variants, indicator dots.                      |
| `src/components/common/Button.tsx`                      | Universal Button Primitive  | Primary, secondary, outline, ghost styles and dimensional sizing.           |
| `src/components/common/GeoBrandLogo.tsx`                | Brand Identity Graphic      | Geometric SVG brand mark and corporate typography styling.                  |
| `src/types/dashboard.ts`                                | Data Contracts              | TypeScript interfaces for users, projects, KPIs, inquiries, milestones.     |
| `src/data/mockDashboardData.ts`                         | Operational Data Fixtures   | Verified mock values for all dashboard cards and operational lists.         |
