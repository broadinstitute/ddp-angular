export interface SignUpResponse {
  _id: string;
  email: string;
  email_verified: boolean;
}

export interface AuthenticatedResponse {
  co_id: string;
  co_verifier: string;
  login_ticket: string;
}

export interface Auth0LoginErrorResponse {
  code: string;
  error: string;
  description: string;
  error_description: string;
  original: {
    error: string;
    error_description: string;
  };
}
