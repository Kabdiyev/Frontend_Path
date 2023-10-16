import axios from 'axios';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Link, useParams } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import "./assets/styles/Results_new.css";

const Resultsnew = () => {
    const { pdfId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [filterTerms, setFilterTerms] = useState([]);
    const [range, setRange] = useState({ min: 0, max: 100 });
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        const fetchTableData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_similarity_new`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = response.data;
                setTableData(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchTableData();
    }, [pdfId, token]);

    const handleOpenPDF = () => {

        axios
            .get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_similarities_download_new`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                window.open(response.data, '_blank');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const onRegenerateResultsClick = async () => {
        setIsLoading(true);  // Show the loader while regenerating

        try {
            const response = await axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_similarity_new?regenerate=true`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;
            setTableData(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error regenerating results:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (filterTerms.length === 0) {
            setFilteredData(tableData);
        } else {
            const filtered = tableData.filter(row => filterTerms.includes(row.Field));
            setFilteredData(filtered);
        }
    }, [filterTerms, tableData]);

    const handleFilterChange = (field) => {
        const newFilterTerms = [...filterTerms];

        if (filterTerms.includes(field)) {
            const index = newFilterTerms.indexOf(field);
            newFilterTerms.splice(index, 1);
        } else {
            newFilterTerms.push(field);
        }

        setFilterTerms(newFilterTerms);
    };

    const fieldOptions = Array.isArray(tableData) ? [...new Set(tableData.map(item => item.Field))] : [];
    const half = Math.ceil(fieldOptions.length / 2);
    const firstHalfOptions = fieldOptions.splice(0, half);
    const secondHalfOptions = fieldOptions.splice(-half);

    const handleRangeChange = (boundary, value) => {
        setRange(prevRange => ({
            ...prevRange,
            [boundary]: Number(value),
        }));
    };

    const calculateChartData = () => {
        if (!tableData) {
            return {
                labels: [],
                datasets: [],
            };
        }

        const filteredData = tableData.filter(data => {
            const place = Number(data.Place);
            return place >= range.min && place <= range.max;
        });

        const fieldCounts = filteredData.reduce((counts, data) => {
            counts[data.Field] = (counts[data.Field] || 0) + 1;
            return counts;
        }, {});

        return {
            labels: Object.keys(fieldCounts),
            datasets: [{
                label: 'Number of Fields',
                data: Object.values(fieldCounts),
                backgroundColor: 'rgba(143, 75, 192, 0.6)', // Change to any color you like
            }],
        };
    };

    const chartData = calculateChartData();

    return (
        <div className="row">
            {isLoading ? (
                <div className="col-12">
                    <div className="card card-custom h-100 p-3 d-flex flex-column align-items-center">
                        <h1>Атлас Новых Профессий</h1>
                        <ul className="content-list">
                            <li><strong>ПРОФЕССИИ БУДУЩЕГО:</strong> Откройте для себя новейшие профессии, основанные на ваших навыках и способностях.</li>
                            <li><strong>ИССЛЕДУЙ СВОЙ ПУТЬ:</strong> Изучайте новые профессии, понимайте их требования и пути, как в них добиться успеха.</li>
                            <li><strong>ПЕРСОНАЛИЗИРУЙ ДАННЫЕ:</strong> Настраивайте свои профессии, выбирая только интересующие вас области.</li>
                        </ul>
                        <div className="loader">
                            <BeatLoader color="#4A90E2" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="col-12 my-3 text-center">
                        <div className="card card-custom h-100 p-3">
                            <h1>Атлас Новых Профессий и Компетенций</h1>
                            <div className="col-12 mt-3">
                                <Link to={`/report4/${pdfId}`}>
                                    <button className='btn btn-info mx-2'>Back</button>
                                </Link>
                                <button onClick={onRegenerateResultsClick} className='btn btn-danger mx-2'>Regenerate</button>
                                <button onClick={handleOpenPDF} className='btn btn-success mx-2'>
                                    Download
                                </button>
                                <Link to={`/results_pdf/${pdfId}`}>
                                    <button className='btn btn-primary me-2'>Next</button>
                                </Link>

                            </div>
                        </div>
                    </div>
                    <div className="col-12 row pb-3">
                        <div className="col-12 col-md-6 bg-grey row justify-content-start align-items-start">
                            <div className="col-12">
                                <div className="card card-custom p-3">
                                    <h3>Выберите интересные вам сферы</h3>
                                    {firstHalfOptions.map(field => (
                                        <div className="form-check" key={field}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`checkbox-${field}`}
                                                checked={filterTerms.includes(field)}
                                                onChange={() => handleFilterChange(field)}
                                            />
                                            <label className='form-check-label' htmlFor={`checkbox-${field}`}>{field}</label>
                                        </div>
                                    ))}
                                    {secondHalfOptions.map(field => (
                                        <div className="form-check" key={field}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`checkbox-${field}`}
                                                checked={filterTerms.includes(field)}
                                                onChange={() => handleFilterChange(field)}
                                            />
                                            <label className='form-check-label' htmlFor={`checkbox-${field}`}>{field}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-12 my-3">
                                <div className="card card-custom p-3">
                                    <h3>Распределение сфер деятельности в заданном интервале</h3>
                                    <div className='d-flex'>
                                        <label>Min:</label>
                                        <input className='form-control mx-2' type="number" value={range.min} onChange={e => handleRangeChange('min', e.target.value)} />
                                        <label>Max:</label>
                                        <input className='form-control ml-2' type="number" value={range.max} onChange={e => handleRangeChange('max', e.target.value)} />
                                    </div>
                                    <Bar data={chartData} />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="card card-custom p-3">
                                <div className="table-responsive results-table-div">
                                    {isLoading ? (
                                        <p>Loading...</p>
                                    ) : (
                                        <>
                                            {Array.isArray(filteredData) && filteredData.length > 0 ? (
                                                <table className="results-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Место</th>
                                                            <th>Сфера</th>
                                                            <th>Подсфера</th>
                                                            <th>Профессия</th>
                                                            <th>Описание</th>
                                                            <th>Процент соответствия</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredData.map((row, index) => (
                                                            <tr key={index}>
                                                                <td>{row.Place}</td>
                                                                <td>{row.Field}</td>
                                                                <td>{row.Professions}</td>
                                                                <td>{row['Year of appearance']}</td>
                                                                <td><a href={row['Description link']} target="_blank" rel="noopener noreferrer">Open Link</a></td>
                                                                <td>{row['Percentage fitting']}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p>No table data available.</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};



export default Resultsnew;