import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import MainLayout from "../ui-kit/template/MainLayout";
import Button from "../ui-kit/atoms/Button";
import TextArea from "../ui-kit/atoms/TextArea";
import styles from "../styles/PostsShow.module.css";
import { formatDate } from "../modules/formatDate";
import Spinner from "../ui-kit/atoms/Spinner";
import Image from "next/image";
import Icon from "../ui-kit/atoms/Icon";
import Modal from "react-modal";
import { FaPencil } from "react-icons/fa6";
import { MdGroupAdd, MdPersonRemoveAlt1 } from "react-icons/md";
import ProfilePopover from "./ProfilePopover";

// Nettoie le HTML Quill pour supprimer les <p><br></p> inutiles
function cleanQuillHtml(html) {
  if (!html) return html;
  return html.replace(/<p><br\/?><\/p>/g, '');
}

function PostsShow() {
  const router = useRouter();
  const user = useSelector((state) => state.user.value);
  const { postId } = router.query;
  const [post, setPost] = useState(null);
  const [answerContent, setAnswerContent] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [followedAuthor, setFollowedAuthor] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {
    if (!user.id) {
      fetch("http://localhost:3000/users/" + user.token)
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            user._id = data.user.id;
          } else {
            console.error("Failed to fetch user data");
          }
        });
    }
    if (postId) {
      fetch(`http://localhost:3000/posts/${postId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setPost(data.post);
            // On ne set plus ici followedAuthor, on laisse le useEffect suivant gérer
          } else {
            console.error("Failed to fetch post data");
          }
        })
        .catch((error) => {
          console.error("Error fetching post:", error);
        });
    }
    // follow user list
    fetch(`http://localhost:3000/follows/users/${user.id}`)
      .then(response => response.json())
      .then(data => {
        const following = data.follows.map(f => f.following._id);
        setFollowingList(following);
      });
  }, [postId]);

  // Met à jour followedAuthor après la mise à jour de followingList ou post
  useEffect(() => {
    if (post && post.userId && followingList) {
      setFollowedAuthor(followingList.includes(post.userId._id));
    }
  }, [followingList, post]);
  

  function toggleFollowAuthor() {

    if (!user?.token || !post?.userId?._id) {
      alert("Vous devez être connecté pour suivre un utilisateur.");
      return;
    }

    if(followedAuthor) {
      // unfollow
      fetch(`http://localhost:3000/follows/users/${user.id}/${post.userId._id}`, {
        method: 'DELETE',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({following : post?.userId?._id})
      })
        .then(response => response.json())
        .then(data => {
          if(data.result) {
            setFollowingList(followingList.filter(f => f !== post.userId._id ));
            setFollowedAuthor(false);
          }
        });
    } else {
      // follow
      fetch(`http://localhost:3000/follows/users/${user.id}`, {
        method: 'POST',
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({following : post?.userId?._id})
      })
        .then(response => response.json())
        .then(data => {
          setFollowingList((prev) => [...prev, data.follow.following._id]);
          setFollowedAuthor(true);
        });
    }
    // const targetUserId = post.userId._id;
    // const endpoint = followedAuthor ? "unfollow-user" : "follow-user";

    // setLoadingFollow(true);

    // fetch(`http://localhost:3000/users/${endpoint}`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ token: user.token, targetUserId }),
    // })
    //   .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
    //   .then(({ ok, data }) => {
    //     if (!ok || !data.result) {
    //       console.warn(data.error || "Erreur follow/unfollow");
    //       alert("Impossible de mettre à jour le suivi. Réessayez plus tard.");
    //       return; 
    //     }

    //     const next =
    //       typeof data.following === "boolean"
    //         ? data.following
    //         : !followedAuthor;

    //     setFollowedAuthor(next);

        // stockage de l'information de suivi dans le post
      //   setPost((p) =>
      //     p ? { ...p, userId: { ...p.userId, isFollowedByMe: next } } : p
      //   );
      // });
  }

  function openModal() {
    setModalIsOpen(true);
  }
  function closeModal() {
    setModalIsOpen(false);
  }

  function handleSubmitAnswer(e) {
    e.preventDefault();
    // check if user is connected
    if (!user) {
      alert("Vous devez être connecté pour répondre à un sujet.");
      return;
    }
    if (!answerContent.trim()) {
      alert("Veuillez saisir une réponse.");
      return;
    }
    const answerData = {
      response: answerContent,
      userId: user.id,
      postId: postId,
    };
    console.log("Submitting answer:", answerData);

    

    fetch(`http://localhost:3000/posts/${postId}/answers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(answerData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Réponse ajoutée avec succès:", data.answer);
          setPost(data.post);
          setAnswerContent("");
          closeModal();
        } else {
          console.error("Erreur lors de l'ajout de la réponse");
        }
      });
  }

  function handleNewMessage() {
    if (!user) {
      alert("Vous devez être connecté pour envoyer un message.");
      return;
    }
    fetch(`http://localhost:3000/messages/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: user.id,
        recipientId: post.userId._id,
        content: `Bonjour ${post.userId.username}, j'aimerais discuter de votre sujet "${post.title}".`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          router.push('//messenger');
        } else {
          console.error("Erreur lors de l'envoi du message");
        }
      })
      .catch((error) => {
        console.error("Error sending message:", error); 
      });
  }

  if (!post) {
    return (
      <MainLayout>
        <Spinner size={50} />
      </MainLayout>
    );
  }
  // affichage de icons langages
  const languagesList = post.languages.map((language, index) => {
    return <Icon key={index} language={language} size={50} />;
  });

  console.log("Post data:", post);
  const answersList = post.answers.map((answer, index) => {
    return (
      <div key={index} className={styles.answerCard}>
        <div className={styles.answerHeader}>
          <div className={styles.answerAuthor}>{answer.userId.username}</div>
          <div className={styles.answerDate}>
            {formatDate(answer.createdAt)}
          </div>
        </div>
        <div className={styles.answerContent}>{answer.response}</div>
      </div>
    );
  });
  Modal.setAppElement("#__next");
  return (
    <MainLayout>
      <div className={styles.content}>
        <div className={styles.btnBack}>
          <Button variant="primary" onClick={() => router.back()}>
            Retour
          </Button>
        </div>
        <div className={styles.postContainer}>
          <div className={styles.postHeader}>
            <ProfilePopover
              userIdOrUsername={post?.userId?.username}
              trigger={
                <div className={styles.postAuthor}>
                  <Image
                    src="/avatar.png"
                    width={60}
                    height={60}
                    className={styles.logoImg}
                    alt="PingMe logo"
                  />
                  {post ? post.userId.username : "Loading..."}
                </div>
              }
              onDiscuss={handleNewMessage}
              onToggleFollow={toggleFollowAuthor}
              followedAuthor={followedAuthor}
            />

            <div className={styles.postHeaderTitle}>
              <h1 className={styles.postTitle}>{post.title}</h1>
              <div className={styles.subTitle}>
                {/* <button
                  className={styles.followButton}
                  onClick={toggleFollowAuthor}
                  disabled={loadingFollow}
                  title={
                    followedAuthor
                      ? "Ne plus suivre l’auteur"
                      : "Suivre l’auteur"
                  }
                  aria-pressed={followedAuthor}
                >
                  {followedAuthor ? (
                    <MdPersonRemoveAlt1
                      size={38}
                      color="var(--secondary-color)"
                    />
                  ) : (
                    <MdGroupAdd size={32} color="var(--secondary-color)" />
                  )}
                </button> */}
                <p className={styles.postDate}>{formatDate(post.createdAt)}</p>
                <div className={styles.languages}>{languagesList}</div>
              </div>
            </div>
          </div>
          <div className={styles.postContent}>
            <div className={styles.sujectContent}>
              <div dangerouslySetInnerHTML={{ __html: cleanQuillHtml(post.content) }} />
            </div>
            <div className={styles.responses}>
              <div className={styles.answersList}>{answersList}</div>
              <div className={styles.answerForm}>
                <button className={styles.answerButton} onClick={openModal}>
                  <div className={styles.icon}>
                    <FaPencil size={20} />
                  </div>
                  <p>Répondre</p>
                </button>
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  contentLabel="Répondre au sujet"
                  className={styles.modal}
                  overlayClassName={styles.overlay}
                >
                  <div className={styles.modalHeader}>
                    <h2>Répondre au sujet</h2>
                    <Button variant="secondary" onClick={() => closeModal()}>
                      Fermer
                    </Button>
                  </div>
                  <form
                    onSubmit={(e) => handleSubmitAnswer(e)}
                    className={styles.form}
                  >
                    <TextArea
                      placeholder="Votre réponse..."
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      rows={10}
                    />
                    <div className={styles.btnSubmit}>
                      <Button type="submit" variant="primary">
                        Répondre
                      </Button>
                    </div>
                  </form>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PostsShow;