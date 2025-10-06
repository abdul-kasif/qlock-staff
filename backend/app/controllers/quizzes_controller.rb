# app/controllers/api/v1/quizzes_controller.rb
class QuizzesController < ApplicationController
  include Authenticable
  before_action :authenticate_user!
  before_action :ensure_staff, only: [:create, :update, :complete, :pause, :resume, :destroy]

  # POST /quizzes
  def create
    service = QuizCreationService.new(current_user, quiz_params)

    if quiz = service.create!
      render json: quiz.as_json(
        include: {
          questions: {
            only: [:id, :text, :order],
            include: {
              options: { only: [:id, :text, :is_correct, :order] },
            },
          },
        },
        except: [:user_id],
      ), status: :created
    else
      render json: { errors: service.quiz.errors }, status: :unprocessable_content
    end
  rescue StandardError => e
    Rails.logger.error "Failed to create the quiz #{e.message}"
    render json: { error: "Failed to create the quiz" }, status: :unprocessable_content
  end

  # PATCH /quizzes/:id
  def update
    @quiz = current_user.quizzes.find(params[:id])

    if @quiz.update(quiz_params.except(:questions)) # Don't allow nested update here
      render json: @quiz
    else
      render json: { errors: @quiz.errors }, status: :unprocessable_content
    end
  rescue StandardError => e
    Rails.logger.error "Failed to update the quiz #{e.message}"
    render json: { error: "Failed to update the quiz" }, status: :unprocessable_content
  end

  # PATCH /quizzes/:id/pause
  def pause
    @quiz = current_user.quizzes.find(params[:id])

    if @quiz.pause!
      render json: @quiz
    else
      render json: { errors: @quiz.errors }, status: :unprocessable_content
    end
  rescue StandardError => e
    Rails.logger.error "Failed to pause the quiz #{e.message}"
    render json: { error: "Failed to pause the quiz" }, status: :unprocessable_content
  end

  # PATCH /quizzes/:id/resume
  def resume
    @quiz = current_user.quizzes.find(params[:id])

    if @quiz.resume!
      render json: @quiz
    else
      render json: { errors: @quiz.errors }, status: :unprocessable_content
    end
  rescue StandardError => e
    Rails.logger.error "Failed to resume the quiz #{e.message}"
    render json: { error: "Failed to resume the quiz" }, status: :unprocessable_content
  end

  # DELETE /api/v1/quizzes/:id
  def destroy
    quiz = current_user.quizzes.find(params[:id])

    # Only allow if: completed AND no submissions
    if !quiz.status_completed?
      return render json: { error: "Quiz must be completed to delete" }, status: :unprocessable_entity
    end

    if quiz.quiz_submissions.exists?
      return render json: { error: "Cannot delete quiz with student submissions" }, status: :unprocessable_entity
    end

    quiz.destroy!
    render json: { message: "Quiz deleted successfully" }, status: :ok
  rescue StandardError => e
    Rails.logger.error "Failed to delete the quiz #{e.message}"
    render json: { error: "Failed to delete the quiz #{e.message}" }, status: :unprocessable_content
  end

  # PATCH /quizzes/:id/complete
  def complete
    @quiz = current_user.quizzes.find(params[:id])
    if @quiz.stop!
      render json: @quiz
    else
      render json: { errors: @quiz.errors }, status: :unprocessable_content
    end
  rescue StandardError => e
    Rails.logger.error "Failed to stop the quiz #{e.message}"
    render json: { error: "Failed to stop the quiz" }, status: :unprocessable_content
  end

  # GET /quizzes (for staff dashboard)
  def index
    @quizzes = current_user.quizzes.order(created_at: :desc)
    render json: @quizzes
  end

  private

  def quiz_params
    permitted = params.require(:quiz).permit(
      :title, :degree, :semester, :subject_code, :subject_name,
      :time_limit_minutes, :started_at, :ended_at,
      questions: [
        :text,
        options: [:text, :is_correct],
      ],
    )
    Rails.logger.info "PERMITTED QUIZ PARAMS: #{permitted.inspect}"
    permitted
  end

  def ensure_staff
    unless current_user.role_staff?
      render json: { error: "Access denied. Staff only." }, status: :forbidden
      false
    end
  end
end
