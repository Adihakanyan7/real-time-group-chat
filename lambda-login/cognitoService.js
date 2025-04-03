import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
  } from "@aws-sdk/client-cognito-identity-provider";
  
  const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });
  
  export const loginUser = async (email, password) => {
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_APP_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };
  
    try {
      const command = new InitiateAuthCommand(params);
      const response = await cognitoClient.send(command);
  
      return {
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
      };
  
    } catch (error) {
      console.error("❌ Login error:", error);
      throw new Error("Invalid email or password");
    }
  };
  