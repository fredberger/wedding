Rails.application.routes.draw do
  root to: 'home#index'

  match "/guests/:id" => 'guests#update', via: :put
  match "/guests" => 'guests#index', via: :get
  match "/convidados" => 'guests#attend', via: :get
  match "/chabarsp" => 'home#bar', via: :get
  match "/chabar" => 'home#bar', via: :get
  match "/messages" => 'messages#create', via: :post
end
