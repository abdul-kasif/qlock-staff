class AnswerSerializer < ActiveModel::Serializer
  attributes :id

  belongs_to :question
  belongs_to :selected_option, key: :option

  attribute :is_correct do
    object.selected_option.is_correct
  end
end
