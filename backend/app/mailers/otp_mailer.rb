class OtpMailer < ApplicationMailer
  default from: "abdulkasif.ra@gmail.com"

  def send_otp(otp_data)
    @otp_code = otp_data.code
    @email = otp_data.email
    mail(
      to: otp_data.email,
      subject: "Your OTP Code"
    )
  end
end
