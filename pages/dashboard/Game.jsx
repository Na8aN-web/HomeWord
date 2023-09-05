import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import Typed from "typed.js";
import { useRouter } from "next/router";
import app from "../../firebase";
import {
  getDatabase,
  ref,
  push,
  serverTimestamp,
  get,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database";
import ProtectedRoute from "@/components/ProtectedRoute";

const Game = () => {
  const [verse, setVerse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scoresLoading, setScoresLoading] = useState(true);
  const [userBook, setUserBook] = useState("");
  const [userChapter, setUserChapter] = useState("");
  const [userVerse, setUserVerse] = useState("");
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [correct, setCorrect] = useState({});
  const [round, setRound] = useState(1);
  const scriptureRef = useRef(null); // Ref for the scripture element
  const [typed, setTyped] = useState(null);
  const [highscores, setHighscores] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [isInMainMenu, setIsInMainMenu] = useState(true);
  let chapter, verseNumber;
  const router = useRouter();

  const startGame = () => {
    setGameEnded(false);
    setGameStarted(true);
    setTotalScore(0);
    setScore(0);
    setRound(1);
    getVerse();
    setIsInMainMenu(false);
  };

  useEffect(() => {
    // Initialize Typed.js instance when scripture is set
    if (verse && scriptureRef.current) {
      const options = {
        strings: [verse], // An array containing the verse to type
        typeSpeed: 40, // Typing speed in milliseconds
        showCursor: false, // Hide the cursor
      };
      const newTyped = new Typed(scriptureRef.current, options);
      setTyped(newTyped);

      // Cleanup Typed.js instance on unmount
      return () => {
        newTyped.destroy();
      };
    }
  }, [verse]);

  const getVerse = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://labs.bible.org/api/?passage=random&type=json"
      );
      const randomVerse = response.data[0];
      setVerse(randomVerse.text);
      setCorrect({
        bookname: randomVerse.bookname,
        chapter: randomVerse.chapter,
        verse: randomVerse.verse,
      });
      setUserBook("");
      setUserChapter("");
      setUserVerse("");
      setShowCorrectAnswer(false);
    } catch (error) {
      alert("Error fetching verse:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswer = () => {
    const points =
      (userBook.toLowerCase() === correct.bookname.toLowerCase() ? 1 : 0) +
      (userChapter === correct.chapter ? 1 : 0) +
      (userVerse === correct.verse ? 1 : 0);

    setScore(points);
    setTotalScore(totalScore + points);
    setShowCorrectAnswer(true);
    setRound((prevRound) => prevRound + 1);
  };

  const getScoreMessage = () => {
    if (score === 0) {
      return `Oops! Looks like you didn't guess right. You got 0 points.`;
    } else if (score === 1) {
      return `Not bad! You got a point.`;
    } else if (score === 2) {
      return `Nicely done! You got 2 points.`;
    } else if (score === 3) {
      return `Wow, you really know your stuff! 3 points.`;
    }
  };
  const fetchHighscores = async () => {
    setScoresLoading(true);
    const db = getDatabase(app);
    const highscoresRef = ref(db, "highscores");

    try {
      const highscoresQuery = query(
        highscoresRef,
        orderByChild("score"),
        limitToLast(10)
      );

      const snapshot = await get(highscoresQuery);
      if (snapshot.exists()) {
        const highscoresData = snapshot.val();
        // Convert the object of highscores into an array
        const highscoresArray = Object.values(highscoresData);

        // Sort the highscores in descending order (highest first)
        highscoresArray.sort((a, b) => b.score - a.score);

        // Format and add the date to each highscore entry
        highscoresArray.forEach((entry) => {
          const timestamp = entry.timestamp;
          if (timestamp) {
            const date = new Date(timestamp);
            const formattedDate = `${date.getDate()}/${
              date.getMonth() + 1
            }/${date.getFullYear()}`;
            entry.formattedDate = formattedDate;
          }
        });

        setHighscores(highscoresArray);
      }
    } catch (error) {
      console.error("Error fetching highscores:", error);
    } finally {
      setScoresLoading(false); // Set scoresLoading to false when done fetching
    }
  };

  useEffect(() => {
    fetchHighscores(); // Fetch highscores when the component mounts
  }, []);

  const saveHighscore = async (score) => {
    try {
      // Get a reference to the "highscores" node in the database
      if (gameEnded) {
        return;
      }
      const db = getDatabase(app);
      const highscoresRef = ref(db, "highscores");

      // Generate a new unique key for the highscore entry
      const newHighscoreRef = push(highscoresRef);

      // Get the current timestamp using serverTimestamp()
      const timestamp = serverTimestamp();

      // Create a highscore object
      const highscoreData = {
        score: score,
        timestamp: timestamp,
      };

      // Save the highscore entry to the database
      await push(highscoresRef, highscoreData);

      setGameEnded(true);

      console.log("Highscore saved successfully!");

      // After saving the highscore, fetch the updated highscores and update the state
      fetchHighscores();
    } catch (error) {
      console.error("Error saving highscore:", error);
    }
  };

  useEffect(() => {
    if (round > 10) {
      saveHighscore(totalScore);
    }
  }, [round, totalScore]);

  console.log(highscores);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -100 }} // Initial position and opacity
            animate={{ opacity: 1, x: 0 }} // Animate to full opacity and default position
            exit={{ opacity: 0, x: -100 }} // Animate to exit with sliding to the left
            transition={{ duration: 0.3 }} // Animation duration
            className="p-8 md:p-2"
          >
            {!gameStarted && (
              <div className="row">
                <div className="col-md-6 col-md-offset-3">
                  <p className="font-mont text-[24px] font-bold">
                    Welcome to the HomeTrivia game!
                  </p>
                  <p className="font-mont text-[18px] w-full md:w:-1/2 my-8">
                    This is a scripture guessing game where you&apos;re,  given a
                    scripture and you have to guess what book, chapter and verse
                    the passage was taken from
                  </p>
                  <h3 className="font-mont font-semibold text-[20px]">
                    Rules of HomeTrivia
                  </h3>
                  <ol className="list-decimal pl-6 font-mont text-[16px] p-4">
                    <li className=" mb-4">
                      Each correct answer earns you points!
                    </li>
                    <li className="mb-4">
                      <strong>Points:</strong> 1 for book, 1 for chapter, 1 for
                      verse (maximum 3 points per scripture).
                    </li>
                    <li className="mb-4">
                      You can write the book in whatever casing you like
                      (capital letters, small letteres etc) but be careful about
                      your spelling.
                    </li>
                    <li className="mb-4">
                      The game consists of 10 rounds. You can see how many
                      points you earn per round and at the end of the game you
                      see your total score
                    </li>
                  </ol>
                  <div className="text-center">
                    <motion.button
                      className="px-4 py-2 bg-gray-800 font-mont text-white rounded focus:outline-none m-8 hover:bg-white hover:text-gray-800"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                      animate={{
                        scale: [1, 1.05, 1], // Define the animation keyframes
                        transition: {
                          duration: 3, // Animation duration for one loop
                          repeat: Infinity, // Infinite animation loop
                        },
                      }}
                      onClick={startGame}
                    >
                      Ready?
                    </motion.button>
                  </div>
                </div>
                <div className="row my-8">
                  {/* ... previous code ... */}
                  <div className="row bg-gray-800 text-white mb-12 py-4 w-full">
                    <div className="col-md-8 offset-md-2 font-mont">
                      <h2 className="font-mont text-[20px] text-center mb-4">
                        Leaderboard
                      </h2>
                      {scoresLoading ? (
                        <p className="font-mont text-center my-4 text-[20px]">
                          Loading highscores...
                        </p>
                      ) : highscores.length === 0 ? (
                        <p className="font-mont text-center text-[20px]">
                          No Top scores yet.
                        </p>
                      ) : (
                        <table className="table table-striped table-bordered table-responsive w-full mt-4">
                          <thead className="bg-[#f4f4f4] ">
                            <tr>
                              <th className="text-black p-4">SCORE</th>
                              <th className="text-black p-4">DATE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {highscores.map((scoreData, index) => (
                              <tr
                                key={index}
                                className="text-white text-center hover:bg-[#f4f4f4] hover:text-black"
                              >
                                <td className="p-4">{scoreData.score}</td>
                                <td className="p-4">
                                  {scoreData.formattedDate}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {gameStarted && !showCorrectAnswer && (
              <div>
                <h1 className="flex justify-center font-mont p-4 text-[20px]">
                  Round {round}
                </h1>
                <div className="row">
                  <div className="col-md-6 col-md-offset-3">
                    {isLoading ? (
                      <p className="font-mont py-4">Loading...</p>
                    ) : (
                      <p
                        className="verse-text font-mont py-4"
                        ref={scriptureRef}
                      ></p>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="flex flex-col gap-4 md:flex-row col-md-6 col-md-offset-3 font-mont">
                    <div className="form-group ">
                      <input
                        type="text"
                        className="form-control py-2 px-1 focus:outline-none w-full"
                        id="userBook"
                        value={userBook}
                        onChange={(e) => setUserBook(e.target.value)}
                        placeholder="Guess the book"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control py-2 px-1 focus:outline-none w-full"
                        id="userChapter"
                        value={userChapter}
                        onChange={(e) => setUserChapter(e.target.value)}
                        placeholder="Guess the chapter"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control py-2 px-1 focus:outline-none w-full"
                        id="userVerse"
                        value={userVerse}
                        onChange={(e) => setUserVerse(e.target.value)}
                        placeholder="Guess the verse"
                      />
                    </div>
                    <motion.button
                      className="py-2 px-4 bg-gray-800 text-white hover:bg-white hover:text-gray-800 font-mont focus:outline-none"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                      disabled={isLoading}
                      onClick={checkAnswer}
                    >
                      {isLoading ? "Loading..." : "Guess!"}
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
            {showCorrectAnswer && (
              <div>
                <div className="row">
                  <div className="col-md-6 col-md-offset-3">
                    <p className="font-mont text-[16px] py-2">
                      {getScoreMessage()}
                    </p>
                    {score === 3 ? null : (
                      <p className="correct-answer font-mont py-4">
                        Correct answer:{" "}
                        <strong>
                          {correct.bookname} {correct.chapter}:{correct.verse}
                        </strong>
                      </p>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-md-offset-3">
                    {round > 10 ? (
                      <div className="flex flex-col justify-center w-1/3 bg-gray-500 p-8 ">
                        <p className="font-mont text-white">GAME OVER</p>
                        <p className="font-mont text-white pb-4">
                          You scored a total of {totalScore} points
                        </p>
                        <motion.button
                          className="py-2 px-4 my-2 bg-gray-800 text-white hover:bg-white hover:text-gray-800 font-mont focus:outline-none"
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                          onClick={startGame}
                        >
                          Try again?
                        </motion.button>
                        <motion.button
                          className="py-2 px-4 my-2 bg-gray-800 text-white hover:bg-white hover:text-gray-800 font-mont focus:outline-none"
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                          onClick={() => {
                            window.location.reload(); // Refresh the page
                          }}
                        >
                          Main Menu
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        className="py-2 px-4 bg-gray-800 text-white hover:bg-white hover:text-gray-800 font-mont focus:outline-none"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                        disabled={isLoading}
                        onClick={getVerse}
                      >
                        {isLoading ? "Loading..." : "Next Round"}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Game;
