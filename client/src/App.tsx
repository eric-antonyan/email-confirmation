import React, { FC } from 'react'
import { NextUIProvider } from "@nextui-org/react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ConfirmPage from './pages/ConfirmPage'

const App: FC = () => {
    return (
        <NextUIProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/auth'>
                        <Route path='sign-in' element={<LoginPage />} />
                        <Route path='sign-up' element={<RegisterPage />} />
                        <Route path='confirm' element={<ConfirmPage />} />
                    </Route>
                </Routes>
            </Router>
        </NextUIProvider>
    )
}

export default App