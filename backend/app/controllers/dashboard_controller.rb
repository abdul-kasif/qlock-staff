class DashboardController < ApplicationController
  include Authenticable
  before_action :authenticate_user!
  
  def show
    if current_user.role_student?
      render json: {
        user:{
          user_id: current_user.id,
          user_personal_id: current_user.user_personal_id,
          name: current_user.name,
          department: current_user.department,
          role: current_user.role,
          profile_complete: current_user.profile_complete 
        }
      }, status: :ok
    else
      render json: {
        user: {
          user_id: current_user.id,
          name: current_user.name,
          email: current_user.email,
          user_personal_id: current_user.user_personal_id,
          department: current_user.department,
          role: current_user.role,
          profile_complete: current_user.profile_complete
        },
        active_sessions: active_sessions.as_json(only: [:id, :title, :google_form_url, :test_duration_minutes, :access_code, :started_at]),
        history_sessions: history_sessions.as_json(only: [:id, :title, :google_form_url, :test_duration_minutes, :started_at, :ended_at])
      }, status: :ok
    end
  rescue StandardError => e
    Rails.logger.error "Failed to fetch user info #{e.message}"
    return render json: { error: "Failed to fetch user info #{e.message}"}, status: :unprocessable_content
  end

  private

  # Fetch all active assessment sessions
  def active_sessions
    current_user.assessment_sessions.status_active.order(started_at: :desc)
  end
  
  # Fetch all completed asssessment sessions
  def history_sessions
    current_user.assessment_sessions.status_completed.order(started_at: :desc)
  end
end
