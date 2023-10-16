import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultPhoto from './assets/images/photo.svg';
import './assets/styles/student_info.css';

const StudentInfo = () => {
    const [studentData, setStudentData] = useState({});
    const { pdfId } = useParams();
    const navigate = useNavigate();
    const parsedMIT = studentData.MIT ? JSON.parse(studentData.MIT) : null;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const parsedSelectedFields = studentData.Selected_fields ? JSON.parse(studentData.Selected_fields) : {};
    const [isSelectedFieldsDropdownVisible, setIsSelectedFieldsDropdownVisible] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/by_id`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setStudentData(response.data);
        };

        fetchData();
    }, [pdfId]);

    const handleDelete = async () => {
        const userConfirmation = window.confirm("Вы уверены, что хотите удалить аккаунт?"); // Show a confirmation dialog

        if (userConfirmation) { // If user confirms deletion
            const token = localStorage.getItem('access_token'); // Get token
            try {
                // Send DELETE request to API
                await axios.patch(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/delete_from_dashboard`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // If successful, navigate to dashboard
                navigate('/dashboard');
            } catch (error) {
                // Handle error (e.g., show an error message to user)
                console.error("An error occurred while deleting:", error);
                alert("Произошла ошибка при удалении. Пожалуйста, попробуйте еще раз.");
            }
        }
    };

    return (
        <div className="container">
            <div className="row my-4">
                <div className="col-12 col-md-4">
                    <div className="card card-custom p-3 d-flex flex-column align-items-center">
                        <div className="d-flex flex-column align-items-center student-details">
                            <img
                                src={studentData.photo_url || defaultPhoto}
                                alt={studentData.Name || "Default student"}
                                className="img-fluid student-photo"
                            />
                            <p>Школа: {studentData.School}</p>
                            <p>Имя: {studentData.Name}</p>
                            <p>Класс: {studentData.Grade}</p>
                            <p>Дата рождения: {studentData.Date_of_birth}</p>
                            <p>Файлы: {studentData.Google_drive}</p>
                            <p>MBTI: {studentData.MBTI}</p>
                            <div className="d-grid gap-2">
                                <button type="button" className='btn btn-warning' onClick={() => navigate(`/edit_info/${pdfId}`)}>Изменить данные</button>
                                <button type="button" className='btn btn-danger' onClick={handleDelete}>Удалить профиль</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card card-custom h-100 d-flex flex-column p-3 align-items-center">
                        <div className="d-grid gap-2">
                            <button
                                className="btn btn-secondary mt-2"
                                onClick={() => setIsSelectedFieldsDropdownVisible(!isSelectedFieldsDropdownVisible)}
                            >
                                Посмотреть Сферы &nbsp;  {isSelectedFieldsDropdownVisible ? "▲" : "▼"}
                            </button>

                            {isSelectedFieldsDropdownVisible && parsedSelectedFields && (
                                <div className="selected-fields-dropdown-content">
                                    {Object.entries(parsedSelectedFields).map(([key, value]) => (
                                        <p key={key}>{key}: {value}</p>
                                    ))}
                                </div>
                            )}
                            <button className="btn btn-secondary" onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
                                Посмотреть MIT &nbsp;  {isDropdownVisible ? "▲" : "▼"}
                            </button>
                            {isDropdownVisible && parsedMIT && (
                                <div className="mit-dropdown-content">
                                    {Object.entries(parsedMIT).map(([key, value]) => (
                                        <p key={key}>{key}: {value}</p>
                                    ))}
                                </div>
                            )}
                            {studentData.gallup_url &&
                                <a href={studentData.gallup_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Посмотреть Gallup</a>
                            }

                            {studentData.report1_url &&
                                <a href={studentData.report1_url} download className="btn btn-primary btn-block">Загрузить Отчет 1</a>
                            }
                            {studentData.report2_url &&
                                <a href={studentData.report2_url} download className="btn btn-primary btn-block">Загрузить Отчет 2</a>
                            }
                            {studentData.report3_url &&
                                <a href={studentData.report3_url} download className="btn btn-primary btn-block">Загрузить Отчет 3</a>
                            }
                            {studentData.pdf_similarities &&
                                <a href={studentData.pdf_similarities} download className="btn btn-primary btn-block">Загрузить Профессии 1</a>
                            }
                            {studentData.pdf_similarities_new &&
                                <a href={studentData.pdf_similarities_new} download className="btn btn-primary btn-block">Загрузить Профессии 2</a>
                            }
                            {studentData.pdf_comment &&
                                <a href={studentData.report4_url} download className="btn btn-primary btn-block">Загрузить Отчет 4</a>
                            }
                            <button type="button" className='btn btn-success' onClick={() => navigate(`/report1/${pdfId}`)}>Перейти к результатам</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentInfo;