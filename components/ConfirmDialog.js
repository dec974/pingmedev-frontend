import Modal from "react-modal";
import styles from "../styles/confirmDialog.module.css";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmer l’action",
  message = "Êtes-vous sûr ?",
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  confirmVariant = "danger",
}) {
  return (
<Modal
  isOpen={isOpen}
  onRequestClose={onClose}
  closeTimeoutMS={180}
  className={{
    base: styles.content,
    afterOpen: styles.contentOpen,
    beforeClose: styles.contentClose,
  }}
  overlayClassName={{
    base: styles.overlay,
    afterOpen: styles.overlayOpen,
    beforeClose: styles.overlayClose,
  }}
  contentLabel="Boîte de dialogue de confirmation"
>
  <h3 className={styles.title}>{title}</h3>
  <div className={styles.message}>{message}</div>
  <div className={styles.actions}>
    <button className={styles.btn} onClick={onClose}>Annuler</button>
    <button className={`${styles.btn} ${styles.danger}`} onClick={onConfirm}>
      {confirmLabel}
    </button>
  </div>
</Modal>
  );
}
