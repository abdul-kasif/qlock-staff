# app/controllers/api/v1/quizzes_controller.rb
class QuizzesController < ApplicationController
  include Authenticable
  before_action :authenticate_user!
  before_action :ensure_staff, only: [:create, :update, :complete, :pause, :resume]

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
    Rails.logger.error "Failed to create quiz #{e.message}"
  end

  # PATCH /quizzes/:id
  def update
    @quiz = current_user.quizzes.find(params[:id])

    if @quiz.update(quiz_params.except(:questions)) # Don't allow nested update here
      render json: @quiz
    else
      render json: { errors: @quiz.errors }, status: :unprocessable_content
    end
  end

  # PATCH /quizzes/:id/pause
  def pause
    @quiz = current_user.quizzes.find(params[:id])

    if @quiz.pause!
      render json: @quiz
    else
      render json: { errors: @quiz.errors }, status: :unprocessable_content
    end
  end

  # PATCH /quizzes/:id/resume
  def resume
    @quiz = current_user.quizzes.find(params[:id])

    if @quiz.resume!
      render json: @quiz
    else
      render json: { errors: @quiz.errors }, status: :unprocessable_content
    end
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
