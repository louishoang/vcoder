Rails.application.routes.draw do
  devise_for :users,
              :controllers => {
                :omniauth_callbacks => "users/omniauth_callbacks"
              }

  # allow front end angularjs to get current_user and check for user
  devise_scope:user do
    get '/api/current_user' => 'users/sessions#show_current_user'
    post '/api/check/is_user' => 'users/users#is_user', as: 'is_user'
    post '/api/check/is_admin' => 'users/users#is_admin', as: 'is_admin'
  end

  root 'home#index'

  # HANDLE VCODER FRONT
  post 'contact_us' => 'home#contact_us', as: :contact_us
  get 'privacy_policy' => 'home#privacy_policy', as: :privacy_policy
  get 'faq' => 'home#faq', as: :faq
  get 'tuition' => 'home#tuition', as: :tuition
  get 'curriculum' => 'home#curriculum', as: :curriculum
  get 'the_program' => 'home#the_program', as: :the_program

  resources :prospects do
    collection do
      get :thank_you
    end
  end

  resources :cohorts
end
