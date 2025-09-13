class SendOtpMailerJob < ApplicationJob
  queue_as :default

  def perform(otp_id)
    otp = Otp.find(otp_id)
    OtpMailer.send_otp(otp).deliver_now
  end
end
