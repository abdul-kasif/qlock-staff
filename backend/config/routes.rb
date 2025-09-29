Rails.application.routes.draw do
  # Auth routes
  post "auth/send_otp", to: "auth#send_otp" # AuthController -> send_otp method
  post "auth/verify_otp", to: "auth#verify_otp" # AuthController -> verify_otp method

  # Profile Creation routes
  post "/profile", to: "profile#create"

  # Dashboard routes
  get "/dashboard", to: "dashboard#show"

  # Staff quix management routes
  resources :quizzes, only: [ :create, :update, :index ] do
    member do
      patch :stop
    end
  end

  # Student Quiz Access
  get "/student_quizzes/access/:access_code", to: "student_quizzes#show", as: "student_quiz_access"

  # Student Quiz Submission
  post "/quiz_submissions", to: "quiz_submissions#create"
  get "/quiz_submissions/:access_code", to: "quiz_submissions#show"

  # Staff Quiz Reports
  get "/quiz_reports/:quiz_id", to: "quiz_reports#show", as: "quiz_report"
end
