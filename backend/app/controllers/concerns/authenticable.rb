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
      @current_user = User.find_by(id: payload[:user_id])

      if @current_user.nil?
        return render json: { error: "Invalid token"}, status: :unauthorized
      end
    rescue StandardError => e
      Rails.logger.error "JWT Auth Error #{e.message}"
      return render json: { error: e.message}, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end