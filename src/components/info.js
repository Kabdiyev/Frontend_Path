import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./assets/styles/Info.css";

const Info = () => {
    const [photo, setPhoto] = useState(null);
    const [School, setSchool] = useState('');
    const [Name, setName] = useState('');
    const [Grade, setGrade] = useState('');
    const [Date_of_birth, setDateOfBirth] = useState('');
    const [Google_drive, setGoogledrive] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [pdfId, setPdfId] = useState('');
    const [schools, setSchools] = useState([]); // New state for schools list
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const response = await axios.get('https://fastapi-production-fffa.up.railway.app/auth/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data && response.data.schools) {
                    setSchools(response.data.schools.split(', ').map(school => school.trim()));
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (shouldRedirect && pdfId) {
            navigate(`/upload/${pdfId}`);
        }
    }, [shouldRedirect, pdfId, navigate]);
    useEffect(() => {
        if (shouldRedirect && pdfId) {
            navigate(`/upload/${pdfId}`);
        }
    }, [shouldRedirect, pdfId, navigate]);


    const submitHandler = async (e) => {
        e.preventDefault();

        // Removed the photo from this check since it's optional now
        if (!School || !Name || !Grade || !Date_of_birth || !Google_drive) {
            setErrorMessage('Please fill all the fields');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        const formData = new FormData();

        // Only append the photo if it's present
        if (photo) {
            formData.append('photo', photo);
        }
        formData.append('School', School);
        formData.append('Name', Name);
        formData.append('Grade', Grade);
        formData.append('Date_of_birth', Date_of_birth);
        formData.append('Google_drive', Google_drive)

        const token = localStorage.getItem('access_token');

        try {
            const response = await axios.post('https://fastapi-production-fffa.up.railway.app/Gallup/info', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data._id) {
                setPdfId(response.data._id);
                setShouldRedirect(true);
            }
        } catch (error) {
            console.error("Error while uploading the info:", error);
            if (error.response && error.response.data) {
                // You can further refine this to display error messages from the backend
                setErrorMessage(`Error: ${error.response.data.detail || 'Error uploading the info.'}`);
            } else {
                setErrorMessage('Error uploading the info.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        setErrorMessage('');
    };

    const handleGradeChange = (e) => {
        setGrade(e.target.value);
        setErrorMessage('');
    };

    const handleSchoolChange = (e) => {
        setSchool(e.target.value);
        setErrorMessage('');
    };

    const handleDateOfBirthChange = (e) => {
        setDateOfBirth(e.target.value);
        setErrorMessage('');
    };

    const handleGoogledriveChange = (e) => {
        setGoogledrive(e.target.value);
        setErrorMessage('');
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-4 offset-md-4 mt-4">
                    <div className="card card-custom p-4">
                        <h1 className='mb-4'>Информация о вас</h1>
                        <form onSubmit={submitHandler}>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Дата вашего рождения</label>
                                <input
                                    className='form-control'
                                    type="date"
                                    placeholder="Gallup Test Date"
                                    value={Date_of_birth}
                                    onChange={handleDateOfBirthChange}
                                />
                            </div>
                            <div class="mb-3">
                                <label for="formFile" class="form-label">Загрузите ваше фото</label>
                                <input class="form-control" type="file" accept=".png" onChange={handlePhotoChange} />
                            </div>
                            <div class="mb-3">


                                <label for="exampleInputEmail1" class="form-label">Ваша школа</label>

                                <select className='form-control' type="text" value={School} onChange={handleSchoolChange}>
                                    <option value="">Выберите вашу школу</option>
                                    {schools.map(school => (
                                        <option key={school} value={school}>
                                            {school}
                                        </option>
                                    ))}
                                    <option value="Other">Other</option>
                                </select>
                            </div>



                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Ваш класс</label>
                                <input
                                    className='form-control'
                                    type="text"
                                    placeholder="Ex. 10 А"
                                    value={Grade}
                                    onChange={handleGradeChange}
                                />
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Ваше Имя</label>
                                <input
                                    className='form-control'
                                    type="text"
                                    placeholder="Ex. Asset Kabdiyev"
                                    value={Name}
                                    onChange={handleNameChange}
                                />
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Ссылка на ваши файлы</label>
                                <input
                                    className='form-control'
                                    type="text"
                                    placeholder="Ex. google.com"
                                    value={Google_drive}
                                    onChange={handleGoogledriveChange}
                                />
                            </div>

                            <div className="d-grid gap-2">
                                <button type="submit" className='btn btn-success btn-block' disabled={isLoading}>
                                    {isLoading ? 'Загрузка...' : 'Подтвердить'}
                                </button>
                            </div>
                        </form>
                        {errorMessage && <p>{errorMessage}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Info;