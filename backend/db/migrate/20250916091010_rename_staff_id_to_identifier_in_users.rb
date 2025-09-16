class RenameStaffIdToIdentifierInUsers < ActiveRecord::Migration[8.0]
  def change
    # Rename staff_personal_id to user_personal_id in users table
    rename_column :users, :staff_personal_id, :user_personal_id
  end
end
