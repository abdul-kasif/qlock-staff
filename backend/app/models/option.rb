class Option < ApplicationRecord
  belongs_to :question

  validates :text, presence: true
  validates :order, presence: true, numericality: { greater_than_or_equal_to: 0 }

  # Ensure only one correct option per question
  validate :only_one_correct_option_per_question

  private

  def only_one_correct_option_per_question
    return unless is_correct
    if question.options.where(is_correct: true).where.not(id: id).exists?
      errors.add(:is_correct, "Only one correct option allowed per question")
    end
  end
end
