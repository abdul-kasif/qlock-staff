# db/migrate/xxxx_create_questions.rb
class CreateQuestions < ActiveRecord::Migration[8.0]
  def change
    create_table :questions do |t|
      t.references :quiz, null: false, foreign_key: true
      t.text :text, null: false
      t.integer :order, null: false, default: 0 # ← ORDER COLUMN ADDED

      t.timestamps
    end
    add_index :questions, [ :quiz_id, :order ], unique: false # optional: enforce order uniqueness per quiz
  end
end
