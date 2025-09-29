class StudentQuizzesController < ApplicationController
  include Authenticable
  before_action :authenticate_user!

  # ➤ GET /student_quizzes/access/:access_code
  def show
    unless current_user.role_student?
      return render json: { error: "Access denied, Students only" }, status: :forbidden
    end

    quiz = Quiz.status_active.find_by!(access_code: params[:access_code])

    # Check if already submitted
    submission = current_user.quiz_submissions.find_by(quiz: quiz)
    if submission&.status_submitted?
      return render json: { error: "Already submitted" }, status: :unprocessable_entity
    end

    # Create or resume submission
    submission ||= current_user.quiz_submissions.build(quiz: quiz, started_at: Time.current, status: 'started')
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
                text: option.text
              }
            end
          }
        end
      }
    }
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "Quiz fetch failed: #{e.message}"
    render json: { error: "Invalid or expired access code" }, status: :not_found
  end
end