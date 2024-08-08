import { Button } from "./components/ui/button"
import { BrowserRouter as Router,Routes,Route, Navigate } from "react-router-dom"
import Auth from "./pages/auth"
import Chat from "./pages/chat"
import Profile from "./pages/profile"


export default function App() {
  return (
   <Router>
    <Routes>
      <Route path="/auth" element={<Auth/>}></Route>
      <Route path="/chat" element={<Chat/>}></Route>
      <Route path="/profile" element={<Profile/>}></Route>
      
      
      <Route path="*" element={<Navigate to="/auth"/>}/>
    </Routes>
   </Router>
  )
}