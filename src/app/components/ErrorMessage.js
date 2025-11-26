import styles from './ErrorMessage.module.css';

export default function ErrorMessage({ message, onRetry }) {
    return (
        <div className={styles.error}>
            <p className={styles.message}>⚠️ {message}</p>
            {onRetry && (
                <button onClick={onRetry} className={styles.button}>
                    Réessayer
                </button>
            )}
        </div>
    );
}