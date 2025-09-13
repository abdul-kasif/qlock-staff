class AuthController < ApplicationController
  def send_otp
    email = params.require(:email).downcase.strip
    
    # Check email is empty
    if email.blank?
      return render json: { error: "Email is required"}, status: :bad_request
    end
    
    # Check email format is valid
    unless email.match?(URI::MailTo::EMAIL_REGEXP)
      return render json: { error: "Invalid email format"}, status: :bad_request
    end

    # Create or find OTP 
    otp = Otp.find_or_initialize_by(email: email)

    otp.generate_otp

    # Call SendOtpMailer job -> in production, use perform_later
    SendOtpMailerJob.perform_now(otp.id)

    render json: {
      message: "OTP sent to #{email}",
    }, status: :ok

  rescue StandardError => e
    Rails.logger.error "OTP Request Error: #{e.message}"
    render json: { error: "Failed to send OTP. Please try again." }, status: :internal_server_error
  end
end
