'use client';
import { useEffect, useState} from 'react';
import  Pusher  from 'react-pusher';
import { useSelector } from 'react-redux';
import pusherClient from '../modules/pusherClient';
import MainLayout from '../ui-kit/template/MainLayout';


function PusherComponent() {
    const [messages, setMessages] = useState([]);   
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');

    const user = useSelector((state) =>  state.user.value);

    useEffect(() => {
        setAuthor(user.id);
        //historic
        console.log('historic');
        fetch('http://localhost:3000/pusher/', { cache: 'no-store'})
            .then(response => response.json())
            .then(data => {
                if(data.result) {
                    setMessages(data.messages);
                } else {
                    console.log('error: fetch historic')
                }
            });
    }, []);

    const fetchMessages = () => {
        fetch('http://localhost:3000/pusher/', { cache: 'no-store'})
        .then(response => response.json())
        .then(data => {
            if(data.result) {
                setMessages(data.messages);
            } else {
                    console.log('error: fetch historic')
            }
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:3000/pusher/', {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                author,
                content
            }),
        });
        setContent('');
    };

    return (
        <MainLayout>
            <div>
                <ul>
                    {messages.map(m => (
                    <li key={m._id}><b>{m.author.username}</b> : {m.content}</li>
                    ))}
                </ul>

                <Pusher
                    channel="chat"
                    event="new-message"
                    onUpdate={fetchMessages}
                />

                <form onSubmit={handleSubmit}>
                    <input
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Message"
                    required
                    />
                    <button type="submit">Envoyer</button>
                </form>
            </div>
        </MainLayout>
    );
}

export default PusherComponent;