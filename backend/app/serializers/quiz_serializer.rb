class QuizSerializer < ActiveModel::Serializer
  attributes :id, :title, :degree, :semester, :subject_code, :subject_name,
             :time_limit_minutes, :access_code, :status, :started_at, :ended_at,
             :created_at, :updated_at
             
  has_many :questions
end