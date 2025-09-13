class Staff < ApplicationRecord
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates_format_of :email, with: URI::MailTo::EMAIL_REGEXP, if: -> { email.present? }

  before_save :downcase_email

  private

  def downcase_email
    self.email = email.downcase if email.present?
  end
end
