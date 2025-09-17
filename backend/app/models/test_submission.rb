class TestSubmission < ApplicationRecord
  belongs_to :user
  belongs_to :assessment_session

  enum :status, { started: "started", submitted: "submitted", abandoned: "abandoned" }, prefix: true

  validates :user_id, presence: true
  validates :assessment_session_id, presence: true
  validates :started_at, presence: true

  # Centralized method to start/resume a test session
  def self.start_for_user(user, access_code)
    # Find active session
    session = AssessmentSession.status_active.find_by!(access_code: access_code)

    # Check if already submitted
    existing = find_by(user_id: user.id, assessment_session_id: session.id)
    if existing && existing.status_submitted?
      raise ActiveRecord::RecordInvalid.new(self.new), "You have already submitted this test"
    end

    # Create or resume
    submission = existing || new(
      user: user,
      assessment_session: session,
      started_at: Time.current,
      status: 'started'
    )

    # Save and return
    submission.save!
    { submission: submission, session: session, can_resume: existing.present? }
  end

  # Centralized method to submit a test
  def self.submit_for_user(user, session_id)
    submission = find_by!(user_id: user.id, assessment_session_id: session_id)

    if submission.status_submitted?
      raise ActiveRecord::RecordInvalid.new(submission), "Test already submitted"
    end

    submission.update!(
      submitted_at: Time.current,
      status: 'submitted'
    )

    submission
  end
end