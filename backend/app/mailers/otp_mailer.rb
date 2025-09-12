class OtpMailer < ApplicationMailer
  default from: "abdulkasif.ra@gmail.com"

  def send_otp(email, otp_code)
    @otp_code = otp_code
    @email = email
    mail(
      to: email,
      subject: "Your OTP Code"
    )
  end
end
