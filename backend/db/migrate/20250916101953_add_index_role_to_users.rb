class AddIndexRoleToUsers < ActiveRecord::Migration[8.0]
  def change
    add_index :users, :role
    #Ex:- add_index("admin_users", "username")
  end
end
