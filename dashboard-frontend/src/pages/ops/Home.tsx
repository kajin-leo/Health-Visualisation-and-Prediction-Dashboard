import { Alert, Button, Input, Progress, Switch, Tab, Tabs } from "@heroui/react";
import { useState, useRef, useEffect } from "react";
import { apiClient } from "../../service/axios";
import { CircleCheck, CircleX, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const IndividualAttributesImport = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setProgress] = useState(0);
    const [uploadedSuccessfully, setUploadedSuccessfully] = useState(false);
    const [uploadFailure, setUploadFailure] = useState(false);
    const [uploadFailureMessage, setUploadFailureMessage] = useState('');

    const pollProgress = async (jobId) => {
        const interval = setInterval(async () => {
            try {
                const { data } = await apiClient.get(`/ops/import/progress/${jobId}`);
                console.log(data);

                setProgress(data.percentage);

                if (data.completed) {
                    clearInterval(interval);
                    setIsLoading(false);
                    setUploadedSuccessfully(true);
                } else if (!data) {
                    clearInterval(interval);
                    setIsLoading(false);
                    setUploadFailure(true);
                }
            } catch (error) {
                clearInterval(interval);
                setIsLoading(false);
                setUploadFailure(true);
            }
        }, 1000);
    }

    const upload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.multiple = false;

        input.onchange = async (e) => {
            setUploadedSuccessfully(false);
            setUploadFailure(false);
            setProgress(0);

            const file = e!.target!.files[0];
            if (!file) return;

            setIsLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            try {
                const { data: jobId } = await apiClient.post('/ops/import/individual-attributes', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                pollProgress(jobId);

            } catch (error) {
                console.error(error);
                setIsLoading(false);
                setUploadFailure(true);
                setUploadFailureMessage(error.response.data || error.response.data.message);
            }
        }

        input.click();
    }

    return (
        <div className="flex items-center flex-col gap-2">
            <Button color='primary' className="m-2" isLoading={isLoading} onPress={upload}>
                Upload File
            </Button>
            <h3>Select the CSV file for Individual Attributes</h3>
            <h4>Please note that data of duplicate participants will be covered</h4>
            {isLoading ? <Progress aria-label="Uploading" showValueLabel={true} size="md" value={uploadProgress} /> : ''}
            {uploadedSuccessfully ? <Alert color='success' title='Imported successfully!' /> : ''}
            {uploadFailure ? <Alert color='danger' title={uploadFailureMessage} /> : ''}
        </div>
    );
}

const BatchWorkoutImport = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setProgress] = useState(0);
    const [uploadedSuccessfully, setUploadedSuccessfully] = useState(false);
    const [uploadFailure, setUploadFailure] = useState(false);
    const [uploadFailureMessage, setUploadFailureMessage] = useState('');

    const pollProgress = async (jobId) => {
        const interval = setInterval(async () => {
            try {
                const { data } = await apiClient.get(`/ops/import/progress/${jobId}`);
                console.log(data);

                setProgress(data.percentage);

                if (data.completed) {
                    clearInterval(interval);
                    setIsLoading(false);
                    setUploadedSuccessfully(true);
                } else if (!data) {
                    clearInterval(interval);
                    setIsLoading(false);
                    setUploadFailure(true);
                }
            } catch (error) {
                clearInterval(interval);
                setIsLoading(false);
                setUploadFailure(true);
            }
        }, 1000);
    }

    const upload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.multiple = true;

        input.onchange = async (e) => {
            setUploadedSuccessfully(false);
            setUploadFailure(false);
            setProgress(0);

            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            setIsLoading(true);
            const formData = new FormData();

            files.forEach(file => {
                formData.append('files', file);
            });

            try {
                const { data: jobId } = await apiClient.post('/ops/import/workout-batch', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                pollProgress(jobId);

            } catch (error) {
                console.error(error);
                setIsLoading(false);
                setUploadFailure(true);
                setUploadFailureMessage("Errors occurred when uploading");
            }
        }

        input.click();
    }

    return (
        <div className="flex items-center flex-col gap-2">
            <Button color='primary' className="m-2" isLoading={isLoading} onPress={upload}>
                Upload File
            </Button>
            <h3>Select the CSV files for Workout Data</h3>
            <h4>Please note that data of duplicate participants will be covered</h4>
            {isLoading ? <Progress aria-label="Uploading" showValueLabel={true} size="md" value={uploadProgress} /> : ''}
            {uploadedSuccessfully ? <Alert color='success' title='Imported successfully!' /> : ''}
            {uploadFailure ? <Alert color='danger' title={uploadFailureMessage} /> : ''}
        </div>
    );
}

const IndividualWorkoutImport = () => {
    return (
        <div className="flex items-center flex-col gap-2 mt-2">
            <Input variant='bordered' isRequired
                label='Participant Index'
                placeholder="Enter the index of participant (Starting from 000000)"
                classNames={{
                    inputWrapper: [
                        'border-white/20 bg-black/10',
                        'hover:border-white',
                        'hover:bg-black/20',
                        'group-data-[focus=true]:border-white/30'
                    ]
                }}
            />
            <Button color='primary' className="m-2">
                Upload File
            </Button>
            <h3>Select the CSV file for Workout Data</h3>
            <h4>Please note that data of duplicate participants will be covered</h4>
        </div>
    );
}

const WorkoutImport = () => {
    const [isBatchImport, setBatchImport] = useState(true);
    return (
        <div className="flex items-center flex-col gap-2">
            <Switch isSelected={isBatchImport} onValueChange={setBatchImport}>
                Batch Import
            </Switch>
            {isBatchImport ? <BatchWorkoutImport /> : <IndividualWorkoutImport />}
            <h4>Only importing for existing participants is supported. </h4>
        </div>
    )
}

const TestConnection = () => {
    const [serviceRunning, setServiceRunning] = useState(false);
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await apiClient.get('/ops/import/status')
                console.log(response);
                if (response.status == 200) setServiceRunning(true);
            } catch (error) {
                console.error(error);
                setServiceRunning(false);
            }
        }
        checkStatus();
    }, []);

    if (serviceRunning) {
        return (
            <div className="bg-green-500/50 rounded-xl flex p-3 gap-2 text-sm items-center">
                <CircleCheck />
                Service Running
            </div>
        )
    } else {
        return (
            <div className="bg-red-600/50 rounded-xl flex p-3 gap-2 text-sm items-center">
                <CircleX />
                Service Down
            </div>
        )
    }
}

const Home = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="bg-gradient-to-b from-gray-900/40 to-gray-950/30 backdrop-blur-lg rounded-2xl outline-2 outline-gray-300/20 items-center flex flex-col p-4 select-none transition-all">
                <h1 className="text-xl font-semibold m-2">Batch Import</h1>
                <Tabs variant='underlined'>
                    <Tab key='individual-attributes' title='Individual Attributes'>
                        <IndividualAttributesImport />
                    </Tab>
                    <Tab key='workout' title='Workout'>
                        <WorkoutImport />
                    </Tab>
                </Tabs>
                <div className="flex justify-end w-full">
                    <TestConnection />
                </div>
            </div>
            <Button color="danger" className="fixed bottom-5 left-5" onPress={logout}>
                <LogOut />Sign Out
            </Button>
        </div>
    )
}

export default Home;