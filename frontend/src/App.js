import React, { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [age, setAge] = useState('');

  const fetchUsers = () => {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  };

  const handleAddUser = () => {
    if (!username || !pin || !age) {
      alert('Please fill in all fields');
      return;
    }

    fetch('http://localhost:3000/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pin, age }),
    })
      .then(res => res.json())
      .then(() => {
        setUsername('');
        setPin('');
        setAge('');
        fetchUsers();
      })
      .catch(err => console.error('Error adding user:', err));
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    fetch(`http://localhost:3000/delete/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        fetchUsers();
      })
      .catch(err => console.error('Error deleting user:', err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">User Management</h2>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">Add New User</h5>
        <div className="row g-2">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="password"
              className="form-control"
              placeholder="PIN"
              value={pin}
              onChange={e => setPin(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Age"
              value={age}
              onChange={e => setAge(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleAddUser}>
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="4" className="text-center">No users found</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.age}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
