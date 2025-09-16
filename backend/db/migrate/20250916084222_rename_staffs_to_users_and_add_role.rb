class RenameStaffsToUsersAndAddRole < ActiveRecord::Migration[8.0]
  def change
    # 1. Rename table
    rename_table :staffs, :users

    # 2. Add role column to users table
    add_column :users, :role, :string, default: "staff", null: false
    #Ex:- add_column("admin_users", "username", :string, :limit =>25, :after => "email")
    
    # 3. Rename foreign key in assessment_sessions
    rename_column :assessment_sessions, :staff_id, :user_id
  end
end
