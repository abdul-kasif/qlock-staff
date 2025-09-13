class DashboardController < ApplicationController
  include Authenticable
  before_action :authenticate_user!
  
  def show
    staff = current_staff

    render json: {
      user: {
        staff_id: staff.id,
        name: staff.name,
        emall: staff.email,
        staff_personal_id: staff.staff_personal_id,
        department: staff.department
      }
    }, status: :ok

  rescue StandardError => e
    Rails.logger.error "Failed to fetch user info #{e.message}"
    return render json: { error: "Failed to fetch user info #{e.message}"}, status: :unprocessable_content
  end
end
