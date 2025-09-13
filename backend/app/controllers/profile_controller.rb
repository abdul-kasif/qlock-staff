class ProfileController < ApplicationController
  include Authenticable
  before_action :authenticate_user!
  before_action :ensure_profile_incomplete

  def create
    # Get Current Staff details from Authenticable -> current_staff
    staff = current_staff

    # Update profile fields
    staff.update!(
      staff_personal_id: profile_params[:staff_personal_id],
      name: profile_params[:name],
      department: profile_params[:department],
      profile_complete: true
    )

    render json: {
      message: "Profile created successfully",
      user: {
        staff_id: staff.id,
        name: staff.name,
        email: staff.email,
        staff_personal_id: staff.staff_personal_id,
        department: staff.department,
        profile_complete: staff.profile_complete
      }
    }, status: :ok

  rescue StandardError => e
    Rails.logger.error "Profile Setup Error #{e.message}"
    render json: { error: "Failed to update profile #{e.message}"}, status: :unprocessable_content
  end

  private
  
  def profile_params
    params.require(:profile).permit(:staff_personal_id, :name, :department)
  end

  def ensure_profile_incomplete
    unless current_staff&.profile_complete == false
      render json: { error: "Profile is already complete"}, status: :forbidden
      return false
    end
  end
end
