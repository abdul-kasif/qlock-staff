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

  # Check OTP is valid or not
  def otp_valid?(input_otp)
    return false unless code.present? && expires_at && expires_at > Time.current
    return false if attempts.to_i >= MAX_OTP_ATTEMPTS.to_i

    if self.code.to_s == input_otp.to_s.strip
      self.destroy
      true
    else
      self.attempts ||= 0
      self.attempts += 1
      save!
      false
    end
  end

  # Check OTP is expired
  def otp_expired?
    true if expires_at.present? && expires_at < Time.current
  end
end
