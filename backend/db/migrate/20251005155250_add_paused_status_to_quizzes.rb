class AddPausedStatusToQuizzes < ActiveRecord::Migration[8.0]
  def up
    # No DB schema change needed — enum is stored as integer
    # Just document the new state
    say "Added 'paused' status (value: 1) to quizzes.status enum"
  end

  def down
    # Prevent rollback if any quiz is paused (to avoid data loss)
    if Quiz.where(status: 1).exists?
      raise ActiveRecord::IrreversibleMigration, "Cannot remove 'paused' status: quizzes are using it"
    end
  end
end
