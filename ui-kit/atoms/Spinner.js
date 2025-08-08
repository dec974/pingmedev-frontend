import styles from './Spinner.module.css';

function Spinner(props) {
    return (
        <svg
            className={styles.loader}
            width={props.size}
            height={props.size}
            color={props.color || '#1761ab'}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
            </svg>
    );
}

export default Spinner;