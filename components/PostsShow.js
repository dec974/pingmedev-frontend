import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import MainLayout from '../ui-kit/template/MainLayout';
import Button from '../ui-kit/atoms/Button';
import styles from '../styles/PostsShow.module.css';
import { formatDate } from '../modules/formatDate';
import Spinner from "../ui-kit/atoms/Spinner";

function PostsShow( ) {
    const router = useRouter();
    const user = useSelector((state => state.user.value));
    const { postId }  = router.query;
    const [post, setPost] = useState(null);

    useEffect(() => {
        if (postId) {
            console.log('Fetching post with ID:', postId);
            fetch(`http://localhost:3000/posts/${postId}`)
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setPost(data.post);
                    console.log('Post data:', data.post);
                } else {
                    console.error('Failed to fetch post data');
                }
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
        }
    }, [postId]);
    
    if (!post) {
        return (
            <MainLayout>
                <Spinner size={50} />
            </MainLayout>
        );
    }
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
                        <div className={styles.postAuthor}>
                            {post ? post.userId.username : 'Loading...'}
                        </div>
                        <h1 className={styles.postTitle}>{post.title}</h1>
                        <p className={styles.postDate}>
                            {formatDate( post.createdAt )}
                        </p>
                    </div>
                    <div className={styles.postContent}>
                        <p className={styles.postContent}>{post ? post.content : 'Loading...'}</p>
                        <p className={styles.postType}>Type: {post ? post.type : 'Loading...'}</p>
                        <p className={styles.postAuthor}>Author: {post ? post.userId.name : 'Loading...'}</p>
                        <p className={styles.postStatus}>Status: {post ? post.status : 'Loading...'}</p>
                        <p className={styles.postLanguages}>Languages: {post ? post.languages.join(', ') : 'Loading...'}</p>
                        <p className={styles.postCreatedAt}>Created At: {post ? new Date(post.createdAt).toLocaleDateString() : 'Loading...'}</p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default PostsShow;