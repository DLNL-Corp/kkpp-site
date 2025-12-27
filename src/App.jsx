import { useState } from 'react'
import MainPage from './pages/MainPage'
import QuestionPage from './pages/QuestionPage'
import ResultPage from './pages/ResultPage'
import TeamModal from './components/TeamModal'
import { questions } from './data/questions'
import { calculateResult } from './data/results'

function App() {
  const [currentPage, setCurrentPage] = useState('main') // main, question, result
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [showTeamModal, setShowTeamModal] = useState(false)

  const handleStart = () => {
    setCurrentPage('question')
    setCurrentQuestion(0)
    setAnswers([])
  }

  const handleAnswer = (type) => {
    const newAnswers = [...answers, type]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 300)
    } else {
      // 모든 질문 완료
      const calculatedResult = calculateResult(newAnswers)
      setResult(calculatedResult)
      setTimeout(() => {
        setCurrentPage('result')
      }, 300)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setAnswers(answers.slice(0, -1))
    }
  }

  const handleRestart = () => {
    setCurrentPage('main')
    setCurrentQuestion(0)
    setAnswers([])
    setResult(null)
  }

  return (
    <>
      {currentPage === 'main' && (
        <MainPage
          onStart={handleStart}
          onShowTeam={() => setShowTeamModal(true)}
        />
      )}

      {currentPage === 'question' && (
        <QuestionPage
          question={questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          onPrevious={handlePrevious}
          canGoPrevious={currentQuestion > 0}
        />
      )}

      {currentPage === 'result' && result && (
        <ResultPage
          result={result}
          onRestart={handleRestart}
          onShowTeam={() => setShowTeamModal(true)}
        />
      )}

      {showTeamModal && (
        <TeamModal onClose={() => setShowTeamModal(false)} />
      )}
    </>
  )
}

export default App
