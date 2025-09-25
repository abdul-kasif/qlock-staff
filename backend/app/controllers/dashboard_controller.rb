class DashboardController < ApplicationController
  include Authenticable
  before_action :authenticate_user!

  def show
    if current_user.role_student?
      render json: {
        user: user_data,
        taken_quizzes: taken_quizzes
      }, status: :ok
    else
      render json: {
        user: user_data,
        active_quizzes: active_quizzes,
        completed_quizzes: completed_quizzes
      }, status: :ok
    end
  rescue StandardError => e
    Rails.logger.error "Dashboard Fetch Error: #{e.message}"
    render json: { error: "Failed to load dashboard: #{e.message}" }, status: :internal_server_error
  end

  private

  def user_data
    {
      user_id: current_user.id,
      user_personal_id: current_user.user_personal_id,
      name: current_user.name,
      department: current_user.department,
      email: current_user.email,
      role: current_user.role,
      profile_complete: current_user.profile_complete
    }
  end

  # ➤ For STAFF: Active Quizzes
  def active_quizzes
    current_user.quizzes.status_active.order(started_at: :desc).map do |quiz|
      {
        id: quiz.id,
        title: quiz.title,
        degree: quiz.degree,
        semester: quiz.semester,
        subject_code: quiz.subject_code,
        subject_name: quiz.subject_name,
        time_limit_minutes: quiz.time_limit_minutes,
        access_code: quiz.access_code,
        started_at: quiz.started_at,
        created_at: quiz.created_at
      }
    end
  end

  # ➤ For STAFF: Completed Quizzes
  def completed_quizzes
    current_user.quizzes.status_completed.order(ended_at: :desc).map do |quiz|
      {
        id: quiz.id,
        title: quiz.title,
        degree: quiz.degree,
        semester: quiz.semester,
        subject_code: quiz.subject_code,
        subject_name: quiz.subject_name,
        time_limit_minutes: quiz.time_limit_minutes,
        access_code: quiz.access_code,
        started_at: quiz.started_at,
        ended_at: quiz.ended_at,
        created_at: quiz.created_at
      }
    end
  end

  # ➤ For STUDENTS: Taken Quizzes
  def taken_quizzes
    current_user.quiz_submissions.includes(:quiz).order(submitted_at: :desc).map do |submission|
      {
        quiz_title: submission.quiz.title,
        degree: submission.quiz.degree,
        semester: submission.quiz.semester,
        subject_code: submission.quiz.subject_code,
        subject_name: submission.quiz.subject_name,
        started_at: submission.started_at,
        submitted_at: submission.submitted_at,
        status: submission.status,
        score: submission.score
      }
    end
  end
end
