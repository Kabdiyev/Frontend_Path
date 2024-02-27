import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import "./assets/styles/Report1.css";

const Report1 = () => {
    const { pdfId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [gallupUrl, setGallupUrl] = useState('');
    const token = localStorage.getItem('access_token');


    useEffect(() => {
        axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/school_reports`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                num_report: 1, // Directly sending integer 1 for num_report
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
        axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/school_reports?regenerate=true`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                num_report: 1, // Again, directly sending integer 1 for num_report
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
                    <h1>Профиль cliftonstrengths34 </h1>
                    <ul className="content-list">
                        <li><strong>ХАРАКТЕРИСТИКА ТАЛАНТОВ:</strong> - Узнайте свои уникальные сильные стороны с помощью методологии CliftonStrengths34</li>
                        <li><strong>ЛИЧНОСТНОЕ И ПРОФЕССИОНАЛЬНОЕ РАЗВИТИЕ:</strong> - План развития ваших сильных сторон и преодоления слабостей</li>
                        <li><strong>РЕКОМЕНДАЦИИ К КНИГАМ:</strong> - Ознакомьтесь с рекомендуемыми книгами для глубокого понимания каждого таланта</li>
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
                            onLoad={() => setPdfLoaded(true)}
                            onError={(e) => {
                                console.error("Error loading PDF:", e);
                                <p>error</p>
                            }}><>
                                <p>Для получения отчета:</p>
                                <p>1. Можете перезагрузить страницу через 3-4 минуты</p>
                                <p>2. Через 3-4 минуты можете нажать на эту ссылку <a href={gallupUrl} target="_blank" rel="noopener noreferrer"> что бы загрузить отчет</a>.</p>
                                <p>3. Так же можно будет скачать отчет в профиле ученика</p>
                                <p>4. Если через 7 минут ни один способ не сработал, проверьте загруженные файлы и загрузите профиль ученика заново.</p>
                                <p>Если проблема останется нерешенной, пожалуйста, обратитесь к администратору, предоставив полное описание проблемы.</p>
                            </>
                        </object>
                    </div>
                </div>
            )}
            <div className="buttons-container" >
                <Link to={`/report2/${pdfId}`}>
                    <button className='btn btn-primary me-2' style={{ marginTop: '10px' }}>Next</button>
                </Link>
            </div>
            <div className="buttons-container-left" >
                <button onClick={onRegenerateClick} className='btn btn-danger' style={{ marginTop: '10px', left: '0' }}>Regenerate</button>
            </div>
        </div>
    </div >
    );
};

export default Report1;