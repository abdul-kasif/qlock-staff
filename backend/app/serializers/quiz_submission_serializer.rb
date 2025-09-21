class QuizSubmissionSerializer < ActiveModel::Serializer
  attributes :id, :started_at, :submitted_at, :status, :score

  belongs_to :user, key: :student
  has_many :answers
end
