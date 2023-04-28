import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext";

import api from "../auth/api";
const TOKEN_KEY = process.env.REACT_APP_TOKEN_HEADER_KEY;


const CreateProject = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [search, setSearch] = useState("");
    const [members, setMembers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // const { loggedInUser } = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            const response = await api.post(
                "/projects",
                { name, description, members },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // Redirect to the new project or the projects list page
            // navigate(`/projects/${response.data._id}`);
            navigate(`../projects/${response.data._id}`);
            console.log("Project created:", response.data);
        } catch (err) {
            setError(err.message || "An error occurred while creating the project.");
        }
    };

    const handleSearch = async () => {
        if (search.trim() === "") {
            setSearchResults([]);
            return;
        }

        try {
            const { data } = await api.get(`/users/search?name=${search}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                },
            });

            // console.log(loggedInUser);

            // Filter out the logged-in user from the search results
            // const filteredResults = data.filter(
            //     (user) => user._id !== loggedInUser._id
            // );

            setSearchResults(data);
        } catch (err) {
            console.error(err);
            setSearchResults([]);
        }
    };


    const handleAddMember = (e, user) => {
        e.preventDefault(); // Add this line to prevent the default form submission behavior
        setMembers([...members, user]);
        setSearchResults([]);
        setSearch("");
    };


    return (
        <div>
            <h1>Create Project</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Project Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="description">Project Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="search">Add Members:</label>
                    <input
                        type="text"
                        id="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="button" onClick={handleSearch}>
                        Search
                    </button>
                    <ul>
                        {searchResults.map((user) => (
                            <li key={user._id}>
                                {user.name} <button onClick={(e) => handleAddMember(e, user)}>Add</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Selected Members:</h3>
                    <ul>
                        {members.map((member) => (
                            <li key={member._id}>{member.name}</li>
                        ))}
                    </ul>
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Create Project</button>
            </form>
        </div>
    );
};

export default CreateProject;
