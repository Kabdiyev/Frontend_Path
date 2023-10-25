import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./assets/styles/BusinessClient.css";

const BusinessClient = () => {
    const [clients, setClients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('https://fastapi-production-fffa.up.railway.app/Gallup/all', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const validClient = response.data.filter(client =>
                    client.Name.trim() !== '' &&
                    client.Business === true &&
                    client.show_acc === true
                );
                setClients(validClient);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleClick = (client) => {
        if (client.report1_url && client.report1_url.trim() !== '') {
            navigate(`/Business_Report1/${client._id}`);
        } else {
            navigate(`/results_new/${client._id}`);
        }
    };

    return (
        <div className="col-12 col-md-4">
            <div className="card card-custom m-2">
                <div className="card card-custom p-3">
                    <h3 style={{ textAlign: "center" }}>Список клиентов</h3>
                    <div className="client-list">
                        {clients.map(client => (
                            <div
                                key={client._id}
                                onClick={() => handleClick(client)}
                                className={client.report1_url && client.report1_url.trim() !== '' ? 'client-name blue-frame' : 'client-name green-frame'}
                            >
                                {client.Name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessClient;