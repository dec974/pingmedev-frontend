"use client";
import { useEffect, useState } from "react";
import Pusher from "react-pusher";
import { useSelector } from "react-redux";
import pusherClient from "../modules/pusherClient";
import MainLayout from "../ui-kit/template/MainLayout";
import styles from "../styles/Pusher.module.css"
import Button from "../ui-kit/atoms/Button";

function PusherComponent() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    setAuthor(user.id);
    //historic
    console.log("historic");
    fetch("https://pingmedev-backend.vercel.app/pusher/", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setMessages(data.messages);
        } else {
          console.log("error: fetch historic");
        }
      });
  }, []);

  const fetchMessages = () => {
    fetch("https://pingmedev-backend.vercel.app/pusher/", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setMessages(data.messages);
        } else {
          console.log("error: fetch historic");
        }
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("https://pingmedev-backend.vercel.app/pusher/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        author,
        content,
      }),
    });
    setContent("");
  };
  return (
    <MainLayout className={styles.main}>
      <div className={styles.container}>
        <ul className={styles.messages}>
          {messages.map((m) => (
            <li key={m._id} className={styles.message}>
              <b>{m.author.username}</b> : {m.content}
            </li>
          ))}
        </ul>

        <Pusher channel="chat" event="new-message" onUpdate={fetchMessages} />

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Message"
            required
          />
          <Button type="submit" className={styles.button}>
            Envoyer
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}

export default PusherComponent;
