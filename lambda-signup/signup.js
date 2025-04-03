import { registerUser } from "./cognitoService.js";

export const handler = async (event) => {
    try {
      const body = JSON.parse(event.body);
      const { email, password, username } = body;
  
      if (!email || !password || !username) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing required fields" }),
        };
      }
  
      const result = await registerUser(email, password, username);
  
      return {
        statusCode: 201,
        body: JSON.stringify(result),
      };
  
    } catch (error) {
      console.error("❌ Error in signup handler:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
      };
    }
  };
  