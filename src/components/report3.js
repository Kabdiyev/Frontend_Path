import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import "./assets/styles/Report1.css";

const Report3 = () => {
    const { pdfId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [gallupUrl, setGallupUrl] = useState('');
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/report3`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                // Append a timestamp to the URL as a query parameter
                setGallupUrl(`${response.data}?timestamp=${new Date().getTime()}`);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, [pdfId, token]);

    const onRegenerateClick = () => {
        setIsLoading(true);  // Show the loader while regenerating
        axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/report3?regenerate=true`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                // Append a timestamp to the URL as a query parameter
                setGallupUrl(`${response.data}?timestamp=${new Date().getTime()}`);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error regenerating report:', error);
                setIsLoading(false);
            });
    }
    return (<div className="results-container">
        <div className="report1-container">
            {isLoading ? (
                <div className="card card-custom h-100 p-3 d-flex flex-column align-items-center">
                    <h1>Unlock Your Potential with Personalized Insights</h1>
                    <ul className="content-list">
                        <li><strong>REPORT 1: YOUR PERSONALITY</strong> - Pesronality analysis based on CliftonStrengths, MBTI, and Multiple Intelligences </li>
                        <li><strong>REPORT 2: BEST CAREER FIELDS</strong> - Explore top career paths aligned with your unique strengths and interests </li>
                        <li><strong>REPORT 3: TOP 5 PROFESSIONS</strong> - Analyze your chosen professions to understand their fit with your strengths </li>
                    </ul>
                    <div className="loader">
                        <BeatLoader color="#4A90E2" />
                    </div>
                </div>
            ) : (


                <div >
                    {pdfLoaded ? null : <p>Загружаем отчет...</p>}
                    <div >
                        <object
                            data={gallupUrl}
                            type="application/pdf"
                            width="100%"
                            height="820px"
                            onLoad={() => setPdfLoaded(true)}>
                            <p>Для получения отчета:</p>
                            <p>1. Можете перезагрузить страницу через 3-4 минуты</p>
                            <p>2. Через 3-4 минуты можете нажать на эту ссылку <a href={gallupUrl} target="_blank" rel="noopener noreferrer"> что бы загрузить отчет</a>.</p>
                            <p>3. Так же можно будет скачать отчет в профиле ученика</p>
                            <p>4. Если через 7 минут ни один способ не сработал, проверьте загруженные файлы и загрузите профиль ученика заново.</p>
                            <p>Если проблема останется нерешенной, пожалуйста, обратитесь к администратору, предоставив полное описание проблемы.</p>
                        </object>
                    </div>
                </div>
            )}
            <div className="buttons-container" >
                <Link to={`/results/${pdfId}`}>
                    <button className='btn btn-primary me-2' style={{ marginTop: '10px' }}>Next</button>
                </Link>
                <Link to={`/report2/${pdfId}`}>
                    <button className='btn btn-info mx-2' style={{ marginTop: '10px' }}>Back</button>
                </Link>
            </div>
            <div className="buttons-container-left" >
                <button onClick={onRegenerateClick} className='btn btn-danger' style={{ marginTop: '10px' }}>Regenerate</button>
            </div>
        </div>
    </div >
    );
};

export default Report3;