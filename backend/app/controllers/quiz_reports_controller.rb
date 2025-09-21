class QuizReportsController < ApplicationController
  include Authenticable
  before_action :authenticate_user!
  before_action :ensure_staff

  # ➤ GET /quiz_reports/:quiz_id
  def show
    quiz = current_user.quizzes.find(params[:quiz_id])

    submissions = quiz.quiz_submissions.includes(
      :user,
      { answers: [:question, :selected_option] }
    ).order(submitted_at: :desc)

    render json: {
      quiz_title: quiz.title,
      total_students: submissions.count,
      submissions: submissions.map do |sub|
        {
          id: sub.id,
          student_name: sub.user.name,
          started_at: sub.started_at,
          submitted_at: sub.submitted_at,
          status: sub.status,
          score: sub.score,
          answers: sub.answers.map do |ans|
            {
              question_id: ans.question.id,
              question_text: ans.question.text,
              selected_option_id: ans.selected_option.id,
              selected_option_text: ans.selected_option.text,
              correct: ans.selected_option.is_correct
            }
          end
        }
      end
    }
  end

  private

  def ensure_staff
    unless current_user.role_staff?
      render json: { error: "Access denied. Staff only." }, status: :forbidden
      return false
    end
  end
end
