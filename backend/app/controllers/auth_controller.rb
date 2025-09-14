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

  def verify_otp
    email = params.require(:email).downcase.strip
    input_otp = params.require(:code)

    # Check Email and OTP are empty
    if email.blank? || input_otp.blank?
      return render json: { error: "Email and OTP are required" }, status: :bad_request
    end

    # Find email from OTP table
    otp = Otp.find_by(email: email)

    # Check OTP exists
    if otp.nil?
      return render json: { error: "Not Found, Please request a new one"}, status: :not_found
    end
    
    # Check OTP is expired or not
    if otp.otp_expired?
      return render json: { error: "OTP expired, Please request a new one"}, status: :unprocessable_content
    end

    # Check the input OTP is vaild or not
    if otp.otp_valid?(input_otp)
      staff = Staff.find_by(email: email) # check whether the user exist and profile is complete

      if staff.nil?
        staff = Staff.create!(email: email, profile_complete: false)
        is_new_staff = true
      else
        is_new_staff = !staff.profile_complete
      end

      # Establish session
      token = JwtService.encode(staff_id: staff.id)

      render json: {
        message: "OTP verified successfully",
        is_new_staff: is_new_staff,
        staff_id: staff.id,
        token: token # JWT Token , store this in frontend locally
      }, status: :ok

    else
      if otp.attempts.to_i >= MAX_OTP_ATTEMPTS.to_i
        return render json: { error: "Too many attempt, Please generate a new one"}, status: :locked
      else
        return render json: { error: "Invalid OTP"}, status: :unprocessable_content
      end
    end
  rescue StandardError => e
    Rails.logger.error "OTP Verification Error #{e.message}"
    render json: { error: "Verification failed. Please try again." }, status: :internal_server_error
  end
end
