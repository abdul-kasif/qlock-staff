class CreateAssessmentSessions < ActiveRecord::Migration[8.0]
  def change
    create_table :assessment_sessions do |t|
      t.references :staff, null: false, foreign_key: true
      t.string :title, null: false
      t.text :google_form_url, null: false
      t.string :access_code, null: false
      t.integer :test_duration_minutes, null: false
      t.datetime :started_at, null: false
      t.datetime :ended_at 
      t.integer :status, null: false, default: 0 # 0 = active, 1 = completed

      t.timestamps
    end
    
    # Add index for performance
    add_index :assessment_sessions, :access_code
    add_index :assessment_sessions, :status  
  end
end
