import React, { useState } from 'react';
import axios from 'axios';

const CreatePollForm: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPoll = {
            question,
            options: options.map(optionText => ({ text: optionText, votes: 0 })),
        };
        axios.post('http://localhost:8080/api/polls', newPoll)
            .then(response => {
                console.log('Poll created:', response.data);
                setQuestion('');
                setOptions(['', '']);
            })
            .catch(error => {
                console.error('Error creating poll:', error);
            });
    };

    const handleAddOption = () => {
        setOptions([...options, '']);
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Create New Poll</h2>
            <form onSubmit={handleSubmit} className="poll-form">
                <div className="form-group">
                    <label className="form-label">Poll Question</label>
                    <input 
                        type="text" 
                        value={question} 
                        onChange={(e) => setQuestion(e.target.value)}
                        className="form-input"
                        placeholder="Enter your question..."
                        required 
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Options</label>
                    <div className="options-grid">
                        {options.map((option, index) => (
                            <div key={index} className="option-input-group">
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="option-input"
                                    placeholder={`Option ${index + 1}`}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                    <button 
                        type="button" 
                        onClick={handleAddOption}
                        className="add-option-btn"
                    >
                        Add Option
                    </button>
                </div>

                <button type="submit" className="submit-btn">
                    Create Poll
                </button>
            </form>
        </div>
    );
};

export default CreatePollForm;