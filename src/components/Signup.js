import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:"", email: "", password: "", cpassword:""})
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const {name, email, password, cpassword} = credentials;
        
        // Validate password match
        if (password !== cpassword) {
            alert("Passwords do not match!");
            return;
        }

        // Validate minimum requirements
        if (!name || !email || !password) {
            alert("Please fill all fields!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/createuser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, email, password})
            });
            
            // Log the response status and text
            console.log("Response status:", response.status);
            const text = await response.text();
            console.log("Response text:", text);
            
            // Try to parse as JSON
            let json;
            try {
                json = JSON.parse(text);
            } catch (e) {
                console.error("Failed to parse JSON:", e);
                alert("Server error occurred. Check console for details.");
                return;
            }
            
            console.log("Parsed JSON:", json);
            
            if (json.success) {
                // Save the auth token and redirect
                localStorage.setItem('token', json.authtoken);
                alert("Account created successfully!");
                history.push("/");
                props.showAlert("Account created successfully", "success");
            }
            else {
                alert(json.error || json.errors?.[0]?.msg || "Invalid credentials");
            }
        } catch (error) {
            console.error("Error:", error);
            props.showAlert("Invalid Credentials", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className="container mt-3">
            <h2>Create an Account to use iNoteBook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        name="name" 
                        value={credentials.name}
                        onChange={onChange} 
                        minLength={3}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        name="email" 
                        value={credentials.email}
                        onChange={onChange} 
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        name="password" 
                        value={credentials.password}
                        onChange={onChange} 
                        minLength={5} 
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="cpassword" 
                        name="cpassword" 
                        value={credentials.cpassword}
                        onChange={onChange} 
                        minLength={5} 
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup