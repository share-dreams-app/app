# Shared Dreams MVP Design

**Date:** 2026-04-15
**Status:** Draft validated in brainstorming
**Product Stage:** MVP
**Primary GTM Beachhead:** Couples
**Product Model:** Relationship-agnostic collaboration (supporter/invitee model)

## 1. Product Vision and Positioning

Shared Dreams is a B2C product that helps people convert dreams/goals into executable plans with stages and tasks, then collaborate with one important person for support and accountability.

The product architecture is relationship-agnostic (it supports partner, friend, sibling, family member), but go-to-market starts with couples to maximize early clarity of value and retention.

## 2. MVP Scope

### In Scope

- Create and manage dreams/goals with deadline and status.
- Break dreams into stages and active tasks.
- Weekly progress check-ins.
- Invite one supporter per dream after dream creation.
- Supporter collaboration: comments, encouragement, milestone celebration, and task suggestions.
- Reward definition at dream and task levels.
- Per-dream permission modes controlled by dream owner.
- Hybrid smart suggestions: template/rule-based baseline plus AI-assisted personalization.
- Freemium limits and premium upgrades.

### Out of Scope (MVP)

- Ads.
- Group collaboration beyond one supporter per dream.
- Native mobile app launch (web-first).
- Partner marketplace/coupon integrations for rewards.

## 3. Success Metrics (First 60 Days)

### Primary Metric

- Weekly retention across 4 consecutive weeks.
- Operational definition for analysis: users active in Week 1 who return in Weeks 2, 3, and 4.

### Secondary Signals

- Activation: user creates first dream and at least 3 tasks in first session.
- Collaboration adoption: supporter invited within 7 days.
- Weekly consistency: check-in completion rate.
- Execution signal: task completion frequency per active dream.
- Reward engagement: percent of active dreams with at least one defined reward.

## 4. Functional Architecture and Components

### 4.1 Account and Identity

- User account creation and authentication.
- User owns private dreams by default.

### 4.2 Dream Management

- Dream entity fields: title, context, deadline, status (`active`, `completed`, `archived`).
- Dreams start private.
- Owner can invite one supporter later.

### 4.3 Planning Engine (Stages and Tasks)

- Dreams contain stages.
- Stages contain tasks.
- Task fields: title, priority, due date, owner/assignee, status (`active`, `completed`).

### 4.4 Check-in System

- Recurring progress registration per dream.
- Weekly cadence is guided by reminders (not hard-blocked by strict deadlines).
- Minimum check-in payload: progress status and next steps.
- Optional blockers field with explicit support request.

### 4.5 Collaboration Layer

- Supporter actions: comment, suggest task, celebrate milestone.
- All collaboration happens inside the dream context.

### 4.6 Permission Model (Per Dream)

- Mode A: supporter can view and comment.
- Mode B: supporter can suggest tasks; owner must approve.
- Mode C: supporter can edit directly.
- Owner can switch mode at any time; changes apply immediately.

### 4.7 Smart Suggestions (Hybrid)

- Baseline recommendations from templates and deterministic rules.
- AI layer proposes personalized alternatives and refinements.
- User confirms before adding suggestions to plan.
- If AI fails, template/rule fallback remains available.

### 4.8 Freemium and Premium Entitlements

#### Free

- Up to 3 active dreams.
- Up to 5 active tasks per dream.
- Completing, archiving, or deleting frees active slots.
- One supporter per dream (MVP cap).
- Manual reward creation at dream/task level.
- Basic reward templates (non-personalized).

#### Premium

- Shared Dreams Space for pair collaboration.
- Unlimited dreams and tasks.
- Advanced AI suggestions.
- Progress reports and insights.
- Supporter cap per dream remains one in MVP (premium expands depth, not collaborator count).
- Personalized AI reward suggestions based on relationship profile and goal context.

### 4.9 Relationship Profile (For Personalization)

- Optional profile fields to improve suggestions: age range, relationship type, relationship duration, and objective context.
- Profile is editable and used only to personalize recommendation quality.
- Product language remains relationship-agnostic (partner/friend/family/mentor use cases).

### 4.10 Reward System

