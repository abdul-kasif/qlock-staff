class Staff < ApplicationRecord
  has_many :assessment_sessions, dependent: :destroy
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates_format_of :email, with: URI::MailTo::EMAIL_REGEXP, if: -> { email.present? }

  # Profile validations
  validates :staff_personal_id, presence: true, if: :profile_complete
  validates :name, presence: true, if: :profile_complete
  validates :department, presence: true, if: :profile_complete

  before_save :downcase_email

  private

  def downcase_email
    self.email = email.downcase if email.present?
  end
end
