# db/migrate/xxxx_create_quizzes.rb
class CreateQuizzes < ActiveRecord::Migration[8.0]
  def change
    create_table :quizzes do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.string :degree
      t.string :semester
      t.string :subject_code
      t.string :subject_name
      t.integer :time_limit_minutes, null: false
      t.string :access_code, null: false
      t.integer :status, default: 0, null: false # 0 = active, 1 = completed
      t.datetime :started_at
      t.datetime :ended_at

      t.timestamps
    end

    add_index :quizzes, :access_code
    add_index :quizzes, :status
  end
end
