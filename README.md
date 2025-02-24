# **📢 Real-Time Group Chat Application**

A **real-time chat application** built using **React (frontend), Node.js/Express (backend), MongoDB (database), and Socket.IO** for real-time messaging. Users can join, set a username, and send messages that are stored in MongoDB.

---

## **🚀 Features**
- ✅ **Real-time messaging** using WebSockets (**Socket.IO**)
- ✅ **User authentication** (enter username before chatting)
- ✅ **Stores messages in MongoDB** for persistence
- ✅ **Loads previous messages** when users join
- ✅ **Separation of frontend (React) & backend (Node.js/Express)**
- ✅ **Responsive UI with CSS styling**

---

## **📂 Project Structure**
```
real-time-group-chat/
│   README.md
│   package.json
│
├── client/        # Frontend (React)
│   ├── src/
│   │   ├── App.js      # Main React component
│   │   ├── style.css   # Chat UI styling
│   │   ├── index.js    # React entry point
│   ├── public/
│   ├── package.json
│
├── server/        # Backend (Node.js, Express, MongoDB)
│   ├── index.js       # Express & Socket.IO server
│   ├── .env           # MongoDB connection string
│   ├── package.json
```

---

## **🛠 Installation & Setup**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/Adihakanyan7/real-time-group-chat.git
cd real-time-group-chat
```

### **2️⃣ Install Dependencies**
#### **Backend (Server)**
```sh
cd server
npm install
```

#### **Frontend (Client)**
```sh
cd ../client
npm install
```

---

## **🖥 Running the Application**
### **1️⃣ Start the MongoDB Server**
Make sure MongoDB is running locally or connect to **MongoDB Atlas**.
```sh
mongod
```

### **2️⃣ Start the Backend**
```sh
cd server
node index.js
```
✅ Expected Output:
```
✅ Connected to MongoDB
Server listening on port 3000
```

### **3️⃣ Start the Frontend**
```sh
cd ../client
npm start
```
✅ Open `http://localhost:3001` in the browser.

---

## **💾 Environment Variables (`.env`)**
Create a `.env` file inside `server/` and add:
```
MONGO_URI=mongodb://localhost:27017/chatDB
```
This allows your backend to connect to MongoDB.

---

## **🎨 Frontend (React) Overview**
- **Users enter a username** before joining.
- **Messages are displayed in real-time**.
- **Previous messages are loaded** from MongoDB.

---

## **🛠 Backend (Node.js/Express) Overview**
- **Manages WebSocket connections** using `Socket.IO`
- **Handles user messages** and stores them in MongoDB
- **Loads previous messages** when a user joins

---

## **🚀 Deployment**
### **Deploy Backend to Render/Railway**
1. Push your code to GitHub.
2. Create a new **Render** or **Railway** project.
3. Set environment variables (`MONGO_URI`).
4. Deploy 🚀

### **Deploy Frontend to Vercel/Netlify**
1. Push your frontend code to GitHub.
2. Import the project in **Vercel** or **Netlify**.
3. Deploy 🚀

---

## **📌 Future Improvements**
- 🟢 **Add private messaging**
- 🟢 **Typing indicator**
- 🟢 **User online status**
- 🟢 **Deploy to production**

---

## **🙌 Contributing**
Feel free to fork the repository and submit pull requests! 🚀

---

## **📜 License**
This project is licensed under the **MIT License**.

