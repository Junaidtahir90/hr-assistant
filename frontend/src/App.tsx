import { BrowserRouter, Routes, Route } from "react-router-dom";
import HRAssistChat from "./components/pages/hr-assistant";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HRAssistChat/>} />
  
      </Routes>
    </BrowserRouter>
  );
}

export default App;