import AddOrEditReceipt from "./components/AddOrEditReceipt"
import ReceiptList from "./components/ReceiptList"
import Receipt from "./components/Receipt"
import NotFound from "./components/NotFound"
import Login from "./components/Login"
import "./App.css"
import {Link, Route, Routes} from "react-router-dom"
import {useContext} from "react"
import AuthContext from "./context/AuthProvider"
import RequireAuth from "./components/RequireAuth"

function App() {
    const {auth_token} = useContext(AuthContext)
    
    return (
        <div className="App">
            <nav>
                <ul className="nav-ul">
                    <Link to="/"><li>Strona główna</li></Link>
                    {
                        auth_token && 
                        <>
                            <Link to="/receipt/add"><li>Dodaj paragon</li></Link>
                            <Link to="/receipt/show"><li>Pokaż paragony</li></Link>
                        </>
                    }
                </ul>
                <ul className="login-ul">
                    {
                        auth_token !== "" ?
                        <Link to="/logout"><li>Wyloguj</li></Link>
                        :
                        <>
                            <Link to="/login"><li>Zaloguj się</li></Link>
                            <Link to="/register"><li>Zarejestruj się</li></Link>
                        </>
                    }
                </ul>
            </nav>

            <section>
                <Routes>
                    <Route path="/" element={<h1>Hello World :3</h1>} />

                    <Route path="/receipt/add" element={<RequireAuth> <AddOrEditReceipt /> </RequireAuth>} />
                    <Route path="/receipt/edit" element={<RequireAuth> <AddOrEditReceipt /> </RequireAuth>} />
                    <Route path="/receipt/show" element={<RequireAuth> <ReceiptList /> </RequireAuth>} />
                    <Route path="/receipt/show/:id" element={<RequireAuth> <Receipt /> </RequireAuth>} />

                    <Route path="/login" element={<Login action="login" />} />
                    <Route path="/register" element={<Login action="register" />} />
                    <Route path="/logout" element={<Login action="logout" />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </section>

            <footer>
                <p>Super strona, panda 3</p>
            </footer>
        </div>
    );
}

export default App;
