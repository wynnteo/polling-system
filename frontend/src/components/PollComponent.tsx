import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Poll } from '../types';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Client } from '@stomp/stompjs';

const PollComponent: React.FC = () => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [votedOptions, setVotedOptions] = useState<Set<number>>(new Set());
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        // Fetch polls from the backend when the component mounts
        axios.get('http://localhost:8080/api/polls')
            .then(res => setPolls(res.data));

        // Initialize WebSocket client
        const client = new Client({
            brokerURL: 'ws://192.168.18.16:8080/ws-poll',
            debug: (str) => {
                console.log('WebSocket debug:', str); // Log WebSocket activity
            },
            reconnectDelay: 5000, // Reconnect after 5 seconds
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = (frame) => {
            console.log('WebSocket connected:', frame);
            client.subscribe('/topic/polls', (message) => {
                const updatedPoll = JSON.parse(message.body);
                console.log('Received updated poll:', updatedPoll);

                // Update React state with the new poll data
                setPolls(prevPolls => 
                    prevPolls.map(poll => 
                        poll.id === updatedPoll.id ? updatedPoll : poll
                    )
                );
            });
        };

        client.onStompError = (frame) => {
            console.error('WebSocket error:', frame);
        };

        // Activate WebSocket client
        client.activate();

        // Cleanup WebSocket connection on component unmount
        return () => {
            client.deactivate();
        };
    }, []);

    const handleVote = (pollId: number, optionId: number) => {
        if (votedOptions.has(optionId)) {
            setErrorMessage('You have already voted for this option!');
            return;
        }

        axios.post(`http://localhost:8080/api/polls/${pollId}/vote/${optionId}`)
            .then(() => {
                setVotedOptions(prev => new Set([...prev, optionId]));
                setErrorMessage('');
            })
            .catch((error) => {
                if (error.response && (error.response.status === 429 || error.response.status === 409)) {
                    setErrorMessage('Too many votes. Please try again later.');
                } else {
                    setErrorMessage('Error voting! Please try again.');
                }
                console.error('Error voting:', error);
            });
    };

    const getChartData = (poll: Poll) => {
        return {
            labels: poll.options.map(option => option.text),
            datasets: [
                {
                    label: 'Votes',
                    data: poll.options.map(option => option.votes),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    return (
        <div className="poll-container">
            {errorMessage && (
                <div className="error-message">
                    ⚠️ {errorMessage}
                </div>
            )}

            {polls.map(poll => {
                const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
                return (
                    <div key={poll.id} className="poll-card">
                        <h3 className="poll-question">{poll.question}</h3>
                        
                        <div className="chart-container">
                            <Line 
                                data={getChartData(poll)}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                stepSize: 1
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className="options-list">
                            {poll.options.map(option => (
                                <div key={option.id} className="option-item">
                                    <div className="option-content">
                                        <button
                                            className={`vote-button ${votedOptions.has(option.id) ? 'voted' : ''}`}
                                            onClick={() => handleVote(poll.id, option.id)}
                                            disabled={votedOptions.has(option.id)}
                                        >
                                            {option.text}
                                            {votedOptions.has(option.id) && (
                                                <span className="checkmark">✓</span>
                                            )}
                                        </button>
                                        
                                        <div className="results-container">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ 
                                                        width: `${(option.votes / (totalVotes || 1)) * 100}%`,
                                                        backgroundColor: votedOptions.has(option.id) 
                                                            ? '#4CAF50' 
                                                            : '#e0e0e0'
                                                    }}
                                                />
                                            </div>
                                            <span className="vote-count">
                                                {option.votes} votes • {totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PollComponent;