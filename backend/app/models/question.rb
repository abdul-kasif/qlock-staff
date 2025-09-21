class Question < ApplicationRecord
  belongs_to :quiz
  has_many :options, dependent: :destroy

  accepts_nested_attributes_for :options, allow_destroy: false
  
  validates :text, presence: true
  validates :order, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validate :unique_order_within_quiz

  private

  def unique_order_within_quiz
    if quiz.questions.where.not(id: id).exists?(order: order)
      errors.add(:order, "must be unique within quiz")
    end
  end
end
