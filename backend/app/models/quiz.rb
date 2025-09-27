class Quiz < ApplicationRecord
    belongs_to :user
    has_many :questions, dependent: :destroy
    has_many :quiz_submissions, dependent: :destroy

    accepts_nested_attributes_for :questions, allow_destroy: false

    enum :status, { active: 0, completed: 1 }, prefix: true

    validates :title, presence: true
    validates :access_code, presence: true
    validates :time_limit_minutes, presence: true, numericality: { greater_than: 0 }

    before_validation :generate_access_code
    before_update :prevent_edit_if_completed

    # Generate unique access code
    def generate_access_code
        return if access_code.present?
        self.access_code = loop do
            token = rand(100000..999999).to_s
            break token unless Quiz.status_active.where.not(id: id).exists?(access_code: token)
        end
    end

    # Prevent editing if quiz is completed
    def prevent_edit_if_completed
        return unless status_completed?

        protected_attrs = %i[title degree semester subject_code subject_name time_limit_minutes]

        if protected_attrs.any? { |attr| saved_change_to_attribute?(attr) }
            errors.add(:base, "Cannot edit a completed quiz")
            throw :abort
        end
    end

    # Stop the quiz
    def stop!
      if status_completed?
        errors.add(:base, "Quiz has already been stopped")
        return false
      end

      update!(ended_at: Time.current, status: :completed)
    end
end
