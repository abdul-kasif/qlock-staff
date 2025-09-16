class ProfileController < ApplicationController
  include Authenticable
  before_action :authenticate_user!
  before_action :ensure_profile_incomplete

  def create
    # Get Current user details from Authenticable -> current_user
    user = current_user

    # Update profile fields
    user.update!(
      user_personal_id: profile_params[:user_personal_id],
      name: profile_params[:name],
      department: profile_params[:department],
      profile_complete: true
    )

    render json: {
      message: "Profile created successfully",
      user: {
        user_id: user.id,
        name: user.name,
        email: user.email,
        user_personal_id: user.user_personal_id,
        department: user.department,
        role: user.role,
        profile_complete: user.profile_complete
      }
    }, status: :ok

  rescue StandardError => e
    Rails.logger.error "Profile Setup Error #{e.message}"
    render json: { error: "Failed to update profile #{e.message}"}, status: :unprocessable_content
  end

  private
  
  def profile_params
    params.require(:profile).permit(:user_personal_id, :name, :department)
  end

  def ensure_profile_incomplete
    unless current_user&.profile_complete == false
      render json: { error: "Profile is already complete"}, status: :forbidden
      return false
    end
  end
end
