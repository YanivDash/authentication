import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (confirmPassword === values.password) {
      axios
        .post("http://localhost:4000/register", values)
        .then((res) => {
          if (res.data.Status === "success") {
            navigate("/login");
          } else if (res.data.duplicate) {
            alert("Email alread exists");
          } else {
            alert("Error");
          }
        })
        .then((err) => console.log(err));
    } else {
      alert("password not matched");
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100 vw-100'>
      <div className='bg-white p-3 rounded '>
        <h2>sign up</h2>
        <form className='container' onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='name'>
              {" "}
              <strong>Name</strong>
            </label>
            <input
              required
              type='text'
              placeholder='Enter name'
              name='name'
              className='form-control rounded-0'
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='email'>
              {" "}
              <strong>Email</strong>
            </label>
            <input
              required
              type='email'
              placeholder='Enter email'
              name='email'
              className='form-control rounded-0'
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='password'>
              {" "}
              <strong>Password</strong>
            </label>
            <input
              required
              type='password'
              placeholder='Enter Password'
              name='password'
              className='form-control rounded-0'
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='confirmPassword'>
              {" "}
              <strong>Password</strong>
            </label>
            <input
              required
              type='password'
              placeholder='Confirm Password'
              name='confirmPassword'
              className='form-control rounded-0'
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type='submit' className='btn btn-success rounded-0 w-100'>
            Sign Up
          </button>
          <p>you agree to our terms and condition</p>
          <Link to='/login'>
            <button className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>
              Login
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
