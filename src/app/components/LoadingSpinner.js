import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner() {
    return (
        <div className={styles.spinner}>
            <FontAwesomeIcon icon={faSpinner} spin className={styles.icon} />
            <p>Chargement des données météo...</p>
        </div>
    );
}