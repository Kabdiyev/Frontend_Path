import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import "./assets/styles/Results_pdf.css";

const ResultsPdf = () => {
    const { pdfId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [commentData, setCommentData] = useState(null);
    const [selectedOption, setSelectedOption] = useState("content1");


    useEffect(() => {
        const fetchCommentData = () => {
            setIsLoading(true);

            const token = localStorage.getItem('access_token');

            axios
                .get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_comments`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    const data = response.data;
                    setCommentData(data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setIsLoading(false);
                });
        };

        fetchCommentData();
    }, [pdfId]);

    const handleOpenPDF = () => {
        axios
            .get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_comments_download`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            })
            .then((response) => {
                window.open(response.data, '_blank');
            })
            .catch((error) => {
                console.error(error);
            });
    };




    const handleSelectionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const renderContent = (start, end) => {
        if (!commentData) return null;  // Add this line

        const startIndex = commentData.indexOf(start);
        const endIndex = end ? commentData.indexOf(end) : undefined;
        const content = commentData.slice(startIndex, endIndex);
        return content.split('\n').map((item, key) => {
            const parts = item.split('**');
            return (
                <span key={key}>
                    {parts.map((part, i) => i % 2 === 0 ? part : <strong>{part}</strong>)}
                    <br />
                </span>
            );
        });
    };

    const renderSelectedContent = () => {
        switch (selectedOption) {
            case "content1":
                return renderContent("REPORT 1: EXPLORE YOUR PERSONALITY", "REPORT 2: BEST CAREER FIELDS");
            case "content2":
                return renderContent("REPORT 2: BEST CAREER FIELDS", "REPORT 3: TOP 5 PROFESSIONS");
            case "content3":
                return renderContent("REPORT 3: TOP 5 PROFESSIONS");
            default:
                return null;
        }
    };

    return (
        <div className="results-container">
            {isLoading ? (
                <div className="loader-container">
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
                <>
                    <div className="buttons-container">
                        <Link to={`/chatbot/${pdfId}`}>
                            <button type='submit' className='results-button'>Next</button>
                        </Link>
                        <button type='submit' onClick={handleOpenPDF} className='results-button'>
                            Download
                        </button>
                        <Link to={`/results_new/${pdfId}`}>
                            <button type='submit' className='results-button'>Back</button>
                        </Link>

                    </div>
                    <select value={selectedOption} onChange={handleSelectionChange} className="filter-input2">
                        <option value="content1">REPORT 1: EXPLORE YOUR PERSONALITY</option>
                        <option value="content2">REPORT 2: BEST CAREER FIELDS</option>
                        <option value="content3">REPORT 3: TOP 5 PROFESSIONS</option>
                    </select>
                    <div className="container-text">

                        <h1>Open AI analysis</h1>
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            renderSelectedContent()
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ResultsPdf