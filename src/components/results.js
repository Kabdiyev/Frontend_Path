import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Link, useParams } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import "./assets/styles/Results.css";

Chart.register(...registerables);

const Results = () => {
    const { pdfId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [filterTerms, setFilterTerms] = useState([]);
    const [range, setRange] = useState({ min: 0, max: 100 });
    const [selectedDomain, setSelectedDomain] = useState('');
    const [domains, setDomains] = useState([]);


    useEffect(() => {
        const fetchTableData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('access_token');
            try {
                const response = await axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_similarity`, {
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
    }, [pdfId]);

    const handleOpenPDF = () => {
        const token = localStorage.getItem('access_token');

        axios
            .get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_similarities_download`, {
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

    useEffect(() => {
        if (tableData && tableData.length > 0) {
            const uniqueDomains = [...new Set(tableData.map(item => item.Domains))];
            setDomains(uniqueDomains);
        }
    }, [tableData]);

    useEffect(() => {
        let filtered = tableData;

        // If domain is selected, filter by domain
        if (selectedDomain) {
            filtered = filtered.filter(row => row.Domains === selectedDomain);
        }

        // Your existing filter logic
        if (filterTerms.length > 0) {
            filtered = filtered.filter(row => filterTerms.includes(row.Field));
        }

        setFilteredData(filtered);
    }, [selectedDomain, filterTerms, tableData]);

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
                backgroundColor: 'rgba(75, 192, 192, 0.6)', // Change to any color you like
            }],
        };
    };

    const chartData = calculateChartData();

    return (
        <div className="row">
            {isLoading ? (
                <div className="col-12 row pb-3">
                    <div className="card card-custom h-100 p-3 d-flex flex-column align-items-center">
                        <h1>What Can You Discover Here?</h1>
                        <ul className="content-list">
                            <li><strong>PROFESSIONAL DISCOVERY:</strong> - Explore an extensive list of professions tailored to your aptitude.</li>
                            <li><strong>DEEP DIVE:</strong> - Open the links in the description to delve into each profession's details.</li>
                            <li><strong>CUSTOMIZED VIEW:</strong> - Select fields of personal interest for a customized viewing experience.</li>
                            <li><strong>RANKING INSIGHT:</strong> - Utilize our top-chart to identify the quantity of fields within a range of rankings.</li>
                        </ul>
                        <div className="loader">
                            <BeatLoader color="#4A90E2" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="col-12 text-center my-2 pb-3">
                        <div className="card card-custom h-100 p-3">
                            <h1 className='mb-3'>Наилучшие Карьерные Пути</h1>
                            <select className='form-control' value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)}>
                                <option value=''>Все Домены</option>
                                {domains.map(domain => (
                                    <option key={domain} value={domain}>{domain}</option>
                                ))}
                            </select>
                            <div className="col-12 mt-3">
                                <Link to={`/report3/${pdfId}`}>
                                    <button className='btn btn-info mx-2'>Back</button>
                                </Link>

                                <button onClick={handleOpenPDF} className='btn btn-success mx-2'>
                                    Download
                                </button>
                                <Link to={`/results_new/${pdfId}`}>
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
                                        <input className='form-control ms-2' type="number" value={range.max} onChange={e => handleRangeChange('max', e.target.value)} />
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
                                                                <td>{index + 1}</td>
                                                                <td>{row.Field}</td>
                                                                <td>{row.Subfield}</td>
                                                                <td>{row.Professions}</td>
                                                                <td><a href={row['Links']} target="_blank" rel="noopener noreferrer">Open Link</a></td>
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

export default Results;