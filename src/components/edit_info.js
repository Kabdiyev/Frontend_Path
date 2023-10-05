import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./assets/styles/Edit_info.css";


const EditInfo = () => {
    const { pdfId } = useParams();
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const parsedMIT = formData.MIT ? JSON.parse(formData.MIT) : null;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const parsedSelectedFields = formData.Selected_fields ? JSON.parse(formData.Selected_fields) : null;
    const [isSelectedFieldsDropdownVisible, setIsSelectedFieldsDropdownVisible] = useState(false);

    const predefinedSelectedFields = {
        "Бизнес и управление": "",
        "Здравоохранение": "",
        "Образование": "",
        "Естественные науки, математика и статистика": "",
        "Инженерия": "",
        "ИТ": "",
        "Социальные и Гуманитарные науки": "",
        "Искусство": "",
        "Спорт": "",
        "Услуги": "",
        "Сельское хозяйство и биоресурсы": "",
        "Национальная оборона и безопасность": ""
    };

    const effectiveSelectedFields = { ...predefinedSelectedFields, ...parsedSelectedFields };


    const handleMITChange = (key, e) => {
        const value = e.target.value.replace(/\D/g, ''); // Replace non-digit characters with empty string
        const updatedMIT = { ...parsedMIT, [key]: value };
        setFormData({ ...formData, MIT: JSON.stringify(updatedMIT) });
    };

    const handleSelectedFieldsChange = (key, e) => {
        const value = e.target.value.replace(/\D/g, ''); // Replace non-digit characters with an empty string
        const updatedSelectedFields = { ...parsedSelectedFields, [key]: value };
        setFormData({ ...formData, Selected_fields: JSON.stringify(updatedSelectedFields) });
    };

    const formDataObject = new FormData();
    Object.keys(formData).forEach(key => formDataObject.append(key, formData[key]));

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/by_id`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFormData(response.data);
        };

        fetchData();
    }, [pdfId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
            await axios.patch(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/edit_info`, formDataObject, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate(`/student_info/${pdfId}`);
        } catch (error) {
            console.error("Error updating student data:", error);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-9 col-md-4 offset-md-4 mt-4">
                    <div className="card card-custom p-4">
                        <h2>Изменить данные</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 row" >
                                <label htmlFor="Name" className="col-md-6 col-form-label mit-label text-start">Имя</label>
                                <div className="col-md-6">
                                    <input type="text" className="form-control mit-input" id="Name" name="Name" value={formData.Name || ''} onChange={handleChange} />
                                </div>
                                <label htmlFor="Grade" className="col-md-6 col-form-label mit-label text-start">Класс</label>
                                <div className="col-md-6">
                                    <input type="text" className="form-control mit-input" id="Grade" name="Grade" value={formData.Grade || ''} onChange={handleChange} />
                                </div>
                                <label htmlFor="Date_of_birth" className="col-md-6 col-form-label mit-label text-start">Дата рождения</label>
                                <div className="col-md-6">
                                    <input type="text" className="form-control mit-input" id="Date_of_birth" name="Date_of_birth" value={formData.Date_of_birth || ''} onChange={handleChange} />
                                </div>
                                <label htmlFor="Google_drive" className="col-md-6 col-form-label mit-label text-start">Ссылка на файлы</label>
                                <div className="col-md-6">
                                    <input type="text" className="form-control mit-input" id="Google_drive" name="Google_drive" value={formData.Google_drive || ''} onChange={handleChange} />
                                </div>
                                <label htmlFor="MBTI" className="col-md-6 col-form-label mit-label text-start">MBTI</label>
                                <div className="col-md-6">
                                    <input type="text" className="form-control mit-input" id="MBTI" name="MBTI" value={formData.MBTI || ''} onChange={handleChange} />
                                </div>
                                <button className="btn btn-secondary" onClick={(e) => {
                                    e.preventDefault();
                                    setIsDropdownVisible(!isDropdownVisible);
                                }} style={{ marginTop: "0.2rem", marginBottom: "0.2rem" }}>MIT
                                </button>
                                {isDropdownVisible && parsedMIT && (
                                    <div className="mit-dropdown-content">
                                        {Object.entries(parsedMIT).map(([key, value]) => (
                                            <div key={key}>
                                                <div className="sm-3 row" >
                                                    <label className="col-sm-6 col-form-label mit-label text-start">{key}</label>
                                                    <div className="col-sm-3">
                                                        <input
                                                            className="form-control mit-input"
                                                            type="text" // Assuming it's a number, modify as needed
                                                            value={value}
                                                            onChange={e => handleMITChange(key, e)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button className="btn btn-secondary" onClick={(e) => {
                                    e.preventDefault();
                                    setIsSelectedFieldsDropdownVisible(!isSelectedFieldsDropdownVisible);
                                }}>Сферы</button>

                                {isSelectedFieldsDropdownVisible && (
                                    <div className="selected-fields-dropdown-content">
                                        {Object.entries(effectiveSelectedFields).map(([key, value]) => (
                                            <div key={key}>
                                                <div className="sm-3 row">
                                                    <label className="col-sm-9 col-form-label mit-label text-start">{key}</label>
                                                    <div className="col-sm-3">
                                                        <input
                                                            className="form-control mit-input"
                                                            type="text"
                                                            value={value}
                                                            onChange={e => handleSelectedFieldsChange(key, e)}
                                                            placeholder=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}


                            </div>
                            <div className='md-12row'>
                                <button type="button" className='btn btn-info btn-fixed-size md-4' onClick={() => navigate(`/student_info/${pdfId}`)}>Назад</button>
                                <button type="submit" className="btn btn-warning btn-fixed-size md-4">Изменить</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditInfo;