class Answer < ApplicationRecord
  belongs_to :quiz_submission
  belongs_to :question
  belongs_to :selected_option, class_name: 'Option'

  validates :question_id, uniqueness: { scope: :quiz_submission_id }
  validates :selected_option_id, presence: true

  # Ensure selected option belongs to question
  validate :option_belongs_to_question

  private

  def option_belongs_to_question
    unless question.options.exists?(id: selected_option_id)
      errors.add(:selected_option_id, "does not belong to this question")
    end
  end
end