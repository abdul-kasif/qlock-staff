# db/migrate/xxxx_create_options.rb
class CreateOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :options do |t|
      t.references :question, null: false, foreign_key: true
      t.text :text, null: false
      t.boolean :is_correct, null: false, default: false
      t.integer :order, null: false, default: 0 # ← ORDER COLUMN ADDED (A=1, B=2, C=3, D=4)

      t.timestamps
    end
    add_index :options, [ :question_id, :order ], unique: true # ← Enforce unique order per question
  end
end
