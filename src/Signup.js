import { useState } from "react"
import axios from "axios"
import { Link } from 'react-router-dom'

function Signup() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userId, setUserId] = useState('')

    const handleSubmit = () => {
        console.log(email, password)
        axios.post('http://localhost:5000/signup',
            {
                email: email,
                password: password,
                userId: userId 
            })
            .then(res => {
                console.log(res.data)
                if (res.data.code === 200) {
                    alert('Signup success.')
                } else {
                    alert('Error.' + res.data.message)
                }
            }).catch(err => {
                console.log(err);
                alert('Error: Failed to signup.');
            })
    }

    return (<>
        <h1 className="center"> SIGNUP </h1>
        <div className="outcard">
            User Name
            <input
                onChange={(e) => {
                    setUserId(e.target.value)
                }}
                value={userId}
                className="inputs"
                type="text" /> <br /> <br />
            Email
            <input
                onChange={(e) => {
                    setEmail(e.target.value)
                }}
                value={email}
                className="inputs"
                type="email" /> <br /> <br />
            Password
            <input
                onChange={(e) => {
                    setPassword(e.target.value)
                }}
                value={password}
                className="inputs" type="password" /> <br /> <br />
            <button
                onClick={handleSubmit}
                className="btns"> SUBMIT </button>
            <Link style={{ textAlign: 'center', display: 'block', marginTop: '5px' }}
                to={'/signin'}> SIGN IN </Link>
        </div>
    </>
    )
}


export default Signup