import React from 'react';
import CreatePollForm from './components/CreatePollForm';
import PollComponent from './components/PollComponent';
import './styles.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <center>
                <h1>Real-Time Polling System</h1>
            </center>
            <CreatePollForm />
            <PollComponent />
        </div>
    );
};

export default App;