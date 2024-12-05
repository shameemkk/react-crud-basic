import React from "react";
import { useState,useEffect } from "react";
function App() {

const [userData, setUserData]=useState([]);
const [userDetails, setuserDetails]=useState({});
const [updateData,setUdateData]=useState({});
const [deleteUserId, setDeleteUserId] = useState(null);
const [newUser, setNewUser] = useState({
  name: '',
  phone: '',
  email: '',
  address: { street: '' }
});
  
useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(data => setUserData(data))
      .catch((error) => console.error('Error fetching data:', error));
  },[]);

  const userViewDetails=(id)=>{
    const user = userData.find(user => user.id === id);
    setuserDetails(user);
  }
   const userUpdateDetails=(id)=>
   {
    const user = userData.find(user => user.id === id);
    setUdateData(user);
   }
   const userDeleteDetails = (id) => {
    const user = userData.find(user => user.id === id);
    setDeleteUserId(user.id);
  }
   const handleUpdate = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    
    if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setUdateData({
            ...updateData,
            [parent]: {
                ...updateData[parent],
                [child]: value
            }
        });
    } else {
        setUdateData({
            ...updateData,
            [name]: value
        });
    }
};

const handleSaveChanges = async () => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${updateData.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
            const updatedUser = await response.json();
            setUserData(userData.map(user => 
                user.id === updatedUser.id ? updatedUser : user
            ));
            document.getElementById('editModal').querySelector('[data-bs-dismiss="modal"]').click();
    } else{
        alert('Error updating user');
    }
    } catch (error) {
        console.error('Error updating user:', error);
    }
};

const handleDelete = async () => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${deleteUserId}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            setUserData(userData.filter(user => user.id !== deleteUserId));
            document.getElementById('deleteModal').querySelector('[data-bs-dismiss="modal"]').click();
        } else {
            alert('Error deleting user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

const handleCreateInputChange = (e) => {
  const { name, value } = e.target;
  
  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    setNewUser({
      ...newUser,
      [parent]: {
        ...newUser[parent],
        [child]: value
      }
    });
  } else {
    setNewUser({
      ...newUser,
      [name]: value
    });
  }
};

const handleCreate = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser)
    });
    
    if (response.ok) {
      const createdUser = await response.json();
      setUserData([...userData, createdUser]);
      setNewUser({ name: '', phone: '', email: '', address: { street: '' } }); // Reset form
      document.getElementById('createModal').querySelector('[data-bs-dismiss="modal"]').click();
    } else {
      alert('Error creating user');
    }
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>CRUD - Table View</h2>
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">Create CRUD</button>
        </div>
        
        <div className="table-responsive">
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>View</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                  {
                    userData.map((user)=>{
                    
                    return (
                    <tr key={user.id}>
                      <td>{user.name} </td>
                      <td>{user.phone}</td>
                      <td>{user.email}</td>
                      <td>{user.address?.street}</td>
                      <td><button onClick={()=>userViewDetails(user.id)} className="btn btn-view btn-sm" data-bs-toggle="modal" data-bs-target="#viewModal">View</button></td>
                      <td><button onClick={()=>userUpdateDetails(user.id)} className="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button></td>
                      <td><button onClick={() => userDeleteDetails(user.id)} className="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button></td>
                    </tr>
                    );
                    })
                  }
                    
                
                </tbody>
            </table>
        </div>
    </div>

    {/* <!-- Create Modal --> */}
    <div className="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="createModalLabel">Create New Entry</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="createName" className="form-label">Name</label>
                            <input 
                              onChange={handleCreateInputChange} 
                              name='name' 
                              value={newUser.name} 
                              type="text" 
                              className="form-control" 
                              id="createName" 
                              required 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="createPhone" className="form-label">Phone</label>
                            <input 
                              onChange={handleCreateInputChange} 
                              name='phone' 
                              value={newUser.phone} 
                              type="tel" 
                              className="form-control" 
                              id="createPhone" 
                              required 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="createEmail" className="form-label">Email</label>
                            <input 
                              onChange={handleCreateInputChange} 
                              name='email' 
                              value={newUser.email} 
                              type="email" 
                              className="form-control" 
                              id="createEmail" 
                              required 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="createLocation" className="form-label">Location</label>
                            <input 
                              onChange={handleCreateInputChange} 
                              name='address.street' 
                              value={newUser.address.street} 
                              type="text" 
                              className="form-control" 
                              id="createLocation" 
                              required 
                            />
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleCreate}>Create</button>
                </div>
            </div>
        </div>
    </div>

    {/* <!-- View Modal --> */}
    <div className="modal fade" id="viewModal" tabindex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="viewModalLabel">View Entry</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <p><strong>Name:</strong> {userDetails?.name}</p>
                    <p><strong>Phone:</strong> {userDetails?.phone}</p>
                    <p><strong>Email:</strong> {userDetails?.email}</p>
                    <p><strong>Location:</strong> {userDetails?.address?.suite}</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    {/* <!-- Edit Modal --> */}
    <div className="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="editModalLabel">Edit Entry</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="mb-3">
                            <label for="editName" className="form-label">Name</label>
                            <input onChange={handleUpdate} name='name' value={updateData.name} type="text" className="form-control" id="editName"  required />
                        </div>
                        <div className="mb-3">
                            <label for="editPhone" className="form-label">Phone</label>
                            <input onChange={handleUpdate} name='phone' value={updateData.phone} type="tel" className="form-control" id="editPhone"  required />
                        </div>
                        <div className="mb-3">
                            <label for="editEmail" className="form-label">Email</label>
                            <input onChange={handleUpdate} name='email' value={updateData.email} type="email" className="form-control" id="editEmail"  required />
                        </div>
                        <div className="mb-3">
                            <label for="editLocation" className="form-label">Location</label>
                            <input onChange={handleUpdate} name='address.street' value={updateData?.address?.street} type="text" className="form-control" id="editLocation"  required />
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Save changes</button>
                </div>
            </div>
        </div>
    </div>

    {/* <!-- Delete Modal --> */}
    <div className="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="deleteModalLabel">Delete Entry</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to delete this entry?</p>
                    <p><strong>{userData.find(user => user.id === deleteUserId)?.name}</strong></p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    </div>
    </>
  );
}

export default App;
