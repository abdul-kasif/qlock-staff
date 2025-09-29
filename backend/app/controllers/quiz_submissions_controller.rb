class QuizSubmissionsController < ApplicationController
  include Authenticable
  before_action :authenticate_user!

  # ➤ POST /quiz_submissions
  def create
    unless current_user.role_student?
      return render json: { error: "Access denied, Stundents only" }, status: :forbidden
    end

    quiz = Quiz.find(params[:quiz_id])
    submission = QuizSubmission.find_or_initialize_by(user: current_user, quiz: quiz)

    if submission.status_submitted?
      return render json: { error: "You have already submitted this quiz." }, status: :forbidden
    end

    # Submit answers + auto-grade
    submission.submit_answers!(answer_params)

    render json: submission, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_content
  end

  private

  def answer_params
    params.require(:answers).map do |ans|
      {
        question_id: ans[:question_id],
        selected_option_id: ans[:selected_option_id]
      }
    end
  end
end
