class AssessmentSessionController < ApplicationController
  include Authenticable
  before_action :authenticate_user!

  # Create a new assessment session
  def create
    unless current_user.role_staff?
      return render json: { error: "Access denied, Staff only"}, status: :forbidden
    end
    session = current_user.assessment_sessions.create!(
      title: session_params[:title],
      google_form_url: session_params[:google_form_url],
      test_duration_minutes: session_params[:test_duration_minutes],
      started_at: Time.current,
      status: :active,
      ended_at: nil
    )

    render json: {
      message: "Session created successfully",
      session: {
        id: session.id,
        title: session.title,
        google_form_url: session.google_form_url,
        test_duration_minutes: session.test_duration_minutes,
        started_at: session.started_at,
        status: session.status
      }
    }, status: :created

  rescue StandardError => e
    Rails.logger.error "Failed to create assessment session #{e.message}"
    render json: { error: "Failed to create assessment session #{e.message}"}, status: :unprocessable_content
  end

  # Stop an active assessment session
  def stop
    unless current_user.role_staff?
      return render json: { error: "Access Denied, Staff only" }, status: :forbidden
    end
    session = current_user.assessment_sessions.status_active.find(params[:id])

    session.update!(
      status: :completed,
      ended_at: Time.current
    )

    render json: {
      message: "Session ended successfully",
      session: {
        id: session.id,
        status: session.status,
        ended_at: session.ended_at
      }
    }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Active session not found"}, status: :not_found
  rescue StandardError => e
    Rails.logger.error "Failed to stop the session #{e.message}"
    render json: { error: "Failed to stop the session #{e.message}"}, status: :unprocessable_content
  end

  # Fetch all active assessment sessions
  def active
    sessions = current_user.assessment_sessions.status_active.order(started_at: :desc)
    render json: {
      sessions: sessions.as_json(only: [:id, :title, :google_form_url, :access_code, :test_duration_minutes, :started_at])
    }, status: :ok
  rescue StandardError => e
    Rails.logger.error "Failed to fetch active sessions #{e.message}"
    render json: { error: "Failed to fetch active sessions #{e.message}"}, status: :unprocessable_content
  end

  # Fetch all completed assessment sessions
  def history
    sessions = current_user.assessment_sessions.status_completed.order(started_at: :desc)
    render json: {
      sessions: sessions.as_json(only: [:id, :title, :google_form_url, :test_duration_minutes, :started_at, :ended_at])
    }, status: :ok 
  rescue StandardError => e
    Rails.logger.error "Failed to fetch active sessions #{e.message}"
    render json: { error: "Failed to fetch active sessions #{e.message}"}, status: :unprocessable_content
  end

  def delete
    unless current_user.role_staff?
      return render json: { error: "Access Denied, Staff only" }, status: :forbidden 
    end
    session = current_user.assessment_sessions.status_completed.find_by(id: params[:id])
    if session.nil?
      render json: { error: "Session not found" }, status: :not_found
      return
    end
    session.destroy
    render json: {
      message: "Session deleted successfully"
    }, status: :ok
  rescue ActiveRecord::InvalidForeignKey => e
    Rails.logger.error "Foreign key violation while deleting session #{e.message}"
    render json: { error: "Cannot delete session: it is referenced by submissions" }, status: :bad_request
  rescue StandardError => e
    Rails.logger.error "Failed to delete session #{e.message}"
    render json: { error: "Failed to delete session #{e.message}" }, status: :unprocessable_content
  end

  private
 
  # Strong parameters for session creation 
  def session_params
    params.permit(:title, :google_form_url, :test_duration_minutes)
  end
end
