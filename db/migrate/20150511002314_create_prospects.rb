class CreateProspects < ActiveRecord::Migration
  def change
    create_table :prospects do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :gender
      t.string :phone_number
      t.string :skype
      t.string :email
      t.string :payment_type
      t.text :comment
      t.string :status

      t.timestamps
    end
  end
end
