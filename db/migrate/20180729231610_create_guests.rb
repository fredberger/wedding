class CreateGuests < ActiveRecord::Migration[5.2]
  def change
    create_table :guests do |t|
      t.string :name
      t.string :phone
      t.json :list, default: []
    end
  end
end
