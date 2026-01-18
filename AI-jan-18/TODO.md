# Counseling System Upgrade - TODO List

## Phase 1: Backend Model Updates ✅ COMPLETED
- [x] Update CounselingSession model with new fields
  - session_type (academic, behavioral, personal, career)
  - severity (low, medium, high, critical)
  - outcomes (text field for session outcomes)
  - next_steps (text field for follow-up actions)
  - status (scheduled, completed, cancelled, no-show)

## Phase 2: Backend API Endpoints ✅ COMPLETED
- [x] GET /counseling/sessions - List all sessions for teacher
- [x] GET /counseling/student/<student_id> - Get sessions for a specific student
- [x] GET /counseling/<session_id> - Get single session details
- [x] PUT /counseling/<session_id> - Update session
- [x] DELETE /counseling/<session_id> - Delete/cancel session
- [x] GET /counseling/upcoming - Get upcoming follow-ups

## Phase 3: Frontend Updates (IN PROGRESS)
- [ ] Add counseling history section in Teacher Dashboard
- [ ] Update Add Counseling form with new fields
- [ ] Add upcoming follow-ups widget
- [ ] Add session cards with status badges
- [ ] Add view/edit session functionality

## Phase 4: Database Migration
- [ ] Create Alembic migration script
- [ ] Test database migration

