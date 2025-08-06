import { useState, useEffect } from 'react';
import MainLayout from '../ui-kit/template/MainLayout';
import Input from '../ui-kit/atoms/Input';
import styles from '../styles/Home.module.css';
import PostsList from '../ui-kit/organisms/PostsList';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("http://localhost:3000/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.slice(0,10)); //Affiche les 10 premiers posts
        setLoading(false);
      });
}, []);

  return (
    <MainLayout>
      <h1 className={styles.title}>Bienvenue sur PingMeDev</h1>
      <h2>John Doe</h2>
      <Input type="text" placeholder="Rechercher un sujet ..." />
      <h2> Derniers posts</h2>
      {loading ? (
        <p> Chargement en cours</p>
      ) : (
        posts.map((post) => (
          <div key={post._id}>
            <PostsList></PostsList>
            <h3>{post.title}</h3>
            
            <p>{post.content}</p>
            <p>Par: {post.userId.username}</p>
            <a href={`/posts/${post._id}`}>Voir le post</a>
            <p>Langages: {post.languages.map(lang => lang.name).join(', ')}</p>
            <p>Status: {post.status}</p>
            <p>Créé le: {new Date(post.createdAt).toLocaleDateString()}</p>
            
          </div>
        ))
      )}
      </MainLayout>
    );
  }