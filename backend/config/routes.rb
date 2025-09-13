Rails.application.routes.draw do
  # Auth routes
  post "auth/send_otp", to: "auth#send_otp" #Authcontroller -> send_otp method
end
