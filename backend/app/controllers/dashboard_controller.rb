class DashboardController < ApplicationController
  include Authenticable
  before_action :authenticate_user!
  
  def show
    staff = current_staff

    render json: {
      user: {
        staff_id: staff.id,
        name: staff.name,
        email: staff.email,
        staff_personal_id: staff.staff_personal_id,
        department: staff.department,
        profile_complete: staff.profile_complete
      },
      active_sessions: active_sessions.as_json(only: [:id, :title, :google_form_url, :test_duration_minutes, :access_code, :started_at]),
      history_sessions: history_sessions.as_json(only: [:id, :title, :google_form_url, :test_duration_minutes, :started_at, :ended_at])
    }, status: :ok
  rescue StandardError => e
    Rails.logger.error "Failed to fetch user info #{e.message}"
    return render json: { error: "Failed to fetch user info #{e.message}"}, status: :unprocessable_content
  end

  private

  # Fetch all active assessment sessions for specified staff
  def active_sessions
    current_staff.assessment_sessions.status_active.order(started_at: :desc)
  end
  
  # Fetch all completed asssessment sessions for specified staff
  def history_sessions
    current_staff.assessment_sessions.status_completed.order(started_at: :desc)
  end
end
