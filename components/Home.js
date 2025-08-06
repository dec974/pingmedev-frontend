import { useState, useEffect } from 'react';
import Header from '../ui-kit/organisms/Header';
import Input from '../ui-kit/atoms/Input';
import styles from '../styles/Home.module.css';
import PostsList from '../ui-kit/organisms/PostsList';
import Button from '../ui-kit/atoms/Button';
import Footer from '../ui-kit/organisms/Footer';

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

//voici le composant Home qui affiche les posts
  return (
    <>
    <Header></Header>
    
    <div className={styles.home}>
      <h1 className={styles.title}>Bienvenue sur PingMeDev</h1>
      <h2>John Doe</h2>
      <div className={styles.returnBtn}>
      <Button variant={"primary"} onClick={() => alert('Button clicked!')}>Retour</Button>
      </div>
      <Input type="text" placeholder="Rechercher un sujet ..." />
      
      <h2> Derniers posts</h2>
      {loading ? (
        <p> Chargement en cours</p>
      ) : (
        <PostsList posts={posts}/>
        
        /*posts.map((post) => (
          <div key={post._id}>
            <h3>{post.title}</h3>
            
            <p>{post.content}</p>
            <p>Par: {post.userId.username}</p>
            <a href={`/posts/${post._id}`}>Voir le post</a>
            <p>Langages: {post.languages.map(lang => lang.name).join(', ')}</p>
            <p>Status: {post.status}</p>
            <p>Créé le: {new Date(post.createdAt).toLocaleDateString()}</p>
            
          </div>
        ))*/
      )}
      </div>
      <div classname={styles.footer}>
      <Footer ></Footer>
      </div>
      </>
    );
  }