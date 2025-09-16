class User < ApplicationRecord
  has_many :assessment_sessions, dependent: :destroy

  enum :role, { staff: "staff", student: "student" }, prefix: true

  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates_format_of :email, with: URI::MailTo::EMAIL_REGEXP, if: -> { email.present? }
  validates :role, presence: true

  # Profile validations
  validates :user_personal_id, presence: true, if: :profile_complete
  validates :name, presence: true, if: :profile_complete
  validates :department, presence: true, if: :profile_complete

  before_save :downcase_email

  private

  def downcase_email
    self.email = email.downcase if email.present?
  end
end
