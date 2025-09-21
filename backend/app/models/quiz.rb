class Quiz < ApplicationRecord
    belongs_to :user
    has_many :questions, dependent: :destroy
    has_many :quiz_submissions, dependent: :destroy

    enum :status, { active: 0, completed: 1}, prefix: true

    validates :title, presence: true
    validates :access_code, presence: true
    validates :time_limit_minutes, presence: true, numericality: { greater_than: 0 }

    before_validation :generate_access_code
    before_update :prevent_edit_if_completed

    # Generate unique access code
    def generate_access_code
        return if access_code.present?
        self.access_code = loop do
            token = SecureRandom.alphanumeric(6).upcase
            break token unless Quiz.active.where.not(id: id).exists?(access_code: token)
        end
    end

    # Prevent editing if quiz is completed
    def prevent_edit_if_completed
        if completed? && saved_change_to_any_of?(:title, :degree, :semester, :subject_code, :subject_name, :time_limit_minutes)
            errors.add(:base, "Cannot edit a completed quiz")
            throw :abort
        end
    end

    # Stop the quiz
    def stop!
        update!(ended_at: Time.current, status: completed)
    end
end

