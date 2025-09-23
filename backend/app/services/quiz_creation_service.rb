class QuizCreationService
  attr_reader :quiz, :params, :user

  def initialize(user, quiz_params)
    @user = user
    @params = quiz_params
    @quiz = Quiz.new
  end

  def create!
    Quiz.transaction do
      create_quiz!
      create_questions_and_options!
    end
    quiz
  rescue => e
    Rails.logger.error "QUIZ CREATION FAILED: #{e.class} - #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    quiz.errors.add(:base, e.message.presence || "Unknown error occurred during quiz creation")
    nil
  end

  private

  def create_quiz!
    @quiz = user.quizzes.new(
      title: params[:title],
      degree: params[:degree],
      semester: params[:semester],
      subject_code: params[:subject_code],
      subject_name: params[:subject_name],
      time_limit_minutes: params[:time_limit_minutes],
      started_at: params[:started_at] || Time.current,
      ended_at: params[:ended_at],
      status: 0
    )

    unless quiz.save
      raise ActiveRecord::RecordInvalid.new(quiz)
    end
  end

  def create_questions_and_options!
    questions_params = params[:questions] || []

    questions_params.each_with_index do |question_params, index|
      create_question_with_options!(question_params, index + 1)
    end
  end

  def create_question_with_options!(question_params, order)
    if question_params[:text].blank?
      raise StandardError, "Question text cannot be blank"
    end

    question = quiz.questions.new(
      text: question_params[:text],
      order: order
    )

    unless question.save
      error_messages = question.errors.full_messages.join(", ")
      raise StandardError, "Question validation failed: #{error_messages}"
    end

    options_params = question_params[:options] || []
    validate_options_count!(options_params)

    options_params.each_with_index do |option_params, opt_index|
      create_option!(question, option_params, opt_index + 1)
    end

    correct_options = question.options.where(is_correct: true)
    unless correct_options.count == 1
      raise StandardError, "Each question must have exactly one correct option"
    end
  rescue ActiveRecord::RecordInvalid => e
    error_messages = e.record.errors.full_messages.join(", ")
    raise StandardError, "Question validation failed: #{error_messages}"
  end

  def create_option!(question, option_params, order)
    if option_params[:text].blank?
      raise StandardError, "Option text cannot be blank"
    end

    option = question.options.new(
      text: option_params[:text],
      is_correct: option_params[:is_correct],
      order: order
    )

    unless option.save
      error_messages = option.errors.full_messages.join(", ")
      raise StandardError, "Option validation failed: #{error_messages}"
    end
  end

  def validate_options_count!(options_params)
    if options_params.length != 4
      raise StandardError, "Each question must have exactly 4 options"
    end
  end
end