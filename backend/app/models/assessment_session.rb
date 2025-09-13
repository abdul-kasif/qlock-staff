class AssessmentSession < ApplicationRecord
  belongs_to :staff

  enum status: { active: 0, completed: 1 }, _prefix: true

  validates :title, presence: true
  validates :google_form_url, presence: true, format: { with: URI::DEFAULT_PARSER.make_regexp, message: "must be a valid URL"}
  validates :test_duration_minutes, presence: true, numericality: { greater_than: 0 }
  validates :access_code, presence: true, uniqueness: { scope: :status, where: -> { active }}

  before_validation :generate_access_code, on: :create

  private

  def generate_access_code
    self.access_code = loop do
      token = SecureRandom.alphanumeric(6).upcase
      break token unless AssessmentSession.active.exists?(access_code: token)
    end
  end
end
