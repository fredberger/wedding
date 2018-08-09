class AddAttendToGuests < ActiveRecord::Migration[5.2]
  def change
    add_column :guests, :attend, :boolean
    add_column :guests, :invited, :integer, default: 0
  end
end
