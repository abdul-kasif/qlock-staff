class AddStaffDetailsToStaffs < ActiveRecord::Migration[8.0]
  def change
    add_column :staffs, :staff_personal_id, :string
    add_column :staffs, :name, :string
    add_column :staffs, :department, :string
    add_index :staffs, :staff_personal_id, unique: true
    #Ex:- add_index("admin_users", "username")
  end

end
