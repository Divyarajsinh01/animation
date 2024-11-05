import { useContext, useRef, useState } from 'react';
import { ChallengesContext } from '../store/challenges-context.jsx';
import Modal from './Modal.jsx';
import images from '../assets/images.js';
import { motion, useAnimate, stagger } from 'framer-motion';

export default function NewChallenge({ onDone }) {
  const title = useRef();
  const description = useRef();
  const deadline = useRef();
  const [scope, animate] = useAnimate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { addChallenge } = useContext(ChallengesContext);

  function handleSelectImage(image) {
    setSelectedImage(image);
    setErrorMessage(''); // Clear error if an image is selected
  }

  function handleSubmit(event) {
    event.preventDefault();
    const challenge = {
      title: title.current.value,
      description: description.current.value,
      deadline: deadline.current.value,
      image: selectedImage,
    };

    // Check for missing fields and set error message if any are empty
    if (
      !challenge.title.trim() ||
      !challenge.description.trim() ||
      !challenge.deadline.trim() ||
      !challenge.image
    ) {
      setErrorMessage('Please fill in all fields and select an image.');
      animate('label, input, textarea', { x: [-10, 0, 10, 0] }, { type: 'spring', duration: 0.2, delay: stagger(0.05) });
      return;
    }

    setErrorMessage(''); // Clear error on successful submission
    onDone();
    addChallenge(challenge);
  }

  return (
    <Modal title="New Challenge" onClose={onDone}>
      <motion.form
        id="new-challenge"
        onSubmit={handleSubmit}
        ref={scope}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        {errorMessage && (
          <motion.p
            className="error-message"
            initial={{ x: -10 }}
            animate={{ x: [0, -10, 10, 0] }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {errorMessage}
          </motion.p>
        )}

        <p>
          <label htmlFor="title">Title</label>
          <motion.input ref={title} type="text" name="title" id="title" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }} />
        </p>

        <p>
          <label htmlFor="description">Description</label>
          <motion.textarea ref={description} name="description" id="description" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }} />
        </p>

        <p>
          <label htmlFor="deadline">Deadline</label>
          <motion.input ref={deadline} type="date" name="deadline" id="deadline" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }} />
        </p>

        <motion.ul
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          animate="visible"
          id="new-challenge-images"
        >
          {images.map((image) => (
            <motion.li
              variants={{
                hidden: { opacity: 0, scale: 0.5 },
                visible: { opacity: 1, scale: [0.8, 1.3, 1] },
              }}
              exit={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
              key={image.alt}
              onClick={() => handleSelectImage(image)}
              className={selectedImage === image ? 'selected' : undefined}
              style={{
                border: selectedImage === image ? '2px solid blue' : 'none',
                padding: selectedImage === image ? '5px' : '0',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.1 }}
            >
              <img {...image} />
            </motion.li>
          ))}
        </motion.ul>

        <p className="new-challenge-actions">
          <motion.button
            type="button"
            onClick={onDone}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Challenge
          </motion.button>
        </p>
      </motion.form>
    </Modal>
  );
}
