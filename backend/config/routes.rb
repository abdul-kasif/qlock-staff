Rails.application.routes.draw do
  # Auth routes
  post "auth/send_otp", to: "auth#send_otp" # AuthController -> send_otp method
  post "auth/verify_otp", to: "auth#verify_otp" # AuthController -> verify_otp method

  # Profile Creation routes
  post "/profile", to: "profile#create"

  # Dashboard routes
  get "/dashboard", to: "dashboard#show"

  # Assessment session routes
  resources :sessions, controller: "assessment_session", only: [:create, :show] do
    member do
      patch :stop
      delete :delete
    end
    collection do
      get :active
      get :history
    end
  end

  # Test Sessions Routes
  post "test_sessions/start", to: "test_sessions#start"
  post "test_sessions/submit", to: "test_sessions#submit"
end
