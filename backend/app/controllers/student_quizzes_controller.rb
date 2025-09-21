class StudentQuizzesController < ApplicationController
  include Authenticable
  before_action :authenticate_user!

  # ➤ GET student_quizzes/access/:access_code
  def show
    unless current_user.role_student?
      return render json: { error: "Access denied, Stundents only"}, status: :forbidden
    end

    @quiz = Quiz.status_active.find_by!(access_code: params[:access_code])

    render json: {
      quiz: {
        id: @quiz.id,
        title: @quiz.title,
        time_limit_minutes: @quiz.time_limit_minutes,
        questions: @quiz.questions.order(:order).map do |q|
          {
            id: q.id,
            text: q.text,
            options: q.options.order(:order).map do |opt|
              {
                id: opt.id,
                text: opt.text
              }
            end
          }
        end
      }
    }
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "Failed to fetch the quiz #{e.message}"
    render json: { error: "Invalid or expired access code" }, status: :not_found
  end
end