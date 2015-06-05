class AddIsActiveToUsers < ActiveRecord::Migration
  def up
    add_column :users, :is_active, :boolean, default: false
  end

  def down
    remove_column :users, :is_active
  end
end
