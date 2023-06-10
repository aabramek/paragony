import AddOrEditReceipt from "./components/AddOrEditReceipt"
import ReceiptList from "./components/ReceiptList"
import Receipt from "./components/Receipt"
import NotFound from "./components/NotFound"
import Login from "./components/Login"
import Statistics from "./components/Statistics"
import "./App.css"
import {NavLink, Route, Routes} from "react-router-dom"
import {useContext} from "react"
import AuthContext from "./context/AuthProvider"
import RequireAuth from "./components/RequireAuth"

function App() {
    const {auth_token} = useContext(AuthContext)
    
    return (
        <div className="App">
            <nav>
                <ul>
                    <li>
                        <NavLink to="/">Strona główna</NavLink>
                    </li>
                    {
                        auth_token &&
                        <>
                            <li>
                                <NavLink to="/receipt/add" state={null}>Dodaj paragon</NavLink>
                            </li>
                            <li>
                                <NavLink to="/receipt/show">Pokaż paragony</NavLink>
                            </li>
                            <li>
                                <NavLink to="/statistics">Statystyki</NavLink>
                            </li>
                        </>
                    }
                </ul>
                <ul>
                    {
                        auth_token ?
                        <>
                            <li>
                                <NavLink to="/logout">Wyloguj</NavLink>
                            </li>
                        </>
                        :
                        <>
                            <li>
                                <NavLink to="/login">Zaloguj się</NavLink>
                            </li>
                            <li>
                                <NavLink to="/register">Zarejestruj się</NavLink>
                            </li>
                        </>
                    }
                </ul>
            </nav>

            <section>
                <Routes>
                    <Route path="/" element={<h1>Strona główna</h1>} />

                    <Route path="/receipt/add" element={<RequireAuth> <AddOrEditReceipt /> </RequireAuth>} />
                    <Route path="/receipt/edit" element={<RequireAuth> <AddOrEditReceipt /> </RequireAuth>} />
                    <Route path="/receipt/show" element={<RequireAuth> <ReceiptList /> </RequireAuth>} />
                    <Route path="/receipt/show/:id" element={<RequireAuth> <Receipt /> </RequireAuth>} />
                    <Route path="/statistics" element={<RequireAuth> <Statistics /> </RequireAuth>} />

                    <Route path="/login" element={<Login action="login" />} />
                    <Route path="/register" element={<Login action="register" />} />
                    <Route path="/logout" element={<Login action="logout" />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </section>
            <footer>
                <p>&copy; Aleksander Abramowicz 2023</p>
            </footer>
        </div>
    );
}

export default App;
