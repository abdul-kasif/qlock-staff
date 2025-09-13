class JwtError < StandardError; end

class JwtService
  ALGORITHM = 'HS256'.freeze

  class << self
    # Encode a payload into a JWT token
    # @param payload [Hash] the data to encode
    # @return [String] the JWT token
    def encode(payload)
      payload[:exp] = 24.hours.from_now.to_i
      JWT.encode(payload, secret_key, ALGORITHM)
    end

    # Decode a JWT token and return the payload
    # @param token [String] the JWT token to decode
    # @return [HashWithIndifferentAccess] the decoded payload
    # @raise [JwtError] if token is invalid or expired
    def decode(token)
      raise JwtError, 'Token is blank' if token.blank?

      decoded = JWT.decode(token, secret_key, true, { algorithm: ALGORITHM })
      HashWithIndifferentAccess.new(decoded[0])
    rescue JWT::ExpiredSignature
      raise JwtError, 'Token has expired'
    rescue JWT::DecodeError
      raise JwtError, 'Invalid token'
    end

    private

    def secret_key
      Rails.application.credentials.secret_key_base
    end
  end
end