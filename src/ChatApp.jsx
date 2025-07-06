import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatAppUIOnly.css';

const ChatApp = () => {
    const [inputText, setInputText] = useState('');
    const [responseText, setResponseText] = useState('ここに回答が表示されます');
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);

    const historyEndRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponseText('');

        try {
            //const res = await axios.post('http://localhost:8000/chat', { text: inputText });
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat`, { text: inputText });

            setResponseText(res.data.answer);
            setChatHistory(prev => [...prev, { question: inputText, answer: res.data.answer }]);
        } catch (error) {
            console.error(error);
            setResponseText('エラーが発生しました');
        } finally {
            setLoading(false);
            setInputText('');
        }
    };

    const handleReset = () => {
        setInputText('');
        setResponseText('ここに回答が表示されます');
        setChatHistory([]);
    };

    useEffect(() => {
        if (historyEndRef.current) {
            historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory]);

    return (
        <div className="chat-app-container">
            {/* 左側 履歴パネル */}
            <div className="chat-history-panel">
                <h2>チャット履歴</h2>
                <div className="chat-history-scroll">
                    {chatHistory.map((item, index) => (
                        <div key={index} className="chat-history-item">
                            <strong>Q:</strong> {item.question}<br />
                            <strong>A:</strong> {item.answer}
                        </div>
                    ))}
                    <div ref={historyEndRef}></div>
                </div>
            </div>

            {/* 右側 入力・レスポンス */}
            <div className="chat-main-panel">
                <div className="chat-card">
                    <h1 className="chat-title">Original LLM Chat APP（Yoshihiko Hagita）</h1>
                    <form className="chat-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="質問を入力してください"
                            className="chat-input"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <div className="button-group">
                            <button type="submit" className="chat-button" disabled={loading}>
                                {loading ? '送信中...' : '送信'}
                            </button>
                            <button type="button" className="reset-button" onClick={handleReset} disabled={loading}>
                                リセット
                            </button>
                        </div>
                    </form>
                    <div className="chat-response">
                        {loading ? '回答生成中...' : responseText}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatApp;
