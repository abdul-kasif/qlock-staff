class QuizSubmissionsController < ApplicationController
  include Authenticable
  before_action :authenticate_user!

  def show
    quiz = Quiz.status_active.find_by!(access_code: params[:access_code])

    # feat(student_quizzes): block new quiz access when quiz is paused or completed
    submission = current_user.quiz_submissions.find_by(quiz: quiz)

    # Create or resume submission
    submission ||= current_user.quiz_submissions.build(quiz: quiz, started_at: Time.current, status: "started")
    submission.save! if submission.new_record?

    render json: {
      quiz: {
        id: quiz.id,
        title: quiz.title,
        time_limit_minutes: quiz.time_limit_minutes,
        questions: quiz.questions.order(:order).map do |question|
          {
            id: question.id,
            text: question.text,
            options: question.options.order(:order).map do |option|
              {
                id: option.id,
                text: option.text,
              }
            end,
          }
        end,
      },
    }
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "Quiz fetch failed: #{e.message}"
    render json: { error: "Invalid or expired access code" }, status: :not_found
  end

  # POST /quiz_submissions
  def create
    unless current_user.role_student?
      return render json: { error: "Access denied, Stundents only" }, status: :forbidden
    end

    quiz = Quiz.find(params[:quiz_id])

    # Allow submission if quiz is active OR paused
    unless quiz.status_active? || quiz.status_paused?
      return render json: { error: "Quiz is closed, can't submit." }, status: :forbidden
    end

    submission = QuizSubmission.find_or_initialize_by(user: current_user, quiz: quiz)

    if submission.status_submitted?
      return render json: { error: "You have already submitted this quiz." }, status: :forbidden
    end

    # Submit answers + auto-grade
    answers = params[:answers] || []
    submission.submit_answers!(answers)

    render json: submission, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_content
  end
end
