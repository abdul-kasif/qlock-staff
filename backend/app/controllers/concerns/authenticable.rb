module Authenticable
  extend ActiveSupport::Concern

  private

  def authenticate_user!
    token = request.headers["Authorization"]&.split(' ')&.last
    if token.blank?
      return render json: { error: "Missing token"}, status: :unauthorized
    end

    begin
      payload = JwtService.decode(token)
      @current_staff = Staff.find_by(id: payload[:staff_id])

      if @current_staff.nil?
        return render json: { error: "Invalid token"}, status: :unauthorized
      end
    rescue StandardError => e
      Rails.logger.error "JWT Auth Error #{e.message}"
      return render json: { error: e.message}, status: :unauthorized
    end
  end

  def current_staff
    @current_staff
  end
end