class TestSessionsController < ApplicationController
  include Authenticable
  before_action :authenticate_user!

  def start 
    unless current_user.role_student?
      return render json: { error: "Access Denied, Student only"}, status: :forbidden
    end

    access_code = params.require(:access_code)
    result = TestSubmission.start_for_user(current_user, access_code)
  
    render json: {
      valid: true,
      session: session_data(result[:session]),
      can_resume: result[:can_resume]
    }, status: :ok
  rescue ActionController::ParameterMissing => e
    render json: { valid: false, error: "Access code is required" }, status: :bad_request
  rescue ActiveRecord::RecordNotFound
    render json: { valid: false, error: "Invalid or expired access code" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { valid: false, error: e.message }, status: :forbidden
  rescue => e
    Rails.logger.error "Test Session Start Error: #{e.message}"
    render json: { valid: false, error: "Failed to start test session" }, status: :internal_server_error
  end

  # ➤ POST /api/v1/test_sessions/submit
  def submit
    unless current_user.role_student?
      return render json: { error: "Access Denied, Student only" }, status: :forbidden
    end
    session_id = params.require(:session_id)
    submission = TestSubmission.submit_for_user(current_user, session_id)

    render json: {
      message: "Test submitted successfully",
      submitted_at: submission.submitted_at
    }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Submission record not found" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :forbidden
  rescue => e
    Rails.logger.error "Test Submission Error: #{e.message}"
    render json: { error: "Failed to submit test" }, status: :internal_server_error
  end

  private

  def session_data(session)
    {
      id: session.id,
      title: session.title,
      google_form_url: session.google_form_url,
      test_duration_minutes: session.test_duration_minutes,
      started_at: session.started_at
    }
  end
end
