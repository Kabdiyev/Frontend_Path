import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "./assets/styles/Info.css";


const proFields = [
    "Бизнес и управление",
    "Здравоохранение",
    "Образование",
    "Естественные науки, мат. и стат.",
    "Инженерия",
    "Информационные технологии",
    "Соц. и Гум. науки",
    "Искусство",
    "Спорт",
    "Туризм, транспорт и логистика",
    "СелХоз и биоресурсы",
    "Гос.служба и Нац. безопасность",
];

const RU_EN_MAPPING = {
    "Бизнес и управлени": "Бизнес и управление",
    "Здравоохранение": "Здравоохранение",
    "Образование": "Образование",
    "Естественные науки, мат. и стат.": "Естественные науки, математика и статистика",
    "Инженерия": "Инженерия",
    "Информационные технологии": "ИТ",
    "Соц. и Гум. науки": "Социальные и Гуманитарные науки", // except гос служба
    "Искусство": "Искусство",
    "Спорт": "Спорт", //??
    "Туризм, транспорт и логистика": "Услуги", //кроме спорта    
    "СелХоз и биоресурсы": "Сельское хозяйство и биоресурсы",
    "Гос.служба и Нац. безопасность": "Национальная оборона и безопасность", //гос служба
};

const BusinessInfo = () => {
    const [company, setCompany] = useState('');
    const [name, setName] = useState('');
    const [personType, setPersonType] = useState('');
    const [expertiseRequired, setExpertiseRequired] = useState('');
    const [info, setInfo] = useState('');
    const [proInput, setProInput] = useState(
        proFields.reduce((prev, field) => ({ ...prev, [field]: '' }), {})
    );
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [pdfId, setPdfId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (shouldRedirect && pdfId) {
            navigate(`/upload_business/${pdfId}`);
        }
    }, [shouldRedirect, pdfId, navigate]);


    const submitHandler = async (e) => {
        e.preventDefault();

        if (!company || !name || !personType || !expertiseRequired || !info) {
            setErrorMessage('Please fill all the fields');
            return;
        }

        const englishProInput = Object.keys(proInput).reduce((prev, key) => {
            const englishKey = RU_EN_MAPPING[key] || key;
            return { ...prev, [englishKey]: proInput[key] };
        }, {});

        setIsLoading(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('company', company);
        formData.append('name', name);
        formData.append('person_type', personType);
        formData.append('expertise_required', expertiseRequired);
        formData.append('info', info);
        formData.append('proInput', JSON.stringify(englishProInput));

        const token = localStorage.getItem('access_token');

        try {
            const response = await axios.post('https://fastapi-production-fffa.up.railway.app/Gallup/business_info', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data._id) {
                setPdfId(response.data._id);
                setShouldRedirect(true);
            }

            // Handle successful response here...
        } catch (error) {
            console.error("Error while uploading business info:", error);
            if (error.response && error.response.data) {
                setErrorMessage(`Error: ${error.response.data.detail || 'Error uploading business info.'}`);
            } else {
                setErrorMessage('Error uploading business info.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleProChange = (e, field) => {
        const value = e.target.value.replace(/\D/g, '');
        setProInput(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-4 offset-md-4 mt-4">
                    <div className="card card-custom p-4">
                        <h1 className='mb-4'>Информация о вас</h1>            <form onSubmit={submitHandler}>
                            {/* input fields for company, name, personType, expertiseRequired, info here */}
                            <div className="mb-3">
                                <label for="company" className="form-label">Company</label>
                                <input
                                    className='form-control'
                                    type="text"
                                    placeholder="Enter Company Name"
                                    value={company}
                                    onChange={e => setCompany(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">

                                <label for="name" className="form-label">Name</label>
                                <input
                                    className='form-control'
                                    type="text"
                                    placeholder="Enter Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label for="personType" className="form-label">Person type</label>
                                <select
                                    className='form-control'
                                    value={personType}
                                    onChange={e => setPersonType(e.target.value)}
                                >
                                    <option value="" disabled>Select your option</option>
                                    <option value="Professional">Professional</option>
                                    <option value="High School Student">High School Student</option>
                                    <option value="University Student">University Student</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label for="expertiseRequired" className="form-label"> Expertise Required </label>
                                <input
                                    className='form-control'
                                    type="text"
                                    placeholder="Enter Person type"
                                    value={expertiseRequired}
                                    onChange={e => setExpertiseRequired(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label for="info" className="form-label"> Info </label>
                                <input
                                    className='form-control'
                                    type="text"
                                    placeholder="Enter Person type"
                                    value={info}
                                    onChange={e => setInfo(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <strong>Evaluate how suitable the spheres are for you</strong>
                            </div>

                            {
                                proFields.map(field => (
                                    <div className="mb-3 row" key={field}>
                                        <label className="col-sm-9 col-form-label">{field}</label>
                                        <div className="col-sm-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={`1-10`}
                                                value={proInput[field]}
                                                onChange={e => handleProChange(e, field)}
                                            />
                                        </div>
                                    </div>
                                ))
                            }

                            <div className="d-grid gap-2">
                                <button type="submit" className='btn btn-success btn-block' disabled={isLoading} style={{ marginTop: "1rem" }}>
                                    {isLoading ? 'Loading...' : 'Confirm'}
                                </button>
                            </div>
                        </form >
                        {errorMessage && <p>{errorMessage}</p>}
                    </div >
                </div>
            </div >
        </div >
    );
};

export default BusinessInfo;