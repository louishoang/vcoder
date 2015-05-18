class CreateCohorts < ActiveRecord::Migration
  def change
    create_table :cohorts do |t|
      t.string :name
      t.datetime :start_at
      t.datetime :end_at
      t.string :status

      t.timestamps
    end
  end
end
