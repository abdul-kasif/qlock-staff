class CreateStaffs < ActiveRecord::Migration[8.0]
  def change
    create_table :staffs do |t|
      t.string :email, null: false
      t.boolean :profile_complete, default: false, null: false

      t.timestamps
    end

    add_index :staffs, :email, unique: true
  end
end
