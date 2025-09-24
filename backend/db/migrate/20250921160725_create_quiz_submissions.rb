# db/migrate/xxxx_create_quiz_submissions.rb
class CreateQuizSubmissions < ActiveRecord::Migration[8.0]
  def change
    create_table :quiz_submissions do |t|
      t.references :user, null: false, foreign_key: true # student
      t.references :quiz, null: false, foreign_key: true
      t.datetime :started_at, null: false
      t.datetime :submitted_at
      t.string :status, null: false, default: 'started' # 'started', 'submitted'
      t.integer :score # percentage 0-100

      t.timestamps
    end
    add_index :quiz_submissions, [ :user_id, :quiz_id ], unique: true # ← One submission per student per quiz
  end
end
