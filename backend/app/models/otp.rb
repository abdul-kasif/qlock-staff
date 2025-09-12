class Otp < ApplicationRecord
  validates :email, presence: true
  validates :code, presence: true
  validates :expires_at, presence: true
  validates_format_of :email, with: URI::MailTo::EMAIL_REGEXP, if: -> { email.present? }

  before_create :cleanup_expired

  private

  def cleanup_expired
    Otp.where(email: email).where("expires_at > ?", Time.current).delete_all
  end
end
