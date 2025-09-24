# app/models/quiz_submission.rb
class QuizSubmission < ApplicationRecord
  belongs_to :user # student
  belongs_to :quiz
  has_many :answers, dependent: :destroy

  enum :status, { started: "started", submitted: "submitted" }, prefix: true

  validates :user_id, uniqueness: { scope: :quiz_id } # One submission per student per quiz

  # Submit answers + auto-grade
  def submit_answers!(answer_params)
    raise "Quiz already submitted" if status_submitted?

    # Use transaction — all or nothing
    transaction do
      answer_params.each do |ans|
        answers.create!(
          question_id: ans[:question_id],
          selected_option_id: ans[:selected_option_id]
        )
      end

      calculate_score!
      update!(submitted_at: Time.current, status: :submitted)
    end
  end

  # Calculate score
  def calculate_score!
    total_questions = quiz.questions.count
    return if total_questions.zero?

    correct_answers = answers.joins(:selected_option).where(options: { is_correct: true }).count
    self.score = ((correct_answers.to_f / total_questions) * 100).to_i
    save!
  end
end
