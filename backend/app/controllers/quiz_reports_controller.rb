class QuizReportsController < ApplicationController
  include Authenticable
  before_action :authenticate_user!
  before_action :ensure_staff

  # GET /quiz_reports/:quiz_id
  def show
    quiz = current_user.quizzes.find(params[:quiz_id])

    # Fetch all questions in order (once)
    all_questions = quiz.questions.order(:order).to_a

    submissions = quiz.quiz_submissions.includes(
      :user,
      { answers: [:question, :selected_option] }
    ).order(submitted_at: :desc)

    render json: {
      quiz_title: quiz.title,
      subject_code: quiz.subject_code,
      subject_name: quiz.subject_name,
      degree: quiz.degree,
      semester: quiz.semester,
      time_limit_minutes: quiz.time_limit_minutes,
      status: quiz.status,
      total_students: submissions.count,
      questions: all_questions.map do |q|
        {
          id: q.id,
          text: q.text,
          order: q.order,
        }
      end,
      submissions: submissions.map do |sub|
        # Build answer map: question_id → answer details
        answer_map = sub.answers.index_by(&:question_id)

        {
          id: sub.id,
          student_name: sub.user.name,
          started_at: sub.started_at,
          submitted_at: sub.submitted_at,
          status: sub.status,
          score: sub.score,
          answers: all_questions.map do |question|
            if answer = answer_map[question.id]
              {
                question_id: question.id,
                selected_option_id: answer.selected_option.id,
                selected_option_text: answer.selected_option.text,
                correct: answer.selected_option.is_correct,
              }
            else
              {
                question_id: question.id,
                selected_option_id: nil,
                selected_option_text: "Not Attempted",
                correct: nil,
              }
            end
          end,
        }
      end,
    }
  end

  private

  def ensure_staff
    unless current_user.role_staff?
      render json: { error: "Access denied. Staff only." }, status: :forbidden
      false
    end
  end
end
