class QuestionSerializer < ActiveModel::Serializer
  attributes :id, :text, :order

  has_many :options
end
