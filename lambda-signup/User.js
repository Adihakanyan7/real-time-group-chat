const User = (userId, email, username) => {
    return {
      userId,
      email,
      username,
      createdAt: new Date().toISOString(),
    };
  };
  
  export default User;
  