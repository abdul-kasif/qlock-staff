class OptionSerializer < ActiveModel::Serializer
  attributes :id, :text, :is_correct, :order
end
