class StudentQuizzesController < ApplicationController
  include Authenticable
  before_action :authenticate_user!

  # ➤ GET /student_quizzes/access/:access_code
  def show
    unless current_user.role_student?
      return render json: { error: "Access denied, Students only" }, status: :forbidden
    end

    quiz = Quiz.find_by!(access_code: params[:access_code])

    # Only allow access if quiz is ACTIVE (not paused or completed)
    unless quiz.status_active?
      return render json: { error: "Quiz is not accepting new participants (paused or ended)" }, status: :forbidden
    end

    # Check if already submitted
    submission = current_user.quiz_submissions.find_by(quiz: quiz)
    if submission&.status_submitted?
      return render json: { error: "Already submitted" }, status: :unprocessable_entity
    end

    render json: {
      message: "valid access code",
      quiz: {
        id: quiz.id,
        title: quiz.title,
        time_limit_minutes: quiz.time_limit_minutes,
      },
    }, status: :ok
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "Quiz fetch failed: #{e.message}"
    render json: { error: "Invalid or expired access code" }, status: :not_found
  end
end
