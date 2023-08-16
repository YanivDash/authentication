import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    console.log("reloaded");
    axios
      .get("http://localhost:4000")
      .then((res) => {
        if (res.data.Status === "success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .then((err) => console.log(err));
  }, []);

  const handleDelete = () => {
    axios
      .get("http://localhost:4000/logout")
      .then(() => {
        location.reload(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='container mt-4'>
      {auth ? (
        <div>
          <h3>you are Authorized {name}</h3>
          <button className='btn btn-danger' onClick={handleDelete}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <h3>{message}</h3>
          <h3>Login now</h3>
          <Link to='/login' className='btn btn-primary'>
            Login
          </Link>
          <p className='mt-2 mb-2'>dont have a account ? </p>
          <Link to='/register' className='btn btn-primary'>
            Create Account
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
