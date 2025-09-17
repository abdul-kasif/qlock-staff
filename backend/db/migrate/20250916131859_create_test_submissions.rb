class CreateTestSubmissions < ActiveRecord::Migration[8.0]
  def change
    create_table :test_submissions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :assessment_session, null: false, foreign_key: true
      t.datetime :started_at, null: false
      t.datetime :submitted_at
      t.string :status, default: "started", null: false

      t.timestamps
    end
    add_index :test_submissions, [:user_id, :assessment_session_id], unique: true
  end
end