- Rewards can be attached to dream completion and/or specific task milestones.
- Reward can be defined manually by users.
- Free tier receives generic templates for quick setup.
- Premium tier receives personalized AI reward suggestions.
- Users always review and confirm reward before saving.

## 5. Core User Flows

### 5.1 Activation Flow

1. User creates account.
2. User creates first dream with deadline.
3. User creates initial tasks.
4. User submits first check-in.
5. User optionally invites one supporter (recommended in onboarding prompts).

### 5.2 Collaboration Flow

1. Owner sends invitation to supporter.
2. Supporter accepts invitation.
3. Supporter interacts according to permission mode.
4. Owner receives notifications and approves suggestions when needed.

### 5.3 Ongoing Execution Flow

1. User progresses tasks and closes completed tasks.
2. User performs weekly check-ins.
3. Supporter reinforces consistency through comments and celebrations.
4. Dream advances through stages until completion.
5. On milestone completion, system prompts reward execution/logging.

## 6. Data Flow and Event Model

### 6.1 Interaction Flow

- Dream creation triggers baseline task suggestions.
- Dream/task completion triggers reward prompt.
- User can accept/edit/reject suggested tasks.
- User can accept/edit/reject reward suggestions.
- Supporter activity generates notifications.
- Check-ins update progress timeline and insight inputs.

### 6.2 Minimum Analytics Events

- `dream_created`
- `task_created`
- `checkin_submitted`
- `supporter_invited`
- `support_interaction` (comment/suggestion/celebration)
- `task_completed`
- `dream_completed`
- `reward_defined`
- `reward_completed`
- `reward_ai_suggested`
- `reward_ai_accepted`
- `weekly_active_user`

## 7. Error Handling and Edge Cases

- Invalid/expired invitation: show clear reason and one-click resend.
- Free limit reached: explain constraint and show path to resolve (complete/archive/delete/upgrade).
- Concurrent edit conflict: keep latest valid state and show update notice.
- AI suggestion failure: fallback to template/rule recommendations.
- AI reward suggestion failure: fallback to generic reward templates/manual entry.
- Long inactivity: trigger guided return with "next best action" prompt.

## 8. Validation and Experiment Plan

### 8.1 Core Hypothesis

If users break dreams into tasks and receive supporter collaboration, weekly consistency and retention improve.

### 8.2 Lightweight MVP Experiments

- Onboarding timing test:
  - Variant A: invite supporter during onboarding.
  - Variant B: invite supporter after first check-in.
- Goal: identify higher retention with lower onboarding drop-off.

### 8.3 Monetization Validation

- Trigger paywall on active-limit boundary.
- Measure upgrade conversion after limit-hit events.
- Measure premium feature usage depth (shared space, advanced AI, insights).
- Measure conversion impact of personalized reward suggestions.

## 9. Testing Strategy (Product Validation)

- New user can create one dream and three tasks without external help.
- A pair can complete one collaboration cycle (invite, comment/suggest, check-in).
- Users can define and complete one reward flow (manual or AI-suggested depending on tier).
- Permission mode changes take effect immediately and predictably.
- Notification behaviors support continuity without noise.
- Weekly loop is clear enough to drive repeated return.

## 10. Platform and Delivery Strategy

- Launch format: web-first responsive experience.
- Hosting/runtime: Cloudflare (free-tier friendly start).
- Managed database: Supabase PostgreSQL (free-tier friendly start).
- Mobile-native apps are explicitly post-MVP.

## 11. Design Decisions and Rationale

- **GTM in couples first:** clearer message, stronger natural collaboration loop.
- **Product model relationship-agnostic:** avoids future re-architecture for friends/family/mentor use cases.
- **Execution-first MVP:** prioritizes retention proof over broad social surface.
- **Hybrid suggestion model:** controls cost/risk while still delivering AI-assisted value.
- **Reward reinforcement loop:** milestone-based rewards strengthen motivation and weekly return behavior.

## 12. MVP Release Readiness Criteria

- End-to-end flow works: create dream -> plan tasks -> invite supporter -> weekly check-in.
- Free and premium limits/entitlements behave as specified.
- Analytics events required for retention analysis are emitted.
- Core error states are handled with clear user guidance.
- Retention and activation dashboards can be computed from collected events.
