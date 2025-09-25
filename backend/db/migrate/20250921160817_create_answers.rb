# db/migrate/xxxx_create_answers.rb
class CreateAnswers < ActiveRecord::Migration[7.0]
  def change
    create_table :answers do |t|
      t.references :quiz_submission, null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true
      t.references :selected_option, null: false, foreign_key: { to_table: :options }

      t.timestamps
    end
    add_index :answers, [ :quiz_submission_id, :question_id ], unique: true # ← One answer per question per submission
  end
end
