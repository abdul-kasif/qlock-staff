class AddIndexRoleToUsers < ActiveRecord::Migration[8.0]
  def change
    add_index :users, :role
  end
end
