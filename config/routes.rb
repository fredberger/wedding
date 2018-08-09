Rails.application.routes.draw do
  root to: 'home#index'

  match "/guests/:id" => 'guests#update', via: :put
  match "/guests" => 'guests#index', via: :get
end
