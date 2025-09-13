class CreateOtps < ActiveRecord::Migration[8.0]
  def change
    create_table :otps do |t|
      t.string :email, null: false
      t.string :code, null: false
      t.datetime :expires_at, null: false
      t.integer :attempts, default: 0, null: false

      t.timestamps
    end

    add_index :otps, :email
    add_index :otps, :expires_at
  end
end
