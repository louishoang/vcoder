class CreateAnnouncements < ActiveRecord::Migration
  def change
    create_table :announcements do |t|
      t.text :content
      t.string :type

      t.timestamps
    end
  end
end
