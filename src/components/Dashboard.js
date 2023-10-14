import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./assets/styles/Dashboard.css";

const Dashboard = () => {
    const [students, setStudents] = useState([]);
    const [schools, setSchools] = useState([]);
    const [grades, setGrades] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState('Все школы');
    const [selectedGrade, setSelectedGrade] = useState('Все классы');
    const [hasBusinessAccount, setHasBusinessAccount] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('https://fastapi-production-fffa.up.railway.app/Gallup/all', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const validStudents = response.data.filter(student =>
                student.Name.trim() !== '' &&
                student.report1_url.trim() !== '' &&
                student.Business === false &&
                student.show_acc === true
            );
            setStudents(validStudents);

            const uniqueSchools = [...new Set(validStudents.map(student => student.School))].sort();
            setSchools(['Все школы', ...uniqueSchools]);

            const uniqueGrades = [...new Set(validStudents.map(student => student.Grade))].sort();
            setGrades(['Все классы', ...uniqueGrades]);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const checkBusinessAccount = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const response = await axios.get('https://fastapi-production-fffa.up.railway.app/auth/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setHasBusinessAccount(response.data.business);
            } catch (error) {
                console.error("Error checking business account status:", error);
            }
        };

        checkBusinessAccount();
    }, []);


    const filteredStudents = students.filter(student => {
        let matchesSchool = selectedSchool === 'Все школы' || student.School === selectedSchool;
        let matchesGrade = selectedGrade === 'Все классы' || student.Grade === selectedGrade;
        return matchesSchool && matchesGrade;
    }).sort((a, b) => a.Name.localeCompare(b.Name)); // sort names alphabetically

    return (
        <div className="row justify-content-md-center">
            <div className="col-12 col-md-3 pb-3 ">
                <div className="card card-custom h-100 m-2 p-3">
                    <h3 className='mb-3'>Dashboard</h3>
                    <button type="button" className='btn btn-primary' onClick={() => navigate('/info')}>Добавить ученика</button>
                    {hasBusinessAccount && (
                        <>
                            <button type="button" className='btn btn-primary mt-2' onClick={() => navigate('/business_info')}>Добавить разбор</button>
                            <button type="button" className='btn btn-primary mt-2' onClick={() => navigate('/business_clients')}>Посмотреть клиентов</button>
                        </>
                    )}
                </div>
            </div>
            <div className="col-12 col-md-4">
                <div className="card card-custom m-2">
                    <div className="card card-custom p-3">
                        <h3>Список прошедших систему</h3>
                        <div className="filters">
                            <h5>Фильтры</h5>
                            <select className='form-control my-2' value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)}>
                                {schools.map(school => <option key={school} value={school}>{school}</option>)}
                            </select>
                            <select className='form-control my-2' value={selectedGrade} onChange={e => setSelectedGrade(e.target.value)}>
                                {grades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="student-list">
                        {filteredStudents.map(student => (
                            <div key={student._id} onClick={() => navigate(`/student_info/${student._id}`)}>
                                {student.Name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 