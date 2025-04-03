import { loginUser } from "./cognitoService.js";


export const handler = async (event) => {
    try {
      const body = JSON.parse(event.body);
      const { email, password } = body;
  
      // 🟣 Log input values
      console.log("Received login request for:", email);

      if (!email || !password) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing email or password" }),
        };
      }
  
      const result = await loginUser(email, password);
      
      // 🟢 Log success output
      console.log("Login successful:", result);

      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
  
    } catch (error) {
      // 🔴 Log the error clearly
      console.error("❌ Error in login handler:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
      };
    }
  };
  