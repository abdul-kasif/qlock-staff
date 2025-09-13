import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useRef } from "react"
import { Toaster, toast } from "sonner"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef([])

  const handleGetCode = () => {
    if (!email.trim()) return
    setShowOtp(true)
    toast.success("Check mail for OTP")
  }

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input automatically
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleLogin = () => {
    const enteredOtp = otp.join("")
    if (enteredOtp === "123456") {
      navigate("/dashboard")
    } else {
      toast.error("Invalid or wrong OTP entered")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Toaster position="top-right" richColors />
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">Welcome back</CardTitle>
          <p className="text-sm text-gray-500 text-center">
            
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Email */}
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={showOtp}
          />

          {/* OTP Section */}
          {showOtp && (
            <div className="flex justify-between">
              {otp.map((digit, idx) => (
                <Input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-10 text-center"
                />
              ))}
            </div>
          )}

          {/* Button */}
          {!showOtp ? (
            <Button onClick={handleGetCode} className="w-full">
              Get Code
            </Button>
          ) : (
            <Button onClick={handleLogin} className="w-full">
              Continue
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
