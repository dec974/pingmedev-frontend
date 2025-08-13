import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserId } from "../reducers/user";
import Button from "../ui-kit/atoms/Button";
import Header from "../ui-kit/organisms/Header";
import Footer from "../ui-kit/organisms/Footer";
import MainLayout from "../ui-kit/template/MainLayout";
import styles from "../styles/Messenger.module.css";

const Messenger = () => {
  const dispatch = useDispatch();
  let user = useSelector((state) => {
    console.log("État complet Redux:", state);
    return state.user.value;
  });

  console.log("User depuis Redux:", user);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     if (!user || !user.token || !user.id) {
    //         console.log('Pas d\'utilisateur connecté');
    //         setLoading(false);
    //         return;
    //     }

    //     // Récupération de l'ID utilisateur depuis le backend (comme dans Posts)
    //     fetch('http://localhost:3000/users/' + user.token)
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.result) {
    //                 console.log('ID utilisateur récupéré:', data.user.id);
                    
    //                 dispatch(setUserId(data.user.id));
    //             } else {
    //                 console.error('Erreur récupération utilisateur:', data.error);
    //                 setLoading(false);
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Erreur fetch utilisateur:', error);
    //             setLoading(false);
    //         });
    // }, [user.token, user.id, dispatch]);

  useEffect(() => {
    if (user.id) {
      console.log("Chargement des conversations pour:", user.id);
      loadConversations();

      // Refresh toutes les 3 sec.
      const interval = setInterval(() => {
        loadConversations();
        if (selectedConversation) {
          loadMessages(selectedConversation.contact._id);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [user.id, selectedConversation]);

  const loadConversations = () => {
    console.log("loadConversations appelée pour:", user.id);
    fetch(`http://localhost:3000/messages/chats/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Conversations reçues:", data);
        setConversations(data);
        setLoading(false);
        console.log("Loading set false");
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des conversations", error);
        setLoading(false);
        console.log("Loading set false après error");
      });
  };

  const loadMessages = (contactId) => {
    fetch(`http://localhost:3000/messages/${user.id}/${contactId}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des messages", error);
      });
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.contact._id);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const messageData = {
      senderId: user.id,
      recipientId: selectedConversation.contact._id,
      content: newMessage,
    };

    fetch("http://localhost:3000/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          loadMessages(selectedConversation.contact._id);
          setNewMessage("");
          loadConversations();
        }
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi du message:", error);
      });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (username) => {
    return username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Si pas d'utilisateur connecté
  if (!user) {
    return (
      <>
        <MainLayout>
          <div className={styles.messengerContainer}>
            <div className={styles.noConversation}>
              <p>Vous devez être connecté pour accéder à la messagerie</p>
            </div>
          </div>
        </MainLayout>
      </>
    );
  }

  console.log("État loading:", loading);
  console.log("État conversations:", conversations.length);

  if (loading) {
    return (
      <>
        <MainLayout>
          <div className={styles.messengerLoading}>
            Chargement en cours... (User: {user.username})
          </div>
        </MainLayout>
      </>
    );
  }

  return (
    <MainLayout>
      <div className={styles.messengerContainer}>
        {/* Liste des chats */}
        <div className={styles.conversationsSidebar}>
          <div className={styles.conversationsHeader}>
            <h3>Messages</h3>
            <p>Connecté: {user.username}</p>
          </div>
          <div className={styles.conversationsList}>
            {conversations.length === 0 ? (
              <div>Aucune conversation</div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.contact._id}
                  className={`${styles.conversationItem} ${
                    selectedConversation?.contact._id ===
                    conversation.contact._id
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => selectConversation(conversation)}
                >
                  <div className={styles.avatar}>
                    {getInitials(conversation.contact.username)}
                  </div>
                  <div className={styles.conversationInfo}>
                    <div className={styles.contactName}>
                      {conversation.contact.username}
                    </div>
                    <div className={styles.lastMessage}>
                      {conversation.lastMessage.content.length > 30
                        ? conversation.lastMessage.content.substring(0, 30) +
                          "..."
                        : conversation.lastMessage.content}
                    </div>
                  </div>
                  <div className={styles.conversationTime}>
                    {formatTime(conversation.lastMessage.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Zone messages */}
        <div className={styles.messagesArea}>
          {selectedConversation ? (
            <>
              <div className={styles.messagesHeader}>
                <div className={styles.avatar}>
                  {getInitials(selectedConversation.contact.username)}
                </div>
                <div className={styles.contactName}>
                  {selectedConversation.contact.username}
                </div>
              </div>
              <div className={styles.messagesList}>
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`${styles.message} ${
                      message.senderId._id === user.id
                        ? styles.sent
                        : styles.received
                    }`}
                  >
                    <div className={styles.messageAvatar}>
                      {getInitials(message.senderId.username)}
                    </div>
                    <div className={styles.messageContent}>
                      <div className={styles.messageHeader}>
                        <span className={styles.messageSender}>
                          {message.senderId.username}
                        </span>
                        <span className={styles.messageTime}>
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                      <div className={styles.messageText}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.noConversation}>
              <p>Cliquez sur un chat pour commencer</p>
            </div>
          )}

          {/* Zone envoi toujours visible */}
          <div className={styles.messageInputArea}>
            <input
              type="text"
              placeholder="Votre message ici..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={styles.messageInput}
            />
            <Button
              variant="secondary"
              onClick={sendMessage}
              className={styles.sendButton}
            >
              Envoyer
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Messenger;
