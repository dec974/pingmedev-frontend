import Posts from '../../../components/Posts';
import { useRouter } from 'next/router';
import Spinner from '../../../ui-kit/atoms/Spinner';

function PostsEdit() {
    const router = useRouter();
    const { id } = router.query;
    console.log('id:', id);

    if (!id) {
        return <Spinner size={50} />;
    }

    return (
        <Posts type="edit" id={id}/>
    );
}

export default PostsEdit;