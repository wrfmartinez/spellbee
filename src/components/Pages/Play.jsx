import { useState, useEffect } from "react";
import textToSpeech from "../../services/textToSpeech.js";
import Navbar from "../Common/Navbar.jsx";
import * as words from "../../services/words.js"

const Play = () => {
  const [play, setPlay] = useState([])
  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState("");

 
  // Randomly select a word when the component mounts
  useEffect(() => {
    const fetchRandom = async () =>{
      const wordsPlay = await words.show()
      setPlay(wordsPlay.word)
      selectRandomWord(wordsPlay);
    }
    fetchRandom()
  }, []);

  const selectRandomWord = (play) => {
    const randomIndex = Math.floor(Math.random() * play.length);
    setCurrentWord(play.word);
    console.log(play.word);
    setUserInput("");
    setAttemptsLeft(3);
    setButtonDisabled(false);
    setMessage("");
  };

  const handleSpeak = () => {
    if (attemptsLeft > 0) {
      textToSpeech(currentWord);
      setAttemptsLeft(attemptsLeft - 1);
      if (attemptsLeft === 1) {
        setButtonDisabled(true);
      }
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    if (userInput.trim().toLowerCase() === currentWord.toLowerCase()) {
      setPoints(points + 1);
      setMessage("Correct! Moving to the next word.");
    } else {
      setMessage("Incorrect! No points awarded. Moving to the next word.");
    }
    setTimeout(() => {
      selectRandomWord();
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key == 'Enter') {
      handleSubmit();
    }
  }

  return (
    <>
      <Navbar />
      <section id="practice-container">
        <div className="center">
          <div className="message-container">
            <h2 className="message">{message}</h2>
          </div>
          <div className="score">
            <h3 className="score-counter">Score <span className="score-number">{points}</span></h3>
          </div>
          <p className="instruction-text">Listen and spell the word</p>
          <button className="btn" disabled={isButtonDisabled} onClick={handleSpeak}>
            Speak Word ({attemptsLeft} attempts left)
          </button>
          <input
            className="user-input"
            autoFocus
            type="text"
            placeholder="Type the word"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button className="btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </section>
    </>
  );
};

export default Play;