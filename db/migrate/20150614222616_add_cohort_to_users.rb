class AddCohortToUsers < ActiveRecord::Migration
  def up
    add_column :users, :cohort_id, :integer
    add_index :users, :cohort_id
  end

  def down
    remove_column :users, :cohort_id
  end
end
