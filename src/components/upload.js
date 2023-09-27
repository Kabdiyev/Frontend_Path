import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./assets/styles/Upload.css";

const MIT_FIELDS = [
    'Лингвистический',
    'Логико-математический',
    'Музыкальный',
    'Кинестетический',
    'Пространственный',
    'Межличностный',
    'Внутриличностный',
    'Натуралистический',
    'Экзистенциальный'
];

const RU_EN_MAPPING = {
    'Лингвистический': 'Linguistic',
    'Логико-математический': 'Logical–mathematical',
    'Музыкальный': 'Musical',
    'Кинестетический': 'Bodily–kinesthetic',
    'Пространственный': 'Spatial',
    'Межличностный': 'Interpersonal',
    'Внутриличностный': 'Intra–personal',
    'Натуралистический': 'Naturalistic',
    'Экзистенциальный': 'Existential'
};

const Upload = () => {
    const { pdfId } = useParams();
    const [file, setFile] = useState(null);
    const [mbti, setMbti] = useState('');
    const [mitInput, setMitInput] = useState(
        MIT_FIELDS.reduce((prev, field) => ({ ...prev, [field]: '' }), {})
    );
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (shouldRedirect && pdfId) {
            navigate(`/results/${pdfId}`);
        }
    }, [shouldRedirect, pdfId, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (!file || !mbti || Object.values(mitInput).some(val => val === '')) {
            setErrorMessage('Please select a file and enter your MBTI and MIT results');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        const englishMitInput = Object.keys(mitInput).reduce((prev, key) => {
            const englishKey = RU_EN_MAPPING[key] || key; // Use original key if no mapping found
            return { ...prev, [englishKey]: mitInput[key] };
        }, {});

        const formData = new FormData();
        formData.append('pdf_id', pdfId);
        formData.append('file', file);
        formData.append('MBTI', mbti);
        formData.append('MIT', JSON.stringify(englishMitInput));

        const token = localStorage.getItem('access_token');

        axios.post(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                console.log(res.data);
                setShouldRedirect(true);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
                setErrorMessage(err.response && err.response.data.detail ? err.response.data.detail : 'Error processing the file. Please upload another file.');
            });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleMbtiChange = (e) => {
        setMbti(e.target.value);
        setErrorMessage('');
    };

    const handleMitChange = (e, field) => {
        const value = e.target.value.replace(/\D/g, ''); // Replace non-digit characters with empty string
        setMitInput(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-4 offset-md-4 mt-4">
                    <div className="card card-custom p-4">
                        <h2 className='mb-4'>Загрузите результаты ваших тестов</h2>
                        <form onSubmit={submitHandler}>

                            <div className="mb-3">
                                <a href="https://www.gallup.com/home.aspx" target="_blank" for="formFile" class="form-label" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}> <strong>Загрузите ваш результат Gallup теста</strong></a>
                            </div>
                            <div>
                                <input class="form-control" type="file" accept=".pdf" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
                            </div>
                            <div className="mb-3">
                                <a href="https://www.16personalities.com/free-personality-test" for="formFile" class="form-label" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} ><strong>Результаты индикатора Майерс-Бриггс</strong></a>
                            </div>
                            <div>
                                <input
                                    className='form-control'
                                    type="text"
                                    placeholder="Ex. INTJ-A"
                                    value={mbti}
                                    onChange={handleMbtiChange}
                                    style={{ marginBottom: '10px' }}
                                />
                            </div>
                            <div className="mb-3">
                                <a href="https://www.idrlabs.com/multiple-intelligences/test.php" target="_blank" for="formFile" class="form-label" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}> <strong>Результаты теста на тип интеллекта</strong></a>
                            </div>
                            {
                                MIT_FIELDS.map(field => (
                                    <div className="mb-3 row" key={field}>
                                        <label className="col-sm-7 col-form-label mit-label text-start">{field}</label>
                                        <div className="col-sm-5">
                                            <input
                                                type="text" // keep as text, as the user might input characters initially
                                                className="form-control mit-input"
                                                placeholder={`Ex. 70%`}
                                                value={mitInput[field]}
                                                onChange={e => handleMitChange(e, field)}
                                            />
                                        </div>
                                    </div>
                                ))
                            }
                            <div className="d-grid gap-2">
                                <button type="submit" className='btn btn-success btn-block' disabled={isLoading} style={{ marginTop: '10px' }}>
                                    {isLoading ? 'Загрузка...' : 'Загрузить'}
                                </button>
                            </div>
                        </form >
                        {errorMessage && <p>{errorMessage}</p>}
                    </div >
                </div>
            </div>
        </div>

    );

};

export default Upload;
