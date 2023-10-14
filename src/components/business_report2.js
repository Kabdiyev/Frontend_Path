import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import "./assets/styles/Report1.css";

const BusinessReport2 = () => {
    const { pdfId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [gallupUrl, setGallupUrl] = useState('');
    const token = localStorage.getItem('access_token');


    useEffect(() => {
        axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/business_report2`, {
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
        axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/business_report2?regenerate=true`, {
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
                    <h1>Синергия Ваших Талантов</h1>
                    <ul className="content-list">
                        <li><strong>ДОМЕНЫ ВЕДУЩИЕ К УСПЕХУ:</strong> - Разкройте свои ведущие домены CliftonStrength34</li>
                        <li><strong>ТАЛАНТЫ УСПЕХА:</strong> - Используйте свои таланты для достижения успеха в учебе и карьере</li>
                        <li><strong>ПОСТРОЕНИЕ ОТНОШЕНИЙ:</strong> - Укрепляйте свои социальные связи и создавайте гармоничные отношения</li>
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
                <Link to={`/Business_Report3/${pdfId}`}>
                    <button className='btn btn-primary me-2' style={{ marginTop: '10px' }}>Next</button>
                </Link>
                <Link to={`/Business_Report1/${pdfId}`}>
                    <button className='btn btn-info mx-2' style={{ marginTop: '10px' }}>Back</button>
                </Link>
            </div>
            <div className="buttons-container-left" >
                <button onClick={onRegenerateClick} className='btn btn-danger' style={{ marginTop: '10px', left: '0' }}>Regenerate</button>
            </div>
        </div>
    </div>
    );
};

export default BusinessReport2;