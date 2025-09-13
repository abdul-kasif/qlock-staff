Rails.application.routes.draw do
  # Auth routes
  post "auth/send_otp", to: "auth#send_otp" # AuthController -> send_otp method
  post "auth/verify_otp", to: "auth#verify_otp" # AuthController -> verify_otp method

  # Profile Creation routes
  post "/profile", to: "profile#create"

  # Dashboard routes
  get "/dashboard", to: "dashboard#show"
end 
