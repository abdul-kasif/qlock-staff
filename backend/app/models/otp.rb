class Otp < ApplicationRecord
  validates :email, presence: true
  validates_format_of :email, with: URI::MailTo::EMAIL_REGEXP, if: -> { email.present? }

  before_save :downcase_email

  # Downcase the email before saving.
  def downcase_email
    self.email = email.downcase.strip if email.present?
  end

  # Generate the OTP 
  def generate_otp
    self.code = rand(100000..999999).to_s
    self.expires_at = OTP_EXPIRY_MINUTES.minutes.from_now
    self.attempts = 0
    save!
  end

  # def otp_valid?(input_otp)
  #   return false unless code.present? && expires_at && expires_at > Time.current
  #   false if attempts >= MAX_OTP_ATTEMPTS.to_i
  # end
end
